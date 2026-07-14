// Unit Test Script for Sneek Store logic verification

// 1. Mock CSV parser logic matching BulkUpload.jsx
function parseCsv(text) {
  const lines = text.split(/\r?\n/).filter(line => line.trim() !== '');
  if (lines.length === 0) return { error: 'Empty' };

  const parseCsvLine = (line) => {
    const result = [];
    let current = '';
    let inQuotes = false;
    for (let i = 0; i < line.length; i++) {
      const char = line[i];
      if (char === '"') {
        inQuotes = !inQuotes;
      } else if (char === ',' && !inQuotes) {
        result.push(current.trim().replace(/^"|"$/g, ''));
        current = '';
      } else {
        current += char;
      }
    }
    result.push(current.trim().replace(/^"|"$/g, ''));
    return result;
  };

  const headerRow = parseCsvLine(lines[0]);
  const records = [];

  for (let i = 1; i < lines.length; i++) {
    const fields = parseCsvLine(lines[i]);
    const record = {};
    headerRow.forEach((h, index) => {
      record[h] = fields[index] || '';
    });
    records.push(record);
  }

  return { headers: headerRow, records };
}

// 2. Mock Validation Logic
function validateProducts(parsedData, mappings) {
  return parsedData.map((rawRow, idx) => {
    const nameVal = rawRow[mappings.name] ? String(rawRow[mappings.name]).trim() : '';
    const priceRaw = rawRow[mappings.price] ? String(rawRow[mappings.price]).trim() : '';
    const priceVal = parseFloat(priceRaw.replace(/[^0-9.]/g, ''));
    
    const errors = [];
    if (!nameVal) {
      errors.push('Product name is required.');
    }
    if (isNaN(priceVal)) {
      errors.push('Price must be a valid number.');
    }

    const mappedProduct = {
      name: nameVal,
      price: isNaN(priceVal) ? 0 : priceVal,
      category: rawRow[mappings.category] ? String(rawRow[mappings.category]).trim() : 'Uncategorized',
      description: rawRow[mappings.description] ? String(rawRow[mappings.description]).trim() : '',
      img: rawRow[mappings.img] ? String(rawRow[mappings.img]).trim() : '',
      sizes: rawRow[mappings.sizes] ? String(rawRow[mappings.sizes]).trim() : 'S, M, L, XL',
      colors: rawRow[mappings.colors] ? String(rawRow[mappings.colors]).trim() : 'Matte Black',
      tags: rawRow[mappings.tags] ? String(rawRow[mappings.tags]).trim() : ''
    };

    return {
      index: idx,
      product: mappedProduct,
      errors,
      isValid: errors.length === 0
    };
  });
}

// ---- RUNNING TEST CASES ----
console.log('=== RUNNING SNEEK LOGIC TESTS ===');

// Test Case A: Valid CSV string
const mockCsvText = `garment_name,cost,type,text
"TECH HOODIE",110.00,"Hoodies","Tactical heavyweight hoodie."
"CARGO PANTS",140.50,"Pants","Draped cargo utility pants."
`;

const parsed = parseCsv(mockCsvText);
console.log('Test A - CSV parsing:');
console.log('Headers parsed:', JSON.stringify(parsed.headers));
console.log('Records length:', parsed.records.length);

if (parsed.headers.length === 4 && parsed.records.length === 2) {
  console.log('✔ Test A Passed: Headers and records lengths are correct.');
} else {
  console.error('✗ Test A Failed: Incorrect parse results.');
  process.exit(1);
}

// Test Case B: Column mapping and validation
const mappings = {
  name: 'garment_name',
  price: 'cost',
  category: 'type',
  description: 'text',
  sizes: '',
  colors: '',
  tags: '',
  img: ''
};

const validated = validateProducts(parsed.records, mappings);
console.log('\nTest B - Mappings & Validations:');
console.log('Validated rows:', JSON.stringify(validated, null, 2));

const allValid = validated.every(v => v.isValid);
if (allValid && validated[0].product.name === 'TECH HOODIE' && validated[1].product.price === 140.50) {
  console.log('✔ Test B Passed: Products mapped and validated correctly.');
} else {
  console.error('✗ Test B Failed: Incorrect validation results.');
  process.exit(1);
}

// Test Case C: Handling Invalid Row (e.g. Missing Name, Invalid Price)
const badCsvText = `garment_name,cost,type
"",110.00,"Hoodies"
"ERROR PRODUCT",abc,"Pants"
`;
const badParsed = parseCsv(badCsvText);
const badValidated = validateProducts(badParsed.records, mappings);
console.log('\nTest C - Invalid Data checks:');
console.log('Errors for Row 1 (missing name):', badValidated[0].errors);
console.log('Errors for Row 2 (invalid price):', badValidated[1].errors);

if (badValidated[0].isValid === false && badValidated[1].isValid === false) {
  console.log('✔ Test C Passed: Invalid rows correctly marked.');
} else {
  console.error('✗ Test C Failed: Should have flagged errors.');
  process.exit(1);
}

console.log('\n=== ALL TESTS PASSED SUCCESSFULLY ===');

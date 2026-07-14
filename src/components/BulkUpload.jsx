import React, { useState, useRef } from 'react';
import { Upload, FileText, CheckCircle, AlertTriangle, Play, X } from 'lucide-react';
import { useProducts } from '../context/ProductsContext';

export default function BulkUpload({ addToast, onUploadComplete }) {
    const { bulkUploadProducts } = useProducts();
    const [dragActive, setDragActive] = useState(false);
    const [file, setFile] = useState(null);
    const [parsedData, setParsedData] = useState([]); // Raw rows from file
    const [headers, setHeaders] = useState([]); // CSV headers
    const [mappings, setMappings] = useState({
        name: '',
        price: '',
        category: '',
        description: '',
        sizes: '',
        colors: '',
        tags: '',
        img: ''
    });
    const [expressMode, setExpressMode] = useState(true); // Auto-detect and skip mapping
    const [step, setStep] = useState('select'); // select, map, preview
    const [processedRows, setProcessedRows] = useState([]); // Ready for import
    const [selectedRows, setSelectedRows] = useState({}); // Checked row index map
    const fileInputRef = useRef(null);

    // Field definitions for mapping
    const targetFields = [
        { key: 'name', label: 'Product Name (Required)' },
        { key: 'price', label: 'Price (Numeric, Required)' },
        { key: 'category', label: 'Category' },
        { key: 'description', label: 'Description' },
        { key: 'img', label: 'Image URL' },
        { key: 'sizes', label: 'Sizes (Comma separated)' },
        { key: 'colors', label: 'Colors (Comma separated)' },
        { key: 'tags', label: 'Tags (Comma separated)' }
    ];

    const handleDrag = (e) => {
        e.preventDefault();
        e.stopPropagation();
        if (e.type === 'dragenter' || e.type === 'dragover') {
            setDragActive(true);
        } else if (e.type === 'dragleave') {
            setDragActive(false);
        }
    };

    const handleDrop = (e) => {
        e.preventDefault();
        e.stopPropagation();
        setDragActive(false);
        if (e.dataTransfer.files && e.dataTransfer.files[0]) {
            processFile(e.dataTransfer.files[0]);
        }
    };

    const handleFileChange = (e) => {
        if (e.target.files && e.target.files[0]) {
            processFile(e.target.files[0]);
        }
    };

    const processFile = (selectedFile) => {
        const ext = selectedFile.name.split('.').pop().toLowerCase();
        if (ext !== 'csv' && ext !== 'json') {
            addToast('Invalid file format. Please upload a .csv or .json file.', 'error');
            return;
        }

        setFile(selectedFile);
        const reader = new FileReader();

        reader.onload = (e) => {
            const text = e.target.result;
            if (ext === 'json') {
                parseJson(text);
            } else {
                parseCsv(text);
            }
        };

        reader.readAsText(selectedFile);
    };

    const parseJson = (text) => {
        try {
            const data = JSON.parse(text);
            const rows = Array.isArray(data) ? data : [data];
            if (rows.length === 0) {
                addToast('JSON file is empty.', 'error');
                return;
            }

            const allKeys = Object.keys(rows[0] || {});
            processParsedData(rows, allKeys);
        } catch (err) {
            addToast('Could not parse JSON. Ensure JSON format is correct.', 'error');
        }
    };

    const parseCsv = (text) => {
        const lines = text.split(/\r?\n/).filter(line => line.trim() !== '');
        if (lines.length === 0) {
            addToast('CSV file is empty.', 'error');
            return;
        }

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

        processParsedData(records, headerRow);
    };

    const getAutoMappings = (fileHeaders) => {
        const autoMappings = {
            name: '',
            price: '',
            category: '',
            description: '',
            sizes: '',
            colors: '',
            tags: '',
            img: ''
        };

        const findMatch = (key, synonyms) => {
            const lowerSynonyms = synonyms.map(s => s.toLowerCase());
            const headerMatch = fileHeaders.find(h => {
                const lowerH = h.toLowerCase();
                return lowerH === key || lowerSynonyms.includes(lowerH);
            });
            return headerMatch || '';
        };

        autoMappings.name = findMatch('name', ['title', 'productname', 'item', 'product']);
        autoMappings.price = findMatch('price', ['cost', 'rate', 'retail', 'value', 'priceinr', 'rupees', 'priceusd']);
        autoMappings.category = findMatch('category', ['type', 'collection', 'dept', 'department']);
        autoMappings.description = findMatch('description', ['desc', 'details', 'about', 'summary']);
        autoMappings.sizes = findMatch('sizes', ['size', 'sizelist', 'availablesizes']);
        autoMappings.colors = findMatch('colors', ['color', 'colors', 'colour', 'colours', 'colorlist']);
        autoMappings.tags = findMatch('tags', ['tag', 'labels', 'status']);
        autoMappings.img = findMatch('img', ['image', 'images', 'photourl', 'pic', 'url']);

        return autoMappings;
    };

    const processParsedData = (records, fileHeaders) => {
        setHeaders(fileHeaders);
        setParsedData(records);
        
        const autoMap = getAutoMappings(fileHeaders);
        setMappings(autoMap);

        if (expressMode) {
            validateWithMappings(records, autoMap);
        } else {
            setStep('map');
        }
    };

    const handleMappingChange = (fieldKey, value) => {
        setMappings(prev => ({ ...prev, [fieldKey]: value }));
    };

    const validateWithMappings = (records, activeMappings) => {
        const rows = records.map((rawRow, idx) => {
            const nameVal = rawRow[activeMappings.name] ? String(rawRow[activeMappings.name]).trim() : '';
            const priceRaw = rawRow[activeMappings.price] ? String(rawRow[activeMappings.price]).trim() : '';
            // Strip rupee symbols or spaces for parsing
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
                category: rawRow[activeMappings.category] ? String(rawRow[activeMappings.category]).trim() : 'Uncategorized',
                description: rawRow[activeMappings.description] ? String(rawRow[activeMappings.description]).trim() : '',
                img: rawRow[activeMappings.img] ? String(rawRow[activeMappings.img]).trim() : '',
                sizes: rawRow[activeMappings.sizes] ? String(rawRow[activeMappings.sizes]).trim() : 'S, M, L, XL',
                colors: rawRow[activeMappings.colors] ? String(rawRow[activeMappings.colors]).trim() : 'Matte Black',
                tags: rawRow[activeMappings.tags] ? String(rawRow[activeMappings.tags]).trim() : ''
            };

            return {
                index: idx,
                product: mappedProduct,
                errors,
                isValid: errors.length === 0
            };
        });

        setProcessedRows(rows);

        const initialSelected = {};
        rows.forEach(r => {
            if (r.isValid) {
                initialSelected[r.index] = true;
            }
        });
        setSelectedRows(initialSelected);
        setStep('preview');
    };

    const runValidation = () => {
        validateWithMappings(parsedData, mappings);
    };

    const toggleSelectRow = (index) => {
        setSelectedRows(prev => ({
            ...prev,
            [index]: !prev[index]
        }));
    };

    const toggleSelectAll = () => {
        const allSelected = Object.keys(selectedRows).length === processedRows.filter(r => r.isValid).length;
        if (allSelected) {
            setSelectedRows({});
        } else {
            const nextSelect = {};
            processedRows.forEach(r => {
                if (r.isValid) nextSelect[r.index] = true;
            });
            setSelectedRows(nextSelect);
        }
    };

    const handleCommit = () => {
        const productsToUpload = processedRows
            .filter(r => selectedRows[r.index])
            .map(r => r.product);

        if (productsToUpload.length === 0) {
            addToast('No items checked for import.', 'error');
            return;
        }

        bulkUploadProducts(productsToUpload);
        addToast(`Successfully imported ${productsToUpload.length} products to store catalog.`);
        resetUpload();
        if (onUploadComplete) onUploadComplete();
    };

    const downloadSampleCsv = () => {
        const headers = ['Name', 'Price', 'Category', 'Description', 'Sizes', 'Colors', 'Image URL', 'Tags'];
        const row1 = ['CORE UTILITY FIELD PUFFER', '8499.00', 'Outerwear', 'Insulated ripstop nylon puffer jacket with adjustable hems', 'S, M, L, XL', 'Matte Black, Sage Green', 'https://images.unsplash.com/photo-1611312449412-6cefac5dc3e4', 'NEW, WARM'];
        const row2 = ['SLOUCH TECH SWEATSHIRT', '4999.00', 'Hoodies', 'Oversized fleece crewneck sweatshirt with custom ribbing detailing', 'M, L', 'Sage Green', 'https://images.unsplash.com/photo-1556821840-3a63f95609a7', 'ESSENTIAL'];
        
        const csvContent = [
            headers.join(','),
            row1.map(v => `"${v}"`).join(','),
            row2.map(v => `"${v}"`).join(',')
        ].join('\n');
        
        const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.setAttribute('href', url);
        link.setAttribute('download', 'sneek_bulk_import_template.csv');
        link.style.visibility = 'hidden';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        addToast('Sample CSV template downloaded successfully.');
    };

    const resetUpload = () => {
        setFile(null);
        setParsedData([]);
        setHeaders([]);
        setProcessedRows([]);
        setSelectedRows({});
        setStep('select');
    };

    return (
        <div className="upload-card">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
                <div>
                    <h3>Bulk Upload Products</h3>
                    <p style={{ margin: 0 }}>Import batches of garments using .csv or .json files</p>
                </div>
                {step !== 'select' && (
                    <button className="btn-secondary" onClick={resetUpload} style={{ padding: '8px 16px', fontSize: '12px' }}>
                        <X size={14} style={{ marginRight: '6px', verticalAlign: 'middle' }} /> Reset
                    </button>
                )}
            </div>

            {step === 'select' && (
                <div>
                    <div
                        className={`dropzone-area ${dragActive ? 'drag-active' : ''}`}
                        onDragEnter={handleDrag}
                        onDragOver={handleDrag}
                        onDragLeave={handleDrag}
                        onDrop={handleDrop}
                        onClick={() => fileInputRef.current.click()}
                        id="dropzone-area"
                    >
                        <input
                            type="file"
                            ref={fileInputRef}
                            onChange={handleFileChange}
                            style={{ display: 'none' }}
                            accept=".csv, .json"
                        />
                        <Upload className="dropzone-icon" size={48} />
                        <p className="dropzone-text">Drag and drop file here, or click to browse</p>
                        <span className="dropzone-subtext">Supports CSV or JSON templates</span>
                    </div>

                    <div style={{ display: 'flex', justifyContent: 'center', gap: '20px', marginTop: '12px', fontSize: '12px' }}>
                        <span style={{ color: 'var(--text-secondary)' }}>Need a schema template?</span>
                        <button 
                            onClick={downloadSampleCsv} 
                            style={{ 
                                background: 'none', 
                                border: 'none', 
                                color: 'var(--accent)', 
                                textDecoration: 'underline', 
                                cursor: 'pointer',
                                padding: 0,
                                fontSize: '12px',
                                fontWeight: '600'
                            }}
                            type="button"
                            id="download-template-btn"
                        >
                            Download Sample CSV
                        </button>
                    </div>

                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', marginTop: '16px' }}>
                        <input 
                            type="checkbox" 
                            id="express-upload-checkbox" 
                            checked={expressMode} 
                            onChange={(e) => setExpressMode(e.target.checked)} 
                            style={{ cursor: 'pointer' }}
                        />
                        <label htmlFor="express-upload-checkbox" style={{ fontSize: '13px', color: 'var(--text-secondary)', cursor: 'pointer', userSelect: 'none' }}>
                            Express Auto-Import (Skip column mapping step if columns match)
                        </label>
                    </div>
                </div>
            )}

            {step === 'map' && (
                <div>
                    <div className="file-info-strip">
                        <div className="file-name-side">
                            <FileText size={20} style={{ color: 'var(--accent)' }} />
                            <div>
                                <span className="file-title">{file?.name}</span>
                                <span className="file-meta"> ({parsedData.length} records found)</span>
                            </div>
                        </div>
                    </div>

                    <h4 style={{ textTransform: 'uppercase', fontSize: '13px', margin: '20px 0 10px', color: 'var(--text-secondary)' }}>
                        Map File Columns to Catalog Fields
                    </h4>

                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '24px' }}>
                        {targetFields.map(field => (
                            <div key={field.key} className="form-group" style={{ margin: 0 }}>
                                <label className="form-label">{field.label}</label>
                                <select
                                    className="form-input"
                                    value={mappings[field.key]}
                                    onChange={(e) => handleMappingChange(field.key, e.target.value)}
                                    style={{ cursor: 'pointer' }}
                                    id={`map-select-${field.key}`}
                                >
                                    <option value="">-- Do Not Import / Default --</option>
                                    {headers.map(h => (
                                        <option key={h} value={h}>{h}</option>
                                    ))}
                                </select>
                            </div>
                        ))}
                    </div>

                    <div className="bulk-actions-row">
                        <button className="btn-accent" onClick={runValidation} id="validation-btn">
                            Validate Data <Play size={14} style={{ marginLeft: '6px', verticalAlign: 'middle' }} />
                        </button>
                    </div>
                </div>
            )}

            {step === 'preview' && (
                <div>
                    <div className="file-info-strip">
                        <div className="file-name-side">
                            <CheckCircle size={20} style={{ color: 'var(--accent)' }} />
                            <div>
                                <span className="file-title">Validation Complete</span>
                                <span className="file-meta">
                                    {' '}
                                    ({processedRows.filter(r => r.isValid).length} valid rows,{' '}
                                    {processedRows.filter(r => !r.isValid).length} errors)
                                </span>
                            </div>
                        </div>
                    </div>

                    <div className="preview-table-container">
                        <table className="preview-table">
                            <thead>
                                <tr>
                                    <th style={{ width: '40px' }}>
                                        <input
                                            type="checkbox"
                                            checked={Object.keys(selectedRows).length === processedRows.filter(r => r.isValid).length && processedRows.filter(r => r.isValid).length > 0}
                                            onChange={toggleSelectAll}
                                        />
                                    </th>
                                    <th>Row</th>
                                    <th>Name</th>
                                    <th>Price</th>
                                    <th>Category</th>
                                    <th>Sizes</th>
                                    <th>Status</th>
                                </tr>
                            </thead>
                            <tbody>
                                {processedRows.map((r, i) => (
                                    <tr key={i} className={!r.isValid ? 'row-invalid' : ''} id={`row-preview-${i}`}>
                                        <td>
                                            <input
                                                type="checkbox"
                                                disabled={!r.isValid}
                                                checked={!!selectedRows[r.index]}
                                                onChange={() => toggleSelectRow(r.index)}
                                            />
                                        </td>
                                        <td>{i + 1}</td>
                                        <td title={r.product.name}>{r.product.name || <em style={{ color: 'var(--text-muted)' }}>Missing</em>}</td>
                                        <td>₹{r.product.price.toFixed(2)}</td>
                                        <td>{r.product.category}</td>
                                        <td>{r.product.sizes}</td>
                                        <td>
                                            {r.isValid ? (
                                                <span className="row-status-ok">✔ Ready</span>
                                            ) : (
                                                <span className="row-status-err">
                                                    <AlertTriangle size={12} style={{ display: 'inline', marginRight: '4px', verticalAlign: 'middle' }} />
                                                    {r.errors.join(' ')}
                                                </span>
                                            )}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>

                    <div className="bulk-actions-row">
                        <button className="btn-secondary" onClick={() => setStep(headers.length > 0 ? 'map' : 'select')}>
                            Back to Mapping
                        </button>
                        <button
                            className="btn-accent"
                            onClick={handleCommit}
                            disabled={Object.keys(selectedRows).length === 0}
                            id="commit-upload-btn"
                        >
                            Import Selected ({Object.keys(selectedRows).length} items)
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
}

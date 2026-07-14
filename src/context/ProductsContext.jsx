import React, { createContext, useState, useContext, useEffect } from 'react';

const ProductsContext = createContext();

export const useProducts = () => useContext(ProductsContext);

const DEFAULT_PRODUCTS = [
    {
        id: 'SNEEK-1',
        name: 'HEAVYWEIGHT FLEECE UTILITY HOODIE',
        price: 5499.00,
        category: 'Hoodies',
        description: 'Oversized silhouette cut from 450gsm organic cotton brushback fleece. Features deep kangaroo pocket with double-needle stitch detailing, ribbed side panels, and seamless cuffs.',
        sizes: ['S', 'M', 'L', 'XL'],
        colors: ['Matte Black', 'Off-White', 'Dusty Olive'],
        img: 'https://images.unsplash.com/photo-1556821840-3a63f95609a7?auto=format&fit=crop&q=80&w=600',
        featured: true,
        tags: ['NEW', 'BEST SELLER']
    },
    {
        id: 'SNEEK-2',
        name: 'DRAPED TEAR-AWAY CARGO PANTS',
        price: 6999.00,
        category: 'Pants',
        description: 'Relaxed-fit cargo pants featuring metal snap button closures on side seams, tactical storage pockets, adjustable belt waist, and corded ankle cuffs for styling flexibility.',
        sizes: ['S', 'M', 'L', 'XL'],
        colors: ['Matte Black', 'Charcoal Gray', 'Sand Beige'],
        img: 'https://images.unsplash.com/photo-1517423568366-8b83523034fd?auto=format&fit=crop&q=80&w=600',
        featured: true,
        tags: ['LIMITED']
    },
    {
        id: 'SNEEK-3',
        name: 'MINIMALIST BOXY RAW-HEM TEE',
        price: 2499.00,
        category: 'T-Shirts',
        description: 'Crafted from 240gsm long-staple cotton single jersey. Structured boxy fit with dropped shoulders and clean raw-edge styling at bottom hem and sleeves.',
        sizes: ['S', 'M', 'L', 'XL'],
        colors: ['Off-White', 'Sage Green', 'Matte Black'],
        img: 'https://images.unsplash.com/photo-1521572267360-ee0c2909d518?auto=format&fit=crop&q=80&w=600',
        featured: false,
        tags: ['ESSENTIAL']
    },
    {
        id: 'SNEEK-4',
        name: 'WATER-RESISTANT INSULATED PUFFER VEST',
        price: 8499.00,
        category: 'Outerwear',
        description: 'Grid-structured ripstop nylon vest filled with vegan down. Features thermal lining, inner zip document wallet, and custom shock cord adjustable hem.',
        sizes: ['M', 'L', 'XL'],
        colors: ['Matte Black', 'Cobalt Blue'],
        img: 'https://images.unsplash.com/photo-1611312449412-6cefac5dc3e4?auto=format&fit=crop&q=80&w=600',
        featured: true,
        tags: ['HOT']
    },
    {
        id: 'SNEEK-5',
        name: 'WAFFLE-KNIT PANNELED SWEATER',
        price: 4499.00,
        category: 'Sweaters',
        description: 'Midweight organic cotton waffle knit. Panel ribbing details along sleeves and shoulders, boxy fit, optimized for breathable layering.',
        sizes: ['S', 'M', 'L', 'XL'],
        colors: ['Oatmeal Heather', 'Off-White', 'Matte Black'],
        img: 'https://images.unsplash.com/photo-1620799140408-edc6dcb6d633?auto=format&fit=crop&q=80&w=600',
        featured: false,
        tags: []
    },
    {
        id: 'SNEEK-6',
        name: 'MILITARY TWILL FIELD OVERJACKET',
        price: 9999.00,
        category: 'Outerwear',
        description: 'Durable military cotton-twill canvas shell. Storm collar guard, internal waist adjustment strings, and multiple structured utility compartments.',
        sizes: ['M', 'L', 'XL'],
        colors: ['Dusty Olive', 'Matte Black'],
        img: 'https://images.unsplash.com/photo-1551028719-00167b16eac5?auto=format&fit=crop&q=80&w=600',
        featured: false,
        tags: ['VINTAGE EDITION']
    },
    {
        id: 'SNEEK-7',
        name: 'PREMIUM EMBROIDERED COMFORT SOCKS',
        price: 999.00,
        category: 'Accessories',
        description: 'Thick-rib active slouch socks with direct embroidered logo details. Arch compression details and cushioned footbed.',
        sizes: ['ONESIZE'],
        colors: ['Off-White', 'Oatmeal Heather'],
        img: 'https://images.unsplash.com/photo-1582966772680-860e372bb558?auto=format&fit=crop&q=80&w=600',
        featured: false,
        tags: ['ESSENTIAL']
    },
    {
        id: 'SNEEK-8',
        name: 'STREETWEAR CRINKLE DUFFLE BAG',
        price: 3999.00,
        category: 'Accessories',
        description: 'Sleek waterproof crinkle nylon utility bag. D-ring connectors, padded tech compartments, external luggage slots, and high-tensile seatbelt webbing.',
        sizes: ['ONESIZE'],
        colors: ['Matte Black'],
        img: 'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?auto=format&fit=crop&q=80&w=600',
        featured: false,
        tags: ['UTILITY']
    }
];

const generateMockProducts = () => {
  const categories = ['Hoodies', 'Pants', 'T-Shirts', 'Outerwear', 'Sweaters', 'Accessories'];
  const sizesList = [['S', 'M', 'L', 'XL'], ['M', 'L', 'XL'], ['S', 'M', 'L'], ['ONESIZE']];
  const colorsList = [
    ['Matte Black', 'Off-White'],
    ['Sage Green', 'Dusty Olive'],
    ['Charcoal Gray', 'Slate Blue'],
    ['Sand Beige', 'Oatmeal Heather']
  ];
  const tagsList = [['NEW'], ['BEST SELLER'], ['LIMITED'], ['ESSENTIAL'], ['UTILITY'], []];
  
  const imgs = {
    Hoodies: [
      'https://images.unsplash.com/photo-1556821840-3a63f95609a7?auto=format&fit=crop&q=80&w=600',
      'https://images.unsplash.com/photo-1543163521-1bf539c55dd2?auto=format&fit=crop&q=80&w=600'
    ],
    Pants: [
      'https://images.unsplash.com/photo-1542272604-787c3835535d?auto=format&fit=crop&q=80&w=600',
      'https://images.unsplash.com/photo-1517423568366-8b83523034fd?auto=format&fit=crop&q=80&w=600'
    ],
    'T-Shirts': [
      'https://images.unsplash.com/photo-1521572267360-ee0c2909d518?auto=format&fit=crop&q=80&w=600',
      'https://images.unsplash.com/photo-1562157873-818bc0726f68?auto=format&fit=crop&q=80&w=600'
    ],
    Outerwear: [
      'https://images.unsplash.com/photo-1551028719-00167b16eac5?auto=format&fit=crop&q=80&w=600',
      'https://images.unsplash.com/photo-1611312449412-6cefac5dc3e4?auto=format&fit=crop&q=80&w=600'
    ],
    Sweaters: [
      'https://images.unsplash.com/photo-1620799140408-edc6dcb6d633?auto=format&fit=crop&q=80&w=600',
      'https://images.unsplash.com/photo-1614975058789-41316d0e2e9c?auto=format&fit=crop&q=80&w=600'
    ],
    Accessories: [
      'https://images.unsplash.com/photo-1582966772680-860e372bb558?auto=format&fit=crop&q=80&w=600',
      'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?auto=format&fit=crop&q=80&w=600'
    ]
  };

  const adjs = ['TACTICAL', 'DRIFT', 'CORE', 'SABER', 'MODULAR', 'STRUCTURED', 'OVERSIZED', 'THERMAL', 'HEAVYWEIGHT', 'RAW-HEM', 'WATERPROOF', 'UTILITY'];
  const nouns = ['TEE', 'HOODIE', 'CARGOS', 'ZIP-VEST', 'KNIT SWEATER', 'DUFFLE', 'SOCKS', 'FIELD PARKA', 'TRACK PANTS', 'WINDBREAKER', 'MOCK-NECK', 'BELT BAG'];

  const generated = [];
  // Generate 92 items to reach 100 items total
  for (let i = 1; i <= 92; i++) {
    const category = categories[i % categories.length];
    const adj = adjs[Math.floor(Math.random() * adjs.length)];
    const noun = nouns[Math.floor(Math.random() * nouns.length)];
    const name = `${adj} ${noun} // SNEEK-${i + 8}`;
    // Scale base price in INR (e.g. ₹1999 to ₹14999)
    const price = Math.floor((1999 + (i * 135))) + (i % 2 === 0 ? 99 : 49);
    const sizes = category === 'Accessories' ? ['ONESIZE'] : sizesList[i % sizesList.length];
    const colors = colorsList[i % colorsList.length];
    const tags = tagsList[i % tagsList.length];
    const catImgs = imgs[category];
    const img = catImgs[i % catImgs.length];

    generated.push({
      id: `SNEEK-${i + 8}`,
      name,
      price,
      category,
      description: `Premium engineered ${category.toLowerCase()} garment styled for modern streetwear utility. Comfort fit, durable stitch lines, pigment dyed.`,
      sizes,
      colors,
      img,
      featured: i < 5,
      tags
    });
  }
  return generated;
};

export const ProductsProvider = ({ children }) => {
    const [products, setProducts] = useState([]);

    useEffect(() => {
        const cached = localStorage.getItem('sneek_store_products');
        if (cached) {
            const parsed = JSON.parse(cached);
            // Self healing: if cached products have prices under 500, they are in USD. Trigger re-seed!
            const hasUsd = parsed.some(p => p.price < 500 && p.category !== 'Accessories');
            if (parsed.length < 50 || hasUsd) {
                const combined = [...DEFAULT_PRODUCTS, ...generateMockProducts()];
                setProducts(combined);
                localStorage.setItem('sneek_store_products', JSON.stringify(combined));
            } else {
                setProducts(parsed);
            }
        } else {
            const combined = [...DEFAULT_PRODUCTS, ...generateMockProducts()];
            setProducts(combined);
            localStorage.setItem('sneek_store_products', JSON.stringify(combined));
        }
    }, []);

    const saveProducts = (updated) => {
        setProducts(updated);
        localStorage.setItem('sneek_store_products', JSON.stringify(updated));
    };

    const addNewProduct = (prod) => {
        const newId = `SNEEK-${Date.now()}`;
        const newProd = {
            id: newId,
            ...prod,
            price: parseFloat(prod.price) || 0,
            sizes: Array.isArray(prod.sizes) ? prod.sizes : (prod.sizes || '').split(',').map(s => s.trim()).filter(Boolean),
            colors: Array.isArray(prod.colors) ? prod.colors : (prod.colors || '').split(',').map(c => c.trim()).filter(Boolean),
            tags: Array.isArray(prod.tags) ? prod.tags : (prod.tags || '').split(',').map(t => t.trim()).filter(Boolean),
            featured: !!prod.featured
        };
        saveProducts([...products, newProd]);
        return newProd;
    };

    const deleteProduct = (id) => {
        const updated = products.filter(p => p.id !== id);
        saveProducts(updated);
    };

    const updateProduct = (id, updatedFields) => {
        const updated = products.map(p => {
            if (p.id === id) {
                return {
                    ...p,
                    ...updatedFields,
                    price: parseFloat(updatedFields.price) || p.price,
                    sizes: Array.isArray(updatedFields.sizes) ? updatedFields.sizes : (updatedFields.sizes || '').split(',').map(s => s.trim()).filter(Boolean),
                    colors: Array.isArray(updatedFields.colors) ? updatedFields.colors : (updatedFields.colors || '').split(',').map(c => c.trim()).filter(Boolean),
                };
            }
            return p;
        });
        saveProducts(updated);
    };

    const bulkUploadProducts = (newProductsList) => {
        const processed = newProductsList.map((prod, idx) => {
            return {
                id: prod.id || `SNEEK-BULK-${Date.now()}-${idx}`,
                name: prod.name || 'Unnamed Product',
                price: parseFloat(prod.price) || 0,
                category: prod.category || 'Uncategorized',
                description: prod.description || '',
                sizes: Array.isArray(prod.sizes) ? prod.sizes : (prod.sizes || '').split(',').map(s => s.trim()).filter(Boolean),
                colors: Array.isArray(prod.colors) ? prod.colors : (prod.colors || '').split(',').map(c => c.trim()).filter(Boolean),
                tags: Array.isArray(prod.tags) ? prod.tags : (prod.tags || '').split(',').map(t => t.trim()).filter(Boolean),
                img: prod.img || 'https://images.unsplash.com/photo-1523381210434-271e8be1f52b?auto=format&fit=crop&q=80&w=600',
                featured: !!prod.featured
            };
        });

        const combined = [...products, ...processed];
        saveProducts(combined);
    };

    return (
        <ProductsContext.Provider value={{ products, addNewProduct, deleteProduct, updateProduct, bulkUploadProducts }}>
            {children}
        </ProductsContext.Provider>
    );
};

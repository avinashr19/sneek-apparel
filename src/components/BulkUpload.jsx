import React, { useState, useRef, useEffect } from 'react';
import { Upload, X, Loader2, Play, Image as ImageIcon, Trash2, Download } from 'lucide-react';
import { useProducts } from '../context/ProductsContext';
import { useSettings } from '../context/SettingsContext';
import { supabase } from '../lib/supabase';
import JSZip from 'jszip';

export default function BulkUpload({ addToast, onUploadComplete }) {
    const { bulkUploadProducts } = useProducts();
    const { shopCategories } = useSettings();
    const [dragActive, setDragActive] = useState(false);
    const [pendingProducts, setPendingProducts] = useState([]);
    const [isUploading, setIsUploading] = useState(false);
    const fileInputRef = useRef(null);

    // Cleanup object URLs to avoid memory leaks
    useEffect(() => {
        return () => {
            pendingProducts.forEach(p => {
                if (p.previewUrls) p.previewUrls.forEach(url => URL.revokeObjectURL(url));
            });
        };
    }, []);

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
        if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
            processFiles(e.dataTransfer.files);
        }
    };

    const handleFileChange = (e) => {
        if (e.target.files && e.target.files.length > 0) {
            processFiles(e.target.files);
        }
    };

    const processFiles = (fileList) => {
        const files = Array.from(fileList);
        const imgFiles = files.filter(f => f.type.startsWith('image/'));
        
        if (imgFiles.length === 0) {
            addToast('No images found. Please upload image files.', 'error');
            return;
        }

        const groups = {};

        imgFiles.forEach(file => {
            const path = file.webkitRelativePath;
            let sku = '';
            let categoryFromPath = null;
            if (path) {
                const parts = path.split('/');
                if (parts.length > 1) {
                    sku = parts[parts.length - 2];
                }
                if (parts.length > 2) {
                    categoryFromPath = parts[parts.length - 3];
                }
            }
            if (!sku) {
                sku = file.name.split('.')[0].toUpperCase();
            }

            if (!groups[sku]) {
                groups[sku] = {
                    files: [],
                    previewUrls: [],
                    categoryFromPath
                };
            }
            groups[sku].files.push(file);
            groups[sku].previewUrls.push(URL.createObjectURL(file));
        });

        const newProducts = Object.entries(groups).map(([sku, data]) => {
            const nameSpace = sku.replace(/[-_]/g, ' ');
            const nameLower = nameSpace.toLowerCase();
            
            // Try to auto-detect category from folder name first, then file name
            let detectedCategory = 'Uncategorized';
            if (data.categoryFromPath && shopCategories && shopCategories.length > 0) {
                const match = shopCategories.find(c => c.toLowerCase() === data.categoryFromPath.toLowerCase());
                if (match) detectedCategory = match;
            }
            
            if (detectedCategory === 'Uncategorized' && shopCategories && shopCategories.length > 0) {
                const match = shopCategories.find(c => nameLower.includes(c.toLowerCase()));
                if (match) {
                    detectedCategory = match;
                }
            }

            return {
                id: Math.random().toString(36).substring(2, 9),
                sku: sku,
                files: data.files,
                previewUrls: data.previewUrls,
                name: nameSpace,
                price: '',
                category: detectedCategory,
                description: '',
                sizes: 'S, M, L, XL',
                colors: 'Matte Black',
                tags: ''
            };
        });

        setPendingProducts(prev => [...prev, ...newProducts]);
    };

    const updateProduct = (id, field, value) => {
        setPendingProducts(prev => prev.map(p => 
            p.id === id ? { ...p, [field]: value } : p
        ));
    };

    const removeProduct = (id) => {
        setPendingProducts(prev => {
            const product = prev.find(p => p.id === id);
            if (product && product.previewUrls) {
                product.previewUrls.forEach(url => URL.revokeObjectURL(url));
            }
            return prev.filter(p => p.id !== id);
        });
    };

    const resetUpload = () => {
        pendingProducts.forEach(p => {
            if (p.previewUrls) p.previewUrls.forEach(url => URL.revokeObjectURL(url));
        });
        setPendingProducts([]);
        if (fileInputRef.current) fileInputRef.current.value = '';
    };

    const downloadTemplate = async () => {
        const zip = new JSZip();
        
        // Create root and images directory
        const imgFolder = zip.folder("products").folder("images");
        
        // Shirts
        imgFolder.folder("shirts").folder("SHIRT001");
        imgFolder.folder("shirts").folder("SHIRT002");
        
        // Pants
        imgFolder.folder("pants").folder("PANT001");
        imgFolder.folder("pants").folder("PANT002");
        
        // Jackets
        imgFolder.folder("jackets").folder("JACKET001");
        imgFolder.folder("jackets").folder("JACKET002");
        
        // Hoodies
        imgFolder.folder("hoodies").folder("HOODIE001");
        imgFolder.folder("hoodies").folder("HOODIE002");
        
        // Sweaters
        imgFolder.folder("sweaters").folder("SWEATER001");
        imgFolder.folder("sweaters").folder("SWEATER002");

        // Generate and download zip
        try {
            const content = await zip.generateAsync({ type: "blob" });
            const url = URL.createObjectURL(content);
            const a = document.createElement('a');
            a.href = url;
            a.download = 'products_template.zip';
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);
            URL.revokeObjectURL(url);
        } catch (err) {
            console.error("Error generating zip", err);
            addToast("Failed to generate folder template zip.", "error");
        }
    };

    const handleCommit = async () => {
        // Validate
        for (const p of pendingProducts) {
            if (!p.name.trim()) {
                addToast('All products must have a Name.', 'error');
                return;
            }
            if (!p.price || isNaN(parseFloat(p.price))) {
                addToast(`Please enter a valid numeric price for "${p.name}".`, 'error');
                return;
            }
        }

        setIsUploading(true);

        try {
            const finalProducts = [];

            for (let i = 0; i < pendingProducts.length; i++) {
                const product = pendingProducts[i];
                const uploadedUrls = [];
                
                // Upload all images for this SKU
                for (let j = 0; j < product.files.length; j++) {
                    const file = product.files[j];
                    const fileExt = file.name.split('.').pop();
                    const fileName = `${product.sku}_${Math.random().toString(36).substring(2, 8)}_${Date.now()}.${fileExt}`;
                    const filePath = `${fileName}`;
                    
                    const { error: uploadError } = await supabase.storage
                        .from('images')
                        .upload(filePath, file, { upsert: false });
                        
                    if (uploadError) throw uploadError;
                    
                    const { data: { publicUrl } } = supabase.storage
                        .from('images')
                        .getPublicUrl(filePath);
                        
                    uploadedUrls.push(publicUrl);
                }

                finalProducts.push({
                    sku: product.sku,
                    name: product.name.trim(),
                    price: parseFloat(product.price),
                    category: product.category.trim() || 'Uncategorized',
                    description: product.description.trim(),
                    images: uploadedUrls,
                    sizes: product.sizes.trim(),
                    colors: product.colors.trim(),
                    tags: product.tags.trim()
                });
            }

            bulkUploadProducts(finalProducts);
            addToast(`Successfully imported ${finalProducts.length} products to store catalog.`);
            resetUpload();
            if (onUploadComplete) onUploadComplete();
        } catch (err) {
            console.error('Bulk upload image error:', err);
            addToast('Error uploading images. Please try again.', 'error');
        } finally {
            setIsUploading(false);
        }
    };

    return (
        <div className="upload-card">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
                <div>
                    <h3>Image-First Bulk Upload</h3>
                    <p style={{ margin: 0, color: 'var(--text-secondary)', fontSize: '13px' }}>
                        Upload product images directly. Fill out their details below and submit all at once.
                    </p>
                </div>
                {pendingProducts.length > 0 && (
                    <button className="btn-secondary" onClick={resetUpload} style={{ padding: '8px 16px', fontSize: '12px' }}>
                        <X size={14} style={{ marginRight: '6px', verticalAlign: 'middle' }} /> Reset All
                    </button>
                )}
            </div>

            {pendingProducts.length === 0 ? (
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
                            accept="image/*"
                            webkitdirectory="true"
                            directory="true"
                            multiple
                        />
                        <ImageIcon className="dropzone-icon" size={48} />
                        <p className="dropzone-text">Drag and drop folders/images here, or click to browse</p>
                        <span className="dropzone-subtext">Folder names will automatically become the SKU</span>
                    </div>
                    
                    <div style={{ textAlign: 'center', marginTop: '16px' }}>
                        <button 
                            className="btn-secondary" 
                            onClick={downloadTemplate}
                            style={{ fontSize: '12px', padding: '6px 12px' }}
                        >
                            <Download size={14} style={{ marginRight: '6px', verticalAlign: 'middle' }} />
                            Download Folder Template
                        </button>
                    </div>
                </div>
            ) : (
                <div>
                    <div className="preview-table-container" style={{ maxHeight: '600px', overflowY: 'auto', marginBottom: '20px' }}>
                        <table className="preview-table">
                            <thead style={{ position: 'sticky', top: 0, background: 'var(--bg-darker)', zIndex: 10 }}>
                                <tr>
                                    <th style={{ width: '80px' }}>Image</th>
                                    <th>Name *</th>
                                    <th style={{ width: '100px' }}>Price (₹) *</th>
                                    <th>Category</th>
                                    <th>Details (Sizes, Colors, Tags)</th>
                                    <th style={{ width: '40px' }}></th>
                                </tr>
                            </thead>
                            <tbody>
                                {pendingProducts.map((p) => (
                                    <tr key={p.id}>
                                        <td style={{ padding: '8px' }}>
                                            <div style={{ position: 'relative', width: '60px', height: '60px' }}>
                                              <img src={p.previewUrls[0]} alt="preview" style={{ width: '60px', height: '60px', objectFit: 'cover', borderRadius: '4px' }} />
                                              {p.previewUrls.length > 1 && (
                                                <span style={{ position: 'absolute', bottom: '2px', right: '2px', background: 'rgba(0,0,0,0.8)', color: '#fff', fontSize: '10px', padding: '2px 4px', borderRadius: '4px' }}>+{p.previewUrls.length - 1}</span>
                                              )}
                                            </div>
                                            <div style={{ fontSize: '10px', color: 'var(--text-muted)', marginTop: '4px', textAlign: 'center', wordBreak: 'break-all' }}>SKU: {p.sku}</div>
                                        </td>
                                        <td>
                                            <input 
                                                type="text" 
                                                className="form-input" 
                                                value={p.name}
                                                onChange={(e) => updateProduct(p.id, 'name', e.target.value)}
                                                placeholder="Product Name"
                                                style={{ padding: '8px' }}
                                            />
                                        </td>
                                        <td>
                                            <input 
                                                type="number" 
                                                className="form-input" 
                                                value={p.price}
                                                onChange={(e) => updateProduct(p.id, 'price', e.target.value)}
                                                placeholder="Price"
                                                style={{ padding: '8px' }}
                                                min="0"
                                            />
                                        </td>
                                        <td>
                                            <select 
                                                className="form-input" 
                                                value={p.category}
                                                onChange={(e) => updateProduct(p.id, 'category', e.target.value)}
                                                style={{ padding: '8px' }}
                                            >
                                                <option value="Uncategorized">Uncategorized</option>
                                                {(shopCategories || []).map(cat => (
                                                    <option key={cat} value={cat}>{cat}</option>
                                                ))}
                                            </select>
                                        </td>
                                        <td>
                                            <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                                                <input 
                                                    type="text" 
                                                    className="form-input" 
                                                    value={p.sizes}
                                                    onChange={(e) => updateProduct(p.id, 'sizes', e.target.value)}
                                                    placeholder="Sizes (e.g. S, M, L)"
                                                    style={{ padding: '6px', fontSize: '11px' }}
                                                />
                                                <input 
                                                    type="text" 
                                                    className="form-input" 
                                                    value={p.colors}
                                                    onChange={(e) => updateProduct(p.id, 'colors', e.target.value)}
                                                    placeholder="Colors"
                                                    style={{ padding: '6px', fontSize: '11px' }}
                                                />
                                                <input 
                                                    type="text" 
                                                    className="form-input" 
                                                    value={p.tags}
                                                    onChange={(e) => updateProduct(p.id, 'tags', e.target.value)}
                                                    placeholder="Tags (e.g. NEW)"
                                                    style={{ padding: '6px', fontSize: '11px' }}
                                                />
                                            </div>
                                        </td>
                                        <td>
                                            <button 
                                                onClick={() => removeProduct(p.id)}
                                                style={{ background: 'none', border: 'none', color: '#ff4444', cursor: 'pointer', padding: '4px' }}
                                                title="Remove"
                                            >
                                                <Trash2 size={18} />
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>

                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: 'var(--bg-card)', padding: '16px', borderRadius: '8px', border: '1px solid var(--border-luxe)' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                            <button 
                                className="btn-secondary" 
                                onClick={() => fileInputRef.current.click()}
                                disabled={isUploading}
                            >
                                <Upload size={14} style={{ marginRight: '6px', verticalAlign: 'middle' }} />
                                Add More Images
                            </button>
                            <input
                                type="file"
                                ref={fileInputRef}
                                onChange={handleFileChange}
                                style={{ display: 'none' }}
                                accept="image/*"
                                multiple
                            />
                            <span style={{ fontSize: '13px', color: 'var(--text-secondary)' }}>
                                {pendingProducts.length} image{pendingProducts.length !== 1 ? 's' : ''} ready for data entry
                            </span>
                        </div>
                        <button
                            className="btn-accent"
                            onClick={handleCommit}
                            disabled={isUploading}
                            id="commit-upload-btn"
                        >
                            {isUploading ? <Loader2 size={14} className="spin" style={{ marginRight: '6px', verticalAlign: 'middle' }} /> : <Play size={14} style={{ marginRight: '6px', verticalAlign: 'middle' }} />}
                            {isUploading ? 'Uploading Images & Saving...' : `Submit ${pendingProducts.length} Products`}
                        </button>
                    </div>
                </div>
            )}
            <style>{`
                .spin { animation: spin 1s linear infinite; }
                @keyframes spin { 100% { transform: rotate(360deg); } }
                
                .preview-table input.form-input {
                    background: var(--bg-darker);
                    border: 1px solid var(--border-luxe);
                }
                .preview-table input.form-input:focus {
                    border-color: var(--accent);
                }
            `}</style>
        </div>
    );
}

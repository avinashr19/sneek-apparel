import React, { useState } from 'react';
import { Upload, Image as ImageIcon, Loader2 } from 'lucide-react';
import { supabase } from '../lib/supabase';

export default function ImageUpload({ onUploadSuccess, label = "Upload Image", maxSizeMB = 5 }) {
    const [uploading, setUploading] = useState(false);
    const [error, setError] = useState(null);

    const handleFileChange = async (e) => {
        const file = e.target.files[0];
        if (!file) return;

        // Validation
        if (file.size > maxSizeMB * 1024 * 1024) {
            setError(`Image must be less than ${maxSizeMB}MB`);
            return;
        }
        if (!file.type.startsWith('image/')) {
            setError('File must be an image');
            return;
        }

        setError(null);
        setUploading(true);

        try {
            const fileExt = file.name.split('.').pop();
            const fileName = `${Math.random().toString(36).substring(2, 15)}_${Date.now()}.${fileExt}`;
            const filePath = `${fileName}`;

            // Upload to Supabase Storage 'images' bucket
            const { error: uploadError, data } = await supabase.storage
                .from('images')
                .upload(filePath, file, { upsert: false });

            if (uploadError) throw uploadError;

            // Get public URL
            const { data: { publicUrl } } = supabase.storage
                .from('images')
                .getPublicUrl(filePath);

            onUploadSuccess(publicUrl);
        } catch (err) {
            console.error('Error uploading image:', err);
            setError(err.message || 'Failed to upload image');
        } finally {
            setUploading(false);
            e.target.value = ''; // Reset input
        }
    };

    return (
        <div className="image-upload-wrapper" style={{ marginTop: '8px' }}>
            <label className="btn-secondary" style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', cursor: 'pointer', opacity: uploading ? 0.7 : 1 }}>
                {uploading ? <Loader2 size={16} className="spin" /> : <Upload size={16} />}
                {uploading ? 'Uploading...' : label}
                <input 
                    type="file" 
                    accept="image/*" 
                    onChange={handleFileChange} 
                    style={{ display: 'none' }}
                    disabled={uploading}
                />
            </label>
            <div style={{ fontSize: '11px', color: 'var(--text-muted)', marginTop: '6px', display: 'flex', alignItems: 'center', gap: '6px' }}>
                <ImageIcon size={12} />
                Max size: <strong>{maxSizeMB} MB</strong>
            </div>
            {error && <div style={{ color: '#ff4444', fontSize: '12px', marginTop: '4px' }}>{error}</div>}
            
            <style>{`
                .spin { animation: spin 1s linear infinite; }
                @keyframes spin { 100% { transform: rotate(360deg); } }
            `}</style>
        </div>
    );
}

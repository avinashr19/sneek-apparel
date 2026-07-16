import React from 'react';
import Editor, { createButton } from 'react-simple-wysiwyg';

export default function RichTextEditor({ value, onChange, placeholder = "Write something..." }) {
    return (
        <div className="rich-text-container" style={{ margin: '8px 0 16px 0', borderRadius: '4px', overflow: 'hidden' }}>
            <Editor 
                value={value || ''} 
                onChange={e => onChange(e.target.value)} 
                placeholder={placeholder}
                style={{ background: '#ffffff', color: '#000000', height: '200px' }}
            />
        </div>
    );
}

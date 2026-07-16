const fs = require('fs');
const file = '/Users/avinashramakkapet/.gemini/antigravity/scratch/sneek/src/components/AdminDashboard.jsx';
let content = fs.readFileSync(file, 'utf8');

// 1. Update initial newSlide state
content = content.replace(
  "setNewSlide({ tag: '', title: '', desc: '', offer: '', img: '' });",
  "setNewSlide({ tag: '', title: '', desc: '', offer: '', img: '', text_x_pos: 'center', text_y_pos: 'center', text_scale: 1, text_color: '#ffffff', offer_effect: 'pulse' });"
);

content = content.replace(
  "const [newSlide, setNewSlide] = useState({ tag: '', title: '', desc: '', offer: '', img: '' });",
  "const [newSlide, setNewSlide] = useState({ tag: '', title: '', desc: '', offer: '', img: '', text_x_pos: 'center', text_y_pos: 'center', text_scale: 1, text_color: '#ffffff', offer_effect: 'pulse' });"
);

// 2. Update handleEditSlide
content = content.replace(
  /img: slide\.img_url \|\| slide\.img \|\| ''\n\s+\}\);/,
  `img: slide.img_url || slide.img || '',
      text_x_pos: slide.text_x_pos || 'center',
      text_y_pos: slide.text_y_pos || 'center',
      text_scale: slide.text_scale || 1,
      text_color: slide.text_color || '#ffffff',
      offer_effect: slide.offer_effect || 'pulse'
    });`
);

// 3. Add UI inputs inside the Add/Edit form
const uiStr = `<div className="form-group" style={{ margin: 0 }}>
                <label className="form-label">Upload Background Image *</label>`;

const newUi = `<hr style={{ borderTop: '1px solid var(--border-luxe)', margin: '20px 0' }} />
              <h4 style={{ marginBottom: '16px', fontSize: '13px', color: 'var(--text-secondary)' }}>Slide Text Styling & Positioning</h4>
              
              <div className="form-row">
                <div className="form-group" style={{ margin: 0 }}>
                  <label className="form-label" htmlFor="slide-x-pos">Horizontal Position</label>
                  <select id="slide-x-pos" className="form-input" value={newSlide.text_x_pos} onChange={(e) => setNewSlide(prev => ({ ...prev, text_x_pos: e.target.value }))}>
                    <option value="flex-start">Left</option>
                    <option value="center">Center</option>
                    <option value="flex-end">Right</option>
                  </select>
                </div>
                <div className="form-group" style={{ margin: 0 }}>
                  <label className="form-label" htmlFor="slide-y-pos">Vertical Position</label>
                  <select id="slide-y-pos" className="form-input" value={newSlide.text_y_pos} onChange={(e) => setNewSlide(prev => ({ ...prev, text_y_pos: e.target.value }))}>
                    <option value="flex-start">Top</option>
                    <option value="center">Center</option>
                    <option value="flex-end">Bottom</option>
                  </select>
                </div>
              </div>

              <div className="form-row">
                <div className="form-group" style={{ margin: 0 }}>
                  <label className="form-label" htmlFor="slide-scale">Text Size Scale (e.g. 1.2)</label>
                  <input type="number" step="0.1" id="slide-scale" className="form-input" value={newSlide.text_scale} onChange={(e) => setNewSlide(prev => ({ ...prev, text_scale: e.target.value }))} />
                </div>
                <div className="form-group" style={{ margin: 0 }}>
                  <label className="form-label" htmlFor="slide-color">Text Main Color</label>
                  <div style={{ display: 'flex', gap: '8px' }}>
                    <input type="color" id="slide-color" value={newSlide.text_color} onChange={(e) => setNewSlide(prev => ({ ...prev, text_color: e.target.value }))} style={{ width: '40px', height: '40px', padding: '0', border: 'none', background: 'transparent', cursor: 'pointer' }} />
                    <input type="text" className="form-input" value={newSlide.text_color} onChange={(e) => setNewSlide(prev => ({ ...prev, text_color: e.target.value }))} style={{ flex: 1 }} />
                  </div>
                </div>
              </div>

              <div className="form-group" style={{ margin: 0 }}>
                <label className="form-label" htmlFor="slide-effect">Offer Text Animation Effect</label>
                <select id="slide-effect" className="form-input" value={newSlide.offer_effect} onChange={(e) => setNewSlide(prev => ({ ...prev, offer_effect: e.target.value }))}>
                  <option value="none">None</option>
                  <option value="pulse">Pulse Glow</option>
                  <option value="bounce">Bounce</option>
                  <option value="slide-in">Slide In Right</option>
                </select>
              </div>
              <hr style={{ borderTop: '1px solid var(--border-luxe)', margin: '20px 0' }} />
              
              <div className="form-group" style={{ margin: 0 }}>
                <label className="form-label">Upload Background Image *</label>`;

content = content.replace(uiStr, newUi);

fs.writeFileSync(file, content, 'utf8');
console.log('Updated AdminDashboard.jsx');

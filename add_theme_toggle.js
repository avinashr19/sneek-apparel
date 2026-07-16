const fs = require('fs');
const file = '/Users/avinashramakkapet/.gemini/antigravity/scratch/sneek/src/components/AdminDashboard.jsx';
let content = fs.readFileSync(file, 'utf8');

// 1. Add the handleThemeToggle function
const toggleFunc = `
  const handleThemeToggle = (mode) => {
    if (mode === 'dark') {
      setPrimaryBgColor('#000000');
      setFooterBgColor('#000000');
      setBrandNameColor('#ffffff');
      setMenuBgColor('rgba(0, 0, 0, 0.85)');
      setMenuTextColor('#ffffff');
    } else if (mode === 'light') {
      setPrimaryBgColor('#ffffff');
      setFooterBgColor('#ffffff');
      setBrandNameColor('#000000');
      setMenuBgColor('rgba(255, 255, 255, 0.85)');
      setMenuTextColor('#000000');
    }
  };
`;

const handleSaveStr = "const handleSaveSettings = async (e) => {";
content = content.replace(handleSaveStr, toggleFunc + "\n  " + handleSaveStr);

// 2. Add the toggle UI
const uiStr = `<h3 style={{ marginBottom: '20px' }}>Global Theme Colors</h3>`;
const newUi = `<h3 style={{ marginBottom: '20px' }}>Global Theme Colors</h3>
                    <div style={{ display: 'flex', gap: '10px', marginBottom: '24px', padding: '4px', background: 'var(--bg-darker)', borderRadius: '8px', width: 'fit-content' }}>
                      <button 
                        type="button" 
                        onClick={() => handleThemeToggle('dark')} 
                        style={{ padding: '8px 16px', borderRadius: '4px', border: 'none', background: primaryBgColor === '#000000' ? 'var(--accent)' : 'transparent', color: primaryBgColor === '#000000' ? '#000' : 'var(--text-secondary)', cursor: 'pointer', fontWeight: '600', fontSize: '13px', transition: 'all 0.2s' }}
                      >
                        Dark Mode
                      </button>
                      <button 
                        type="button" 
                        onClick={() => handleThemeToggle('light')} 
                        style={{ padding: '8px 16px', borderRadius: '4px', border: 'none', background: primaryBgColor === '#ffffff' ? 'var(--accent)' : 'transparent', color: primaryBgColor === '#ffffff' ? '#000' : 'var(--text-secondary)', cursor: 'pointer', fontWeight: '600', fontSize: '13px', transition: 'all 0.2s' }}
                      >
                        Light Mode
                      </button>
                    </div>`;
content = content.replace(uiStr, newUi);

fs.writeFileSync(file, content, 'utf8');
console.log('Added theme toggle!');

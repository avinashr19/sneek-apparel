const fs = require('fs');
const file = '/Users/avinashramakkapet/.gemini/antigravity/scratch/sneek/src/components/Hero.jsx';
let content = fs.readFileSync(file, 'utf8');

// Section alignment
content = content.replace(
  "alignItems: 'center',\n        justifyContent: 'center',",
  "alignItems: currentSlide.text_y_pos || 'center',\n        justifyContent: currentSlide.text_x_pos || 'center',"
);

// Hero content styling
content = content.replace(
  "className=\"hero-content\" style={{ zIndex: 10, padding: '80px 20px', maxWidth: '900px' }}",
  `className="hero-content" style={{ zIndex: 10, padding: '80px 40px', maxWidth: '900px', transform: \\\`scale(\${currentSlide.text_scale || 1})\\\`, transformOrigin: \\\`\${currentSlide.text_x_pos === 'flex-start' ? 'left' : currentSlide.text_x_pos === 'flex-end' ? 'right' : 'center'} \${currentSlide.text_y_pos === 'flex-start' ? 'top' : currentSlide.text_y_pos === 'flex-end' ? 'bottom' : 'center'}\\\`, textAlign: currentSlide.text_x_pos === 'flex-start' ? 'left' : currentSlide.text_x_pos === 'flex-end' ? 'right' : 'center', color: currentSlide.text_color || '#ffffff' }}`
);

// Title color inherit
content = content.replace(
  "fontSize: '56px', \n            textShadow: '0 4px 12px rgba(0,0,0,0.8)',",
  "fontSize: '56px', \n            textShadow: '0 4px 12px rgba(0,0,0,0.8)',\n            color: 'inherit',"
);

// Desc color inherit
content = content.replace(
  "color: '#e5e7eb',",
  "color: currentSlide.text_color || '#e5e7eb',"
);

// Hero actions alignment
content = content.replace(
  "className=\"hero-actions\" style={{ justifyContent: 'center' }}",
  "className=\"hero-actions\" style={{ justifyContent: currentSlide.text_x_pos === 'flex-start' ? 'flex-start' : currentSlide.text_x_pos === 'flex-end' ? 'flex-end' : 'center' }}"
);

// Offer animation
content = content.replace(
  "animation: 'pulseGlow 2s ease-in-out infinite'",
  "animation: (!currentSlide.offer_effect || currentSlide.offer_effect === 'none') ? 'none' : currentSlide.offer_effect === 'bounce' ? 'bounce 2s infinite' : currentSlide.offer_effect === 'slide-in' ? 'slideInRight 1s ease-out' : 'pulseGlow 2s ease-in-out infinite'"
);

// Add style block at top
content = content.replace(
  "return (\n    <section",
  `return (\n    <>\n      <style>{\\\`
        @keyframes bounce {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-10px); }
        }
        @keyframes slideInRight {
          0% { opacity: 0; transform: translateX(50px); }
          100% { opacity: 1; transform: translateX(0); }
        }
      \\\`}</style>\n    <section`
);

content = content.replace(
  "</section>\n  );",
  "</section>\n    </>\n  );"
);

fs.writeFileSync(file, content, 'utf8');
console.log('Updated Hero.jsx');

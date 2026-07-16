const fs = require('fs');
const file = '/Users/avinashramakkapet/.gemini/antigravity/scratch/sneek/src/components/AdminDashboard.jsx';
let content = fs.readFileSync(file, 'utf8');

const targetStartStr = "{/* TAB 4: GENERAL CONFIGURATIONS */}";
const targetEndStr = "{/* DEVELOPER EXPORT CENTER */}";

const startIdx = content.indexOf(targetStartStr);
const exportStartIdx = content.indexOf(targetEndStr);

if (startIdx === -1 || exportStartIdx === -1) {
  console.log("Could not find boundaries");
  process.exit(1);
}

// Find the end of the settings tab (which ends right after DEVELOPER EXPORT CENTER)
// The settings tab ends with `</div>\n      )}`
const endOfSettingsTab = content.indexOf(')}', exportStartIdx) + 2;

const before = content.slice(0, startIdx);
const after = content.slice(endOfSettingsTab);

const newSettingsTab = `
      {/* TAB 4: GENERAL CONFIGURATIONS */}
      {activeTab === 'settings' && (
        <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
          <form onSubmit={handleSaveSettings} className="add-product-form">
            <div style={{ columns: '2 450px', gap: '24px' }}>
              <div className="dashboard-card" style={{ breakInside: 'avoid', marginBottom: '24px' }}>
                <h3>General Store Config</h3>
                <p style={{ color: 'var(--text-secondary)', fontSize: '13px', marginBottom: '24px' }}>
                  Control utility configurations that appear dynamically on storefront banners and calculations.
                </p>
                <div className="form-group" style={{ margin: 0 }}>
                  <label className="form-label" htmlFor="config-announcement">Top Announcement Bar Text</label>
                  <RichTextEditor 
                    value={announcementText}
                    onChange={setAnnouncementText}
                    placeholder="e.g. FREE SHIPPING ON ORDERS OVER ₹15,000"
                  />
                </div>
                {user?.role === 'admin' && (
                  <div className="form-row">
                    <div className="form-group" style={{ margin: 0 }}>
                      <label className="form-label" htmlFor="config-brand">Store Brand Name *</label>
                      <input 
                        type="text" 
                        id="config-brand" 
                        className="form-input" 
                        placeholder="e.g. SNEEK" 
                        value={brandName} 
                        onChange={(e) => setBrandName(e.target.value)}
                        required
                      />
                    </div>
                  </div>
                )}
              </div>

              {user?.role === 'admin' && (
                <>
                  <div className="dashboard-card" style={{ breakInside: 'avoid', marginBottom: '24px' }}>
                    <h3 style={{ marginBottom: '20px' }}>Content & Messaging</h3>
                    <div className="form-row">
                      <div className="form-group" style={{ margin: 0 }}>
                        <label className="form-label" htmlFor="config-threshold">Free Shipping Threshold (₹) *</label>
                        <input 
                          type="number" id="config-threshold" className="form-input" 
                          placeholder="e.g. 150" value={shippingThreshold} onChange={(e) => setShippingThreshold(e.target.value)} min="0" required
                        />
                      </div>
                      <div className="form-group" style={{ margin: 0 }}>
                        <label className="form-label" htmlFor="config-email">Styling Support Email *</label>
                        <input 
                          type="email" id="config-email" className="form-input" 
                          placeholder="e.g. concierge@sneek.co" value={emailContact} onChange={(e) => setEmailContact(e.target.value)} required
                        />
                      </div>
                    </div>
                  </div>

                  <div className="dashboard-card" style={{ breakInside: 'avoid', marginBottom: '24px' }}>
                    <h3 style={{ marginBottom: '20px' }}>About Page Philosophy</h3>
                    <div className="form-group" style={{ margin: 0 }}>
                      <label className="form-label">About Page Philosophy Image</label>
                      <ImageUpload onUploadSuccess={(url) => setAboutImageUrl(url)} label={aboutImageUrl ? "Replace Image" : "Upload Image"} />
                      {aboutImageUrl && (
                        <div style={{ marginTop: '12px' }}>
                          <img src={aboutImageUrl} alt="About preview" style={{ maxWidth: '100%', maxHeight: '200px', borderRadius: '4px' }} />
                          <button type="button" onClick={() => setAboutImageUrl('')} style={{ display: 'block', marginTop: '8px', color: '#ff4444', background: 'none', border: 'none', cursor: 'pointer', fontSize: '13px' }}>Remove Image</button>
                        </div>
                      )}
                    </div>
                    <div className="form-group" style={{ margin: 0 }}>
                      <label className="form-label" htmlFor="config-mission">Brand Mission Statement</label>
                      <RichTextEditor value={aboutMission} onChange={setAboutMission} placeholder="Write mission quote..." />
                    </div>
                    <div className="form-group" style={{ margin: 0 }}>
                      <label className="form-label" htmlFor="config-story">Brand History Story</label>
                      <RichTextEditor value={aboutStory} onChange={setAboutStory} placeholder="Describe brand story..." />
                    </div>
                  </div>

                  <div className="dashboard-card" style={{ breakInside: 'avoid', marginBottom: '24px' }}>
                    <h3 style={{ marginBottom: '20px' }}>Social Handles & Coordinates</h3>
                    <div className="form-row">
                      <div className="form-group" style={{ margin: 0 }}>
                        <label className="form-label" htmlFor="config-whatsapp">WhatsApp Number (10 Digits)</label>
                        <input 
                          type="tel" id="config-whatsapp" className="form-input" placeholder="e.g. 9876543210" 
                          value={whatsapp} onChange={(e) => setWhatsapp(e.target.value)} pattern="\\d{10}" maxLength="10" title="Please enter exactly 10 digits without +91 or spaces"
                        />
                      </div>
                      <div className="form-group" style={{ margin: 0 }}>
                        <label className="form-label" htmlFor="config-instagram">Instagram Tag</label>
                        <input 
                          type="text" id="config-instagram" className="form-input" placeholder="e.g. @sneek.apparel" value={instagram} onChange={(e) => setInstagram(e.target.value)}
                        />
                      </div>
                    </div>
                    <div className="form-group" style={{ margin: 0 }}>
                      <label className="form-label" htmlFor="config-facebook">Facebook Page Coordinate</label>
                      <input 
                        type="text" id="config-facebook" className="form-input" placeholder="e.g. facebook.com/sneek.apparel" value={facebook} onChange={(e) => setFacebook(e.target.value)}
                      />
                    </div>
                  </div>
                </>
              )}
            </div>
            <button type="submit" className="btn-accent" style={{ marginTop: '24px', gridColumn: '1 / -1', width: '100%', maxWidth: '300px' }} id="save-settings-submit">
              Save General Settings
            </button>
          </form>

          {/* DEVELOPER EXPORT CENTER */}
          {user?.role === 'admin' && (
            <div className="dashboard-card" style={{ marginTop: '24px', border: '1px dashed var(--accent)' }}>
              <h3 style={{ color: 'var(--accent)' }}>Developer Export Center</h3>
              <p style={{ color: 'var(--text-secondary)', fontSize: '13px', marginBottom: '20px' }}>
                Set up the storefront visually, then export your database and configurations. Send these files back to the AI assistant to permanently set them as the default catalog for all visitors on GitHub.
              </p>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                <button type="button" className="btn-secondary" onClick={handleExportProductsJson} style={{ width: '100%', justifyContent: 'center', display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <Download size={14} /> Export Products Database (JSON)
                </button>
                <button type="button" className="btn-secondary" onClick={handleExportSettingsJson} style={{ width: '100%', justifyContent: 'center', display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <Download size={14} /> Export Settings & Config (JSON)
                </button>
              </div>
            </div>
          )}
        </div>
      )}

      {/* NEW TAB: THEME SETTINGS */}
      {activeTab === 'theme' && (
        <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
          <form onSubmit={handleSaveSettings} className="add-product-form">
            <div style={{ columns: '2 450px', gap: '24px' }}>
              {user?.role === 'admin' && (
                <>
                  <div className="dashboard-card" style={{ breakInside: 'avoid', marginBottom: '24px' }}>
                    <h3 style={{ marginBottom: '20px' }}>Brand Identity & Typography</h3>
                    <div className="form-group" style={{ margin: 0, marginBottom: '16px' }}>
                      <label className="form-label">Brand Logo (Overrides Text Name)</label>
                      <ImageUpload onUploadSuccess={(url) => setBrandLogoUrl(url)} label={brandLogoUrl ? "Replace Logo" : "Upload Logo"} />
                      {brandLogoUrl && (
                        <div style={{ marginTop: '12px' }}>
                          <img src={brandLogoUrl} alt="Brand Logo preview" style={{ width: brandLogoWidth, height: brandLogoHeight, borderRadius: '4px', background: 'rgba(0,0,0,0.2)', padding: '10px', objectFit: 'contain' }} />
                          <button type="button" onClick={() => setBrandLogoUrl('')} style={{ display: 'block', marginTop: '8px', color: '#ff4444', background: 'none', border: 'none', cursor: 'pointer', fontSize: '13px' }}>Remove Logo</button>
                        </div>
                      )}
                    </div>
                    <div className="form-row">
                      <div className="form-group" style={{ margin: 0, marginBottom: '16px' }}>
                        <label className="form-label" htmlFor="config-brand-logo-width">Logo Width (e.g. 120px, auto)</label>
                        <input type="text" id="config-brand-logo-width" className="form-input" placeholder="e.g. 120px" value={brandLogoWidth} onChange={(e) => setBrandLogoWidth(e.target.value)} />
                      </div>
                      <div className="form-group" style={{ margin: 0, marginBottom: '16px' }}>
                        <label className="form-label" htmlFor="config-brand-logo-height">Logo Height (e.g. 40px, auto)</label>
                        <input type="text" id="config-brand-logo-height" className="form-input" placeholder="e.g. 40px" value={brandLogoHeight} onChange={(e) => setBrandLogoHeight(e.target.value)} />
                      </div>
                    </div>
                    <hr style={{ borderTop: '1px solid var(--border-luxe)', borderBottom: 'none', margin: '20px 0' }} />
                    <div className="form-row">
                      <div className="form-group" style={{ margin: 0 }}>
                        <label className="form-label" htmlFor="config-brand-size">Brand Font Size</label>
                        <select id="config-brand-size" className="form-input" value={brandNameSize} onChange={(e) => setBrandNameSize(e.target.value)}>
                          <option value="inherit">Default (Inherit)</option>
                          <option value="1.2rem">Small (1.2rem)</option>
                          <option value="1.5rem">Medium (1.5rem)</option>
                          <option value="2rem">Large (2rem)</option>
                          <option value="2.5rem">Extra Large (2.5rem)</option>
                        </select>
                      </div>
                      <div className="form-group" style={{ margin: 0 }}>
                        <label className="form-label" htmlFor="config-brand-weight">Brand Font Weight</label>
                        <select id="config-brand-weight" className="form-input" value={brandNameWeight} onChange={(e) => setBrandNameWeight(e.target.value)}>
                          <option value="normal">Normal (400)</option>
                          <option value="600">Semi Bold (600)</option>
                          <option value="bold">Bold (700)</option>
                          <option value="900">Black (900)</option>
                        </select>
                      </div>
                    </div>
                    <div className="form-group" style={{ margin: 0, marginTop: '16px' }}>
                      <label className="form-label" htmlFor="config-brand-font">Brand Font Family</label>
                      <select id="config-brand-font" className="form-input" value={brandNameFont} onChange={(e) => setBrandNameFont(e.target.value)}>
                        <option value="inherit">Default (Sans-Serif)</option>
                        <option value="'Playfair Display', serif">Serif (Playfair Display)</option>
                        <option value="'Courier New', Courier, monospace">Monospace (Courier)</option>
                        <option value="'Anton', sans-serif">Impact (Anton)</option>
                      </select>
                    </div>
                  </div>

                  <div className="dashboard-card" style={{ breakInside: 'avoid', marginBottom: '24px' }}>
                    <h3 style={{ marginBottom: '20px' }}>Global Theme Colors</h3>
                    <div className="form-row">
                      <div className="form-group" style={{ margin: 0 }}>
                        <label className="form-label" htmlFor="config-bg-color">Primary Background Color</label>
                        <div style={{ display: 'flex', gap: '8px' }}>
                          <input type="color" id="config-bg-color" value={primaryBgColor} onChange={(e) => setPrimaryBgColor(e.target.value)} style={{ width: '40px', height: '40px', padding: '0', border: 'none', background: 'transparent', cursor: 'pointer' }} />
                          <input type="text" className="form-input" value={primaryBgColor} onChange={(e) => setPrimaryBgColor(e.target.value)} style={{ flex: 1 }} />
                        </div>
                      </div>
                      <div className="form-group" style={{ margin: 0 }}>
                        <label className="form-label" htmlFor="config-accent-color">Accent Color</label>
                        <div style={{ display: 'flex', gap: '8px' }}>
                          <input type="color" id="config-accent-color" value={accentColor} onChange={(e) => setAccentColor(e.target.value)} style={{ width: '40px', height: '40px', padding: '0', border: 'none', background: 'transparent', cursor: 'pointer' }} />
                          <input type="text" className="form-input" value={accentColor} onChange={(e) => setAccentColor(e.target.value)} style={{ flex: 1 }} />
                        </div>
                      </div>
                    </div>
                    <div className="form-group" style={{ margin: 0, marginTop: '16px' }}>
                      <label className="form-label" htmlFor="config-brand-color">Brand Name Color</label>
                      <div style={{ display: 'flex', gap: '8px' }}>
                        <input type="color" id="config-brand-color" value={brandNameColor} onChange={(e) => setBrandNameColor(e.target.value)} style={{ width: '40px', height: '40px', padding: '0', border: 'none', background: 'transparent', cursor: 'pointer' }} />
                        <input type="text" className="form-input" value={brandNameColor} onChange={(e) => setBrandNameColor(e.target.value)} style={{ flex: 1 }} />
                      </div>
                    </div>
                    <hr style={{ borderTop: '1px solid var(--border-luxe)', borderBottom: 'none', margin: '20px 0' }} />
                    <h3 style={{ marginBottom: '16px', fontSize: '14px', color: 'var(--text-secondary)' }}>Menu Navigation Colors</h3>
                    <div className="form-row">
                      <div className="form-group" style={{ margin: 0 }}>
                        <label className="form-label" htmlFor="config-menu-bg">Menu Background</label>
                        <div style={{ display: 'flex', gap: '8px' }}>
                          <input type="text" id="config-menu-bg" className="form-input" value={menuBgColor} onChange={(e) => setMenuBgColor(e.target.value)} style={{ flex: 1 }} />
                        </div>
                      </div>
                      <div className="form-group" style={{ margin: 0 }}>
                        <label className="form-label" htmlFor="config-menu-text">Menu Text Color</label>
                        <div style={{ display: 'flex', gap: '8px' }}>
                          <input type="color" id="config-menu-text" value={menuTextColor} onChange={(e) => setMenuTextColor(e.target.value)} style={{ width: '40px', height: '40px', padding: '0', border: 'none', background: 'transparent', cursor: 'pointer' }} />
                          <input type="text" className="form-input" value={menuTextColor} onChange={(e) => setMenuTextColor(e.target.value)} style={{ flex: 1 }} />
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="dashboard-card" style={{ breakInside: 'avoid', marginBottom: '24px' }}>
                    <h3 style={{ marginBottom: '20px' }}>Footer Configurations</h3>
                    <div className="form-row">
                      <div className="form-group" style={{ margin: 0 }}>
                        <label className="form-label" htmlFor="config-footer-bg">Footer Background</label>
                        <div style={{ display: 'flex', gap: '8px' }}>
                          <input type="color" id="config-footer-bg" value={footerBgColor} onChange={(e) => setFooterBgColor(e.target.value)} style={{ width: '40px', height: '40px', padding: '0', border: 'none', background: 'transparent', cursor: 'pointer' }} />
                          <input type="text" className="form-input" value={footerBgColor} onChange={(e) => setFooterBgColor(e.target.value)} style={{ flex: 1 }} />
                        </div>
                      </div>
                      <div className="form-group" style={{ margin: 0 }}>
                        <label className="form-label" htmlFor="config-footer-text">Footer Text</label>
                        <div style={{ display: 'flex', gap: '8px' }}>
                          <input type="color" id="config-footer-text" value={footerTextColor} onChange={(e) => setFooterTextColor(e.target.value)} style={{ width: '40px', height: '40px', padding: '0', border: 'none', background: 'transparent', cursor: 'pointer' }} />
                          <input type="text" className="form-input" value={footerTextColor} onChange={(e) => setFooterTextColor(e.target.value)} style={{ flex: 1 }} />
                        </div>
                      </div>
                    </div>
                    <div className="form-group" style={{ margin: 0, marginTop: '16px' }}>
                      <label className="form-label" htmlFor="config-footer-bio">Footer Bio / Description</label>
                      <textarea id="config-footer-bio" className="form-input" style={{ resize: 'vertical', minHeight: '80px' }} value={footerBio} onChange={(e) => setFooterBio(e.target.value)}></textarea>
                    </div>
                    <div className="form-group" style={{ margin: 0, marginTop: '16px' }}>
                      <label className="form-label" htmlFor="config-footer-copyright">Footer Copyright & Credits</label>
                      <input type="text" id="config-footer-copyright" className="form-input" value={footerCopyrightText} onChange={(e) => setFooterCopyrightText(e.target.value)} />
                    </div>
                  </div>

                  <div className="dashboard-card" style={{ breakInside: 'avoid', marginBottom: '24px' }}>
                    <h3 style={{ marginBottom: '20px' }}>Site Experience</h3>
                    <div className="form-group" style={{ margin: 0 }}>
                      <label className="form-label" htmlFor="config-nav-animation">Page Navigation Animation</label>
                      <select id="config-nav-animation" className="form-input" value={navAnimation} onChange={(e) => setNavAnimation(e.target.value)}>
                        <option value="fade">Default (Smooth Fade)</option>
                        <option value="slide-left">Slide Left (App Style)</option>
                        <option value="slide-up">Slide Up</option>
                        <option value="none">None (Instant)</option>
                      </select>
                    </div>
                  </div>
                </>
              )}
            </div>
            <button type="submit" className="btn-accent" style={{ marginTop: '24px', gridColumn: '1 / -1', width: '100%', maxWidth: '300px' }}>
              Save Theme Settings
            </button>
          </form>
        </div>
      )}
`

const newContent = before + newSettingsTab + after;
fs.writeFileSync(file, newContent, 'utf8');
console.log('Successfully refactored settings tab into settings and theme tabs.');

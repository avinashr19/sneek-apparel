import React, { useState } from 'react';
import { Shield, Eye, EyeOff } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export default function AdminLogin({ addToast }) {
    const { login } = useAuth();
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [loading, setLoading] = useState(false);

    const handleSubmit = (e) => {
        e.preventDefault();
        setLoading(true);

        // Add a slight artificial delay for luxury micro-animations and loading feel
        setTimeout(async () => {
            const res = await login(username, password);
            setLoading(false);

            if (res.success) {
                addToast('Authentication successful.');
            } else {
                addToast(res.error, 'error');
            }
        }, 800);
    };

    return (
        <div className="admin-gate-wrapper">
            <div className="login-card">
                <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '20px' }}>
                    <div
                        style={{
                            background: 'var(--accent-soft)',
                            width: '60px',
                            height: '60px',
                            borderRadius: '50%',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            color: 'var(--accent)'
                        }}
                    >
                        <Shield size={28} />
                    </div>
                </div>

                <h2>ADMIN PORTAL</h2>
                <p className="login-subtitle">Authenticate to access catalog bulk uploads and product logs</p>

                <form onSubmit={handleSubmit}>
                    <div className="form-group">
                        <label className="form-label" htmlFor="admin-username">Username</label>
                        <input
                            type="text"
                            id="admin-username"
                            className="form-input"
                            placeholder="e.g. admin"
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                            required
                        />
                    </div>

                    <div className="form-group" style={{ position: 'relative' }}>
                        <label className="form-label" htmlFor="admin-password">Password</label>
                        <div style={{ position: 'relative', display: 'flex', alignItems: 'center' }}>
                            <input
                                type={showPassword ? 'text' : 'password'}
                                id="admin-password"
                                className="form-input"
                                placeholder="••••••••"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                required
                                style={{ paddingRight: '45px' }}
                            />
                            <button
                                type="button"
                                onClick={() => setShowPassword(p => !p)}
                                style={{
                                    position: 'absolute',
                                    right: '12px',
                                    color: 'var(--text-secondary)',
                                    display: 'flex',
                                    alignItems: 'center'
                                }}
                            >
                                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                            </button>
                        </div>
                    </div>

                    <button
                        type="submit"
                        className="btn-accent login-btn"
                        disabled={loading}
                        id="login-submit-btn"
                    >
                        {loading ? 'Verifying Credentials...' : 'Sign In'}
                    </button>
                </form>
            </div>
        </div >
    );
}

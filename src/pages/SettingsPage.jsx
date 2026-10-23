import { useContext, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext.jsx';
import Toast from '../components/common/Toast.jsx';

export default function SettingsPage() {
  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate();
  const [showChangePassword, setShowChangePassword] = useState(false);
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [toastMessage, setToastMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const [showCurrentPwd, setShowCurrentPwd] = useState(false);
  const [showNewPwd, setShowNewPwd] = useState(false);
  const [showConfirmPwd, setShowConfirmPwd] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const handleChangePassword = async () => {
    if (!currentPassword || !newPassword || !confirmPassword) {
      setToastMessage('Please fill all fields');
      return;
    }

    if (newPassword !== confirmPassword) {
      setToastMessage('New passwords do not match');
      return;
    }

    if (newPassword.length < 6) {
      setToastMessage('Password must be at least 6 characters');
      return;
    }

    setLoading(true);
    try {
      const token = localStorage.getItem('authToken');
      const response = await fetch('https://expense-tracker-5bz6.onrender.com/api/auth/change-password', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({
          currentPassword,
          newPassword,
        }),
      });

      const data = await response.json();
      if (response.ok) {
        setToastMessage('✓ Password changed successfully');
        setCurrentPassword('');
        setNewPassword('');
        setConfirmPassword('');
        setShowChangePassword(false);
      } else {
        setToastMessage(data.error || 'Failed to change password');
      }
    } catch (err) {
      setToastMessage('Error: ' + err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{
      display: 'flex',
      justifyContent: 'center',
      padding: 'var(--spacing-lg)',
      minHeight: '100vh',
      backgroundColor: 'var(--color-bg)',
    }}>
      <div style={{ width: '100%', maxWidth: '600px' }}>
        <h1 style={{ fontSize: 'var(--font-size-lg)', marginBottom: 'var(--spacing-md)' }}>
          Settings
        </h1>

        {/* Account Section */}
        <div style={{ marginBottom: 'var(--spacing-lg)' }}>
          <h3 style={{ fontSize: 'var(--font-size-md)', marginBottom: 'var(--spacing-sm)', color: 'var(--color-text-secondary)' }}>
            Account
          </h3>
          <div style={{ padding: 'var(--spacing-md)', backgroundColor: 'var(--color-bg-secondary)', borderRadius: 'var(--border-radius)' }}>
            <div style={{ marginBottom: 'var(--spacing-sm)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div style={{ fontSize: 'var(--font-size-sm)', color: 'var(--color-text-secondary)' }}>Username</div>
              <div style={{ fontSize: 'var(--font-size-sm)', fontWeight: '600' }}>{user?.username}</div>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div style={{ fontSize: 'var(--font-size-sm)', color: 'var(--color-text-secondary)' }}>User ID</div>
              <div style={{ fontSize: 'var(--font-size-sm)', fontWeight: '600' }}>{user?.userId || 'N/A'}</div>
            </div>
          </div>
        </div>

        {/* App Info Section */}
        <div style={{ marginBottom: 'var(--spacing-lg)' }}>
          <h3 style={{ fontSize: 'var(--font-size-md)', marginBottom: 'var(--spacing-sm)', color: 'var(--color-text-secondary)' }}>
            App Info
          </h3>
          <div style={{ padding: 'var(--spacing-md)', backgroundColor: 'var(--color-bg-secondary)', borderRadius: 'var(--border-radius)' }}>
            <div style={{ marginBottom: 'var(--spacing-sm)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div style={{ fontSize: 'var(--font-size-sm)', color: 'var(--color-text-secondary)' }}>App Name</div>
              <div style={{ fontSize: 'var(--font-size-sm)', fontWeight: '600' }}>Expense Tracker</div>
            </div>
            <div style={{ marginBottom: 'var(--spacing-sm)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div style={{ fontSize: 'var(--font-size-sm)', color: 'var(--color-text-secondary)' }}>Version</div>
              <div style={{ fontSize: 'var(--font-size-sm)', fontWeight: '600' }}>1.0.0</div>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div style={{ fontSize: 'var(--font-size-sm)', color: 'var(--color-text-secondary)' }}>Build</div>
              <div style={{ fontSize: 'var(--font-size-sm)', fontWeight: '600' }}>2026.10</div>
            </div>
          </div>
        </div>

        {/* Change Password Section */}
        <div style={{ marginBottom: 'var(--spacing-lg)' }}>
          <h3 style={{ fontSize: 'var(--font-size-md)', marginBottom: 'var(--spacing-sm)', color: 'var(--color-text-secondary)' }}>
            Security
          </h3>
          {!showChangePassword ? (
            <button
              onClick={() => setShowChangePassword(true)}
              style={{
                width: '100%',
                padding: 'var(--spacing-sm) var(--spacing-md)',
                backgroundColor: 'var(--color-bg-secondary)',
                color: 'var(--color-text)',
                border: `1px solid var(--color-border)`,
                borderRadius: 'var(--border-radius)',
                cursor: 'pointer',
                fontSize: 'var(--font-size-sm)',
                textAlign: 'left',
                transition: 'all 0.2s',
              }}
              onMouseOver={(e) => e.currentTarget.style.backgroundColor = 'var(--color-border)'}
              onMouseOut={(e) => e.currentTarget.style.backgroundColor = 'var(--color-bg-secondary)'}
            >
              🔐 Change Password
            </button>
          ) : (
            <div style={{ padding: 'var(--spacing-md)', backgroundColor: 'var(--color-bg-secondary)', borderRadius: 'var(--border-radius)' }}>
              <style>{`
                .pwd-input {
                  width: 100%;
                  padding: 10px 12px;
                  border-radius: var(--border-radius);
                  border: 2px solid #d1d5db;
                  background-color: #ffffff;
                  color: #000000;
                  font-size: 16px;
                  font-weight: 500;
                  letter-spacing: 0.2em;
                  box-sizing: border-box;
                  transition: border-color 0.2s;
                }
                .pwd-input:focus {
                  outline: none;
                  border-color: #3b82f6;
                  box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
                }
                .pwd-input::placeholder {
                  color: #999999;
                  font-weight: 400;
                  letter-spacing: normal;
                }
              `}</style>
              <div style={{ marginBottom: 'var(--spacing-md)' }}>
                <label style={{ display: 'block', marginBottom: 'var(--spacing-xs)', fontSize: 'var(--font-size-sm)', fontWeight: '500' }}>
                  Current Password
                </label>
                <div style={{ position: 'relative', display: 'flex', alignItems: 'center' }}>
                  <input
                    className="pwd-input"
                    type={showCurrentPwd ? 'text' : 'password'}
                    value={currentPassword}
                    onChange={(e) => setCurrentPassword(e.target.value)}
                    placeholder="Enter current password"
                  />
                  <button
                    onClick={() => setShowCurrentPwd(!showCurrentPwd)}
                    style={{
                      position: 'absolute',
                      right: '10px',
                      background: 'none',
                      border: 'none',
                      cursor: 'pointer',
                      fontSize: '18px',
                      padding: '5px',
                      color: '#666',
                    }}
                  >
                    {showCurrentPwd ? '👁️' : '👁️‍🗨️'}
                  </button>
                </div>
              </div>
              <div style={{ marginBottom: 'var(--spacing-md)' }}>
                <label style={{ display: 'block', marginBottom: 'var(--spacing-xs)', fontSize: 'var(--font-size-sm)', fontWeight: '500' }}>
                  New Password
                </label>
                <div style={{ position: 'relative', display: 'flex', alignItems: 'center' }}>
                  <input
                    className="pwd-input"
                    type={showNewPwd ? 'text' : 'password'}
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    placeholder="Enter new password"
                  />
                  <button
                    onClick={() => setShowNewPwd(!showNewPwd)}
                    style={{
                      position: 'absolute',
                      right: '10px',
                      background: 'none',
                      border: 'none',
                      cursor: 'pointer',
                      fontSize: '18px',
                      padding: '5px',
                      color: '#666',
                    }}
                  >
                    {showNewPwd ? '👁️' : '👁️‍🗨️'}
                  </button>
                </div>
              </div>
              <div style={{ marginBottom: 'var(--spacing-md)' }}>
                <label style={{ display: 'block', marginBottom: 'var(--spacing-xs)', fontSize: 'var(--font-size-sm)', fontWeight: '500' }}>
                  Confirm Password
                </label>
                <div style={{ position: 'relative', display: 'flex', alignItems: 'center' }}>
                  <input
                    className="pwd-input"
                    type={showConfirmPwd ? 'text' : 'password'}
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    placeholder="Confirm new password"
                  />
                  <button
                    onClick={() => setShowConfirmPwd(!showConfirmPwd)}
                    style={{
                      position: 'absolute',
                      right: '10px',
                      background: 'none',
                      border: 'none',
                      cursor: 'pointer',
                      fontSize: '18px',
                      padding: '5px',
                      color: '#666',
                    }}
                  >
                    {showConfirmPwd ? '👁️' : '👁️‍🗨️'}
                  </button>
                </div>
              </div>
              <div style={{ display: 'flex', gap: 'var(--spacing-sm)' }}>
                <button
                  onClick={handleChangePassword}
                  disabled={loading}
                  style={{
                    flex: 1,
                    padding: 'var(--spacing-sm)',
                    backgroundColor: 'var(--color-primary)',
                    color: '#fff',
                    border: 'none',
                    borderRadius: 'var(--border-radius)',
                    cursor: loading ? 'not-allowed' : 'pointer',
                    fontSize: 'var(--font-size-sm)',
                    fontWeight: '600',
                    opacity: loading ? 0.6 : 1,
                  }}
                >
                  {loading ? 'Updating...' : 'Update Password'}
                </button>
                <button
                  onClick={() => {
                    setShowChangePassword(false);
                    setCurrentPassword('');
                    setNewPassword('');
                    setConfirmPassword('');
                  }}
                  style={{
                    flex: 1,
                    padding: 'var(--spacing-sm)',
                    backgroundColor: 'var(--color-bg)',
                    color: 'var(--color-text)',
                    border: `1px solid var(--color-border)`,
                    borderRadius: 'var(--border-radius)',
                    cursor: 'pointer',
                    fontSize: 'var(--font-size-sm)',
                    fontWeight: '600',
                  }}
                >
                  Cancel
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Logout Section */}
        <div style={{ marginBottom: 'var(--spacing-lg)' }}>
          <button
            onClick={handleLogout}
            style={{
              width: '100%',
              padding: 'var(--spacing-sm) var(--spacing-md)',
              backgroundColor: 'var(--color-danger)',
              color: '#fff',
              border: 'none',
              borderRadius: 'var(--border-radius)',
              cursor: 'pointer',
              fontSize: 'var(--font-size-sm)',
              fontWeight: '600',
              transition: 'opacity 0.2s',
            }}
            onMouseOver={(e) => e.currentTarget.style.opacity = '0.9'}
            onMouseOut={(e) => e.currentTarget.style.opacity = '1'}
          >
            🚪 Logout
          </button>
        </div>

        {/* Footer Info */}
        <div style={{
          padding: 'var(--spacing-md)',
          backgroundColor: 'var(--color-bg-secondary)',
          borderRadius: 'var(--border-radius)',
          textAlign: 'center',
          color: 'var(--color-text-secondary)',
          fontSize: 'var(--font-size-xs)',
        }}>
          <div>© 2026 Expense Tracker</div>
          <div style={{ marginTop: 'var(--spacing-xs)' }}>Made with ❤️</div>
        </div>

        <Toast message={toastMessage} onClose={() => setToastMessage('')} />
      </div>
    </div>
  );
}

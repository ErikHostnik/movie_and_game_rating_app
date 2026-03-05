import { useRef, useState } from 'react';

const PROFILE_COLORS = ['#6366f1', '#22c55e', '#f59e0b', '#ef4444', '#8b5cf6', '#3b82f6'];

const Header = ({
  onAdd,
  onExport,
  onImport,
  onOpenSettings,
  profiles,
  activeProfileId,
  onProfileChange,
  onAddProfile,
  onRemoveProfile,
}) => {
  const importRef = useRef(null);
  const [showProfiles, setShowProfiles] = useState(false);
  const [newProfileName, setNewProfileName] = useState('');
  const [newProfileColor, setNewProfileColor] = useState(PROFILE_COLORS[1]);

  const activeProfile = profiles.find((p) => p.id === activeProfileId) || profiles[0];

  const handleAddProfile = () => {
    if (!newProfileName.trim()) return;
    onAddProfile(newProfileName.trim(), newProfileColor);
    setNewProfileName('');
  };

  return (
    <header style={styles.header}>
      <div style={styles.left}>
        <h1 style={styles.title}>My Ratings</h1>
      </div>

      <div style={styles.right}>
        {/* Profile selector */}
        <div style={{ position: 'relative' }}>
          <button
            style={{ ...styles.profileBtn, borderColor: activeProfile?.color || '#6366f1' }}
            onClick={() => setShowProfiles((v) => !v)}
          >
            <span
              style={{ ...styles.profileDot, background: activeProfile?.color || '#6366f1' }}
            />
            {activeProfile?.name || 'Profile'}
            <span style={styles.chevron}>{showProfiles ? '▴' : '▾'}</span>
          </button>

          {showProfiles && (
            <div style={styles.profileDropdown} onClick={(e) => e.stopPropagation()}>
              {profiles.map((p) => (
                <div
                  key={p.id}
                  style={{
                    ...styles.profileItem,
                    background: p.id === activeProfileId ? '#2a2a3a' : 'transparent',
                  }}
                >
                  <div
                    style={{ ...styles.profileItemLeft, cursor: 'pointer' }}
                    onClick={() => { onProfileChange(p.id); setShowProfiles(false); }}
                  >
                    <span style={{ ...styles.profileDot, background: p.color }} />
                    <span style={styles.profileName}>{p.name}</span>
                  </div>
                  {p.id !== 'default' && (
                    <button
                      style={styles.removeProfileBtn}
                      onClick={() => onRemoveProfile(p.id)}
                    >
                      ×
                    </button>
                  )}
                </div>
              ))}

              <div style={styles.addProfileRow}>
                <input
                  type="text"
                  placeholder="New profile name"
                  value={newProfileName}
                  onChange={(e) => setNewProfileName(e.target.value)}
                  style={styles.profileInput}
                  onKeyDown={(e) => e.key === 'Enter' && handleAddProfile()}
                />
                <div style={styles.colorPicker}>
                  {PROFILE_COLORS.map((c) => (
                    <button
                      key={c}
                      style={{
                        ...styles.colorDot,
                        background: c,
                        outline: newProfileColor === c ? `2px solid ${c}` : 'none',
                        outlineOffset: '2px',
                      }}
                      onClick={() => setNewProfileColor(c)}
                    />
                  ))}
                </div>
                <button style={styles.addProfileBtn} onClick={handleAddProfile}>
                  Add
                </button>
              </div>
            </div>
          )}
        </div>

        <div style={styles.divider} />

        <button style={styles.iconBtn} onClick={onExport} title="Export data">
          ↑ Export
        </button>

        <button
          style={styles.iconBtn}
          onClick={() => importRef.current?.click()}
          title="Import data"
        >
          ↓ Import
        </button>
        <input
          ref={importRef}
          type="file"
          accept=".json"
          onChange={onImport}
          style={{ display: 'none' }}
        />

        <button style={styles.iconBtn} onClick={onOpenSettings} title="Settings">
          ⚙ Settings
        </button>

        <button style={styles.addBtn} onClick={onAdd}>
          + Add New
        </button>
      </div>

      {/* Close profile dropdown when clicking outside */}
      {showProfiles && (
        <div
          style={styles.backdrop}
          onClick={() => setShowProfiles(false)}
        />
      )}
    </header>
  );
};

const styles = {
  header: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: '14px 40px',
    background: '#1a1a1a',
    borderBottom: '1px solid #2a2a2a',
    position: 'relative',
    zIndex: 50,
    flexWrap: 'wrap',
    gap: '12px',
  },
  left: { display: 'flex', alignItems: 'center', gap: '16px' },
  title: { fontSize: '1.4rem', fontWeight: 700, color: '#fff' },
  right: { display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' },
  profileBtn: {
    display: 'flex', alignItems: 'center', gap: '8px',
    padding: '8px 14px',
    background: '#1e1e2e', border: '1px solid',
    borderRadius: '8px', color: '#fff',
    fontSize: '0.88rem', fontWeight: 600, cursor: 'pointer',
  },
  profileDot: { width: 10, height: 10, borderRadius: '50%', flexShrink: 0 },
  chevron: { fontSize: '0.7rem', color: '#888' },
  profileDropdown: {
    position: 'absolute', top: 'calc(100% + 6px)', right: 0,
    background: '#1a1a2e', border: '1px solid #2a2a3a', borderRadius: '12px',
    minWidth: '240px', zIndex: 200, overflow: 'hidden',
    boxShadow: '0 8px 32px rgba(0,0,0,0.5)',
  },
  profileItem: {
    display: 'flex', alignItems: 'center', justifyContent: 'space-between',
    padding: '10px 14px', transition: 'background 0.15s',
  },
  profileItemLeft: { display: 'flex', alignItems: 'center', gap: '10px', flex: 1 },
  profileName: { color: '#fff', fontSize: '0.9rem' },
  removeProfileBtn: {
    background: 'none', border: 'none', color: '#555',
    fontSize: '1.1rem', cursor: 'pointer', lineHeight: 1,
  },
  addProfileRow: {
    padding: '10px 14px',
    borderTop: '1px solid #2a2a3a',
    display: 'flex', flexDirection: 'column', gap: '8px',
  },
  profileInput: {
    padding: '7px 10px',
    background: '#12121a', border: '1px solid #2a2a3a', borderRadius: '6px',
    color: '#fff', fontSize: '0.85rem', outline: 'none', width: '100%',
  },
  colorPicker: { display: 'flex', gap: '6px' },
  colorDot: {
    width: 18, height: 18, borderRadius: '50%',
    border: 'none', cursor: 'pointer',
  },
  addProfileBtn: {
    padding: '6px 14px',
    background: '#6366f1', color: '#fff',
    border: 'none', borderRadius: '6px',
    fontSize: '0.85rem', fontWeight: 600, cursor: 'pointer',
  },
  divider: { width: 1, height: 24, background: '#2a2a3a' },
  iconBtn: {
    padding: '8px 12px',
    background: 'transparent', color: '#888',
    border: '1px solid #2a2a3a', borderRadius: '8px',
    fontSize: '0.85rem', cursor: 'pointer', transition: 'color 0.15s',
  },
  addBtn: {
    padding: '9px 18px',
    background: '#6366f1', color: '#fff',
    border: 'none', borderRadius: '8px',
    fontSize: '0.92rem', fontWeight: 600, cursor: 'pointer',
  },
  backdrop: {
    position: 'fixed', inset: 0, zIndex: 49,
  },
};

export default Header;

import { useRef, useState } from 'react';

const SettingsModal = ({ settings, onSave, onClose, onExport, onImport }) => {
  const importRef = useRef(null);
  const [tmdb, setTmdb] = useState(settings.tmdbApiKey || '');
  const [rawg, setRawg] = useState(settings.rawgApiKey || '');

  const handleSave = () => {
    onSave({ tmdbApiKey: tmdb.trim(), rawgApiKey: rawg.trim() });
    onClose();
  };

  return (
    <div style={styles.overlay} onClick={onClose}>
      <div style={styles.modal} onClick={(e) => e.stopPropagation()}>
        <div style={styles.header}>
          <h2 style={styles.title}>Settings</h2>
          <button style={styles.closeBtn} onClick={onClose}>×</button>
        </div>

        <div style={styles.body}>
          <section style={styles.section}>
            <h3 style={styles.sectionTitle}>API Keys — Search Online</h3>
            <p style={styles.hint}>
              API keys let you search for movies and games online when adding new entries.
              Keys are saved locally on your device only.
            </p>

            <div style={styles.field}>
              <label style={styles.label}>
                TMDB API Key{' '}
                <a
                  href="https://www.themoviedb.org/settings/api"
                  target="_blank"
                  rel="noreferrer"
                  style={styles.link}
                >
                  (get one here)
                </a>
              </label>
              <input
                type="password"
                placeholder="Paste your TMDB v3 auth key…"
                value={tmdb}
                onChange={(e) => setTmdb(e.target.value)}
                style={styles.input}
              />
            </div>

            <div style={styles.field}>
              <label style={styles.label}>
                RAWG API Key{' '}
                <a
                  href="https://rawg.io/apidocs"
                  target="_blank"
                  rel="noreferrer"
                  style={styles.link}
                >
                  (get one here)
                </a>
              </label>
              <input
                type="password"
                placeholder="Paste your RAWG key…"
                value={rawg}
                onChange={(e) => setRawg(e.target.value)}
                style={styles.input}
              />
            </div>
          </section>

          <section style={styles.section}>
            <h3 style={styles.sectionTitle}>Data</h3>
            <p style={styles.hint}>Export your ratings as a JSON backup or import a previously exported file.</p>
            <div style={styles.dataRow}>
              <button style={styles.dataBtn} onClick={onExport}>↑ Export</button>
              <button style={styles.dataBtn} onClick={() => importRef.current?.click()}>↓ Import</button>
              <input
                ref={importRef}
                type="file"
                accept=".json"
                onChange={(e) => { onImport(e); onClose(); }}
                style={{ display: 'none' }}
              />
            </div>
          </section>

          <section style={styles.section}>
            <h3 style={styles.sectionTitle}>About</h3>
            <p style={styles.hint}>
              My Ratings — a personal tracker for movies and games.
              All data is stored locally in your browser.
            </p>
          </section>
        </div>

        <div style={styles.footer}>
          <button style={styles.saveBtn} onClick={handleSave}>Save</button>
          <button style={styles.cancelBtn} onClick={onClose}>Cancel</button>
        </div>
      </div>
    </div>
  );
};

const styles = {
  overlay: {
    position: 'fixed', inset: 0,
    background: 'rgba(0,0,0,0.75)',
    display: 'flex', alignItems: 'center', justifyContent: 'center',
    zIndex: 100,
  },
  modal: {
    background: '#1a1a2e', border: '1px solid #2a2a3a', borderRadius: '16px',
    width: '90%', maxWidth: '480px',
    display: 'flex', flexDirection: 'column',
  },
  header: {
    display: 'flex', justifyContent: 'space-between', alignItems: 'center',
    padding: '20px 24px', borderBottom: '1px solid #2a2a3a',
  },
  title: { color: '#fff', fontSize: '1.2rem', fontWeight: 700 },
  closeBtn: {
    background: 'none', border: 'none', color: '#888',
    fontSize: '1.8rem', cursor: 'pointer', lineHeight: 1,
  },
  body: { padding: '24px', display: 'flex', flexDirection: 'column', gap: '24px' },
  section: { display: 'flex', flexDirection: 'column', gap: '14px' },
  sectionTitle: { color: '#ccc', fontSize: '0.95rem', fontWeight: 700 },
  hint: { color: '#666', fontSize: '0.85rem', lineHeight: 1.6 },
  field: { display: 'flex', flexDirection: 'column', gap: '6px' },
  label: { color: '#aaa', fontSize: '0.85rem' },
  link: { color: '#6366f1', textDecoration: 'none', fontSize: '0.82rem' },
  input: {
    padding: '10px 14px',
    background: '#12121a', border: '1px solid #2a2a3a', borderRadius: '8px',
    color: '#fff', fontSize: '0.9rem', outline: 'none',
  },
  dataRow: { display: 'flex', gap: '10px' },
  dataBtn: {
    flex: 1, padding: '10px',
    background: 'transparent', color: '#aaa',
    border: '1px solid #2a2a3a', borderRadius: '8px',
    fontSize: '0.88rem', cursor: 'pointer',
  },
  footer: {
    display: 'flex', gap: '10px',
    padding: '16px 24px', borderTop: '1px solid #2a2a3a',
  },
  saveBtn: {
    flex: 1, padding: '11px',
    background: '#6366f1', color: '#fff',
    border: 'none', borderRadius: '8px', fontSize: '0.95rem', fontWeight: 600, cursor: 'pointer',
  },
  cancelBtn: {
    flex: 1, padding: '11px',
    background: 'transparent', color: '#888',
    border: '1px solid #3a3a4a', borderRadius: '8px', fontSize: '0.95rem', cursor: 'pointer',
  },
};

export default SettingsModal;

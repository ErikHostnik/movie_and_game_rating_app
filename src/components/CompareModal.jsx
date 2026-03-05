import { useState } from 'react';
import StarRating from './StarRating';
import { MOVIE_STATUSES, GAME_STATUSES } from '../constants';

const ALL_STATUSES = [...MOVIE_STATUSES, ...GAME_STATUSES];

const statusLabel = (s) => ALL_STATUSES.find((x) => x.id === s)?.label ?? s ?? '—';
const statusColor = (s) => ALL_STATUSES.find((x) => x.id === s)?.color ?? '#555';

const ItemPanel = ({ item }) => {
  if (!item) return <div style={styles.emptyPanel}>Pick an item →</div>;
  return (
    <div style={styles.panel}>
      <div style={styles.imageWrap}>
        {item.image
          ? <img src={item.image} alt={item.title} style={styles.img} />
          : <div style={styles.noImg}>No Image</div>}
        {item.favorite && <span style={styles.favBadge}>♥</span>}
      </div>

      <div style={styles.panelInfo}>
        <h3 style={styles.panelTitle}>{item.title}</h3>
        <div style={styles.typeBadge}>{item.type === 'movies' ? 'Movie' : 'Game'}</div>

        <div style={styles.row}>
          <span style={styles.rowLabel}>Rating</span>
          <StarRating rating={item.rating} interactive={false} size={16} />
        </div>

        {item.status && (
          <div style={styles.row}>
            <span style={styles.rowLabel}>Status</span>
            <span style={{ color: statusColor(item.status), fontWeight: 600, fontSize: '0.9rem' }}>
              {statusLabel(item.status)}
            </span>
          </div>
        )}

        {item.type === 'games' && item.completionRate !== undefined && (
          <div style={styles.row}>
            <span style={styles.rowLabel}>Completion</span>
            <span style={{ color: '#22c55e', fontWeight: 700, fontSize: '0.9rem' }}>
              {item.completionRate}%
            </span>
          </div>
        )}

        {item.genres?.length > 0 && (
          <div style={styles.genreRow}>
            {item.genres.map((g) => (
              <span key={g} style={styles.genreChip}>{g}</span>
            ))}
          </div>
        )}

        {item.description && (
          <p style={styles.desc}>
            {item.description.length > 200
              ? item.description.slice(0, 200) + '...'
              : item.description}
          </p>
        )}
      </div>
    </div>
  );
};

const CompareModal = ({ item1, allItems, onClose }) => {
  const [item2, setItem2] = useState(null);
  const [search, setSearch] = useState('');

  const candidates = allItems
    .filter((i) => i.id !== item1.id)
    .filter((i) => i.title.toLowerCase().includes(search.toLowerCase()));

  return (
    <div style={styles.overlay} onClick={onClose}>
      <div style={styles.modal} onClick={(e) => e.stopPropagation()}>
        <div style={styles.header}>
          <h2 style={styles.headerTitle}>Compare</h2>
          <button style={styles.closeBtn} onClick={onClose}>×</button>
        </div>

        <div style={styles.body}>
          {/* Left: item1 */}
          <ItemPanel item={item1} />

          {/* VS divider */}
          <div style={styles.vs}>VS</div>

          {/* Right: item2 or picker */}
          {item2 ? (
            <div style={{ position: 'relative', flex: 1 }}>
              <button style={styles.changeBtn} onClick={() => setItem2(null)}>Change</button>
              <ItemPanel item={item2} />
            </div>
          ) : (
            <div style={styles.picker}>
              <div style={styles.pickerTitle}>Pick something to compare</div>
              <input
                type="text"
                placeholder="Search..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                style={styles.pickerSearch}
                autoFocus
              />
              <div style={styles.pickerList}>
                {candidates.length === 0 && (
                  <p style={styles.noResults}>No items found</p>
                )}
                {candidates.map((item) => (
                  <div
                    key={item.id}
                    style={styles.pickerItem}
                    onClick={() => setItem2(item)}
                  >
                    {item.image && (
                      <img src={item.image} alt={item.title} style={styles.pickerThumb} />
                    )}
                    <div style={styles.pickerItemInfo}>
                      <div style={styles.pickerItemTitle}>{item.title}</div>
                      <div style={{ color: '#f59e0b', fontSize: '0.8rem' }}>
                        {item.rating > 0 ? `${item.rating}/10` : 'Unrated'}
                      </div>
                    </div>
                    <span style={styles.pickerType}>
                      {item.type === 'movies' ? 'Film' : 'Game'}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Winner banner */}
        {item2 && item1.rating > 0 && item2.rating > 0 && (
          <div style={styles.winner}>
            {item1.rating > item2.rating
              ? `${item1.title} wins (+${(item1.rating - item2.rating).toFixed(1)})`
              : item2.rating > item1.rating
              ? `${item2.title} wins (+${(item2.rating - item1.rating).toFixed(1)})`
              : 'It\'s a tie!'}
          </div>
        )}
      </div>
    </div>
  );
};

const styles = {
  overlay: {
    position: 'fixed', inset: 0,
    background: 'rgba(0,0,0,0.8)',
    display: 'flex', alignItems: 'center', justifyContent: 'center',
    zIndex: 150,
  },
  modal: {
    background: '#1a1a2e',
    borderRadius: '16px',
    border: '1px solid #2a2a3a',
    width: '96%', maxWidth: '1000px', maxHeight: '92vh',
    overflow: 'auto',
    display: 'flex', flexDirection: 'column',
  },
  header: {
    display: 'flex', justifyContent: 'space-between', alignItems: 'center',
    padding: '18px 24px',
    borderBottom: '1px solid #2a2a3a',
  },
  headerTitle: { color: '#fff', fontSize: '1.2rem', fontWeight: 700 },
  closeBtn: {
    background: 'none', border: 'none', color: '#888',
    fontSize: '1.8rem', cursor: 'pointer', lineHeight: 1,
  },
  body: {
    display: 'flex',
    flex: 1,
    minHeight: 0,
    padding: '24px',
    gap: '0',
    alignItems: 'flex-start',
  },
  vs: {
    flexShrink: 0,
    width: '60px',
    display: 'flex', alignItems: 'center', justifyContent: 'center',
    color: '#3a3a4a',
    fontSize: '1.4rem', fontWeight: 900,
    paddingTop: '120px',
  },
  panel: {
    flex: 1,
    display: 'flex', flexDirection: 'column', gap: '14px',
  },
  emptyPanel: {
    flex: 1,
    display: 'flex', alignItems: 'center', justifyContent: 'center',
    color: '#444', fontSize: '1rem',
    border: '2px dashed #2a2a3a', borderRadius: '12px', minHeight: '300px',
  },
  imageWrap: {
    width: '100%', maxWidth: '220px',
    aspectRatio: '2/3', borderRadius: '10px', overflow: 'hidden',
    background: '#12121a', position: 'relative', flexShrink: 0,
    alignSelf: 'center',
  },
  img: { width: '100%', height: '100%', objectFit: 'cover' },
  noImg: {
    width: '100%', height: '100%',
    display: 'flex', alignItems: 'center', justifyContent: 'center',
    color: '#555', fontSize: '0.9rem',
  },
  favBadge: {
    position: 'absolute', top: 8, right: 8,
    background: 'rgba(239,68,68,0.9)', color: '#fff',
    borderRadius: '50%', width: 24, height: 24,
    display: 'flex', alignItems: 'center', justifyContent: 'center',
    fontSize: '0.8rem',
  },
  panelInfo: { display: 'flex', flexDirection: 'column', gap: '10px' },
  panelTitle: { color: '#fff', fontSize: '1.2rem', fontWeight: 700 },
  typeBadge: {
    display: 'inline-block',
    padding: '3px 10px', background: '#6366f1',
    borderRadius: '6px', fontSize: '0.75rem', fontWeight: 600, color: '#fff',
  },
  row: { display: 'flex', alignItems: 'center', gap: '10px', flexWrap: 'wrap' },
  rowLabel: { color: '#666', fontSize: '0.85rem', minWidth: '80px' },
  genreRow: { display: 'flex', flexWrap: 'wrap', gap: '5px' },
  genreChip: {
    padding: '2px 8px', background: '#1e1e2e',
    border: '1px solid #3a3a4a', borderRadius: '10px',
    fontSize: '0.75rem', color: '#888',
  },
  desc: { color: '#aaa', fontSize: '0.88rem', lineHeight: 1.6 },
  changeBtn: {
    position: 'absolute', top: 0, right: 0,
    padding: '5px 12px', background: '#3a3a4a',
    border: 'none', borderRadius: '6px', color: '#ccc',
    fontSize: '0.8rem', cursor: 'pointer',
  },
  picker: {
    flex: 1,
    display: 'flex', flexDirection: 'column', gap: '12px',
  },
  pickerTitle: { color: '#888', fontSize: '0.9rem', fontWeight: 600 },
  pickerSearch: {
    padding: '10px 14px',
    background: '#12121a', border: '1px solid #2a2a3a', borderRadius: '8px',
    color: '#fff', fontSize: '0.9rem', outline: 'none',
  },
  pickerList: {
    flex: 1, overflowY: 'auto', maxHeight: '400px',
    display: 'flex', flexDirection: 'column', gap: '4px',
  },
  noResults: { color: '#555', fontSize: '0.9rem', textAlign: 'center', padding: '20px' },
  pickerItem: {
    display: 'flex', alignItems: 'center', gap: '10px',
    padding: '10px 12px', borderRadius: '8px', cursor: 'pointer',
    background: '#12121a', border: '1px solid transparent',
    transition: 'border-color 0.15s',
  },
  pickerThumb: { width: 32, height: 44, objectFit: 'cover', borderRadius: '4px', flexShrink: 0 },
  pickerItemInfo: { flex: 1, minWidth: 0 },
  pickerItemTitle: {
    color: '#fff', fontSize: '0.9rem', fontWeight: 600,
    whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis',
  },
  pickerType: {
    color: '#555', fontSize: '0.75rem',
    background: '#1e1e2e', padding: '2px 8px', borderRadius: '10px',
    flexShrink: 0,
  },
  winner: {
    margin: '0 24px 20px',
    padding: '12px 20px',
    background: '#f59e0b22', border: '1px solid #f59e0b44',
    borderRadius: '10px', color: '#f59e0b',
    fontSize: '1rem', fontWeight: 700, textAlign: 'center',
  },
};

export default CompareModal;

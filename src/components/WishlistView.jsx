import Card from './Card';
import { MOVIE_STATUSES, GAME_STATUSES } from '../constants';

const ALL_STATUSES = [...MOVIE_STATUSES, ...GAME_STATUSES];

const WishlistView = ({ items, onCardClick }) => {
  const movies = items.filter((i) => i.type === 'movies');
  const games  = items.filter((i) => i.type === 'games');

  if (items.length === 0) {
    return (
      <div style={styles.empty}>
        <div style={styles.emptyIcon}>☆</div>
        <p style={styles.emptyTitle}>Your wishlist is empty</p>
        <p style={styles.emptyHint}>
          Set a movie status to "Want to Watch" or a game status to "Wishlist" to add them here.
        </p>
      </div>
    );
  }

  const StatusBadge = ({ status }) => {
    const s = ALL_STATUSES.find((x) => x.id === status);
    if (!s) return null;
    return (
      <span style={{ ...styles.badge, background: s.color + '22', color: s.color, border: `1px solid ${s.color}44` }}>
        {s.label}
      </span>
    );
  };

  const Section = ({ title, sectionItems }) => {
    if (!sectionItems.length) return null;
    return (
      <div style={styles.section}>
        <h2 style={styles.sectionTitle}>{title} <span style={styles.sectionCount}>{sectionItems.length}</span></h2>
        <div style={styles.grid}>
          {sectionItems.map((item) => (
            <div key={item.id} style={styles.cardWrap}>
              <Card item={item} onClick={onCardClick} />
              <StatusBadge status={item.status} />
            </div>
          ))}
        </div>
      </div>
    );
  };

  return (
    <div style={styles.page}>
      <Section title="Movies" sectionItems={movies} />
      <Section title="Games"  sectionItems={games}  />
    </div>
  );
};

const styles = {
  page: { padding: '32px 40px' },
  empty: {
    display: 'flex', flexDirection: 'column',
    alignItems: 'center', justifyContent: 'center',
    padding: '80px 40px', gap: '12px',
  },
  emptyIcon: { fontSize: '3rem', color: '#333' },
  emptyTitle: { color: '#888', fontSize: '1.2rem', fontWeight: 600 },
  emptyHint: { color: '#555', fontSize: '0.9rem', textAlign: 'center', maxWidth: '420px', lineHeight: 1.6 },
  section: { marginBottom: '40px' },
  sectionTitle: { color: '#fff', fontSize: '1.2rem', fontWeight: 700, marginBottom: '16px' },
  sectionCount: {
    display: 'inline-block',
    background: '#6366f1',
    color: '#fff',
    fontSize: '0.75rem',
    fontWeight: 700,
    padding: '2px 8px',
    borderRadius: '10px',
    marginLeft: '8px',
    verticalAlign: 'middle',
  },
  grid: {
    display: 'flex',
    flexWrap: 'wrap',
    gap: '16px',
  },
  cardWrap: {
    width: '155px',
    flexShrink: 0,
    display: 'flex',
    flexDirection: 'column',
    gap: '6px',
  },
  badge: {
    display: 'inline-block',
    padding: '3px 10px',
    borderRadius: '20px',
    fontSize: '0.75rem',
    fontWeight: 600,
    textAlign: 'center',
  },
};

export default WishlistView;

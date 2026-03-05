import StarRating from './StarRating';
import { MOVIE_STATUSES, GAME_STATUSES } from '../constants';

const ALL_STATUSES = [...MOVIE_STATUSES, ...GAME_STATUSES];

const completionColor = (v) =>
  v === 100 ? '#f59e0b'
  : v >= 70  ? '#22c55e'
  : v >= 40  ? '#f97316'
  : '#ef4444';

const CompletionRing = ({ value, size = 46 }) => {
  const sw = 4;
  const r = (size - sw * 2) / 2;
  const circ = 2 * Math.PI * r;
  const offset = circ - (value / 100) * circ;
  const color = completionColor(value);
  return (
    <div style={{ position: 'relative', width: size, height: size }}>
      <svg width={size} height={size} style={{ transform: 'rotate(-90deg)', display: 'block' }}>
        <circle cx={size/2} cy={size/2} r={r} fill="none" stroke="#111" strokeWidth={sw} />
        <circle
          cx={size/2} cy={size/2} r={r}
          fill="none" stroke={color} strokeWidth={sw}
          strokeDasharray={circ} strokeDashoffset={offset}
          strokeLinecap="round"
        />
      </svg>
      <div style={{
        position: 'absolute', inset: 0,
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        fontSize: `${size * 0.21}px`, fontWeight: 800, color,
        letterSpacing: '-0.02em',
      }}>
        {value}%
      </div>
    </div>
  );
};

const Card = ({ item, onClick }) => {
  const isGame = item.type === 'games';
  const hasCompletion = isGame && item.completionRate !== undefined;
  const statusInfo = ALL_STATUSES.find((s) => s.id === item.status);

  return (
    <div style={styles.card} onClick={() => onClick(item)}>
      <div style={{ ...styles.imageWrapper, position: 'relative' }}>
        {item.image
          ? <img src={item.image} alt={item.title} style={styles.image} />
          : <div style={styles.placeholder}>No Image</div>}

        {/* Status badge — top left */}
        {statusInfo && (
          <div style={{ ...styles.statusBadge, background: statusInfo.color }}>
            {statusInfo.label}
          </div>
        )}

        {/* Favorite heart — top right */}
        {item.favorite && (
          <div style={styles.favBadge}>♥</div>
        )}

        {/* Completion ring — bottom right (games only) */}
        {hasCompletion && (
          <div style={styles.ringWrap}>
            <CompletionRing value={item.completionRate} size={46} />
          </div>
        )}
      </div>

      <div style={styles.info}>
        <h3 style={styles.title}>{item.title}</h3>

        {/* Genre chips (max 2) */}
        {item.genres?.length > 0 && (
          <div style={styles.genreRow}>
            {item.genres.slice(0, 2).map((g) => (
              <span key={g} style={styles.genreChip}>{g}</span>
            ))}
            {item.genres.length > 2 && (
              <span style={styles.genreMore}>+{item.genres.length - 2}</span>
            )}
          </div>
        )}

        <StarRating rating={item.rating} interactive={false} size={13} />
      </div>
    </div>
  );
};

const styles = {
  card: {
    background: '#1a1a2e', borderRadius: '12px',
    overflow: 'hidden', cursor: 'pointer',
    transition: 'transform 0.2s, box-shadow 0.2s',
    border: '1px solid #2a2a3a',
  },
  imageWrapper: {
    width: '100%', aspectRatio: '2/3',
    overflow: 'hidden', background: '#12121a',
  },
  image: { width: '100%', height: '100%', objectFit: 'cover' },
  placeholder: {
    width: '100%', height: '100%',
    display: 'flex', alignItems: 'center', justifyContent: 'center',
    color: '#555', fontSize: '0.9rem',
  },
  statusBadge: {
    position: 'absolute', top: 7, left: 7,
    padding: '2px 7px',
    borderRadius: '4px', fontSize: '0.65rem', fontWeight: 700,
    color: '#000', letterSpacing: '0.02em',
    maxWidth: '80%',
    whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis',
  },
  favBadge: {
    position: 'absolute', top: 7, right: 7,
    background: 'rgba(239,68,68,0.9)', color: '#fff',
    borderRadius: '50%', width: 22, height: 22,
    display: 'flex', alignItems: 'center', justifyContent: 'center',
    fontSize: '0.7rem',
  },
  ringWrap: {
    position: 'absolute', bottom: 7, right: 7,
    background: 'rgba(0,0,0,0.72)',
    borderRadius: '50%', padding: '2px',
    backdropFilter: 'blur(4px)',
  },
  info: { padding: '10px 12px', display: 'flex', flexDirection: 'column', gap: '5px' },
  title: {
    fontSize: '0.92rem', fontWeight: 600, color: '#fff',
    whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis',
  },
  genreRow: { display: 'flex', gap: '4px', flexWrap: 'nowrap' },
  genreChip: {
    padding: '1px 6px',
    background: '#12121a', border: '1px solid #2a2a3a',
    borderRadius: '10px', fontSize: '0.68rem', color: '#777',
    whiteSpace: 'nowrap',
  },
  genreMore: { color: '#555', fontSize: '0.68rem', alignSelf: 'center' },
};

export default Card;

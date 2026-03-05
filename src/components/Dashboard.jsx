import { MOVIE_STATUSES, GAME_STATUSES } from '../constants';

const statColor = (s) => {
  const all = [...MOVIE_STATUSES, ...GAME_STATUSES];
  return all.find((x) => x.id === s)?.color ?? '#555';
};

const ratingBands = [
  { label: 'F (0.5–1.5)',  min: 0.5,  max: 1.5  },
  { label: 'D (1.5–3)',    min: 1.5,  max: 3    },
  { label: 'C (3–5)',      min: 3,    max: 5    },
  { label: 'B (5–7)',      min: 5,    max: 7    },
  { label: 'A (7–9)',      min: 7,    max: 9    },
  { label: 'S (9–10)',     min: 9,    max: 10.1 },
];

const tierColor = ['#7f1d1d', '#F44336', '#FF9800', '#FDD835', '#8BC34A', '#4CAF50'];

const StatCard = ({ label, value, sub, color }) => (
  <div style={styles.statCard}>
    <div style={{ ...styles.statValue, color: color || '#fff' }}>{value}</div>
    <div style={styles.statLabel}>{label}</div>
    {sub && <div style={styles.statSub}>{sub}</div>}
  </div>
);

const Bar = ({ pct, color }) => (
  <div style={styles.barBg}>
    <div style={{ ...styles.barFill, width: `${pct}%`, background: color }} />
  </div>
);

const Dashboard = ({ items }) => {
  const movies = items.filter((i) => i.type === 'movies');
  const games  = items.filter((i) => i.type === 'games');
  const rated  = items.filter((i) => i.rating > 0);

  const avg = rated.length
    ? (rated.reduce((s, i) => s + i.rating, 0) / rated.length).toFixed(1)
    : '—';

  const favorites = items.filter((i) => i.favorite).length;

  const avgCompletion = games.filter((g) => g.completionRate > 0).length
    ? Math.round(
        games.reduce((s, g) => s + (g.completionRate || 0), 0) / games.length
      )
    : null;

  // Genre distribution
  const genreCounts = {};
  items.forEach((i) => (i.genres || []).forEach((g) => {
    genreCounts[g] = (genreCounts[g] || 0) + 1;
  }));
  const topGenres = Object.entries(genreCounts)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 8);
  const maxGenreCount = topGenres[0]?.[1] || 1;

  // Status distribution (movies)
  const movieStatusCounts = {};
  movies.forEach((m) => {
    const s = m.status || 'unset';
    movieStatusCounts[s] = (movieStatusCounts[s] || 0) + 1;
  });
  // Status distribution (games)
  const gameStatusCounts = {};
  games.forEach((g) => {
    const s = g.status || 'unset';
    gameStatusCounts[s] = (gameStatusCounts[s] || 0) + 1;
  });

  // Rating distribution
  const bandCounts = ratingBands.map(({ min, max }) => ({
    count: rated.filter((i) => i.rating >= min && i.rating < max).length,
  }));
  const maxBand = Math.max(...bandCounts.map((b) => b.count), 1);

  // Top rated
  const topRated = [...rated].sort((a, b) => b.rating - a.rating).slice(0, 5);

  // Recently added
  const recent = [...items]
    .sort((a, b) => new Date(b.dateAdded) - new Date(a.dateAdded))
    .slice(0, 5);

  if (items.length === 0) {
    return (
      <div style={styles.empty}>
        <p style={styles.emptyText}>Add some movies or games to see your dashboard.</p>
      </div>
    );
  }

  return (
    <div style={styles.page}>
      {/* Summary cards */}
      <section style={styles.section}>
        <h2 style={styles.sectionTitle}>Overview</h2>
        <div style={styles.statsRow}>
          <StatCard label="Movies"      value={movies.length} color="#6366f1" />
          <StatCard label="Games"       value={games.length}  color="#8b5cf6" />
          <StatCard label="Avg Rating"  value={`${avg}/10`}   color="#f59e0b" />
          <StatCard label="Favorites"   value={favorites}     color="#ef4444" />
          {avgCompletion !== null && (
            <StatCard label="Avg Completion" value={`${avgCompletion}%`} color="#22c55e" />
          )}
        </div>
      </section>

      {/* Rating distribution */}
      <section style={styles.section}>
        <h2 style={styles.sectionTitle}>Rating Distribution</h2>
        <div style={styles.chartArea}>
          {ratingBands.map((band, i) => (
            <div key={band.label} style={styles.bandRow}>
              <div style={styles.bandLabel}>{band.label}</div>
              <Bar pct={(bandCounts[i].count / maxBand) * 100} color={tierColor[i]} />
              <div style={styles.bandCount}>{bandCounts[i].count}</div>
            </div>
          ))}
        </div>
      </section>

      {/* Genre breakdown */}
      {topGenres.length > 0 && (
        <section style={styles.section}>
          <h2 style={styles.sectionTitle}>Top Genres</h2>
          <div style={styles.chartArea}>
            {topGenres.map(([genre, count]) => (
              <div key={genre} style={styles.bandRow}>
                <div style={styles.bandLabel}>{genre}</div>
                <Bar pct={(count / maxGenreCount) * 100} color="#6366f1" />
                <div style={styles.bandCount}>{count}</div>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Status breakdowns */}
      <div style={styles.twoCol}>
        {movies.length > 0 && (
          <section style={styles.section}>
            <h2 style={styles.sectionTitle}>Movie Statuses</h2>
            {Object.entries(movieStatusCounts).map(([s, count]) => (
              <div key={s} style={styles.statusRow}>
                <span style={{ ...styles.statusDot, background: statColor(s) }} />
                <span style={styles.statusName}>{s.replace('_', ' ')}</span>
                <span style={styles.statusCount}>{count}</span>
              </div>
            ))}
          </section>
        )}

        {games.length > 0 && (
          <section style={styles.section}>
            <h2 style={styles.sectionTitle}>Game Statuses</h2>
            {Object.entries(gameStatusCounts).map(([s, count]) => (
              <div key={s} style={styles.statusRow}>
                <span style={{ ...styles.statusDot, background: statColor(s) }} />
                <span style={styles.statusName}>{s.replace('_', ' ')}</span>
                <span style={styles.statusCount}>{count}</span>
              </div>
            ))}
          </section>
        )}
      </div>

      {/* Top rated + Recent */}
      <div style={styles.twoCol}>
        {topRated.length > 0 && (
          <section style={styles.section}>
            <h2 style={styles.sectionTitle}>Top Rated</h2>
            {topRated.map((item) => (
              <div key={item.id} style={styles.listRow}>
                {item.image && (
                  <img src={item.image} alt={item.title} style={styles.thumb} />
                )}
                <div style={styles.listInfo}>
                  <div style={styles.listTitle}>{item.title}</div>
                  <div style={{ color: '#f59e0b', fontSize: '0.85rem', fontWeight: 700 }}>
                    {item.rating}/10
                  </div>
                </div>
              </div>
            ))}
          </section>
        )}

        {recent.length > 0 && (
          <section style={styles.section}>
            <h2 style={styles.sectionTitle}>Recently Added</h2>
            {recent.map((item) => (
              <div key={item.id} style={styles.listRow}>
                {item.image && (
                  <img src={item.image} alt={item.title} style={styles.thumb} />
                )}
                <div style={styles.listInfo}>
                  <div style={styles.listTitle}>{item.title}</div>
                  <div style={{ color: '#555', fontSize: '0.8rem' }}>
                    {new Date(item.dateAdded).toLocaleDateString()}
                  </div>
                </div>
              </div>
            ))}
          </section>
        )}
      </div>
    </div>
  );
};

const styles = {
  page: { padding: '32px 40px', maxWidth: '1200px', margin: '0 auto' },
  empty: {
    display: 'flex', alignItems: 'center', justifyContent: 'center',
    padding: '80px 40px',
  },
  emptyText: { color: '#555', fontSize: '1.1rem' },
  section: {
    background: '#1a1a2e',
    border: '1px solid #2a2a3a',
    borderRadius: '14px',
    padding: '20px 24px',
    marginBottom: '20px',
  },
  sectionTitle: {
    color: '#aaa',
    fontSize: '0.8rem',
    textTransform: 'uppercase',
    letterSpacing: '0.08em',
    fontWeight: 700,
    marginBottom: '16px',
  },
  statsRow: { display: 'flex', gap: '16px', flexWrap: 'wrap' },
  statCard: {
    flex: '1 1 100px',
    background: '#12121a',
    border: '1px solid #2a2a3a',
    borderRadius: '10px',
    padding: '16px 20px',
    minWidth: '100px',
  },
  statValue: { fontSize: '2rem', fontWeight: 800, lineHeight: 1 },
  statLabel: { color: '#666', fontSize: '0.82rem', marginTop: '4px' },
  statSub: { color: '#555', fontSize: '0.78rem', marginTop: '2px' },
  chartArea: { display: 'flex', flexDirection: 'column', gap: '10px' },
  bandRow: {
    display: 'flex', alignItems: 'center', gap: '12px',
  },
  bandLabel: { color: '#888', fontSize: '0.82rem', minWidth: '90px', textAlign: 'right' },
  bandCount: { color: '#666', fontSize: '0.82rem', minWidth: '24px', textAlign: 'right' },
  barBg: {
    flex: 1, height: '10px', background: '#12121a',
    borderRadius: '5px', overflow: 'hidden',
  },
  barFill: { height: '100%', borderRadius: '5px', transition: 'width 0.4s ease' },
  twoCol: { display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' },
  statusRow: {
    display: 'flex', alignItems: 'center', gap: '10px',
    padding: '6px 0', borderBottom: '1px solid #12121a',
  },
  statusDot: { width: 10, height: 10, borderRadius: '50%', flexShrink: 0 },
  statusName: { flex: 1, color: '#ccc', fontSize: '0.88rem', textTransform: 'capitalize' },
  statusCount: { color: '#666', fontSize: '0.88rem', fontWeight: 700 },
  listRow: {
    display: 'flex', alignItems: 'center', gap: '12px',
    padding: '8px 0', borderBottom: '1px solid #12121a',
  },
  thumb: { width: 36, height: 52, objectFit: 'cover', borderRadius: '4px', flexShrink: 0 },
  listInfo: { flex: 1, minWidth: 0 },
  listTitle: {
    color: '#fff', fontSize: '0.9rem', fontWeight: 600,
    whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis',
  },
};

export default Dashboard;

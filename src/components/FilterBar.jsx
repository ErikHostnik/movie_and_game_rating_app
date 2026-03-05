import { MOVIE_GENRES, GAME_GENRES, MOVIE_STATUSES, GAME_STATUSES } from '../constants';

const SORT_OPTIONS = [
  { id: 'dateAdded', label: 'Date Added' },
  { id: 'rating',    label: 'Rating' },
  { id: 'title',     label: 'Title A–Z' },
  { id: 'completion',label: 'Completion %' },
];

const FilterBar = ({
  type,
  searchQuery, onSearchChange,
  selectedGenres, onGenresChange,
  selectedStatuses, onStatusesChange,
  sortBy, onSortChange,
  showFavoritesOnly, onFavoritesToggle,
}) => {
  const genres   = type === 'movies' ? MOVIE_GENRES   : GAME_GENRES;
  const statuses = type === 'movies' ? MOVIE_STATUSES : GAME_STATUSES;

  const toggleGenre = (g) =>
    onGenresChange(selectedGenres.includes(g)
      ? selectedGenres.filter((x) => x !== g)
      : [...selectedGenres, g]);

  const toggleStatus = (s) =>
    onStatusesChange(selectedStatuses.includes(s)
      ? selectedStatuses.filter((x) => x !== s)
      : [...selectedStatuses, s]);

  const hasFilters =
    searchQuery || selectedGenres.length || selectedStatuses.length || showFavoritesOnly;

  const clearAll = () => {
    onSearchChange('');
    onGenresChange([]);
    onStatusesChange([]);
    if (showFavoritesOnly) onFavoritesToggle();
  };

  return (
    <div style={styles.bar}>
      {/* Row 1: search + sort + favorites + clear */}
      <div style={styles.row}>
        <div style={styles.searchWrap}>
          <span style={styles.searchIcon}>⌕</span>
          <input
            type="text"
            placeholder="Search..."
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            style={styles.searchInput}
          />
          {searchQuery && (
            <button style={styles.clearInput} onClick={() => onSearchChange('')}>×</button>
          )}
        </div>

        <select
          value={sortBy}
          onChange={(e) => onSortChange(e.target.value)}
          style={styles.select}
        >
          {SORT_OPTIONS.map((o) => (
            <option key={o.id} value={o.id}>{o.label}</option>
          ))}
        </select>

        <button
          style={{
            ...styles.favBtn,
            background: showFavoritesOnly ? '#f59e0b' : 'transparent',
            color:      showFavoritesOnly ? '#000'    : '#888',
            borderColor: showFavoritesOnly ? '#f59e0b' : '#3a3a4a',
          }}
          onClick={onFavoritesToggle}
        >
          ♥ Favorites
        </button>

        {hasFilters && (
          <button style={styles.clearBtn} onClick={clearAll}>Clear all</button>
        )}
      </div>

      {/* Row 2: genre chips */}
      <div style={styles.chips}>
        {genres.map((g) => (
          <button
            key={g}
            style={{
              ...styles.chip,
              background:  selectedGenres.includes(g) ? '#6366f1' : '#1e1e2e',
              color:       selectedGenres.includes(g) ? '#fff'    : '#888',
              borderColor: selectedGenres.includes(g) ? '#6366f1' : '#2a2a3a',
            }}
            onClick={() => toggleGenre(g)}
          >
            {g}
          </button>
        ))}
      </div>

      {/* Row 3: status chips */}
      <div style={styles.chips}>
        {statuses.map((s) => (
          <button
            key={s.id}
            style={{
              ...styles.chip,
              background:  selectedStatuses.includes(s.id) ? s.color : '#1e1e2e',
              color:       selectedStatuses.includes(s.id) ? '#000'  : '#888',
              borderColor: selectedStatuses.includes(s.id) ? s.color : '#2a2a3a',
              fontWeight:  selectedStatuses.includes(s.id) ? 700     : 400,
            }}
            onClick={() => toggleStatus(s.id)}
          >
            {s.label}
          </button>
        ))}
      </div>
    </div>
  );
};

const styles = {
  bar: {
    padding: '10px 40px 14px',
    background: '#111',
    borderBottom: '1px solid #1e1e1e',
    display: 'flex',
    flexDirection: 'column',
    gap: '10px',
  },
  row: {
    display: 'flex',
    alignItems: 'center',
    gap: '10px',
    flexWrap: 'wrap',
  },
  searchWrap: {
    position: 'relative',
    display: 'flex',
    alignItems: 'center',
    flex: '1 1 200px',
    minWidth: '160px',
    maxWidth: '320px',
  },
  searchIcon: {
    position: 'absolute',
    left: '10px',
    color: '#555',
    fontSize: '1.1rem',
    pointerEvents: 'none',
  },
  searchInput: {
    width: '100%',
    padding: '8px 32px 8px 32px',
    background: '#1e1e2e',
    border: '1px solid #2a2a3a',
    borderRadius: '8px',
    color: '#fff',
    fontSize: '0.9rem',
    outline: 'none',
  },
  clearInput: {
    position: 'absolute',
    right: '8px',
    background: 'none',
    border: 'none',
    color: '#555',
    fontSize: '1.2rem',
    cursor: 'pointer',
    lineHeight: 1,
  },
  select: {
    padding: '8px 12px',
    background: '#1e1e2e',
    border: '1px solid #2a2a3a',
    borderRadius: '8px',
    color: '#ccc',
    fontSize: '0.88rem',
    outline: 'none',
    cursor: 'pointer',
  },
  favBtn: {
    padding: '8px 14px',
    border: '1px solid',
    borderRadius: '8px',
    fontSize: '0.88rem',
    fontWeight: 600,
    cursor: 'pointer',
    transition: 'all 0.15s',
  },
  clearBtn: {
    padding: '8px 14px',
    background: 'transparent',
    border: '1px solid #3a3a4a',
    borderRadius: '8px',
    color: '#ef4444',
    fontSize: '0.85rem',
    cursor: 'pointer',
  },
  chips: {
    display: 'flex',
    flexWrap: 'wrap',
    gap: '6px',
  },
  chip: {
    padding: '4px 12px',
    border: '1px solid',
    borderRadius: '20px',
    fontSize: '0.82rem',
    cursor: 'pointer',
    transition: 'all 0.15s',
  },
};

export default FilterBar;

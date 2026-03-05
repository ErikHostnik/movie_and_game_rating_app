import { useState, useRef } from 'react';
import StarRating from './StarRating';
import ImageCropper from './ImageCropper';
import { MOVIE_GENRES, GAME_GENRES, MOVIE_STATUSES, GAME_STATUSES } from '../constants';

const completionColor = (v) =>
  v === 100 ? '#f59e0b' : v >= 70 ? '#22c55e' : v >= 40 ? '#f97316' : '#ef4444';

const CompletionRing = ({ value, size = 60 }) => {
  const sw = 5; const r = (size - sw * 2) / 2;
  const circ = 2 * Math.PI * r; const offset = circ - (value / 100) * circ;
  const color = completionColor(value);
  return (
    <div style={{ position: 'relative', width: size, height: size }}>
      <svg width={size} height={size} style={{ transform: 'rotate(-90deg)', display: 'block' }}>
        <circle cx={size/2} cy={size/2} r={r} fill="none" stroke="#2a2a3a" strokeWidth={sw} />
        <circle cx={size/2} cy={size/2} r={r} fill="none" stroke={color} strokeWidth={sw}
          strokeDasharray={circ} strokeDashoffset={offset} strokeLinecap="round" />
      </svg>
      <div style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center',
        justifyContent: 'center', fontSize: `${size * 0.22}px`, fontWeight: 800, color }}>
        {value}%
      </div>
    </div>
  );
};

async function searchTMDB(query, apiKey) {
  const url = `https://api.themoviedb.org/3/search/movie?api_key=${apiKey}&query=${encodeURIComponent(query)}&language=en-US&page=1`;
  const res = await fetch(url);
  if (!res.ok) throw new Error('TMDB error');
  const data = await res.json();
  return (data.results || []).slice(0, 6).map((m) => ({
    title: m.title,
    description: m.overview,
    image: m.poster_path ? `https://image.tmdb.org/t/p/w500${m.poster_path}` : null,
  }));
}

async function searchRAWG(query, apiKey) {
  const url = `https://api.rawg.io/api/games?key=${apiKey}&search=${encodeURIComponent(query)}&page_size=6`;
  const res = await fetch(url);
  if (!res.ok) throw new Error('RAWG error');
  const data = await res.json();
  return (data.results || []).slice(0, 6).map((g) => ({
    title: g.name,
    description: '',
    image: g.background_image || null,
  }));
}

const AddItemModal = ({ type, onSave, onClose, settings = {} }) => {
  const isGame = type === 'games';
  const genres   = isGame ? GAME_GENRES   : MOVIE_GENRES;
  const statuses = isGame ? GAME_STATUSES : MOVIE_STATUSES;

  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [review, setReview] = useState('');
  const [rating, setRating] = useState(0);
  const [image, setImage] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [completionRate, setCompletionRate] = useState(0);
  const [selectedGenres, setSelectedGenres] = useState([]);
  const [status, setStatus] = useState('');
  const [favorite, setFavorite] = useState(false);
  const [rawImageSrc, setRawImageSrc] = useState(null);

  // API search
  const [showSearch, setShowSearch] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [searching, setSearching] = useState(false);
  const [searchError, setSearchError] = useState('');

  const fileInputRef = useRef(null);
  const hasApiKey = isGame ? !!settings.rawgApiKey : !!settings.tmdbApiKey;

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onloadend = () => setRawImageSrc(reader.result);
    reader.readAsDataURL(file);
    e.target.value = '';
  };

  const handleCropApply = (url) => {
    setImage(url); setImagePreview(url); setRawImageSrc(null);
  };

  const toggleGenre = (g) =>
    setSelectedGenres((prev) => prev.includes(g) ? prev.filter((x) => x !== g) : [...prev, g]);

  const handleSearch = async () => {
    if (!searchQuery.trim()) return;
    setSearching(true); setSearchError(''); setSearchResults([]);
    try {
      const results = isGame
        ? await searchRAWG(searchQuery, settings.rawgApiKey)
        : await searchTMDB(searchQuery, settings.tmdbApiKey);
      setSearchResults(results);
    } catch {
      setSearchError('Search failed. Check your API key in Settings.');
    } finally {
      setSearching(false);
    }
  };

  const applyResult = async (result) => {
    setTitle(result.title);
    setDescription(result.description || '');
    if (result.image) {
      // Fetch image as data URL
      try {
        const res = await fetch(result.image);
        const blob = await res.blob();
        const reader = new FileReader();
        reader.onloadend = () => setRawImageSrc(reader.result);
        reader.readAsDataURL(blob);
      } catch {
        // ignore image fetch failure
      }
    }
    setShowSearch(false);
    setSearchQuery(''); setSearchResults([]);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!title.trim()) return;
    onSave({
      id: Date.now().toString(),
      type,
      title: title.trim(),
      description: description.trim(),
      review: review.trim(),
      rating,
      image,
      dateAdded: new Date().toISOString(),
      genres: selectedGenres,
      status,
      favorite,
      ...(isGame ? { completionRate } : {}),
    });
  };

  return (
    <>
      {rawImageSrc && (
        <ImageCropper src={rawImageSrc} onApply={handleCropApply} onCancel={() => setRawImageSrc(null)} />
      )}

      <div style={styles.overlay} onClick={onClose}>
        <div style={styles.modal} onClick={(e) => e.stopPropagation()}>
          <div style={styles.header}>
            <h2 style={styles.headerTitle}>Add {isGame ? 'Game' : 'Movie'}</h2>
            <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
              <button
                type="button"
                style={{
                  ...styles.searchOnlineBtn,
                  opacity: hasApiKey ? 1 : 0.5,
                }}
                title={hasApiKey ? 'Search online' : 'Add API key in Settings first'}
                onClick={() => hasApiKey && setShowSearch((v) => !v)}
              >
                Search Online
              </button>
              <button style={styles.closeBtn} onClick={onClose}>×</button>
            </div>
          </div>

          {/* API Search panel */}
          {showSearch && (
            <div style={styles.searchPanel}>
              <div style={styles.searchRow}>
                <input
                  type="text"
                  placeholder={`Search ${isGame ? 'RAWG' : 'TMDB'}…`}
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  style={styles.searchInput}
                  onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
                  autoFocus
                />
                <button style={styles.searchBtn} onClick={handleSearch} disabled={searching}>
                  {searching ? '…' : 'Go'}
                </button>
              </div>
              {searchError && <p style={styles.searchError}>{searchError}</p>}
              {searchResults.length > 0 && (
                <div style={styles.results}>
                  {searchResults.map((r, i) => (
                    <div key={i} style={styles.resultItem} onClick={() => applyResult(r)}>
                      {r.image && <img src={r.image} alt={r.title} style={styles.resultThumb} />}
                      <div style={styles.resultInfo}>
                        <div style={styles.resultTitle}>{r.title}</div>
                        {r.description && (
                          <div style={styles.resultDesc}>
                            {r.description.slice(0, 80)}…
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          <form onSubmit={handleSubmit} style={styles.form}>
            {/* Image upload */}
            <div style={{ display: 'flex', gap: '16px', alignItems: 'flex-start' }}>
              <div style={styles.imageUpload} onClick={() => fileInputRef.current?.click()}>
                {imagePreview
                  ? <img src={imagePreview} alt="Preview" style={styles.preview} />
                  : <div style={styles.uploadPlaceholder}>
                      <span style={styles.uploadIcon}>+</span>
                      <span>Cover</span>
                    </div>}
                {imagePreview && <div style={styles.imageChangeOverlay}>Change</div>}
                <input ref={fileInputRef} type="file" accept="image/*"
                  onChange={handleImageChange} style={{ display: 'none' }} />
              </div>

              <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '12px' }}>
                <input type="text" placeholder="Title" value={title}
                  onChange={(e) => setTitle(e.target.value)} style={styles.input} autoFocus />

                {/* Status */}
                <div>
                  <div style={styles.fieldLabel}>Status</div>
                  <div style={styles.statusRow}>
                    {statuses.map((s) => (
                      <button key={s.id} type="button"
                        style={{
                          ...styles.statusBtn,
                          background: status === s.id ? s.color : '#12121a',
                          color:      status === s.id ? '#000'  : '#888',
                          borderColor: status === s.id ? s.color : '#2a2a3a',
                          fontWeight: status === s.id ? 700 : 400,
                        }}
                        onClick={() => setStatus(status === s.id ? '' : s.id)}
                      >
                        {s.label}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Rating + Favorite */}
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                  <StarRating rating={rating} onRate={setRating} size={20} />
                  <button type="button"
                    style={{ ...styles.favBtn, color: favorite ? '#ef4444' : '#444' }}
                    onClick={() => setFavorite((v) => !v)}
                  >
                    {favorite ? '♥' : '♡'}
                  </button>
                </div>
              </div>
            </div>

            {/* Genres */}
            <div>
              <div style={styles.fieldLabel}>Genres</div>
              <div style={styles.genreChips}>
                {genres.map((g) => (
                  <button key={g} type="button"
                    style={{
                      ...styles.genreChip,
                      background:  selectedGenres.includes(g) ? '#6366f1' : '#12121a',
                      color:       selectedGenres.includes(g) ? '#fff'    : '#777',
                      borderColor: selectedGenres.includes(g) ? '#6366f1' : '#2a2a3a',
                    }}
                    onClick={() => toggleGenre(g)}
                  >
                    {g}
                  </button>
                ))}
              </div>
            </div>

            {/* Description */}
            <textarea placeholder="Description" value={description}
              onChange={(e) => setDescription(e.target.value)}
              style={styles.textarea} rows={2} />

            {/* Review */}
            <textarea placeholder="Personal review / notes…" value={review}
              onChange={(e) => setReview(e.target.value)}
              style={{ ...styles.textarea, borderColor: '#3a3a4a' }} rows={2} />

            {/* Completion rate (games) */}
            {isGame && (
              <div style={styles.completionSection}>
                <div style={styles.completionHeader}>
                  <div>
                    <div style={styles.fieldLabel}>Completion Rate</div>
                    <div style={{ color: '#fff', fontSize: '1.4rem', fontWeight: 800 }}>{completionRate}%</div>
                  </div>
                  <CompletionRing value={completionRate} size={60} />
                </div>
                <div style={styles.sliderWrapper}>
                  <span style={styles.sliderEdge}>0%</span>
                  <input type="range" min="0" max="100" value={completionRate}
                    onChange={(e) => setCompletionRate(Number(e.target.value))}
                    className="completion-slider" style={{ flex: 1 }} />
                  <span style={styles.sliderEdge}>100%</span>
                </div>
                <div style={styles.quickButtons}>
                  {[0, 25, 50, 75, 100].map((v) => (
                    <button key={v} type="button" onClick={() => setCompletionRate(v)}
                      style={{
                        ...styles.quickBtn,
                        background:  completionRate === v ? completionColor(v) : '#2a2a3a',
                        color:       completionRate === v ? '#000' : '#888',
                        fontWeight:  completionRate === v ? 700 : 400,
                      }}>
                      {v}%
                    </button>
                  ))}
                </div>
              </div>
            )}

            <button type="submit"
              style={{ ...styles.saveBtn, opacity: title.trim() ? 1 : 0.5 }}
              disabled={!title.trim()}>
              Save
            </button>
          </form>
        </div>
      </div>
    </>
  );
};

const styles = {
  overlay: {
    position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.75)',
    display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 100,
  },
  modal: {
    background: '#1a1a2e', borderRadius: '16px',
    width: '92%', maxWidth: '560px', maxHeight: '92vh', overflow: 'auto',
    border: '1px solid #2a2a3a',
  },
  header: {
    display: 'flex', justifyContent: 'space-between', alignItems: 'center',
    padding: '18px 22px', borderBottom: '1px solid #2a2a3a',
  },
  headerTitle: { fontSize: '1.15rem', fontWeight: 700, color: '#fff' },
  closeBtn: { background: 'none', border: 'none', color: '#888', fontSize: '1.8rem', cursor: 'pointer', lineHeight: 1 },
  searchOnlineBtn: {
    padding: '7px 12px', background: '#1e1e2e',
    border: '1px solid #3a3a4a', borderRadius: '7px',
    color: '#aaa', fontSize: '0.82rem', cursor: 'pointer',
  },
  searchPanel: {
    padding: '14px 22px', borderBottom: '1px solid #2a2a3a',
    background: '#12121a', display: 'flex', flexDirection: 'column', gap: '10px',
  },
  searchRow: { display: 'flex', gap: '8px' },
  searchInput: {
    flex: 1, padding: '9px 12px',
    background: '#1e1e2e', border: '1px solid #2a2a3a', borderRadius: '8px',
    color: '#fff', fontSize: '0.9rem', outline: 'none',
  },
  searchBtn: {
    padding: '9px 18px', background: '#6366f1', color: '#fff',
    border: 'none', borderRadius: '8px', fontSize: '0.9rem', fontWeight: 600, cursor: 'pointer',
  },
  searchError: { color: '#ef4444', fontSize: '0.85rem' },
  results: { display: 'flex', flexDirection: 'column', gap: '4px', maxHeight: '200px', overflowY: 'auto' },
  resultItem: {
    display: 'flex', gap: '10px', padding: '8px 10px',
    borderRadius: '8px', cursor: 'pointer', background: '#1e1e2e',
    border: '1px solid transparent', transition: 'border-color 0.15s',
  },
  resultThumb: { width: 36, height: 52, objectFit: 'cover', borderRadius: '4px', flexShrink: 0 },
  resultInfo: { flex: 1, minWidth: 0 },
  resultTitle: { color: '#fff', fontSize: '0.88rem', fontWeight: 600 },
  resultDesc: { color: '#666', fontSize: '0.78rem', marginTop: '2px' },
  form: { padding: '20px 22px', display: 'flex', flexDirection: 'column', gap: '14px' },
  imageUpload: {
    width: '120px', height: '170px', flexShrink: 0,
    borderRadius: '10px', border: '2px dashed #3a3a4a',
    overflow: 'hidden', cursor: 'pointer', position: 'relative',
  },
  preview: { width: '100%', height: '100%', objectFit: 'cover' },
  imageChangeOverlay: {
    position: 'absolute', inset: 0, background: 'rgba(0,0,0,0.5)',
    display: 'flex', alignItems: 'center', justifyContent: 'center',
    color: '#fff', fontSize: '0.82rem', fontWeight: 600, opacity: 0,
    transition: 'opacity 0.2s',
  },
  uploadPlaceholder: {
    width: '100%', height: '100%',
    display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
    gap: '6px', color: '#555', fontSize: '0.82rem',
  },
  uploadIcon: { fontSize: '1.8rem', color: '#444' },
  input: {
    padding: '10px 14px', background: '#12121a',
    border: '1px solid #2a2a3a', borderRadius: '8px',
    color: '#fff', fontSize: '0.95rem', outline: 'none',
  },
  fieldLabel: { color: '#666', fontSize: '0.78rem', textTransform: 'uppercase', letterSpacing: '0.06em', fontWeight: 700, marginBottom: '6px' },
  statusRow: { display: 'flex', flexWrap: 'wrap', gap: '6px' },
  statusBtn: {
    padding: '4px 10px', border: '1px solid', borderRadius: '6px',
    fontSize: '0.78rem', cursor: 'pointer', transition: 'all 0.15s',
  },
  favBtn: { background: 'none', border: 'none', fontSize: '1.4rem', cursor: 'pointer', lineHeight: 1, padding: '0 4px' },
  genreChips: { display: 'flex', flexWrap: 'wrap', gap: '6px' },
  genreChip: {
    padding: '4px 10px', border: '1px solid', borderRadius: '20px',
    fontSize: '0.78rem', cursor: 'pointer', transition: 'all 0.15s',
  },
  textarea: {
    padding: '10px 14px', background: '#12121a',
    border: '1px solid #2a2a3a', borderRadius: '8px',
    color: '#fff', fontSize: '0.9rem', outline: 'none',
    resize: 'vertical', fontFamily: 'inherit',
  },
  completionSection: {
    background: '#12121a', border: '1px solid #2a2a3a',
    borderRadius: '12px', padding: '14px',
    display: 'flex', flexDirection: 'column', gap: '10px',
  },
  completionHeader: { display: 'flex', alignItems: 'center', justifyContent: 'space-between' },
  sliderWrapper: { display: 'flex', alignItems: 'center', gap: '10px' },
  sliderEdge: { color: '#555', fontSize: '0.75rem', minWidth: '28px' },
  quickButtons: { display: 'flex', gap: '6px' },
  quickBtn: {
    flex: 1, padding: '5px 0', border: 'none', borderRadius: '6px',
    fontSize: '0.78rem', cursor: 'pointer', transition: 'all 0.15s',
  },
  saveBtn: {
    padding: '11px', background: '#6366f1', color: '#fff',
    border: 'none', borderRadius: '8px', fontSize: '0.95rem', fontWeight: 600, cursor: 'pointer',
  },
};

export default AddItemModal;

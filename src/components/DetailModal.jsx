import { useState, useRef } from 'react';
import StarRating from './StarRating';
import ImageCropper from './ImageCropper';
import CompareModal from './CompareModal';
import { MOVIE_GENRES, GAME_GENRES, MOVIE_STATUSES, GAME_STATUSES } from '../constants';

const ALL_STATUSES = [...MOVIE_STATUSES, ...GAME_STATUSES];

const completionColor = (v) =>
  v === 100 ? '#f59e0b' : v >= 70 ? '#22c55e' : v >= 40 ? '#f97316' : '#ef4444';

const CompletionRing = ({ value, size = 80 }) => {
  const sw = 6; const r = (size - sw * 2) / 2;
  const circ = 2 * Math.PI * r; const offset = circ - (value / 100) * circ;
  const color = completionColor(value);
  return (
    <div style={{ position: 'relative', width: size, height: size }}>
      <svg width={size} height={size} style={{ transform: 'rotate(-90deg)', display: 'block' }}>
        <circle cx={size/2} cy={size/2} r={r} fill="none" stroke="#2a2a3a" strokeWidth={sw} />
        <circle cx={size/2} cy={size/2} r={r} fill="none" stroke={color} strokeWidth={sw}
          strokeDasharray={circ} strokeDashoffset={offset} strokeLinecap="round" />
      </svg>
      <div style={{ position: 'absolute', inset: 0, display: 'flex', flexDirection: 'column',
        alignItems: 'center', justifyContent: 'center', gap: 1 }}>
        <span style={{ fontSize: `${size * 0.24}px`, fontWeight: 800, color, lineHeight: 1 }}>{value}%</span>
        {value === 100 && <span style={{ fontSize: `${size * 0.14}px`, color: '#f59e0b' }}>Done!</span>}
      </div>
    </div>
  );
};

const DetailModal = ({ item, onClose, onDelete, onEdit, allItems = [] }) => {
  const [editing, setEditing] = useState(false);
  const [title, setTitle] = useState(item.title);
  const [description, setDescription] = useState(item.description || '');
  const [review, setReview] = useState(item.review || '');
  const [rating, setRating] = useState(item.rating);
  const [image, setImage] = useState(item.image);
  const [completionRate, setCompletionRate] = useState(item.completionRate ?? 0);
  const [selectedGenres, setSelectedGenres] = useState(item.genres || []);
  const [status, setStatus] = useState(item.status || '');
  const [favorite, setFavorite] = useState(item.favorite || false);
  const [rawImageSrc, setRawImageSrc] = useState(null);
  const [showCompare, setShowCompare] = useState(false);
  const fileInputRef = useRef(null);

  const isGame = item.type === 'games';
  const genres   = isGame ? GAME_GENRES   : MOVIE_GENRES;
  const statuses = isGame ? GAME_STATUSES : MOVIE_STATUSES;
  const statusInfo = ALL_STATUSES.find((s) => s.id === item.status);

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onloadend = () => setRawImageSrc(reader.result);
    reader.readAsDataURL(file);
    e.target.value = '';
  };

  const toggleGenre = (g) =>
    setSelectedGenres((prev) => prev.includes(g) ? prev.filter((x) => x !== g) : [...prev, g]);

  const handleSave = () => {
    onEdit({
      ...item, title: title.trim() || item.title, description: description.trim(),
      review: review.trim(), rating, image, genres: selectedGenres, status, favorite,
      ...(isGame ? { completionRate } : {}),
    });
    setEditing(false);
  };

  const handleCancel = () => {
    setTitle(item.title); setDescription(item.description || '');
    setReview(item.review || ''); setRating(item.rating);
    setImage(item.image); setCompletionRate(item.completionRate ?? 0);
    setSelectedGenres(item.genres || []); setStatus(item.status || '');
    setFavorite(item.favorite || false); setEditing(false);
  };

  if (showCompare) {
    return (
      <CompareModal
        item1={item}
        allItems={allItems}
        onClose={() => setShowCompare(false)}
      />
    );
  }

  return (
    <>
      {rawImageSrc && (
        <ImageCropper src={rawImageSrc}
          onApply={(url) => { setImage(url); setRawImageSrc(null); }}
          onCancel={() => setRawImageSrc(null)} />
      )}

      <div style={styles.overlay} onClick={onClose}>
        <div style={styles.modal} onClick={(e) => e.stopPropagation()}>
          <button style={styles.closeBtn} onClick={onClose}>×</button>

          <div style={styles.content}>
            {/* Image */}
            <div style={{ ...styles.imageSection, cursor: editing ? 'pointer' : 'default' }}
              onClick={() => editing && fileInputRef.current?.click()}>
              {image
                ? <img src={image} alt={title} style={styles.image} />
                : <div style={styles.placeholder}>{editing ? 'Click to upload' : 'No Image'}</div>}
              {editing && <div style={styles.imageOverlay}>{image ? 'Change Image' : 'Upload'}</div>}
              <input ref={fileInputRef} type="file" accept="image/*"
                onChange={handleImageChange} style={{ display: 'none' }} />
            </div>

            {/* Details */}
            <div style={styles.details}>
              {editing ? (
                <>
                  <input type="text" value={title} onChange={(e) => setTitle(e.target.value)}
                    style={styles.editInput} placeholder="Title" autoFocus />

                  <div style={styles.ratingRow}>
                    <span style={styles.smallLabel}>Rating:</span>
                    <StarRating rating={rating} onRate={setRating} size={20} />
                    <button type="button"
                      style={{ ...styles.favBtn, color: favorite ? '#ef4444' : '#444' }}
                      onClick={() => setFavorite((v) => !v)}>
                      {favorite ? '♥' : '♡'}
                    </button>
                  </div>

                  <div style={styles.meta}>
                    <span style={styles.typeBadge}>{isGame ? 'Game' : 'Movie'}</span>
                    <span style={styles.date}>Added {new Date(item.dateAdded).toLocaleDateString()}</span>
                  </div>

                  {/* Status */}
                  <div>
                    <div style={styles.fieldLabel}>Status</div>
                    <div style={styles.statusRow}>
                      {statuses.map((s) => (
                        <button key={s.id} type="button"
                          style={{
                            ...styles.statusBtn,
                            background:  status === s.id ? s.color : '#12121a',
                            color:       status === s.id ? '#000'  : '#888',
                            borderColor: status === s.id ? s.color : '#2a2a3a',
                            fontWeight:  status === s.id ? 700     : 400,
                          }}
                          onClick={() => setStatus(status === s.id ? '' : s.id)}>
                          {s.label}
                        </button>
                      ))}
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
                          onClick={() => toggleGenre(g)}>
                          {g}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Completion (games) */}
                  {isGame && (
                    <div style={styles.completionSection}>
                      <div style={styles.completionHeader}>
                        <div>
                          <div style={styles.fieldLabel}>Completion Rate</div>
                          <div style={{ color: completionColor(completionRate), fontSize: '1.5rem', fontWeight: 800 }}>
                            {completionRate}%
                          </div>
                        </div>
                        <CompletionRing value={completionRate} size={68} />
                      </div>
                      <div style={styles.sliderWrapper}>
                        <span style={styles.sliderEdge}>0%</span>
                        <input type="range" min="0" max="100" value={completionRate}
                          onChange={(e) => setCompletionRate(Number(e.target.value))}
                          className="completion-slider" style={{ flex: 1 }} />
                        <span style={styles.sliderEdge}>100%</span>
                      </div>
                      <div style={styles.quickButtons}>
                        {[0,25,50,75,100].map((v) => (
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

                  <textarea value={description} onChange={(e) => setDescription(e.target.value)}
                    style={styles.editTextarea} placeholder="Description" rows={3} />
                  <textarea value={review} onChange={(e) => setReview(e.target.value)}
                    style={{ ...styles.editTextarea, borderColor: '#3a3a4a' }}
                    placeholder="Personal review / notes…" rows={3} />

                  <div style={styles.editActions}>
                    <button style={styles.saveBtn} onClick={handleSave}>Save</button>
                    <button style={styles.cancelBtn} onClick={handleCancel}>Cancel</button>
                  </div>
                </>
              ) : (
                <>
                  <div style={styles.titleRow}>
                    <h2 style={styles.titleText}>{item.title}</h2>
                    {item.favorite && <span style={styles.favDisplay}>♥</span>}
                  </div>

                  <StarRating rating={item.rating} interactive={false} size={22} />

                  <div style={styles.meta}>
                    <span style={styles.typeBadge}>{isGame ? 'Game' : 'Movie'}</span>
                    {statusInfo && (
                      <span style={{ ...styles.statusDisplay, background: statusInfo.color + '22',
                        color: statusInfo.color, border: `1px solid ${statusInfo.color}44` }}>
                        {statusInfo.label}
                      </span>
                    )}
                    <span style={styles.date}>Added {new Date(item.dateAdded).toLocaleDateString()}</span>
                  </div>

                  {item.genres?.length > 0 && (
                    <div style={styles.genreChips}>
                      {item.genres.map((g) => (
                        <span key={g} style={styles.genreChipView}>{g}</span>
                      ))}
                    </div>
                  )}

                  {isGame && (
                    <div style={styles.completionView}>
                      <div>
                        <div style={styles.fieldLabel}>Completion Rate</div>
                        <div style={{ color: completionColor(item.completionRate ?? 0), fontSize: '2rem', fontWeight: 800 }}>
                          {item.completionRate ?? 0}%
                        </div>
                        <div style={styles.completionBar}>
                          <div style={{ ...styles.completionFill, width: `${item.completionRate ?? 0}%`,
                            background: completionColor(item.completionRate ?? 0) }} />
                        </div>
                      </div>
                      <CompletionRing value={item.completionRate ?? 0} size={88} />
                    </div>
                  )}

                  {item.description && <p style={styles.desc}>{item.description}</p>}

                  {item.review && (
                    <div style={styles.reviewBox}>
                      <div style={styles.fieldLabel}>Personal Review</div>
                      <p style={styles.reviewText}>{item.review}</p>
                    </div>
                  )}

                  <div style={styles.actions}>
                    <button style={styles.editBtn} onClick={() => setEditing(true)}>Edit</button>
                    <button style={styles.compareBtn} onClick={() => setShowCompare(true)}>Compare</button>
                    <button style={styles.deleteBtn} onClick={() => onDelete(item.id)}>Delete</button>
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

const styles = {
  overlay: {
    position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.78)',
    display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 100,
  },
  modal: {
    background: '#1a1a2e', borderRadius: '16px',
    width: '92%', maxWidth: '900px', maxHeight: '92vh', overflow: 'auto',
    border: '1px solid #2a2a3a', position: 'relative',
  },
  closeBtn: {
    position: 'absolute', top: 14, right: 18,
    background: 'none', border: 'none', color: '#888',
    fontSize: '2rem', cursor: 'pointer', zIndex: 10, lineHeight: 1,
  },
  content: { display: 'flex', gap: '28px', padding: '28px' },
  imageSection: {
    flexShrink: 0, width: '280px', height: '400px',
    borderRadius: '12px', overflow: 'hidden', background: '#12121a', position: 'relative',
  },
  image: { width: '100%', height: '100%', objectFit: 'cover' },
  placeholder: {
    width: '100%', height: '100%',
    display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#555',
  },
  imageOverlay: {
    position: 'absolute', inset: 0, background: 'rgba(0,0,0,0.5)',
    display: 'flex', alignItems: 'center', justifyContent: 'center',
    color: '#fff', fontSize: '0.95rem', fontWeight: 600,
  },
  details: {
    flex: 1, display: 'flex', flexDirection: 'column', gap: '12px',
    paddingTop: '6px', minHeight: '380px',
  },
  titleRow: { display: 'flex', alignItems: 'flex-start', gap: '10px' },
  titleText: { fontSize: '1.6rem', fontWeight: 700, color: '#fff', paddingRight: '40px', flex: 1 },
  favDisplay: { color: '#ef4444', fontSize: '1.4rem', flexShrink: 0 },
  meta: { display: 'flex', gap: '8px', alignItems: 'center', flexWrap: 'wrap' },
  typeBadge: {
    padding: '4px 10px', background: '#6366f1',
    borderRadius: '6px', fontSize: '0.75rem', fontWeight: 600, color: '#fff',
  },
  statusDisplay: {
    padding: '4px 10px', borderRadius: '6px', fontSize: '0.75rem', fontWeight: 600,
  },
  date: { color: '#555', fontSize: '0.85rem' },
  desc: { color: '#bbb', fontSize: '0.95rem', lineHeight: 1.7, flex: 1 },
  reviewBox: {
    background: '#12121a', border: '1px solid #2a2a3a',
    borderRadius: '10px', padding: '12px 16px',
  },
  reviewText: { color: '#aaa', fontSize: '0.9rem', lineHeight: 1.7, marginTop: '4px' },
  ratingRow: { display: 'flex', alignItems: 'center', gap: '10px' },
  smallLabel: { color: '#777', fontSize: '0.85rem' },
  favBtn: { background: 'none', border: 'none', fontSize: '1.4rem', cursor: 'pointer', lineHeight: 1 },
  fieldLabel: {
    color: '#555', fontSize: '0.74rem',
    textTransform: 'uppercase', letterSpacing: '0.07em', fontWeight: 700, marginBottom: '6px',
  },
  statusRow: { display: 'flex', flexWrap: 'wrap', gap: '6px' },
  statusBtn: {
    padding: '4px 10px', border: '1px solid', borderRadius: '6px',
    fontSize: '0.78rem', cursor: 'pointer', transition: 'all 0.15s',
  },
  genreChips: { display: 'flex', flexWrap: 'wrap', gap: '5px' },
  genreChip: {
    padding: '3px 9px', border: '1px solid', borderRadius: '20px',
    fontSize: '0.75rem', cursor: 'pointer', transition: 'all 0.15s',
  },
  genreChipView: {
    padding: '3px 9px', background: '#1e1e2e',
    border: '1px solid #2a2a3a', borderRadius: '20px',
    fontSize: '0.75rem', color: '#888',
  },
  completionView: {
    display: 'flex', alignItems: 'center', justifyContent: 'space-between',
    background: '#12121a', border: '1px solid #2a2a3a',
    borderRadius: '12px', padding: '16px 18px',
  },
  completionBar: { width: '130px', height: '5px', background: '#2a2a3a', borderRadius: '3px', overflow: 'hidden', marginTop: '6px' },
  completionFill: { height: '100%', borderRadius: '3px', transition: 'width 0.3s' },
  completionSection: {
    background: '#12121a', border: '1px solid #2a2a3a',
    borderRadius: '10px', padding: '12px',
    display: 'flex', flexDirection: 'column', gap: '8px',
  },
  completionHeader: { display: 'flex', alignItems: 'center', justifyContent: 'space-between' },
  sliderWrapper: { display: 'flex', alignItems: 'center', gap: '8px' },
  sliderEdge: { color: '#555', fontSize: '0.73rem', minWidth: '24px' },
  quickButtons: { display: 'flex', gap: '5px' },
  quickBtn: {
    flex: 1, padding: '4px 0', border: 'none', borderRadius: '5px',
    fontSize: '0.75rem', cursor: 'pointer', transition: 'all 0.15s',
  },
  actions: { display: 'flex', gap: '10px', marginTop: 'auto', paddingTop: '14px' },
  editBtn: {
    padding: '9px 22px', background: '#6366f1', color: '#fff',
    border: 'none', borderRadius: '8px', fontSize: '0.88rem', fontWeight: 600, cursor: 'pointer',
  },
  compareBtn: {
    padding: '9px 22px', background: '#8b5cf6', color: '#fff',
    border: 'none', borderRadius: '8px', fontSize: '0.88rem', fontWeight: 600, cursor: 'pointer',
  },
  deleteBtn: {
    padding: '9px 22px', background: 'transparent', color: '#ef4444',
    border: '1px solid #ef4444', borderRadius: '8px', fontSize: '0.88rem', cursor: 'pointer',
  },
  editInput: {
    padding: '10px 14px', background: '#12121a',
    border: '1px solid #3a3a4a', borderRadius: '8px',
    color: '#fff', fontSize: '1.2rem', fontWeight: 600, outline: 'none',
  },
  editTextarea: {
    padding: '10px 14px', background: '#12121a',
    border: '1px solid #2a2a3a', borderRadius: '8px',
    color: '#fff', fontSize: '0.9rem', outline: 'none',
    resize: 'vertical', fontFamily: 'inherit', lineHeight: 1.6,
  },
  editActions: { display: 'flex', gap: '10px', marginTop: 'auto', paddingTop: '8px' },
  saveBtn: {
    padding: '9px 26px', background: '#22c55e', color: '#fff',
    border: 'none', borderRadius: '8px', fontSize: '0.88rem', fontWeight: 600, cursor: 'pointer',
  },
  cancelBtn: {
    padding: '9px 22px', background: 'transparent', color: '#888',
    border: '1px solid #3a3a4a', borderRadius: '8px', fontSize: '0.88rem', cursor: 'pointer',
  },
};

export default DetailModal;

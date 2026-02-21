import { useState, useRef } from 'react';
import StarRating from './StarRating';

const DetailModal = ({ item, onClose, onDelete, onEdit }) => {
  const [editing, setEditing] = useState(false);
  const [title, setTitle] = useState(item.title);
  const [description, setDescription] = useState(item.description);
  const [rating, setRating] = useState(item.rating);
  const [image, setImage] = useState(item.image);
  const fileInputRef = useRef(null);

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onloadend = () => setImage(reader.result);
    reader.readAsDataURL(file);
  };

  const handleSave = () => {
    onEdit({
      ...item,
      title: title.trim() || item.title,
      description: description.trim(),
      rating,
      image,
    });
    setEditing(false);
  };

  const handleCancel = () => {
    setTitle(item.title);
    setDescription(item.description);
    setRating(item.rating);
    setImage(item.image);
    setEditing(false);
  };

  return (
    <div style={styles.overlay} onClick={onClose}>
      <div style={styles.modal} onClick={(e) => e.stopPropagation()}>
        <button style={styles.closeBtn} onClick={onClose}>
          ×
        </button>

        <div style={styles.content}>
          {/* Image section - large */}
          <div
            style={{
              ...styles.imageSection,
              cursor: editing ? 'pointer' : 'default',
            }}
            onClick={() => editing && fileInputRef.current?.click()}
          >
            {image ? (
              <img src={image} alt={title} style={styles.image} />
            ) : (
              <div style={styles.placeholder}>
                {editing ? 'Click to upload' : 'No Image'}
              </div>
            )}
            {editing && image && (
              <div style={styles.imageOverlay}>Change Image</div>
            )}
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              onChange={handleImageChange}
              style={{ display: 'none' }}
            />
          </div>

          {/* Details section */}
          <div style={styles.details}>
            {editing ? (
              <>
                <input
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  style={styles.editInput}
                  placeholder="Title"
                  autoFocus
                />

                <div style={styles.ratingRow}>
                  <span style={styles.ratingLabel}>Rating:</span>
                  <StarRating rating={rating} onRate={setRating} size={28} />
                </div>

                <div style={styles.meta}>
                  <span style={styles.type}>
                    {item.type === 'movies' ? 'Movie' : 'Game'}
                  </span>
                  <span style={styles.date}>
                    Added {new Date(item.dateAdded).toLocaleDateString()}
                  </span>
                </div>

                <textarea
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  style={styles.editTextarea}
                  placeholder="Description"
                  rows={6}
                />

                <div style={styles.editActions}>
                  <button style={styles.saveBtn} onClick={handleSave}>
                    Save
                  </button>
                  <button style={styles.cancelBtn} onClick={handleCancel}>
                    Cancel
                  </button>
                </div>
              </>
            ) : (
              <>
                <h2 style={styles.title}>{item.title}</h2>
                <StarRating
                  rating={item.rating}
                  interactive={false}
                  size={28}
                />

                <div style={styles.meta}>
                  <span style={styles.type}>
                    {item.type === 'movies' ? 'Movie' : 'Game'}
                  </span>
                  <span style={styles.date}>
                    Added {new Date(item.dateAdded).toLocaleDateString()}
                  </span>
                </div>

                {item.description && (
                  <p style={styles.description}>{item.description}</p>
                )}

                <div style={styles.actions}>
                  <button
                    style={styles.editBtn}
                    onClick={() => setEditing(true)}
                  >
                    Edit
                  </button>
                  <button
                    style={styles.deleteBtn}
                    onClick={() => onDelete(item.id)}
                  >
                    Delete
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

const styles = {
  overlay: {
    position: 'fixed',
    inset: 0,
    background: 'rgba(0,0,0,0.75)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 100,
  },
  modal: {
    background: '#1a1a2e',
    borderRadius: '16px',
    width: '92%',
    maxWidth: '900px',
    maxHeight: '90vh',
    overflow: 'auto',
    border: '1px solid #2a2a3a',
    position: 'relative',
  },
  closeBtn: {
    position: 'absolute',
    top: '14px',
    right: '18px',
    background: 'none',
    border: 'none',
    color: '#888',
    fontSize: '2rem',
    cursor: 'pointer',
    zIndex: 10,
    lineHeight: 1,
  },
  content: {
    display: 'flex',
    gap: '32px',
    padding: '32px',
  },
  imageSection: {
    flexShrink: 0,
    width: '320px',
    height: '440px',
    borderRadius: '12px',
    overflow: 'hidden',
    background: '#12121a',
    position: 'relative',
  },
  image: {
    width: '100%',
    height: '100%',
    objectFit: 'cover',
  },
  placeholder: {
    width: '100%',
    height: '100%',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    color: '#555',
    fontSize: '1rem',
  },
  imageOverlay: {
    position: 'absolute',
    inset: 0,
    background: 'rgba(0,0,0,0.5)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    color: '#fff',
    fontSize: '1rem',
    fontWeight: 600,
    opacity: 0.8,
  },
  details: {
    flex: 1,
    display: 'flex',
    flexDirection: 'column',
    gap: '16px',
    paddingTop: '8px',
    minHeight: '420px',
  },
  title: {
    fontSize: '1.8rem',
    fontWeight: 700,
    color: '#fff',
    paddingRight: '40px',
  },
  meta: {
    display: 'flex',
    gap: '12px',
    alignItems: 'center',
  },
  type: {
    padding: '5px 12px',
    background: '#6366f1',
    borderRadius: '6px',
    fontSize: '0.8rem',
    fontWeight: 600,
    color: '#fff',
  },
  date: {
    color: '#666',
    fontSize: '0.9rem',
  },
  description: {
    color: '#bbb',
    fontSize: '1rem',
    lineHeight: 1.7,
    marginTop: '4px',
    flex: 1,
  },
  ratingRow: {
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
  },
  ratingLabel: {
    color: '#aaa',
    fontSize: '0.95rem',
  },
  actions: {
    display: 'flex',
    gap: '12px',
    marginTop: 'auto',
    paddingTop: '16px',
  },
  editBtn: {
    padding: '10px 24px',
    background: '#6366f1',
    color: '#fff',
    border: 'none',
    borderRadius: '8px',
    fontSize: '0.9rem',
    fontWeight: 600,
    cursor: 'pointer',
  },
  deleteBtn: {
    padding: '10px 24px',
    background: 'transparent',
    color: '#ef4444',
    border: '1px solid #ef4444',
    borderRadius: '8px',
    fontSize: '0.9rem',
    cursor: 'pointer',
  },
  editInput: {
    padding: '12px 16px',
    background: '#12121a',
    border: '1px solid #3a3a4a',
    borderRadius: '8px',
    color: '#fff',
    fontSize: '1.4rem',
    fontWeight: 600,
    outline: 'none',
  },
  editTextarea: {
    padding: '12px 16px',
    background: '#12121a',
    border: '1px solid #3a3a4a',
    borderRadius: '8px',
    color: '#fff',
    fontSize: '1rem',
    outline: 'none',
    resize: 'vertical',
    fontFamily: 'inherit',
    lineHeight: 1.6,
    flex: 1,
  },
  editActions: {
    display: 'flex',
    gap: '12px',
    marginTop: 'auto',
    paddingTop: '8px',
  },
  saveBtn: {
    padding: '10px 28px',
    background: '#22c55e',
    color: '#fff',
    border: 'none',
    borderRadius: '8px',
    fontSize: '0.9rem',
    fontWeight: 600,
    cursor: 'pointer',
  },
  cancelBtn: {
    padding: '10px 24px',
    background: 'transparent',
    color: '#888',
    border: '1px solid #3a3a4a',
    borderRadius: '8px',
    fontSize: '0.9rem',
    cursor: 'pointer',
  },
};

export default DetailModal;

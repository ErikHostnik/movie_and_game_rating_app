import { useState, useRef } from 'react';
import StarRating from './StarRating';

const AddItemModal = ({ type, onSave, onClose }) => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [rating, setRating] = useState(0);
  const [image, setImage] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const fileInputRef = useRef(null);

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onloadend = () => {
      setImage(reader.result);
      setImagePreview(reader.result);
    };
    reader.readAsDataURL(file);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!title.trim()) return;

    onSave({
      id: Date.now().toString(),
      type,
      title: title.trim(),
      description: description.trim(),
      rating,
      image,
      dateAdded: new Date().toISOString(),
    });
  };

  return (
    <div style={styles.overlay} onClick={onClose}>
      <div style={styles.modal} onClick={(e) => e.stopPropagation()}>
        <div style={styles.header}>
          <h2 style={styles.headerTitle}>
            Add {type === 'movies' ? 'Movie' : 'Game'}
          </h2>
          <button style={styles.closeBtn} onClick={onClose}>
            ×
          </button>
        </div>

        <form onSubmit={handleSubmit} style={styles.form}>
          <div
            style={styles.imageUpload}
            onClick={() => fileInputRef.current?.click()}
          >
            {imagePreview ? (
              <img src={imagePreview} alt="Preview" style={styles.preview} />
            ) : (
              <div style={styles.uploadPlaceholder}>
                <span style={styles.uploadIcon}>+</span>
                <span>Upload Cover</span>
              </div>
            )}
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              onChange={handleImageChange}
              style={{ display: 'none' }}
            />
          </div>

          <input
            type="text"
            placeholder="Title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            style={styles.input}
            autoFocus
          />

          <textarea
            placeholder="Description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            style={styles.textarea}
            rows={3}
          />

          <div style={styles.ratingSection}>
            <span style={styles.ratingLabel}>Rating:</span>
            <StarRating rating={rating} onRate={setRating} size={28} />
          </div>

          <button
            type="submit"
            style={{
              ...styles.saveBtn,
              opacity: title.trim() ? 1 : 0.5,
            }}
            disabled={!title.trim()}
          >
            Save
          </button>
        </form>
      </div>
    </div>
  );
};

const styles = {
  overlay: {
    position: 'fixed',
    inset: 0,
    background: 'rgba(0,0,0,0.7)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 100,
  },
  modal: {
    background: '#1a1a2e',
    borderRadius: '16px',
    width: '90%',
    maxWidth: '480px',
    maxHeight: '90vh',
    overflow: 'auto',
    border: '1px solid #2a2a3a',
  },
  header: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: '20px 24px',
    borderBottom: '1px solid #2a2a3a',
  },
  headerTitle: {
    fontSize: '1.2rem',
    fontWeight: 600,
    color: '#fff',
  },
  closeBtn: {
    background: 'none',
    border: 'none',
    color: '#888',
    fontSize: '1.8rem',
    cursor: 'pointer',
    lineHeight: 1,
  },
  form: {
    padding: '24px',
    display: 'flex',
    flexDirection: 'column',
    gap: '16px',
  },
  imageUpload: {
    width: '160px',
    height: '220px',
    borderRadius: '10px',
    border: '2px dashed #3a3a4a',
    overflow: 'hidden',
    cursor: 'pointer',
    alignSelf: 'center',
  },
  preview: {
    width: '100%',
    height: '100%',
    objectFit: 'cover',
  },
  uploadPlaceholder: {
    width: '100%',
    height: '100%',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '8px',
    color: '#666',
    fontSize: '0.9rem',
  },
  uploadIcon: {
    fontSize: '2rem',
    color: '#555',
  },
  input: {
    padding: '12px 16px',
    background: '#12121a',
    border: '1px solid #2a2a3a',
    borderRadius: '8px',
    color: '#fff',
    fontSize: '1rem',
    outline: 'none',
  },
  textarea: {
    padding: '12px 16px',
    background: '#12121a',
    border: '1px solid #2a2a3a',
    borderRadius: '8px',
    color: '#fff',
    fontSize: '1rem',
    outline: 'none',
    resize: 'vertical',
    fontFamily: 'inherit',
  },
  ratingSection: {
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
  },
  ratingLabel: {
    color: '#aaa',
    fontSize: '0.95rem',
  },
  saveBtn: {
    padding: '12px',
    background: '#6366f1',
    color: '#fff',
    border: 'none',
    borderRadius: '8px',
    fontSize: '1rem',
    fontWeight: 600,
    cursor: 'pointer',
    marginTop: '8px',
  },
};

export default AddItemModal;

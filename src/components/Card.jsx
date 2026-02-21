import StarRating from './StarRating';

const Card = ({ item, onClick }) => {
  return (
    <div style={styles.card} onClick={() => onClick(item)}>
      <div style={styles.imageWrapper}>
        {item.image ? (
          <img src={item.image} alt={item.title} style={styles.image} />
        ) : (
          <div style={styles.placeholder}>No Image</div>
        )}
      </div>
      <div style={styles.info}>
        <h3 style={styles.title}>{item.title}</h3>
        <p style={styles.description}>
          {item.description.length > 80
            ? item.description.slice(0, 80) + '...'
            : item.description}
        </p>
        <StarRating rating={item.rating} interactive={false} size={16} />
      </div>
    </div>
  );
};

const styles = {
  card: {
    background: '#1a1a2e',
    borderRadius: '12px',
    overflow: 'hidden',
    cursor: 'pointer',
    transition: 'transform 0.2s, box-shadow 0.2s',
    border: '1px solid #2a2a3a',
  },
  imageWrapper: {
    width: '100%',
    aspectRatio: '2/3',
    overflow: 'hidden',
    background: '#12121a',
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
    fontSize: '0.9rem',
  },
  info: {
    padding: '14px',
    display: 'flex',
    flexDirection: 'column',
    gap: '6px',
  },
  title: {
    fontSize: '1rem',
    fontWeight: 600,
    color: '#fff',
    whiteSpace: 'nowrap',
    overflow: 'hidden',
    textOverflow: 'ellipsis',
  },
  description: {
    fontSize: '0.8rem',
    color: '#999',
    lineHeight: 1.4,
    minHeight: '2.8em',
  },
};

export default Card;

import Card from './Card';

const CardGrid = ({ items, onCardClick }) => {
  if (items.length === 0) {
    return (
      <div style={styles.empty}>
        <p style={styles.emptyText}>Nothing here yet. Add your first one!</p>
      </div>
    );
  }

  return (
    <div style={styles.grid}>
      {items.map((item) => (
        <Card key={item.id} item={item} onClick={onCardClick} />
      ))}
    </div>
  );
};

const styles = {
  grid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))',
    gap: '24px',
    padding: '24px 40px',
  },
  empty: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    padding: '80px 40px',
  },
  emptyText: {
    color: '#555',
    fontSize: '1.1rem',
  },
};

export default CardGrid;

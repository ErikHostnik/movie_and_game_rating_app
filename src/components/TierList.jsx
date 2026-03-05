import Card from './Card';

const TIERS = [
  { id: 'S', min: 9,   max: Infinity, label: 'S', color: '#4CAF50', textColor: '#000' },
  { id: 'A', min: 7,   max: 9,        label: 'A', color: '#8BC34A', textColor: '#000' },
  { id: 'B', min: 5,   max: 7,        label: 'B', color: '#FDD835', textColor: '#000' },
  { id: 'C', min: 3,   max: 5,        label: 'C', color: '#FF9800', textColor: '#000' },
  { id: 'D', min: 1.5, max: 3,        label: 'D', color: '#F44336', textColor: '#fff' },
  { id: 'F', min: 0.5, max: 1.5,      label: 'F', color: '#7f1d1d', textColor: '#fff' },
];

function hexToRgba(hex, alpha) {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  return result
    ? `rgba(${parseInt(result[1], 16)}, ${parseInt(result[2], 16)}, ${parseInt(result[3], 16)}, ${alpha})`
    : hex;
}

const TierList = ({ items, onCardClick }) => {
  const unratedItems = items
    .filter((item) => !item.rating || item.rating === 0)
    .slice()
    .sort((a, b) => new Date(b.dateAdded) - new Date(a.dateAdded));

  const allEmpty = items.length === 0;

  if (allEmpty) {
    return (
      <div style={styles.emptyContainer}>
        <p style={styles.emptyText}>Nothing here yet. Add your first one!</p>
      </div>
    );
  }

  return (
    <div style={styles.container}>
      {TIERS.map((tier) => {
        const tierItems = items
          .filter((item) => item.rating >= tier.min && item.rating < tier.max)
          .slice()
          .sort((a, b) => b.rating - a.rating);

        return (
          <div
            key={tier.id}
            style={{ ...styles.tierRow, borderBottom: '5px solid #0f0f0f' }}
          >
            <div
              style={{
                ...styles.labelCell,
                background: tier.color,
                color: tier.textColor,
              }}
            >
              <span style={styles.labelText}>{tier.label}</span>
            </div>

            <div
              style={{
                ...styles.contentArea,
                background: hexToRgba(tier.color, 0.08),
              }}
            >
              {tierItems.length === 0 ? (
                <div style={styles.emptySlot} />
              ) : (
                tierItems.map((item) => (
                  <div key={item.id} style={styles.cardWrapper}>
                    <Card item={item} onClick={onCardClick} />
                  </div>
                ))
              )}
            </div>
          </div>
        );
      })}

      {unratedItems.length > 0 && (
        <div style={{ ...styles.tierRow, borderBottom: '5px solid #0f0f0f' }}>
          <div style={{ ...styles.labelCell, background: '#333', color: '#888' }}>
            <span style={styles.labelText}>?</span>
          </div>
          <div style={{ ...styles.contentArea, background: 'rgba(85,85,85,0.08)' }}>
            {unratedItems.map((item) => (
              <div key={item.id} style={styles.cardWrapper}>
                <Card item={item} onClick={onCardClick} />
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

const styles = {
  container: {
    padding: '0',
  },
  tierRow: {
    display: 'flex',
    minHeight: '130px',
  },
  labelCell: {
    width: '80px',
    minWidth: '80px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: '2.2rem',
    fontWeight: 900,
    userSelect: 'none',
  },
  labelText: {
    display: 'block',
    letterSpacing: '0.02em',
  },
  contentArea: {
    flex: 1,
    display: 'flex',
    flexWrap: 'wrap',
    padding: '12px 16px',
    gap: '14px',
    alignItems: 'flex-start',
    borderLeft: '3px solid rgba(255,255,255,0.06)',
  },
  cardWrapper: {
    width: '155px',
    flexShrink: 0,
  },
  emptySlot: {
    width: '100%',
    minHeight: '80px',
  },
  emptyContainer: {
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

export default TierList;

import Card from './Card';

function groupByMonth(items) {
  const groups = {};
  const sorted = [...items].sort((a, b) => new Date(b.dateAdded) - new Date(a.dateAdded));
  sorted.forEach((item) => {
    const d = new Date(item.dateAdded);
    const key = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`;
    const label = d.toLocaleString('default', { month: 'long', year: 'numeric' });
    if (!groups[key]) groups[key] = { label, items: [] };
    groups[key].items.push(item);
  });
  return Object.values(groups);
}

const Timeline = ({ items, onCardClick }) => {
  const groups = groupByMonth(items);

  if (items.length === 0) {
    return (
      <div style={styles.empty}>
        <p style={styles.emptyText}>No items yet. Start adding movies and games!</p>
      </div>
    );
  }

  return (
    <div style={styles.page}>
      {groups.map((group) => (
        <div key={group.label} style={styles.group}>
          {/* Month label + line */}
          <div style={styles.monthRow}>
            <div style={styles.dot} />
            <h3 style={styles.monthLabel}>{group.label}</h3>
            <div style={styles.line} />
            <span style={styles.count}>{group.items.length} item{group.items.length !== 1 ? 's' : ''}</span>
          </div>

          {/* Cards */}
          <div style={styles.cards}>
            {group.items.map((item) => (
              <div key={item.id} style={styles.cardWrap}>
                <Card item={item} onClick={onCardClick} />
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
};

const styles = {
  page: {
    padding: '32px 40px',
    maxWidth: '1400px',
    margin: '0 auto',
  },
  empty: {
    display: 'flex', alignItems: 'center', justifyContent: 'center',
    padding: '80px 40px',
  },
  emptyText: { color: '#555', fontSize: '1.1rem' },
  group: {
    marginBottom: '36px',
  },
  monthRow: {
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
    marginBottom: '16px',
  },
  dot: {
    width: 12, height: 12,
    borderRadius: '50%',
    background: '#6366f1',
    flexShrink: 0,
  },
  monthLabel: {
    color: '#fff',
    fontSize: '1.1rem',
    fontWeight: 700,
    flexShrink: 0,
  },
  line: {
    flex: 1,
    height: '1px',
    background: '#2a2a3a',
  },
  count: {
    color: '#555',
    fontSize: '0.82rem',
    flexShrink: 0,
  },
  cards: {
    display: 'flex',
    flexWrap: 'wrap',
    gap: '14px',
    paddingLeft: '24px',
    borderLeft: '2px solid #2a2a3a',
  },
  cardWrap: {
    width: '155px',
    flexShrink: 0,
  },
};

export default Timeline;

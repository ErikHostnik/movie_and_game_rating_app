import { useState } from 'react';
import Card from './Card';

const TIER_LABELS_KEY = 'tierLabels';

const TIERS = [
  { stars: 5, defaultLabel: 'S', color: '#4CAF50', textColor: '#000' },
  { stars: 4, defaultLabel: 'A', color: '#8BC34A', textColor: '#000' },
  { stars: 3, defaultLabel: 'B', color: '#FDD835', textColor: '#000' },
  { stars: 2, defaultLabel: 'C', color: '#FF9800', textColor: '#000' },
  { stars: 1, defaultLabel: 'D', color: '#F44336', textColor: '#fff' },
];

function hexToRgba(hex, alpha) {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  return result
    ? `rgba(${parseInt(result[1], 16)}, ${parseInt(result[2], 16)}, ${parseInt(result[3], 16)}, ${alpha})`
    : hex;
}

function loadLabels() {
  try {
    const data = localStorage.getItem(TIER_LABELS_KEY);
    return data ? JSON.parse(data) : {};
  } catch {
    return {};
  }
}

function saveLabels(labels) {
  localStorage.setItem(TIER_LABELS_KEY, JSON.stringify(labels));
}

const TierList = ({ items, onCardClick }) => {
  const [labels, setLabels] = useState(loadLabels);
  const [editing, setEditing] = useState(null);

  const getLabel = (stars) =>
    labels[stars] !== undefined
      ? labels[stars]
      : TIERS.find((t) => t.stars === stars)?.defaultLabel ?? String(stars);

  const finishEdit = (stars, value) => {
    const fallback = TIERS.find((t) => t.stars === stars)?.defaultLabel ?? String(stars);
    const newLabels = { ...labels, [stars]: value.trim() || fallback };
    setLabels(newLabels);
    saveLabels(newLabels);
    setEditing(null);
  };

  const unratedItems = items.filter((item) => !item.rating || item.rating === 0);
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
        const tierItems = items.filter((item) => item.rating === tier.stars);
        const label = getLabel(tier.stars);

        return (
          <div
            key={tier.stars}
            style={{
              ...styles.tierRow,
              borderBottom: '5px solid #0f0f0f',
            }}
          >
            <div
              style={{
                ...styles.labelCell,
                background: tier.color,
                color: tier.textColor,
              }}
              onClick={() => setEditing(tier.stars)}
              title="Klikni za urejanje imena tiera"
            >
              {editing === tier.stars ? (
                <input
                  autoFocus
                  defaultValue={label}
                  style={{ ...styles.labelInput, color: tier.textColor }}
                  onClick={(e) => e.stopPropagation()}
                  onBlur={(e) => finishEdit(tier.stars, e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') finishEdit(tier.stars, e.target.value);
                    if (e.key === 'Escape') setEditing(null);
                  }}
                />
              ) : (
                <span style={styles.labelText}>{label}</span>
              )}
            </div>

            <div
              style={{
                ...styles.contentArea,
                background: hexToRgba(tier.color, 0.1),
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
        <div
          style={{
            ...styles.tierRow,
            borderBottom: '5px solid #0f0f0f',
          }}
        >
          <div
            style={{
              ...styles.labelCell,
              background: '#555',
              color: '#fff',
            }}
            onClick={() => setEditing('unrated')}
            title="Klikni za urejanje imena tiera"
          >
            {editing === 'unrated' ? (
              <input
                autoFocus
                defaultValue={labels['unrated'] ?? '?'}
                style={{ ...styles.labelInput, color: '#fff' }}
                onClick={(e) => e.stopPropagation()}
                onBlur={(e) => finishEdit('unrated', e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') finishEdit('unrated', e.target.value);
                  if (e.key === 'Escape') setEditing(null);
                }}
              />
            ) : (
              <span style={styles.labelText}>{labels['unrated'] ?? '?'}</span>
            )}
          </div>

          <div style={{ ...styles.contentArea, background: 'rgba(85,85,85,0.1)' }}>
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
    cursor: 'pointer',
    userSelect: 'none',
    transition: 'filter 0.15s',
  },
  labelText: {
    display: 'block',
    letterSpacing: '0.02em',
  },
  labelInput: {
    width: '60px',
    background: 'rgba(0,0,0,0.25)',
    border: 'none',
    borderBottom: '2px solid currentColor',
    fontSize: '1.6rem',
    fontWeight: 900,
    textAlign: 'center',
    outline: 'none',
    fontFamily: 'inherit',
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

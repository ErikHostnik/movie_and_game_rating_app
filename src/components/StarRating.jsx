import { useState } from 'react';

const StarRating = ({ rating = 0, onRate, size = 20, interactive = true }) => {
  const [hover, setHover] = useState(null);
  const display = hover !== null ? hover : rating;

  const getType = (star) => {
    if (display >= star) return 'full';
    if (display >= star - 0.5) return 'half';
    return 'empty';
  };

  const displayValue = hover !== null ? hover : rating;

  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: '1px' }}>
      {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((star) => {
        const type = getType(star);
        return (
          <div
            key={star}
            style={{
              position: 'relative',
              width: size,
              height: size,
              fontSize: `${size}px`,
              lineHeight: 1,
              flexShrink: 0,
            }}
          >
            <span
              style={{
                color: '#3a3a3a',
                position: 'absolute',
                top: 0,
                left: 0,
                userSelect: 'none',
              }}
            >
              ★
            </span>

            {type !== 'empty' && (
              <span
                style={{
                  color: '#f59e0b',
                  position: 'absolute',
                  top: 0,
                  left: 0,
                  clipPath: type === 'half' ? 'inset(0 50% 0 0)' : undefined,
                  userSelect: 'none',
                }}
              >
                ★
              </span>
            )}

            {interactive && (
              <>
                <div
                  style={{
                    position: 'absolute',
                    left: 0,
                    top: 0,
                    width: '50%',
                    height: '100%',
                    cursor: 'pointer',
                    zIndex: 1,
                  }}
                  onMouseEnter={() => setHover(star - 0.5)}
                  onMouseLeave={() => setHover(null)}
                  onClick={() => onRate?.(star - 0.5)}
                />
                <div
                  style={{
                    position: 'absolute',
                    right: 0,
                    top: 0,
                    width: '50%',
                    height: '100%',
                    cursor: 'pointer',
                    zIndex: 1,
                  }}
                  onMouseEnter={() => setHover(star)}
                  onMouseLeave={() => setHover(null)}
                  onClick={() => onRate?.(star)}
                />
              </>
            )}
          </div>
        );
      })}

      <span
        style={{
          color: displayValue > 0 ? '#f59e0b' : '#444',
          fontSize: `${Math.max(size * 0.8, 11)}px`,
          fontWeight: 700,
          marginLeft: '6px',
          minWidth: '38px',
          letterSpacing: '0.01em',
        }}
      >
        {displayValue > 0 ? `${displayValue}/10` : '—/10'}
      </span>
    </div>
  );
};

export default StarRating;

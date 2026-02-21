import { useState } from 'react';

const StarRating = ({ rating, onRate, size = 20, interactive = true }) => {
  const [hover, setHover] = useState(0);

  return (
    <div style={{ display: 'flex', gap: '2px' }}>
      {[1, 2, 3, 4, 5].map((star) => (
        <span
          key={star}
          style={{
            fontSize: `${size}px`,
            cursor: interactive ? 'pointer' : 'default',
            color: star <= (hover || rating) ? '#f59e0b' : '#3a3a3a',
            transition: 'color 0.15s',
          }}
          onClick={() => interactive && onRate?.(star)}
          onMouseEnter={() => interactive && setHover(star)}
          onMouseLeave={() => interactive && setHover(0)}
        >
          ★
        </span>
      ))}
    </div>
  );
};

export default StarRating;

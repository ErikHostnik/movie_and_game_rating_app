export const MOVIE_GENRES = [
  'Action', 'Adventure', 'Animation', 'Comedy', 'Crime',
  'Documentary', 'Drama', 'Fantasy', 'Horror', 'Mystery',
  'Romance', 'Sci-Fi', 'Thriller',
];

export const GAME_GENRES = [
  'Action', 'Adventure', 'Fighting', 'FPS', 'Horror',
  'Platformer', 'Puzzle', 'Racing', 'RPG', 'Simulation',
  'Sports', 'Strategy',
];

export const MOVIE_STATUSES = [
  { id: 'watched',       label: 'Watched',       color: '#22c55e' },
  { id: 'watching',      label: 'Watching',       color: '#3b82f6' },
  { id: 'want_to_watch', label: 'Want to Watch',  color: '#f59e0b' },
  { id: 'dropped',       label: 'Dropped',        color: '#ef4444' },
];

export const GAME_STATUSES = [
  { id: 'completed', label: 'Completed', color: '#22c55e' },
  { id: 'playing',   label: 'Playing',   color: '#3b82f6' },
  { id: 'backlog',   label: 'Backlog',   color: '#8b5cf6' },
  { id: 'wishlist',  label: 'Wishlist',  color: '#f59e0b' },
  { id: 'dropped',   label: 'Dropped',   color: '#ef4444' },
];

export const WISHLIST_STATUSES = new Set(['want_to_watch', 'wishlist']);

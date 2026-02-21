const Header = ({ onAdd }) => {
  return (
    <header style={styles.header}>
      <h1 style={styles.title}>My Ratings</h1>
      <button style={styles.addBtn} onClick={onAdd}>
        + Add New
      </button>
    </header>
  );
};

const styles = {
  header: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: '20px 40px',
    background: '#1a1a1a',
    borderBottom: '1px solid #2a2a2a',
  },
  title: {
    fontSize: '1.5rem',
    fontWeight: 700,
    color: '#fff',
  },
  addBtn: {
    padding: '10px 20px',
    background: '#6366f1',
    color: '#fff',
    border: 'none',
    borderRadius: '8px',
    fontSize: '0.95rem',
    fontWeight: 600,
    cursor: 'pointer',
  },
};

export default Header;

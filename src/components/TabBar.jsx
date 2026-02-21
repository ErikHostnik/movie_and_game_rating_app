const TabBar = ({ activeTab, onTabChange }) => {
  return (
    <div style={styles.tabBar}>
      {['movies', 'games'].map((tab) => (
        <button
          key={tab}
          style={{
            ...styles.tab,
            ...(activeTab === tab ? styles.activeTab : {}),
          }}
          onClick={() => onTabChange(tab)}
        >
          {tab === 'movies' ? 'Movies' : 'Games'}
        </button>
      ))}
    </div>
  );
};

const styles = {
  tabBar: {
    display: 'flex',
    gap: '4px',
    padding: '16px 40px',
    background: '#141414',
  },
  tab: {
    padding: '10px 28px',
    background: 'transparent',
    color: '#888',
    border: '2px solid transparent',
    borderRadius: '8px',
    fontSize: '1rem',
    fontWeight: 600,
    cursor: 'pointer',
    transition: 'all 0.2s',
  },
  activeTab: {
    color: '#fff',
    background: '#1e1e2e',
    borderColor: '#6366f1',
  },
};

export default TabBar;

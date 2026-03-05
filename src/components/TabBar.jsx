const TABS = [
  { id: 'movies',    label: 'Movies'    },
  { id: 'games',     label: 'Games'     },
  { id: 'wishlist',  label: 'Wishlist'  },
  { id: 'dashboard', label: 'Dashboard' },
  { id: 'timeline',  label: 'Timeline'  },
];

const TabBar = ({ activeTab, onTabChange }) => (
  <div style={styles.tabBar}>
    {TABS.map((tab) => (
      <button
        key={tab.id}
        style={{
          ...styles.tab,
          ...(activeTab === tab.id ? styles.activeTab : {}),
        }}
        onClick={() => onTabChange(tab.id)}
      >
        {tab.label}
      </button>
    ))}
  </div>
);

const styles = {
  tabBar: {
    display: 'flex',
    gap: '4px',
    padding: '12px 40px',
    background: '#141414',
    borderBottom: '1px solid #1e1e1e',
  },
  tab: {
    padding: '9px 22px',
    background: 'transparent',
    color: '#666',
    border: '2px solid transparent',
    borderRadius: '8px',
    fontSize: '0.95rem',
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

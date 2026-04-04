import { useState, useEffect } from 'react';
import Header from './components/Header';
import TabBar from './components/TabBar';
import TierList from './components/TierList';
import FilterBar from './components/FilterBar';
import Dashboard from './components/Dashboard';
import Timeline from './components/Timeline';
import WishlistView from './components/WishlistView';
import AddItemModal from './components/AddItemModal';
import DetailModal from './components/DetailModal';
import SettingsModal from './components/SettingsModal';
import { WISHLIST_STATUSES } from './constants';

const STORAGE_KEY  = 'myRatingsData';
const PROFILES_KEY = 'myRatingsProfiles';
const ACTIVE_KEY   = 'myRatingsActiveProfile';
const SETTINGS_KEY = 'myRatingsSettings'; //hello

const DEFAULT_PROFILE = { id: 'default', name: 'My Profile', color: '#6366f1' };

function load(key, fallback) {
  try { const d = localStorage.getItem(key); return d ? JSON.parse(d) : fallback; }
  catch { return fallback; }
}

function App() {
  const [items,           setItems]           = useState(() => load(STORAGE_KEY, []));
  const [profiles,        setProfiles]        = useState(() => load(PROFILES_KEY, [DEFAULT_PROFILE]));
  const [activeProfileId, setActiveProfileId] = useState(() => localStorage.getItem(ACTIVE_KEY) || 'default');
  const [settings,        setSettings]        = useState(() => load(SETTINGS_KEY, { tmdbApiKey: '', rawgApiKey: '' }));

  const [activeTab,       setActiveTab]       = useState('movies');
  const [showAddModal,    setShowAddModal]     = useState(false);
  const [selectedItem,    setSelectedItem]     = useState(null);
  const [showSettings,    setShowSettings]     = useState(false);

  const [searchQuery,       setSearchQuery]       = useState('');
  const [selectedGenres,    setSelectedGenres]    = useState([]);
  const [selectedStatuses,  setSelectedStatuses]  = useState([]);
  const [sortBy,            setSortBy]            = useState('dateAdded');
  const [showFavoritesOnly, setShowFavoritesOnly] = useState(false);

  useEffect(() => { localStorage.setItem(STORAGE_KEY,  JSON.stringify(items));    }, [items]);
  useEffect(() => { localStorage.setItem(PROFILES_KEY, JSON.stringify(profiles));  }, [profiles]);
  useEffect(() => { localStorage.setItem(ACTIVE_KEY,   activeProfileId);           }, [activeProfileId]);
  useEffect(() => { localStorage.setItem(SETTINGS_KEY, JSON.stringify(settings));  }, [settings]);

  useEffect(() => {
    setSearchQuery(''); setSelectedGenres([]);
    setSelectedStatuses([]); setShowFavoritesOnly(false);
  }, [activeTab]);

  const profileItems = items.filter(
    (i) => (i.profileId || 'default') === activeProfileId
  );

  const applyFilters = (list) => {
    let r = list;
    if (searchQuery)
      r = r.filter((i) => i.title.toLowerCase().includes(searchQuery.toLowerCase()));
    if (selectedGenres.length)
      r = r.filter((i) => selectedGenres.some((g) => i.genres?.includes(g)));
    if (selectedStatuses.length)
      r = r.filter((i) => selectedStatuses.includes(i.status));
    if (showFavoritesOnly)
      r = r.filter((i) => i.favorite);
    return [...r].sort((a, b) => {
      if (sortBy === 'rating')     return (b.rating || 0) - (a.rating || 0);
      if (sortBy === 'title')      return a.title.localeCompare(b.title);
      if (sortBy === 'completion') return (b.completionRate || 0) - (a.completionRate || 0);
      return new Date(b.dateAdded) - new Date(a.dateAdded);
    });
  };

  const moviesFiltered = applyFilters(profileItems.filter((i) => i.type === 'movies'));
  const gamesFiltered  = applyFilters(profileItems.filter((i) => i.type === 'games'));
  const wishlistItems  = profileItems.filter((i) => WISHLIST_STATUSES.has(i.status));

  const handleSave = (newItem) => {
    setItems((prev) => [{ ...newItem, profileId: activeProfileId }, ...prev]);
    setShowAddModal(false);
  };

  const handleEdit = (updated) => {
    setItems((prev) => prev.map((i) => (i.id === updated.id ? updated : i)));
    setSelectedItem(updated);
  };

  const handleDelete = (id) => {
    setItems((prev) => prev.filter((i) => i.id !== id));
    setSelectedItem(null);
  };

  const handleExport = () => {
    const data = { profiles, items: profileItems, exportDate: new Date().toISOString() };
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url  = URL.createObjectURL(blob);
    const a    = document.createElement('a');
    a.href = url;
    a.download = `my-ratings-${new Date().toISOString().slice(0, 10)}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleImport = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onloadend = () => {
      try {
        const data = JSON.parse(reader.result);
        if (!Array.isArray(data.items)) { alert('Invalid file.'); return; }
        const imported = data.items.map((i) => ({ ...i, profileId: activeProfileId }));
        setItems((prev) => {
          const ids = new Set(prev.map((i) => i.id));
          return [...prev, ...imported.filter((i) => !ids.has(i.id))];
        });
      } catch { alert('Invalid JSON file.'); }
    };
    reader.readAsText(file);
    e.target.value = '';
  };

  const addProfile    = (name, color) =>
    setProfiles((prev) => [...prev, { id: Date.now().toString(), name, color }]);
  const removeProfile = (id) => {
    if (id === 'default') return;
    setProfiles((prev) => prev.filter((p) => p.id !== id));
    if (activeProfileId === id) setActiveProfileId('default');
  };

  const showFilterBar = activeTab === 'movies' || activeTab === 'games';
  const addModalType  = showFilterBar ? activeTab : 'movies';

  return (
    <div style={{ minHeight: '100vh' }}>
      <Header
        onAdd={() => setShowAddModal(true)}
        onOpenSettings={() => setShowSettings(true)}
        profiles={profiles}
        activeProfileId={activeProfileId}
        onProfileChange={setActiveProfileId}
        onAddProfile={addProfile}
        onRemoveProfile={removeProfile}
      />

      <TabBar activeTab={activeTab} onTabChange={setActiveTab} />

      {showFilterBar && (
        <FilterBar
          type={activeTab}
          searchQuery={searchQuery}           onSearchChange={setSearchQuery}
          selectedGenres={selectedGenres}     onGenresChange={setSelectedGenres}
          selectedStatuses={selectedStatuses} onStatusesChange={setSelectedStatuses}
          sortBy={sortBy}                     onSortChange={setSortBy}
          showFavoritesOnly={showFavoritesOnly}
          onFavoritesToggle={() => setShowFavoritesOnly((v) => !v)}
        />
      )}

      {activeTab === 'movies'    && <TierList items={moviesFiltered} onCardClick={setSelectedItem} />}
      {activeTab === 'games'     && <TierList items={gamesFiltered}  onCardClick={setSelectedItem} />}
      {activeTab === 'dashboard' && <Dashboard items={profileItems} />}
      {activeTab === 'timeline'  && <Timeline  items={profileItems}  onCardClick={setSelectedItem} />}
      {activeTab === 'wishlist'  && <WishlistView items={wishlistItems} onCardClick={setSelectedItem} />}

      {showAddModal && (
        <AddItemModal
          type={addModalType}
          onSave={handleSave}
          onClose={() => setShowAddModal(false)}
          settings={settings}
        />
      )}

      {selectedItem && (
        <DetailModal
          item={selectedItem}
          onClose={() => setSelectedItem(null)}
          onDelete={handleDelete}
          onEdit={handleEdit}
          allItems={profileItems}
        />
      )}

      {showSettings && (
        <SettingsModal
          settings={settings}
          onSave={setSettings}
          onClose={() => setShowSettings(false)}
          onExport={handleExport}
          onImport={handleImport}
        />
      )}
    </div>
  );
}

export default App;

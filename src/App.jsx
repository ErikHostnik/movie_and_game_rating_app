import { useState, useEffect } from 'react';
import Header from './components/Header';
import TabBar from './components/TabBar';
import TierList from './components/TierList';
import AddItemModal from './components/AddItemModal';
import DetailModal from './components/DetailModal';

const STORAGE_KEY = 'myRatingsData';

function loadItems() {
  try {
    const data = localStorage.getItem(STORAGE_KEY);
    return data ? JSON.parse(data) : [];
  } catch {
    return [];
  }
}

function saveItems(items) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
}

function App() {
  const [items, setItems] = useState(loadItems);
  const [activeTab, setActiveTab] = useState('movies');
  const [showAddModal, setShowAddModal] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);

  useEffect(() => {
    saveItems(items);
  }, [items]);

  const filteredItems = items.filter((item) => item.type === activeTab);

  const handleSave = (newItem) => {
    setItems((prev) => [newItem, ...prev]);
    setShowAddModal(false);
  };

  const handleEdit = (updatedItem) => {
    setItems((prev) =>
      prev.map((item) => (item.id === updatedItem.id ? updatedItem : item))
    );
    setSelectedItem(updatedItem);
  };

  const handleDelete = (id) => {
    setItems((prev) => prev.filter((item) => item.id !== id));
    setSelectedItem(null);
  };

  return (
    <div style={{ minHeight: '100vh' }}>
      <Header onAdd={() => setShowAddModal(true)} />
      <TabBar activeTab={activeTab} onTabChange={setActiveTab} />
      <TierList items={filteredItems} onCardClick={setSelectedItem} />

      {showAddModal && (
        <AddItemModal
          type={activeTab}
          onSave={handleSave}
          onClose={() => setShowAddModal(false)}
        />
      )}

      {selectedItem && (
        <DetailModal
          item={selectedItem}
          onClose={() => setSelectedItem(null)}
          onDelete={handleDelete}
          onEdit={handleEdit}
        />
      )}
    </div>
  );
}

export default App;

import { useState, useEffect } from 'react';
import { create } from 'zustand';

// Inventory store
const useInventoryStore = create((set) => ({
  items: [],
  addItem: (item) => set((state) => ({ 
    items: [...state.items, item]
  })),
  removeItem: (itemId) => set((state) => ({
    items: state.items.filter(item => item.id !== itemId)
  })),
}));

// Collectible items data
export const collectibleItems = {
  newspaper: {
    id: 'newspaper',
    name: 'Torn Newspaper',
    description: 'A yellowed newspaper dated October 1929',
    content: 'WALL STREET IN PANIC AS STOCKS CRASH',
  },
  filmReel: {
    id: 'filmReel',
    name: 'Film Reel',
    description: 'A rusted and dented film reel canister',
    content: 'The canister appears to contain an old animated film.',
  },
  pocketWatch: {
    id: 'pocketWatch',
    name: 'Broken Pocket Watch',
    description: 'An ornate pocket watch frozen at 11:29',
    content: 'The glass is cracked, but the golden finish still gleams.',
  },
  glove: {
    id: 'glove',
    name: 'White Glove',
    description: 'A pristine white glove with three fingers',
    content: 'The glove seems oddly familiar...',
  },
};

// Inventory UI Component
const Inventory = () => {
  const items = useInventoryStore((state) => state.items);
  const [selectedItem, setSelectedItem] = useState(null);

  return (
    <div className="inventory-overlay">
      <div className="inventory-items">
        {items.map((item) => (
          <div 
            key={item.id}
            className="inventory-item"
            onClick={() => setSelectedItem(item)}
          >
            {item.name}
          </div>
        ))}
      </div>
      
      {selectedItem && (
        <div className="item-details">
          <h3>{selectedItem.name}</h3>
          <p>{selectedItem.description}</p>
          <p>{selectedItem.content}</p>
          <button onClick={() => setSelectedItem(null)}>Close</button>
        </div>
      )}
    </div>
  );
};

export { useInventoryStore };
export default Inventory;

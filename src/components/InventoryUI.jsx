import { useInventoryStore } from './ItemDetail';
import { useState, useEffect } from 'react';
import '../styles/inventory.css';

const InventoryUI = () => {
  const items = useInventoryStore((state) => state.items);
  const nearbyItem = useInventoryStore((state) => state.nearbyItem);
  const [selectedItem, setSelectedItem] = useState(null);

  // Show nearby item prompt
  useEffect(() => {
    if (nearbyItem) {
      const handleKeyPress = (e) => {
        if (e.key.toLowerCase() === 'e') {
          setSelectedItem(nearbyItem);
        }
      };
      window.addEventListener('keydown', handleKeyPress);
      return () => window.removeEventListener('keydown', handleKeyPress);
    }
  }, [nearbyItem]);

  if (items.length === 0) return null;

  return (
    <>
      {/* Inventory bar */}
      <div className="inventory-overlay">
        {items.map((item) => (
          <div
            key={item.id}
            onClick={() => setSelectedItem(item)}
            className="inventory-item"
          >
            {item.name}
          </div>
        ))}
      </div>

      {/* Item detail view */}
      {selectedItem && (
        <div className="item-details">
          <h2>{selectedItem.name}</h2>
          <p>{selectedItem.description}</p>
          <div className="content">
            {selectedItem.detailedContent}
          </div>
          <button onClick={() => setSelectedItem(null)}
          >
            Close
          </button>
        </div>
      )}
    </>
  );
};

export default InventoryUI;

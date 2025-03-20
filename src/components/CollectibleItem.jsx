import { useEffect, useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { useInventoryStore } from './Inventory';
import { collectibleItems } from './Inventory';

const CollectibleItem = ({ position, itemId }) => {
  const meshRef = useRef();
  const addItem = useInventoryStore((state) => state.addItem);
  const items = useInventoryStore((state) => state.items);
  
  // Check if item has already been collected
  if (items.some(item => item.id === itemId)) {
    return null;
  }

  useFrame((state) => {
    if (meshRef.current) {
      meshRef.current.rotation.y += 0.01;
      meshRef.current.position.y = position[1] + Math.sin(state.clock.elapsedTime) * 0.1;
    }
  });

  const handleClick = () => {
    if (collectibleItems[itemId]) {
      addItem(collectibleItems[itemId]);
    }
  };

  return (
    <mesh
      ref={meshRef}
      position={position}
      onClick={handleClick}
    >
      <boxGeometry args={[0.5, 0.5, 0.5]} />
      <meshStandardMaterial color="#FFD700" />
    </mesh>
  );
};

export default CollectibleItem;

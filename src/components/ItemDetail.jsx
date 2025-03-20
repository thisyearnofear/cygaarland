import { Html } from '@react-three/drei';
import { useState, useEffect, useRef } from 'react';
import { create } from 'zustand';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

// Constants
const PICKUP_RADIUS = 3; // Units in the game world
const PICKUP_KEY = 'e';

const useInventoryStore = create((set) => ({
  items: [],
  addItem: (item) => set((state) => ({ items: [...state.items, item] })),
  selectedItem: null,
  setSelectedItem: (item) => set({ selectedItem: item }),
  nearbyItem: null,
  setNearbyItem: (item) => set({ nearbyItem: item }),
}));

const ItemDetail = ({ position, itemData }) => {
  const meshRef = useRef();
  const [isNearby, setIsNearby] = useState(false);
  const addItem = useInventoryStore((state) => state.addItem);
  const setNearbyItem = useInventoryStore((state) => state.setNearbyItem);
  const items = useInventoryStore((state) => state.items);
  
  // We'll use this to determine if we should render the item
  const isCollected = items.some(item => item.id === itemData.id);

  // Effect for handling pickup key press
  useEffect(() => {
    const handleKeyPress = (e) => {
      if (e.key.toLowerCase() === PICKUP_KEY && isNearby) {
        addItem(itemData);
        setNearbyItem(null);
      }
    };

    if (isNearby) {
      window.addEventListener('keydown', handleKeyPress);
    }

    return () => {
      window.removeEventListener('keydown', handleKeyPress);
    };
  }, [isNearby, itemData, addItem, setNearbyItem]);

  // Check distance to character each frame
  useFrame(({ scene }) => {
    // Find the character parent group which contains the position
    const characterParent = scene.getObjectByName('characterParent') || 
                           scene.getObjectByName('Character') || 
                           scene.getObjectByName('explorer') ||
                           scene.getObjectByName('Explorer');

    if (characterParent && meshRef.current) {
      // Get world position of character
      const characterPosition = new THREE.Vector3();
      characterParent.getWorldPosition(characterPosition);
      
      // Get world position of item
      const itemPosition = new THREE.Vector3();
      meshRef.current.getWorldPosition(itemPosition);
      
      const distance = characterPosition.distanceTo(itemPosition);
      const nearbyNow = distance < PICKUP_RADIUS;
      
      if (nearbyNow !== isNearby) {
        setIsNearby(nearbyNow);
        if (nearbyNow) {
          setNearbyItem(itemData);
        } else if (!nearbyNow) {
          setNearbyItem(null);
        }
      }

      // Make item float and rotate slowly
      meshRef.current.rotation.y += 0.01;
      meshRef.current.position.y = position[1] + Math.sin(performance.now() * 0.001) * 0.1;
    }
  });

  if (isCollected) {
    return null;
  }

  return (
    <group position={position}>
      <mesh ref={meshRef}>
        <boxGeometry args={[1.5, 0.3, 1.5]} />
        <meshStandardMaterial color={isNearby ? "#FFD700" : "#CCCCCC"} />
      </mesh>
      
      {isNearby && (
        <Html position={[0, 1, 0]} center>
          <div style={{
            background: 'rgba(0, 0, 0, 0.8)',
            color: 'white',
            padding: '12px 16px',
            borderRadius: '4px',
            fontSize: '14px',
            pointerEvents: 'none',
            textAlign: 'center',
            minWidth: '200px',
            fontFamily: 'serif'
          }}>
            Press E to pick up
          </div>
        </Html>
      )}
    </group>
  );
};

// Available items in the game
export const gameItems = {
  newspaper: {
    id: 'newspaper',
    name: 'Weathered Financial Times',
    description: 'Yellowed pages tell of fortunes fall',
    detailedContent: `The ink has faded, but the headlines still scream:

"MARKET IN TURMOIL"
"Fortunes Vanish in Darkest Thursday"

The date is barely legible through the weathered paper...
Oct-- 24, 19-9

The trading floor described within sounds more like a battlefield than a place of business.`,
    position: [15, 0.5, -15]
  },
  filmReel: {
    id: 'filmReel',
    name: 'Mysterious Film Canister',
    description: 'A dusty reel whispers of animations dawn',
    detailedContent: `A metal film canister, surprisingly well-preserved.

Property of W.D. Productions
Test Screening Copy - #1

Scrawled in pencil:
"Sound sync successful - first test"
"The whistle works perfect"
"M.M. approved"

Date: 11/18/28`,
    position: [-20, 0.5, -8]
  },
  pocketWatch: {
    id: 'pocketWatch',
    name: 'Time-Locked Chronometer',
    description: 'Forever marking a moment of change',
    detailedContent: `Ornate brass and gold, frozen in time.
The hands refuse to budge from 11:29.

Turning it over reveals an inscription, the letters worn smooth by countless thumbs:

"Tempus Omnia Revelat"

A hairline crack in the crystal catches the light like a frozen tear.`,
    position: [12, 0.5, 18]
  },
  glove: {
    id: 'glove',
    name: 'Animators Relic',
    description: 'A curious piece of lost imagination',
    detailedContent: `Impossibly clean, as if drawn rather than sewn.
Three fingers, like a signature of simpler times.

The fabric feels unreal - too perfect, too white.
It could be a prop, or perhaps something more...

Something about it makes you want to whistle.`,
    position: [-18, 0.5, 15]
  }
};

export { useInventoryStore };
export default ItemDetail;

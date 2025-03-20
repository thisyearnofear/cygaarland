import { Canvas } from "@react-three/fiber";
import { OrbitControls } from "@react-three/drei";
import InfiniteSnowGround from "./components/InfiniteSnowGround";
import ItemDetail, { gameItems } from "./components/ItemDetail";
import InventoryUI from "./components/InventoryUI";
import FrameLimiter from "./utils/FPSLimiter";

const Scene = () => {
  return (
    <>
      <Canvas camera={{ fov: 65, position: [0, 30, 100] }} dpr={1}>
        <color attach="background" args={["white"]} />

        <directionalLight position={[4, 5, 0]} intensity={3} />
        <ambientLight intensity={1} />

        <InfiniteSnowGround />

        {/* Collectible items */}
        {Object.values(gameItems).map((item) => (
          <ItemDetail
            key={item.id}
            position={item.position}
            itemData={item}
          />
        ))}

        <OrbitControls
          makeDefault
          enableDamping={false}
          enableRotate={false}
          enableZoom={false}
          enablePan={false}
        />

        <FrameLimiter />
      </Canvas>
      
      {/* Inventory UI overlay */}
      <InventoryUI />
    </>
  );
};

export default Scene;

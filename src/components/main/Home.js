import React, { useRef } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { OrbitControls, Text, Environment } from "@react-three/drei";
import "./Home.css";
import Menu from "./menubar/Menu";

const SpinningGlassDonut = () => {
  const donutRef = useRef();
  let time = 0;

  useFrame(() => {
    if (donutRef.current) {
      time += 0.02;
      donutRef.current.rotation.x = Math.sin(time) * 0.5;
      donutRef.current.rotation.z = Math.cos(time) * 0.5;
      donutRef.current.rotation.y += 0.02;
    }
  });

  return (
    <mesh ref={donutRef} position={[0, 0, -3]}>
      <torusGeometry args={[3.5, 1.3, 64, 128]} />
      <meshPhysicalMaterial
        color="white"
        transparent
        opacity={0.3}
        metalness={1}
        roughness={0.01}
        clearcoat={1}
        clearcoatRoughness={0.03}
        transmission={1}
        ior={2}
        thickness={1}
        reflectivity={0.5}
      />
    </mesh>
  );
};

// Main 컴포넌트 (Three.js Canvas와 Menu를 함께 렌더링)
const Home = () => {
  return (
    <div className="main-body">
      <div className="glass-donut-container">
        <Canvas>
          <ambientLight intensity={0.5} />
          <pointLight position={[10, 10, 10]} />
          <Environment preset="studio" />
          <SpinningGlassDonut />
          <OrbitControls enableZoom={false} />
          <Text
            position={[0, 0, -3]}
            fontSize={3}
            color="white"
            anchorX="center"
            anchorY="middle"
            depthTest={true}
          >
            포트폴리오
          </Text>
        </Canvas>
      </div>
      <div className="menubar">
        <Menu />
      </div>
    </div>
  );
};

export default Home;

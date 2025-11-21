import { useRef } from 'react';
import { Canvas, useFrame, useLoader } from '@react-three/fiber';
import { OrbitControls, Edges } from '@react-three/drei';
import { TextureLoader } from 'three';

// ──────────────────────────────────────
// Soleil avec image.png
// ──────────────────────────────────────
function Sun() {
  const ref = useRef();
  const sunTexture = useLoader(TextureLoader, '/image2.png');

  useFrame((state, delta) => {
    ref.current.rotation.y += delta * 0.08;
  });

  return (
    <mesh ref={ref}>
      <sphereGeometry args={[2.4, 80, 80]} />
      <meshStandardMaterial
        map={sunTexture}
        emissive="#ffaa00"
        emissiveMap={sunTexture}
        emissiveIntensity={1.4}
        roughness={0.5}
      />
      <Edges linewidth={5} color="#ffdd00" />
    </mesh>
  );
}

// ──────────────────────────────────────
// Terre avec earth.png (texture réaliste)
// ──────────────────────────────────────
function EarthOrbit() {
  const groupRef = useRef();
  const earthRef = useRef();

  // Charge la texture de la Terre
  const earthTexture = useLoader(TextureLoader, '/earth.png');

  useFrame((state, delta) => {
    groupRef.current.rotation.y += delta *0.5;   // orbite autour du Soleil
    earthRef.current.rotation.y += delta * 1;     // rotation sur elle-même
  });

  return (
    <group ref={groupRef}>
      <mesh ref={earthRef} position={[5, 0, 0]}>
        <sphereGeometry args={[0.8, 64, 64]} />
        <meshStandardMaterial map={earthTexture} roughness={0.8} metalness={0.1} />
        <Edges linewidth={3} color="cyan" />
      </mesh>

      {/* Ligne d'orbite */}
      <mesh rotation={[Math.PI / 2, 0, 0]}>
        <ringGeometry args={[4.9, 5.1, 64]} />
        <meshBasicMaterial color="#ffffff" opacity={0.2} transparent />
      </mesh>
    </group>
  );
}

// ──────────────────────────────────────
// App principale
// ──────────────────────────────────────
export default function App() {
  return (
    <div style={{ width: '100vw', height: '100vh', background: '#000814' }}>
      <Canvas camera={{ position: [0, 6, 15], fov: 60 }}>
        <ambientLight intensity={0.3} />
        <pointLight position={[0, 0, 0]} intensity={4} color="#ffaa00" />

        <Sun />
        <EarthOrbit />

        <OrbitControls
          autoRotate
          autoRotateSpeed={0.4}
          enablePan={false}
          minDistance={8}
          maxDistance={30}
        />

        {/* Petites étoiles en fond */}
        <pointLight position={[25, 25, 25]} intensity={0.6} />
        <pointLight position={[-25, -25, -25]} intensity={0.4} color="#4488ff" />
      </Canvas>
    </div>
  );
}
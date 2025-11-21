import { useRef } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls, Edges, MeshDistortMaterial } from '@react-three/drei';

// ──────────────────────────────────────
// 1. Cube avec bordure + rotation
// ──────────────────────────────────────
function Box(props) {
  const ref = useRef();

  // Animation : rotation lente sur Y et X
  useFrame((state, delta) => {
    if (ref.current) {
      ref.current.rotation.y += delta * 0.5;
      ref.current.rotation.x += delta * 0.3;
    }
  });

  return (
    <mesh {...props} ref={ref}>
      <boxGeometry args={[1.2, 1.2, 1.2]} />
      <MeshDistortMaterial color="hotpink" distort={0.4} speed={2} />
      
      {/* Bordure noire bien visible */}
      <Edges linewidth={4} color="black" />
    </mesh>
  );
}

// ──────────────────────────────────────
// 2. Sphère stylée (deuxième objet)
// ──────────────────────────────────────
function Sphere(props) {
  const ref = useRef();

  // Rotation inverse pour plus de vie
  useFrame((state, delta) => {
    if (ref.current) {
      ref.current.rotation.y -= delta * 0.8;
    }
  });

  return (
    <mesh {...props} ref={ref}>
      <sphereGeometry args={[0.8, 32, 32]} />
      <meshStandardMaterial color="#00ffff" metalness={0.8} roughness={0.2} />
      
      {/* Bordure cyan qui ressort bien */}
      <Edges linewidth={3} color="#00ffff" />
    </mesh>
  );
}

// ──────────────────────────────────────
// App principale
// ──────────────────────────────────────
export default function App() {
  return (
    <div style={{ width: '100vw', height: '100vh', background: '#111' }}>
      <Canvas camera={{ position: [0, 0, 6], fov: 60 }}>
        {/* Lumières */}
        <ambientLight intensity={0.5} />
        <pointLight position={[10, 10, 10]} intensity={1} />
        <pointLight position={[-10, -10, -10]} intensity={0.5} color="#ff00ff" />

        {/* Les deux objets */}
        <Box position={[-1.8, 0, 0]} />
        <Sphere position={[1.8, 0, 0]} />

        {/* Contrôles souris */}
        <OrbitControls enablePan={false} maxDistance={10} minDistance={3} />

        {/* Optionnel : grille au sol pour le style */}
      </Canvas>
    </div>
  );
}
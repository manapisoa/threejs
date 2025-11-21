import { useRef } from 'react';
import { Canvas, useFrame, useLoader } from '@react-three/fiber';
import { OrbitControls, Edges } from '@react-three/drei';
import { TextureLoader } from 'three';

// CHARGEMENT UNE SEULE FOIS DES TEXTURES (dehors des composants = plus fiable)
const [sunTexture, earthTexture, moonTexture] = useLoader(TextureLoader, [
  '/image.png',   // ton Soleil
  '/earth.png',   // ta Terre
  '/moon.png'     // ta Lune → maintenant ça marche à 100%
]);

// ──────────────────────────────────────
// Soleil
// ──────────────────────────────────────
function Sun() {
  const ref = useRef();
  useFrame((state, delta) => (ref.current.rotation.y += delta * 0.06));

  return (
    <mesh ref={ref}>
      <sphereGeometry args={[2.5, 80, 80]} />
      <meshStandardMaterial
        map={sunTexture}
        emissive="#ffaa00"
        emissiveMap={sunTexture}
        emissiveIntensity={1.5}
        roughness={0.5}
      />
      <Edges linewidth={5} color="#ffdd00" />
    </mesh>
  );
}

// ──────────────────────────────────────
// Terre + Lune (Lune marche maintenant !)
// ──────────────────────────────────────
function EarthOrbit() {
  const earthRef = useRef();
  const moonOrbitRef = useRef();   // groupe qui tourne autour de la Terre

  useFrame((state, delta) => {
    earthRef.current.parent.rotation.y += delta * 0.5;     // Terre autour du Soleil
    earthRef.current.rotation.y += delta * 2;              // rotation Terre
    moonOrbitRef.current.rotation.y += delta * 0.2;          // Lune autour de la Terre (rapide)
  });

  return (
    <group position={[5, 0, 0]}>
      {/* Terre */}
      <mesh ref={earthRef}>
        <sphereGeometry args={[0.8, 64, 64]} />
        <meshStandardMaterial map={earthTexture} roughness={0.8} />
        <Edges linewidth={2} color="cyan" />
      </mesh>

      {/* Lune */}
      <group ref={moonOrbitRef}>
        <mesh position={[2, 0, 0]}>
          <sphereGeometry args={[0.27, 48, 48]} />
          <meshStandardMaterial map={moonTexture} roughness={0.95} />
          <Edges linewidth={2} color="#cccccc" />
        </mesh>
      </group>
    </group>
  );
}

// ──────────────────────────────────────
// Mars (bonus)
// ──────────────────────────────────────
function MarsOrbit() {
  const groupRef = useRef();
  const marsRef = useRef();

  useFrame((state, delta) => {
    groupRef.current.rotation.y += delta * 0.25;
    marsRef.current.rotation.y += delta * 1.8;
  });

  return (
    <group ref={groupRef}>
      <mesh ref={marsRef} position={[9, 0, 0]}>
        <sphereGeometry args={[0.6, 64, 64]} />
        <meshStandardMaterial color="#cd5c5c" roughness={0.9} />
        <Edges linewidth={3} color="#ff8888" />
      </mesh>
    </group>
  );
}

// ──────────────────────────────────────
// App
// ──────────────────────────────────────
export default function App() {
  return (
    <div style={{ width: '100vw', height: '100vh', background: '#000814' }}>
      <Canvas camera={{ position: [0, 8, 20], fov: 60 }}>
        <ambientLight intensity={0.2} />
        <pointLight position={[0, 0, 0]} intensity={5} color="#ffaa00" />

        <Sun />
        <EarthOrbit />
        <MarsOrbit />

        <OrbitControls autoRotate autoRotateSpeed={0.3} enablePan={false} />

        {/* Étoiles */}
        <pointLight position={[30, 30, 30]} intensity={0.7} />
        <pointLight position={[-30, -30, -30]} intensity={0.5} color="#4466ff" />
      </Canvas>
    </div>
  );
}
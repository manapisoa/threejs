import { useRef, useEffect } from 'react';
import { Canvas, useFrame, useLoader, useThree } from '@react-three/fiber';
import { OrbitControls, Edges } from '@react-three/drei';
import { TextureLoader, BackSide, Mesh, SphereGeometry, MeshBasicMaterial } from 'three';

// Texture loading components
function SunTextures() {
  const sunTexture = useLoader(TextureLoader, '/sun.jpg');
  return (
    <meshStandardMaterial
      map={sunTexture}
      emissive="#ffaa00"
      emissiveMap={sunTexture}
      emissiveIntensity={1.5}
      roughness={0.5}
    />
  );
}

function EarthTextures() {
  const earthTexture = useLoader(TextureLoader, '/earth.png');
  return <meshStandardMaterial map={earthTexture} roughness={0.8} />;
}

function MoonTextures() {
  const moonTexture = useLoader(TextureLoader, '/moon.png');
  return <meshStandardMaterial map={moonTexture} roughness={0.95} />;
}

function MarsTextures() {
  const marsTexture = useLoader(TextureLoader, '/mars.png');
  return <meshStandardMaterial map={marsTexture} roughness={0.9} />;
}

// ──────────────────────────────────────
// ──────────────────────────────────────
function Sun() {
  const ref = useRef();
  const sunTexture = useLoader(TextureLoader, '/image2.png');
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
// Terre + Lune (CORRIGÉ : la Terre tourne bien autour du Soleil)
// ──────────────────────────────────────
function EarthOrbit() {
  const orbitRef = useRef();     // ← ce groupe tourne autour du Soleil
  const earthRef = useRef();
  const moonOrbitRef = useRef(); // ← Lune autour de la Terre

  useFrame((state, delta) => {
    orbitRef.current.rotation.y += delta * 0.5;     // Terre autour du Soleil
    earthRef.current.rotation.y += delta * 2;       // rotation de la Terre
    moonOrbitRef.current.rotation.y += delta * 1;   // Lune autour de la Terre (rapide)
  });

  return (
    <group ref={orbitRef}>
      {/* Terre (à 5 unités du Soleil) */}
      <mesh ref={earthRef} position={[5, 0, 0]}>
        <sphereGeometry args={[0.8, 64, 64]} />
        <EarthTextures />
        <Edges linewidth={2} color="cyan" />
      </mesh>

      {/* Lune */}
      <group ref={moonOrbitRef} position={[5, 0, 0]}>
        <mesh position={[1.5, 0, 0]}>
          <sphereGeometry args={[0.27, 64, 64]} />
          <MoonTextures />
          <Edges linewidth={2} color="#cccccc" />
        </mesh>
      </group>

      {/* Orbite visible (optionnel) */}
      <mesh rotation={[Math.PI / 2, 0, 0]} position={[0, 0, 0]}>
        <ringGeometry args={[4.9, 5.1, 64]} />
        <meshBasicMaterial color="#3388ff" opacity={2} transparent />
      </mesh>
    </group>
  );
}

// ──────────────────────────────────────
// Mars
// ──────────────────────────────────────
function MarsOrbit() {
  const orbitRef = useRef();
  const marsRef = useRef();

  useFrame((state, delta) => {
    orbitRef.current.rotation.y += delta * 0.25;
    marsRef.current.rotation.y += delta * 1.8;
  });

  return (
    <group ref={orbitRef}>
      <mesh ref={marsRef} position={[9, 0, 0]}>
        <sphereGeometry args={[0.6, 64, 64]} />
        <MarsTextures />
        <Edges linewidth={3} color="#ff8888" />
      </mesh>
    </group>
  );
}

// ──────────────────────────────────────
// Background
// ──────────────────────────────────────
function SpaceBackground() {
  const { scene } = useThree();
  
  useEffect(() => {
    const loader = new TextureLoader();
    const texture = loader.load('/space.jpg');
    
    // Créer une sphère géante avec l'intérieur texturé
    const geometry = new SphereGeometry(1000, 32, 32);
    const material = new MeshBasicMaterial({
      map: texture,
      side: BackSide,
      transparent: true,
      opacity: 1
    });
    
    const skybox = new Mesh(geometry, material);
    scene.background = texture;
    
    return () => {
      // Nettoyage
      geometry.dispose();
      material.dispose();
      texture.dispose();
    };
  }, [scene]);
  
  return null;
}

// ──────────────────────────────────────
// App
// ──────────────────────────────────────
export default function App() {
  return (
    <div style={{ width: '100vw', height: '100vh' }}>
      <Canvas camera={{ position: [0, 10, 25], fov: 60 }}>
        <SpaceBackground />
        <ambientLight intensity={0.2} />
        <pointLight position={[0, 0, 0]} intensity={5} color="#ffaa00" />

      <Sun />
        
        <EarthOrbit />
        <MarsOrbit />

        <OrbitControls
          autoRotate
          autoRotateSpeed={0.3}
          enablePan={false}
          minDistance={10}
          maxDistance={50}
        />

        {/* Étoiles */}
        <pointLight position={[40, 40, 40]} intensity={0.8} />
        <pointLight position={[-40, -40, -40]} intensity={0.6} color="#4466ff" />
      </Canvas>
    </div>
  );
}

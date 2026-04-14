import { useRef, useMemo, useState, useEffect, Suspense } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Environment, ContactShadows, PresentationControls, Sparkles, useTexture, Float, Preload } from '@react-three/drei';
import * as THREE from 'three';

function ZenWaterPavilion() {
  const groupRef = useRef<THREE.Group>(null);
  const concreteTexture = useTexture('https://images.unsplash.com/photo-1533158326339-7f3cf2404354?auto=format&fit=crop&w=1200&q=80');
  
  useFrame((state) => {
    if (groupRef.current) {
      groupRef.current.position.y = Math.sin(state.clock.elapsedTime * 0.5) * 0.05; // Gentle float
    }
  });

  return (
    <group ref={groupRef}>
      {/* Expansive Reflective Water Surface */}
      <mesh position={[0, -1.5, 0]} rotation={[-Math.PI / 2, 0, 0]} receiveShadow>
        <planeGeometry args={[100, 100]} />
        <meshPhysicalMaterial 
          color="#e0f2fe" 
          roughness={0.01} 
          metalness={0.8}
          reflectivity={1}
          clearcoat={1}
          clearcoatRoughness={0.05}
        />
      </mesh>

      {/* Floating Concrete Steps leading to Pavilion */}
      {[...Array(6)].map((_, i) => (
        <Float key={i} speed={2} floatIntensity={0.1} rotationIntensity={0.05}>
          <mesh position={[0, -1.3, i * 2 - 4]} castShadow receiveShadow>
            <boxGeometry args={[3, 0.2, 1.2]} />
            <meshStandardMaterial 
              map={concreteTexture}
              color="#e5e7eb" 
              roughness={0.6} 
            />
          </mesh>
        </Float>
      ))}

      {/* Main Pavilion Structure */}
      <group position={[0, -1.2, -8]}>
        {/* Pavilion Base */}
        <mesh position={[0, 0.1, 0]} receiveShadow castShadow>
          <boxGeometry args={[12, 0.4, 8]} />
          <meshStandardMaterial map={concreteTexture} color="#d1d5db" roughness={0.7} />
        </mesh>

        {/* Golden Pillars */}
        {[
          [-5, 2, -3], [5, 2, -3], [-5, 2, 3], [5, 2, 3],
          [-2, 2, -3], [2, 2, -3] // extra back pillars
        ].map((pos, i) => (
          <mesh key={`pillar-${i}`} position={pos as [number, number, number]} castShadow>
            <cylinderGeometry args={[0.08, 0.08, 4, 16]} />
            <meshStandardMaterial color="#facc15" metalness={1} roughness={0.1} />
          </mesh>
        ))}

        {/* Minimalist Floating Roof */}
        <mesh position={[0, 4, 0]} castShadow receiveShadow>
          <boxGeometry args={[13, 0.3, 9]} />
          <meshStandardMaterial color="#ffffff" roughness={0.9} />
        </mesh>
        
        {/* Ambient warm light inside pavilion */}
        <pointLight position={[0, 3, 0]} intensity={3} color="#f97316" distance={8} />
      </group>
      
      {/* Decorative Zen Stones in water */}
      <mesh position={[-4, -1.4, -2]} rotation={[0.2, 0.5, 0.1]} castShadow>
        <dodecahedronGeometry args={[0.8, 1]} />
        <meshStandardMaterial color="#374151" roughness={0.9} />
      </mesh>
      <mesh position={[3.5, -1.45, -3]} rotation={[-0.1, 0.2, 0.4]} castShadow>
        <dodecahedronGeometry args={[0.5, 1]} />
        <meshStandardMaterial color="#374151" roughness={0.9} />
      </mesh>
    </group>
  );
}

function CinematicCamera() {
  useFrame((state) => {
    // Drone-like slow sweep over water towards pavilion
    const time = state.clock.elapsedTime;
    state.camera.position.x = Math.sin(time * 0.05) * 8;
    state.camera.position.z = 10 + Math.cos(time * 0.05) * 4;
    state.camera.position.y = 2 + Math.sin(time * 0.2) * 0.5;
    state.camera.lookAt(0, 0, -4);
  });
  return null;
}

export default function Hero3D({ paused = false }: { paused?: boolean }) {
  const [isVisible, setIsVisible] = useState(true);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        setIsVisible(entry.isIntersecting);
      },
      { threshold: 0 }
    );

    if (containerRef.current) {
      observer.observe(containerRef.current);
    }

    return () => observer.disconnect();
  }, []);

  return (
    <div ref={containerRef} className="w-full h-full absolute inset-0 z-0 pointer-events-auto bg-mg-dark">
      {isVisible && !paused && (
        <Suspense fallback={null}>
          <Canvas 
            shadows 
            dpr={[1, 1.5]}
            camera={{ position: [10, 2, 10], fov: 45 }}
            gl={{ powerPreference: "high-performance", antialias: false }}
          >
            <color attach="background" args={['#f8f9fa']} />
            <fog attach="fog" args={['#f8f9fa', 15, 50]} />
            <ambientLight intensity={0.8} color="#ffffff" />
            <directionalLight
              position={[20, 20, 10]}
              intensity={2.5}
              color="#fffcf0"
              castShadow
              shadow-mapSize={[1024, 1024]}
              shadow-bias={-0.0001}
            />
            <CinematicCamera />
            <PresentationControls
              global
              snap={true}
              rotation={[0, 0, 0]}
              polar={[-Math.PI / 10, Math.PI / 10]}
              azimuth={[-Math.PI / 6, Math.PI / 6]}
            >
              <ZenWaterPavilion />
              <Sparkles count={40} scale={20} size={2} speed={0.2} opacity={0.4} color="#facc15" position={[0, 2, -4]} />
            </PresentationControls>
            <ContactShadows position={[0, -1.49, 0]} opacity={0.3} scale={30} blur={3} far={4} color="#000000" />
            <Environment preset="apartment" />
            <Preload all />
          </Canvas>
        </Suspense>
      )}
    </div>
  );
}

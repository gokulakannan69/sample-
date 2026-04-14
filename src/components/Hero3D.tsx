import { useRef, useMemo } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Environment, ContactShadows, PresentationControls, Sparkles, useTexture, Float } from '@react-three/drei';
import * as THREE from 'three';

function BackgroundArchitecture() {
  // Using a high-end architecture image as a professional backdrop
  const texture = useTexture('https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=2400&q=80');
  
  return (
    <mesh position={[0, 5, -15]} rotation={[0, 0, 0]}>
      <planeGeometry args={[60, 40]} />
      <meshBasicMaterial map={texture} transparent opacity={0.3} toneMapped={false} />
    </mesh>
  );
}

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
          color="#0f172a" 
          roughness={0.02} 
          metalness={0.9}
          reflectivity={1}
          clearcoat={1}
          clearcoatRoughness={0.1}
        />
      </mesh>

      {/* Floating Concrete Steps leading to Pavilion */}
      {[...Array(6)].map((_, i) => (
        <Float key={i} speed={2} floatIntensity={0.1} rotationIntensity={0.05}>
          <mesh position={[0, -1.3, i * 2 - 4]} castShadow receiveShadow>
            <boxGeometry args={[3, 0.2, 1.2]} />
            <meshStandardMaterial 
              map={concreteTexture}
              color="#d1d5db" 
              roughness={0.7} 
            />
          </mesh>
        </Float>
      ))}

      {/* Main Pavilion Structure */}
      <group position={[0, -1.2, -8]}>
        {/* Pavilion Base */}
        <mesh position={[0, 0.1, 0]} receiveShadow castShadow>
          <boxGeometry args={[12, 0.4, 8]} />
          <meshStandardMaterial map={concreteTexture} color="#9ca3af" roughness={0.8} />
        </mesh>

        {/* Golden Pillars */}
        {[
          [-5, 2, -3], [5, 2, -3], [-5, 2, 3], [5, 2, 3],
          [-2, 2, -3], [2, 2, -3] // extra back pillars
        ].map((pos, i) => (
          <mesh key={`pillar-${i}`} position={pos as [number, number, number]} castShadow>
            <cylinderGeometry args={[0.08, 0.08, 4, 16]} />
            <meshStandardMaterial color="#cfa861" metalness={1} roughness={0.1} />
          </mesh>
        ))}

        {/* Minimalist Floating Roof */}
        <mesh position={[0, 4, 0]} castShadow receiveShadow>
          <boxGeometry args={[13, 0.3, 9]} />
          <meshStandardMaterial color="#111218" roughness={0.9} />
        </mesh>
        
        {/* Ambient warm light inside pavilion */}
        <pointLight position={[0, 3, 0]} intensity={3} color="#ffebd6" distance={8} />
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

export default function Hero3D() {
  return (
    <div className="w-full h-full absolute inset-0 z-0 pointer-events-auto bg-[#060608]">
      <Canvas shadows camera={{ position: [10, 2, 10], fov: 45 }}>
        <color attach="background" args={['#0f121a']} />
        <fog attach="fog" args={['#0f121a', 10, 40]} />
        <ambientLight intensity={0.3} color="#ffe5b4" />
        <directionalLight
          position={[15, 10, -5]} /* Sunset angle */
          intensity={3}
          color="#fda403" /* Warm sunset color */
          castShadow
          shadow-mapSize={[2048, 2048]}
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
          <Sparkles count={200} scale={25} size={2} speed={0.2} opacity={0.3} color="#fda403" position={[0, 2, -4]} />
        </PresentationControls>
        <ContactShadows position={[0, -1.49, 0]} opacity={0.5} scale={30} blur={2.5} far={4} color="#000000" />
        <Environment preset="sunset" />
      </Canvas>
    </div>
  );
}

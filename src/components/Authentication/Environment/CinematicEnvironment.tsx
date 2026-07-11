/* ──────────────────────────────────────────────────────────────
   Cinematic Environment — Lighting, fog, and atmosphere
   Premium dark office lobby environment
   ────────────────────────────────────────────────────────────── */

import React, { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { Environment } from '@react-three/drei';
import * as THREE from 'three';

interface CinematicEnvironmentProps {
  intensity: number;
}

const CinematicEnvironment: React.FC<CinematicEnvironmentProps> = ({ intensity }) => {
  const spotLightRef1 = useRef<THREE.SpotLight>(null);
  const spotLightRef2 = useRef<THREE.SpotLight>(null);
  const pointLightRef = useRef<THREE.PointLight>(null);

  useFrame(({ clock }) => {
    const t = clock.getElapsedTime();
    
    // Subtle light breathing
    if (pointLightRef.current) {
      pointLightRef.current.intensity = intensity * (0.8 + Math.sin(t * 0.5) * 0.2);
    }
  });

  return (
    <>
      {/* Main ambient light — very subtle */}
      <ambientLight intensity={0.05 * intensity} color="#1e3a5f" />

      {/* Key light — cool blue spotlight from above */}
      <spotLight
        ref={spotLightRef1}
        position={[0, 8, 5]}
        angle={0.4}
        penumbra={0.8}
        intensity={1.5 * intensity}
        color="#3b82f6"
        castShadow
        shadow-mapSize-width={1024}
        shadow-mapSize-height={1024}
      />

      {/* Fill light — subtle warm accent */}
      <spotLight
        ref={spotLightRef2}
        position={[-6, 4, 3]}
        angle={0.5}
        penumbra={1}
        intensity={0.4 * intensity}
        color="#8b5cf6"
      />

      {/* Point light — emanating from behind door frame */}
      <pointLight
        ref={pointLightRef}
        position={[0, 2, -2]}
        intensity={0.8 * intensity}
        color="#06b6d4"
        distance={15}
        decay={2}
      />

      {/* Floor accent lights */}
      <pointLight
        position={[-3, -2, 2]}
        intensity={0.3 * intensity}
        color="#3b82f6"
        distance={8}
        decay={2}
      />
      <pointLight
        position={[3, -2, 2]}
        intensity={0.3 * intensity}
        color="#3b82f6"
        distance={8}
        decay={2}
      />

      {/* Fog for depth */}
      <fog attach="fog" args={['#030712', 8, 30]} />

      {/* Environment map for reflections */}
      <Environment preset="city" environmentIntensity={0.15 * intensity} />
    </>
  );
};

export default CinematicEnvironment;

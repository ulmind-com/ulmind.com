/* ──────────────────────────────────────────────────────────────
   Holographic Particles — Floating ambient particles for the 3D scene
   ────────────────────────────────────────────────────────────── */

import React, { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

interface ParticlesProps {
  count?: number;
  visible: boolean;
}

const HolographicParticles: React.FC<ParticlesProps> = ({ count = 200, visible }) => {
  const pointsRef = useRef<THREE.Points>(null);

  const [positions, velocities] = useMemo(() => {
    const pos = new Float32Array(count * 3);
    const vel = new Float32Array(count * 3);
    
    for (let i = 0; i < count; i++) {
      const i3 = i * 3;
      pos[i3] = (Math.random() - 0.5) * 20;
      pos[i3 + 1] = (Math.random() - 0.5) * 12;
      pos[i3 + 2] = (Math.random() - 0.5) * 15;
      
      vel[i3] = (Math.random() - 0.5) * 0.002;
      vel[i3 + 1] = Math.random() * 0.005 + 0.002;
      vel[i3 + 2] = (Math.random() - 0.5) * 0.002;
    }
    return [pos, vel];
  }, [count]);

  useFrame(() => {
    if (!pointsRef.current || !visible) return;
    const geo = pointsRef.current.geometry;
    const posAttr = geo.attributes.position as THREE.BufferAttribute;
    const posArr = posAttr.array as Float32Array;

    for (let i = 0; i < count; i++) {
      const i3 = i * 3;
      posArr[i3] += velocities[i3];
      posArr[i3 + 1] += velocities[i3 + 1];
      posArr[i3 + 2] += velocities[i3 + 2];

      // Reset particles that go too high
      if (posArr[i3 + 1] > 8) {
        posArr[i3] = (Math.random() - 0.5) * 20;
        posArr[i3 + 1] = -6;
        posArr[i3 + 2] = (Math.random() - 0.5) * 15;
      }
    }
    posAttr.needsUpdate = true;
  });

  if (!visible) return null;

  return (
    <points ref={pointsRef}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          count={count}
          array={positions}
          itemSize={3}
        />
      </bufferGeometry>
      <pointsMaterial
        size={0.04}
        color="#3b82f6"
        transparent
        opacity={0.6}
        sizeAttenuation
        blending={THREE.AdditiveBlending}
        depthWrite={false}
      />
    </points>
  );
};

export default HolographicParticles;

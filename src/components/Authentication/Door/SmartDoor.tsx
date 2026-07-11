/* ──────────────────────────────────────────────────────────────
   Procedural 3D Smart Door — React Three Fiber
   Massive futuristic brushed-metal door with glass inserts,
   LED edges, ULMIND branding, magnetic locking mechanism
   ────────────────────────────────────────────────────────────── */

import React, { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import { Text, RoundedBox } from '@react-three/drei';
import * as THREE from 'three';

interface DoorProps {
  isUnlocking: boolean;
  isOpening: boolean;
  openProgress: number; // 0 → 1
  ledActive: boolean;
}

const SmartDoor: React.FC<DoorProps> = ({ isUnlocking, isOpening, openProgress, ledActive }) => {
  const leftDoorRef = useRef<THREE.Group>(null);
  const rightDoorRef = useRef<THREE.Group>(null);
  const ledRef = useRef<THREE.Mesh>(null);
  const lockIndicatorRef = useRef<THREE.Mesh>(null);

  // Door frame material — brushed dark metal
  const frameMaterial = useMemo(() => new THREE.MeshStandardMaterial({
    color: new THREE.Color('#1a1a2e'),
    metalness: 0.95,
    roughness: 0.25,
    envMapIntensity: 1.2,
  }), []);

  // Door panel material — premium dark metal with subtle reflection
  const panelMaterial = useMemo(() => new THREE.MeshStandardMaterial({
    color: new THREE.Color('#0f1629'),
    metalness: 0.9,
    roughness: 0.3,
    envMapIntensity: 1.5,
  }), []);

  // Glass insert material
  const glassMaterial = useMemo(() => new THREE.MeshPhysicalMaterial({
    color: new THREE.Color('#0a1628'),
    metalness: 0.1,
    roughness: 0.05,
    transmission: 0.6,
    transparent: true,
    opacity: 0.7,
    envMapIntensity: 2.0,
    clearcoat: 1,
    clearcoatRoughness: 0.1,
  }), []);

  // LED edge material
  const ledMaterial = useMemo(() => new THREE.MeshStandardMaterial({
    color: new THREE.Color('#3b82f6'),
    emissive: new THREE.Color('#3b82f6'),
    emissiveIntensity: ledActive ? 2.5 : 0.1,
    metalness: 0.1,
    roughness: 0.1,
  }), [ledActive]);

  // Lock indicator colors
  const lockColor = useMemo(() => {
    if (isOpening) return new THREE.Color('#10b981'); // Green = unlocked
    if (isUnlocking) return new THREE.Color('#f59e0b'); // Amber = unlocking
    return new THREE.Color('#ef4444'); // Red = locked
  }, [isUnlocking, isOpening]);

  // Animate door opening
  useFrame(() => {
    if (leftDoorRef.current && rightDoorRef.current) {
      const targetAngle = openProgress * (Math.PI / 2.2);
      leftDoorRef.current.rotation.y = THREE.MathUtils.lerp(
        leftDoorRef.current.rotation.y,
        -targetAngle,
        0.05
      );
      rightDoorRef.current.rotation.y = THREE.MathUtils.lerp(
        rightDoorRef.current.rotation.y,
        targetAngle,
        0.05
      );
    }

    // Pulse LED
    if (ledRef.current && ledActive) {
      const pulse = Math.sin(Date.now() * 0.003) * 0.3 + 0.7;
      (ledRef.current.material as THREE.MeshStandardMaterial).emissiveIntensity = 2.5 * pulse;
    }

    // Lock indicator
    if (lockIndicatorRef.current) {
      (lockIndicatorRef.current.material as THREE.MeshStandardMaterial).emissive = lockColor;
      (lockIndicatorRef.current.material as THREE.MeshStandardMaterial).emissiveIntensity =
        isUnlocking ? (Math.sin(Date.now() * 0.01) * 0.5 + 1.5) : (isOpening ? 2 : 0.5);
    }
  });

  const doorWidth = 2.5;
  const doorHeight = 5;
  const doorDepth = 0.15;
  const frameThickness = 0.2;

  return (
    <group position={[0, 0, 0]}>
      {/* ─── Door Frame ─── */}
      {/* Top beam */}
      <mesh position={[0, doorHeight / 2 + frameThickness / 2, 0]} material={frameMaterial}>
        <boxGeometry args={[doorWidth * 2 + frameThickness * 2, frameThickness, doorDepth + 0.1]} />
      </mesh>
      {/* Left pillar */}
      <mesh position={[-doorWidth - frameThickness / 2, 0, 0]} material={frameMaterial}>
        <boxGeometry args={[frameThickness, doorHeight, doorDepth + 0.1]} />
      </mesh>
      {/* Right pillar */}
      <mesh position={[doorWidth + frameThickness / 2, 0, 0]} material={frameMaterial}>
        <boxGeometry args={[frameThickness, doorHeight, doorDepth + 0.1]} />
      </mesh>
      {/* Floor threshold */}
      <mesh position={[0, -doorHeight / 2 - 0.05, 0]} material={frameMaterial}>
        <boxGeometry args={[doorWidth * 2 + frameThickness * 2, 0.1, doorDepth + 0.3]} />
      </mesh>

      {/* ─── LED Strips along frame ─── */}
      <mesh ref={ledRef} position={[0, doorHeight / 2 + frameThickness + 0.02, doorDepth / 2 + 0.01]} material={ledMaterial}>
        <boxGeometry args={[doorWidth * 2 + frameThickness * 1.5, 0.03, 0.01]} />
      </mesh>
      {/* Left LED strip */}
      <mesh position={[-doorWidth - frameThickness - 0.02, 0, doorDepth / 2 + 0.01]} material={ledMaterial}>
        <boxGeometry args={[0.03, doorHeight + frameThickness, 0.01]} />
      </mesh>
      {/* Right LED strip */}
      <mesh position={[doorWidth + frameThickness + 0.02, 0, doorDepth / 2 + 0.01]} material={ledMaterial}>
        <boxGeometry args={[0.03, doorHeight + frameThickness, 0.01]} />
      </mesh>

      {/* ─── Left Door Panel ─── */}
      <group ref={leftDoorRef} position={[-doorWidth, 0, 0]}>
        {/* Main panel */}
        <mesh position={[doorWidth / 2, 0, 0]} material={panelMaterial}>
          <boxGeometry args={[doorWidth - 0.05, doorHeight - 0.05, doorDepth]} />
        </mesh>
        {/* Glass insert */}
        <mesh position={[doorWidth / 2, doorHeight * 0.15, doorDepth / 2 + 0.01]} material={glassMaterial}>
          <boxGeometry args={[doorWidth * 0.4, doorHeight * 0.35, 0.02]} />
        </mesh>
        {/* Handle */}
        <mesh position={[doorWidth - 0.25, 0, doorDepth / 2 + 0.06]}>
          <cylinderGeometry args={[0.02, 0.02, 0.6, 16]} />
          <meshStandardMaterial color="#2a2a3e" metalness={0.95} roughness={0.15} />
        </mesh>
      </group>

      {/* ─── Right Door Panel ─── */}
      <group ref={rightDoorRef} position={[doorWidth, 0, 0]}>
        {/* Main panel */}
        <mesh position={[-doorWidth / 2, 0, 0]} material={panelMaterial}>
          <boxGeometry args={[doorWidth - 0.05, doorHeight - 0.05, doorDepth]} />
        </mesh>
        {/* Glass insert */}
        <mesh position={[-doorWidth / 2, doorHeight * 0.15, doorDepth / 2 + 0.01]} material={glassMaterial}>
          <boxGeometry args={[doorWidth * 0.4, doorHeight * 0.35, 0.02]} />
        </mesh>
        {/* Handle */}
        <mesh position={[-doorWidth + 0.25, 0, doorDepth / 2 + 0.06]}>
          <cylinderGeometry args={[0.02, 0.02, 0.6, 16]} />
          <meshStandardMaterial color="#2a2a3e" metalness={0.95} roughness={0.15} />
        </mesh>
      </group>

      {/* ─── Lock Indicator (center of door) ─── */}
      <mesh ref={lockIndicatorRef} position={[0, 0.5, doorDepth / 2 + 0.02]}>
        <circleGeometry args={[0.08, 32]} />
        <meshStandardMaterial
          color={lockColor}
          emissive={lockColor}
          emissiveIntensity={1.5}
          transparent
          opacity={0.9}
        />
      </mesh>

      {/* ─── ULMIND Logo on Door ─── */}
      <Text
        position={[0, 1.8, doorDepth / 2 + 0.02]}
        fontSize={0.35}
        font="/fonts/Inter-Bold.woff"
        color="#3b82f6"
        anchorX="center"
        anchorY="middle"
        outlineWidth={0.005}
        outlineColor="#1e3a5f"
      >
        ULMiND
      </Text>

      {/* ─── Floor reflective plane ─── */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -doorHeight / 2 - 0.1, 2]}>
        <planeGeometry args={[20, 20]} />
        <meshStandardMaterial
          color="#060a14"
          metalness={0.8}
          roughness={0.2}
          envMapIntensity={0.5}
        />
      </mesh>
    </group>
  );
};

export default SmartDoor;

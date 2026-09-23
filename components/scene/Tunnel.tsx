"use client";

import { useEffect, useMemo, useRef } from "react";
import { useSyncExternalStore } from "react";
import { useFrame } from "@react-three/fiber";
import { useGLTF } from "@react-three/drei";
import {
  TUNNEL_URL,
  TUNNEL_POSITION,
  TUNNEL_ROTATION,
  TUNNEL_SCALE,
  TUNNEL_DURATION,
  TUNNEL_MIRROR_SCALE,
  TUNNEL_DEBUG,
} from "./config";
import { transitionStore } from "./transitionStore";

import { DoubleSide, MeshBasicMaterial, MeshPhysicalMaterial, type Mesh } from "three";

const GLASS_COLOR = "#0a1a3a";

function easeInOutCubic(t: number) {
  return t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;
}

export default function Tunnel() {
  const { scene } = useGLTF(TUNNEL_URL);
  const mirrored = useMemo(() => scene.clone(true), [scene]);
  const meshesRef = useRef<Mesh[]>([]);
  const fromRef = useRef(0);
  const toRef = useRef(0);
  const elapsedRef = useRef(TUNNEL_DURATION);
  const stage = useSyncExternalStore(
    transitionStore.subscribe,
    transitionStore.getSnapshot,
    transitionStore.getServerSnapshot
  );

  useEffect(() => {
    const targets: Mesh[] = [];
    for (const root of [scene, mirrored]) {
      root.traverse((object) => {
        const mesh = object as Mesh;
        if (mesh.isMesh) targets.push(mesh);
      });
    }
    if (!targets.length) return;

    meshesRef.current = targets;
    console.info("[Tunnel] meshes con morphs:", targets.length);
    const material = TUNNEL_DEBUG
      ? new MeshBasicMaterial({ color: "#00ffcc", side: DoubleSide })
      : new MeshPhysicalMaterial({
          color: GLASS_COLOR,
          metalness: 1,
          roughness: 0.25,
          envMapIntensity: 1.6,
          side: DoubleSide,
        });
    targets.forEach((mesh) => {
      if (mesh.morphTargetInfluences) {
        mesh.morphTargetInfluences.fill(0);
      }
      mesh.material = material;
    });
  }, [scene, mirrored]);

  useEffect(() => {
    fromRef.current = meshesRef.current[0]?.morphTargetInfluences?.[0] ?? 0;
    toRef.current = stage > 0 ? 1 : 0;
    elapsedRef.current = 0;
  }, [stage]);

  useFrame((_, delta) => {
    if (elapsedRef.current < TUNNEL_DURATION) {
      elapsedRef.current += delta;
    }
    const k = Math.min(1, elapsedRef.current / TUNNEL_DURATION);
    const value = fromRef.current + (toRef.current - fromRef.current) * easeInOutCubic(k);

    meshesRef.current.forEach((mesh) => {
      const influences = mesh.morphTargetInfluences;
      if (influences && influences.length === 2) {
        influences.fill(value);
      }
    });
  });

  return (
    <group
      position={TUNNEL_POSITION}
      rotation={TUNNEL_ROTATION}
      scale={TUNNEL_SCALE}
    >
      <primitive object={scene} dispose={null} />
      <group scale={TUNNEL_MIRROR_SCALE}>
        <primitive object={mirrored} dispose={null} />
      </group>
    </group>
  );
}
"use client";

import { useEffect, useRef } from "react";
import { useFrame, useThree } from "@react-three/fiber";
import { Vector3 } from "three";
import type { OrbitControls as OrbitControlsImpl } from "three-stdlib";

const SPEED = 4;
const FAST_SPEED = 14;

export default function CameraFly() {
  const camera = useThree((s) => s.camera);
  const controls = useThree((s) => s.controls as OrbitControlsImpl | null);
  const keys = useRef<Record<string, boolean>>({});

  useEffect(() => {
    const down = (event: KeyboardEvent) => {
      keys.current[event.code] = true;
    };
    const up = (event: KeyboardEvent) => {
      keys.current[event.code] = false;
    };
    window.addEventListener("keydown", down);
    window.addEventListener("keyup", up);
    return () => {
      window.removeEventListener("keydown", down);
      window.removeEventListener("keyup", up);
    };
  }, []);

  useFrame((_, delta) => {
    const k = keys.current;
    if (!(k.KeyW || k.KeyA || k.KeyS || k.KeyD || k.KeyQ || k.KeyE)) return;

    const speed = k.ShiftLeft || k.ShiftRight ? FAST_SPEED : SPEED;
    const forward = camera.getWorldDirection(new Vector3());
    const right = new Vector3().setFromMatrixColumn(camera.matrixWorld, 0);
    const up = new Vector3().setFromMatrixColumn(camera.matrixWorld, 1);

    const move = new Vector3();
    if (k.KeyW) move.add(forward);
    if (k.KeyS) move.sub(forward);
    if (k.KeyD) move.add(right);
    if (k.KeyA) move.sub(right);
    if (k.KeyE) move.add(up);
    if (k.KeyQ) move.sub(up);
    move.normalize().multiplyScalar(speed * delta);

    camera.position.add(move);
    if (controls) controls.target.add(move);
  });

  return null;
}
"use client";

import { useEffect } from "react";
import { useThree } from "@react-three/fiber";
import type { OrbitControls as OrbitControlsImpl } from "three-stdlib";
import { cameraStore } from "./cameraStore";

export default function CameraTracker() {
  const controls = useThree((s) => s.controls as OrbitControlsImpl | null);

  useEffect(() => {
    if (!controls) return;

    const update = () => {
      const { position } = controls.object;
      const { target } = controls;
      const dx = position.x - target.x;
      const dy = position.y - target.y;
      const dz = position.z - target.z;
      const distance = Math.sqrt(dx * dx + dy * dy + dz * dz);
      const azimuth = (Math.atan2(dx, dz) * 180) / Math.PI;
      const polar = (Math.acos(dy / distance) * 180) / Math.PI;
      cameraStore.set({ azimuth, polar, distance });
    };

    controls.addEventListener("change", update);
    update();
    return () => controls.removeEventListener("change", update);
  }, [controls]);

  return null;
}
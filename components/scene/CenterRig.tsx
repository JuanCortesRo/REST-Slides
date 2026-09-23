"use client";

import { useEffect } from "react";
import { useThree } from "@react-three/fiber";
import { useGLTF } from "@react-three/drei";
import { Box3, MathUtils, PerspectiveCamera, Vector3 } from "three";
import type { OrbitControls as OrbitControlsImpl } from "three-stdlib";
import { MODEL_URL } from "./config";

const CORNER_SIGNS = [
  [-1, -1, -1],
  [1, -1, -1],
  [-1, 1, -1],
  [1, 1, -1],
  [-1, -1, 1],
  [1, -1, 1],
  [-1, 1, 1],
  [1, 1, 1],
] as const;

const MAX_ITERATIONS = 8;
const EPS = 0.002;

export default function CenterRig() {
  const scene = useGLTF(MODEL_URL).scene;
  const camera = useThree((s) => s.camera) as PerspectiveCamera;
  const size = useThree((s) => s.size);
  const controls = useThree((s) => s.controls as OrbitControlsImpl | null);

  useEffect(() => {
    if (!scene) return;

    const box = new Box3().setFromObject(scene);
    const boxCenter = box.getCenter(new Vector3());
    const halfV = Math.tan(MathUtils.degToRad(camera.fov / 2));
    const halfH = halfV * (size.width / size.height);

    const target = controls ? controls.target.clone() : boxCenter.clone();
    const projected = new Vector3();

    const centroidNdc = () => {
      camera.lookAt(target);
      camera.updateMatrixWorld(true);
      let accX = 0;
      let accY = 0;
      for (const [sx, sy, sz] of CORNER_SIGNS) {
        projected
          .set(
            sx < 0 ? box.min.x : box.max.x,
            sy < 0 ? box.min.y : box.max.y,
            sz < 0 ? box.min.z : box.max.z
          )
          .project(camera);
        accX += projected.x;
        accY += projected.y;
      }
      return { cx: accX / CORNER_SIGNS.length, cy: accY / CORNER_SIGNS.length };
    };

    for (let i = 0; i < MAX_ITERATIONS; i++) {
      const { cx, cy } = centroidNdc();
      if (Math.abs(cx) < EPS && Math.abs(cy) < EPS) break;

      const right = new Vector3().setFromMatrixColumn(camera.matrixWorld, 0);
      const up = new Vector3().setFromMatrixColumn(camera.matrixWorld, 1);
      const distance = camera.position.distanceTo(target);

      target
        .addScaledVector(right, cx * distance * halfH)
        .addScaledVector(up, cy * distance * halfV);
    }

    camera.lookAt(target);

    if (controls) {
      controls.target.copy(target);
      controls.update();
    }
  }, [scene, camera, controls, size.width, size.height]);

  return null;
}
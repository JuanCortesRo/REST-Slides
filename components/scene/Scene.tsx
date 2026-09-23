"use client";

import { Suspense } from "react";
import { Canvas } from "@react-three/fiber";
import { OrbitControls, Environment, Lightformer } from "@react-three/drei";
import Model from "./Model";
import CenterRig from "./CenterRig";
import SlideTexts from "./SlideTexts";
import DataStreamStars from "./DataStreamStars";
import SilhouetteSmear from "./SilhouetteSmear";
import Tunnel from "./Tunnel";
import CameraTracker from "./CameraTracker";
import CameraFly from "./CameraFly";
import { CAMERA_POSITION, CAMERA_FOV, INTERACTIVE_CAMERA } from "./config";

export default function Scene() {
  return (
    <Canvas
      dpr={[1, 2]}
      camera={{ position: CAMERA_POSITION, fov: CAMERA_FOV }}
      className="!absolute inset-0 touch-none"
    >
      <ambientLight intensity={0.55} />
      <hemisphereLight intensity={0.5} color="#eafcff" groundColor="#9ad0d6" />
      <directionalLight position={[-3, 6, 10]} intensity={2.4} color="#eafcff" />

      <DataStreamStars />

      <Environment frames={1} resolution={512}>
        <Lightformer form="rect" intensity={5} position={[-1, 1.2, 8]} scale={[14, 6, 1]} color="#ffffff" target={[0, 0, 0]} />
        <Lightformer form="rect" intensity={2.5} position={[3, 3, 6]} scale={[9, 5, 1]} color="#dffaff" target={[0, 0, 0]} />
        <Lightformer form="rect" intensity={3} position={[0, 5, -8]} scale={[12, 7, 1]} color="#b3f3ff" target={[0, 0, 0]} />
        <Lightformer form="rect" intensity={2.2} position={[-9, 1.5, 0]} scale={[10, 10, 1]} color="#b3f3ff" target={[0, 0, 0]} />
        <Lightformer form="rect" intensity={2.2} position={[9, 1.5, 2]} scale={[10, 10, 1]} color="#ffffff" target={[0, 0, 0]} />
      </Environment>

      <Suspense fallback={null}>
        <Model />
        <Tunnel />
        <SilhouetteSmear />
        <SlideTexts />
        <CenterRig />
      </Suspense>

      {INTERACTIVE_CAMERA && (
        <>
          <OrbitControls
            makeDefault
            enablePan={false}
            minDistance={4}
            maxDistance={24}
          />
          <CameraTracker />
        </>
      )}
    </Canvas>
  );
}
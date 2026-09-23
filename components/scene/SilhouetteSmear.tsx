"use client";

import { useEffect, useMemo, useState } from "react";
import {
  AdditiveBlending,
  DoubleSide,
  MeshBasicMaterial,
  PlaneGeometry,
  SRGBColorSpace,
  Texture,
  TextureLoader,
} from "three";

const SMEAR_URL = "/images/rest-silhouette.png";

const PLANE_CENTER: [number, number, number] = [-0.095, 0.002, 0.19];

const IMAGE_SIZE: [number, number] = [2200, 700];
const LETTERS_BBOX: [number, number, number, number] = [1, 58, 2184, 640];
const MODEL_SIZE: [number, number] = [7.279, 2.117];

export default function SilhouetteSmear() {
  const [texture, setTexture] = useState<Texture | null>(null);

  useEffect(() => {
    const loaded = new TextureLoader().load(SMEAR_URL, () => {
      loaded.colorSpace = SRGBColorSpace;
      setTexture(loaded);
    });
    return () => loaded.dispose();
  }, []);

  const geometry = useMemo(() => {
    const [imgW, imgH] = IMAGE_SIZE;
    const [lx, ly, rx, ry] = LETTERS_BBOX;
    const [modelW, modelH] = MODEL_SIZE;

    const planeW = modelW * (imgW / (rx - lx - 280));
    const planeH = modelH * (imgH / (ry - ly - 30));

    return new PlaneGeometry(planeW, planeH);
  }, []);

  const material = useMemo(() => {
    if (!texture) return null;

    return new MeshBasicMaterial({
      map: texture,
      transparent: true,
      depthWrite: false,
      blending: AdditiveBlending,
      side: DoubleSide,
      opacity: 0.45,
    });
  }, [texture]);

  if (!material) return null;

  return (
    <group position={[PLANE_CENTER[0], PLANE_CENTER[1], 0]}>
      <mesh geometry={geometry} material={material} position={[0, 0, PLANE_CENTER[2]]} />
      <mesh geometry={geometry} material={material} position={[0, 0, -PLANE_CENTER[2]]} />
    </group>
  );
}
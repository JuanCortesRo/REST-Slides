"use client";

import { useEffect, useRef } from "react";
import {
  AdditiveBlending,
  CanvasTexture,
  Group,
  Mesh,
  MeshBasicMaterial,
  PlaneGeometry,
  Sprite,
  SpriteMaterial,
} from "three";

const BACK_COUNT = 44;
const FRONT_COUNT = 10;

type Particle = {
  head: Sprite;
  trail: Mesh;
  trailGeometry: PlaneGeometry;
  len: number;
  startX: number;
  endX: number;
  y: number;
  z: number;
  period: number;
  offset: number;
  brightness: number;
};

const rand = (min: number, max: number) => min + Math.random() * (max - min);
const clamp01 = (v: number) => Math.min(1, Math.max(0, v));
const lerp = (a: number, b: number, t: number) => a + (b - a) * t;

function smoothstep(a: number, b: number, t: number) {
  const x = clamp01((t - a) / (b - a));
  return x * x * (3 - 2 * x);
}

function travelEnvelope(t: number) {
  const fade = 0.08;
  if (t < fade) return smoothstep(0, fade, t);
  if (t > 1 - fade) return smoothstep(0, fade, 1 - t);
  return 1;
}

function makeHeadTexture() {
  const size = 64;
  const canvas = document.createElement("canvas");
  canvas.width = size;
  canvas.height = size;
  const ctx = canvas.getContext("2d")!;
  const g = ctx.createRadialGradient(32, 32, 0, 32, 32, 32);
  g.addColorStop(0, "rgba(255,255,255,1)");
  g.addColorStop(0.25, "rgba(214,255,255,0.95)");
  g.addColorStop(0.6, "rgba(0,220,255,0.45)");
  g.addColorStop(1, "rgba(0,220,255,0)");
  ctx.fillStyle = g;
  ctx.fillRect(0, 0, size, size);
  return new CanvasTexture(canvas);
}

const CYAN: [number, number, number] = [0, 220, 255];
const WHITE: [number, number, number] = [255, 255, 255];

function makeTrailPixelData() {
  const w = 128;
  const h = 48;
  const data = new Uint8ClampedArray(w * h * 4);

  for (let j = 0; j < h; j++) {
    const v = j / (h - 1);
    const sinVert = Math.sin(Math.PI * v);
    for (let i = 0; i < w; i++) {
      const u = i / (w - 1);

      const alphaU = 0.05 + 0.95 * Math.pow(u, 1.4);
      const smoothU = clamp01((u - 0.35) / 0.65);
      const whiteMix = smoothU * smoothU * (3 - 2 * smoothU);
      const whiteFactor = whiteMix * sinVert;

      const r = Math.round(lerp(CYAN[0], WHITE[0], whiteFactor));
      const g = Math.round(lerp(CYAN[1], WHITE[1], whiteFactor));
      const b = Math.round(lerp(CYAN[2], WHITE[2], whiteFactor));
      const a = alphaU * (0.4 + 0.6 * sinVert);

      const idx = (j * w + i) * 4;
      data[idx] = r;
      data[idx + 1] = g;
      data[idx + 2] = b;
      data[idx + 3] = Math.round(a * 255);
    }
  }

  return data;
}

function dataToCanvas(data: Uint8ClampedArray, w: number, h: number) {
  const canvas = document.createElement("canvas");
  canvas.width = w;
  canvas.height = h;
  const ctx = canvas.getContext("2d")!;
  const imageData = ctx.createImageData(w, h);
  imageData.data.set(data);
  ctx.putImageData(imageData, 0, 0);
  return canvas;
}

function makeTrailTextures() {
  const w = 128;
  const h = 48;
  const data = makeTrailPixelData();

  const tipRightCanvas = dataToCanvas(data, w, h);

  const tipLeftCanvas = document.createElement("canvas");
  tipLeftCanvas.width = w;
  tipLeftCanvas.height = h;
  const ctx = tipLeftCanvas.getContext("2d")!;
  ctx.translate(w, 0);
  ctx.scale(-1, 1);
  ctx.drawImage(tipRightCanvas, 0, 0);

  return {
    tipRight: new CanvasTexture(tipRightCanvas),
    tipLeft: new CanvasTexture(tipLeftCanvas),
  };
}

function createParticles(
  count: number,
  zMin: number,
  zMax: number,
  brightness: number,
  scale: number,
  headTexture: CanvasTexture,
  tipRight: CanvasTexture,
  tipLeft: CanvasTexture,
): Particle[] {
  const particles: Particle[] = [];

  for (let i = 0; i < count; i++) {
    const direction = Math.random() > 0.5 ? 1 : -1;
    const startX = direction === 1 ? -(17 + rand(0, 3)) : 17 + rand(0, 3);
    const endX = direction === 1 ? 17 + rand(0, 3) : -(17 + rand(0, 3));

    const len = rand(2.7, 5.1) * scale;
    const y = rand(-2.6, 3.2);
    const z = rand(zMin, zMax);

    const headMat = new SpriteMaterial({
      map: headTexture,
      transparent: true,
      opacity: 0,
      blending: AdditiveBlending,
      depthWrite: false,
      toneMapped: false,
    });
    const head = new Sprite(headMat);
    head.scale.set(0.11 * scale, 0.11 * scale, 1);

    const trailGeo = new PlaneGeometry(1, 1);
    trailGeo.translate(direction === 1 ? -0.5 : 0.5, 0, 0);
    const trailMat = new MeshBasicMaterial({
      map: direction === 1 ? tipRight : tipLeft,
      transparent: true,
      opacity: 0,
      blending: AdditiveBlending,
      depthWrite: false,
      toneMapped: false,
    });
    const trail = new Mesh(trailGeo, trailMat);
    trail.scale.set(len, 0.055 * scale, 1);

    particles.push({
      head,
      trail,
      trailGeometry: trailGeo,
      len,
      startX,
      endX,
      y,
      z,
      period: rand(4, 8),
      offset: rand(0, 8),
      brightness,
    });
  }

  return particles;
}

function buildParticles() {
  const headTexture = makeHeadTexture();
  const { tipRight, tipLeft } = makeTrailTextures();

  const back = createParticles(
    BACK_COUNT,
    -2.2,
    -6.5,
    1,
    1,
    headTexture,
    tipRight,
    tipLeft,
  );
  const front = createParticles(
    FRONT_COUNT,
    1.7,
    4.2,
    0.7,
    0.5,
    headTexture,
    tipRight,
    tipLeft,
  );

  return { particles: [...back, ...front], headTexture, tipRight, tipLeft };
}

export default function DataStreamStars() {
  const groupRef = useRef<Group>(null);

  useEffect(() => {
    const group = groupRef.current;
    if (!group) return;

    const { particles, headTexture, tipRight, tipLeft } = buildParticles();
    particles.forEach((p) => {
      p.trail.position.set(p.startX, p.y, p.z);
      p.head.position.set(p.startX, p.y, p.z);
      group.add(p.trail);
      group.add(p.head);
    });

    const start = performance.now();
    let raf = 0;
    const tick = () => {
      const now = (performance.now() - start) / 1000;
      for (const p of particles) {
        const t = ((now + p.offset) % p.period) / p.period;
        const x = p.startX + (p.endX - p.startX) * t;
        const envelope = travelEnvelope(t);
        p.trail.scale.x = p.len * (1 + 0.5 * smoothstep(0, 1, t));
        p.trail.position.x = x;
        p.head.position.x = x;
        (p.trail.material as MeshBasicMaterial).opacity =
          envelope * 0.75 * p.brightness;
        p.head.material.opacity = envelope * p.brightness;
      }
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);

    return () => {
      cancelAnimationFrame(raf);
      particles.forEach((p) => {
        group.remove(p.trail);
        group.remove(p.head);
        (p.trail.material as MeshBasicMaterial).dispose();
        p.trailGeometry.dispose();
        p.head.material.dispose();
      });
      headTexture.dispose();
      tipRight.dispose();
      tipLeft.dispose();
    };
  }, []);

  return <group ref={groupRef} />;
}
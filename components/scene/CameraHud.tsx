"use client";

import { useSyncExternalStore } from "react";
import { cameraStore } from "./cameraStore";

export default function CameraHud() {
  const angles = useSyncExternalStore(
    cameraStore.subscribe,
    cameraStore.getSnapshot,
    cameraStore.getServerSnapshot
  );

  const copy = () => {
    const text = `azimuth=${angles.azimuth.toFixed(1)} polar=${angles.polar.toFixed(
      1
    )} distance=${angles.distance.toFixed(2)}`;
    navigator.clipboard?.writeText(text).catch(() => {});
  };

  return (
    <div className="pointer-events-none fixed left-4 top-4 z-10">
      <div className="pointer-events-auto rounded-lg bg-white/90 px-4 py-3 font-mono text-sm text-zinc-900 shadow-lg ring-1 ring-black/10 backdrop-blur">
        <p className="mb-1.5 text-xs uppercase tracking-wider text-zinc-500">Cámara</p>
        <dl className="grid grid-cols-[auto_auto] gap-x-3 gap-y-0.5">
          <dt className="text-zinc-500">azimuth</dt>
          <dd>{angles.azimuth.toFixed(1)}°</dd>
          <dt className="text-zinc-500">polar (desde +Y)</dt>
          <dd>{angles.polar.toFixed(1)}°</dd>
          <dt className="text-zinc-500">distancia</dt>
          <dd>{angles.distance.toFixed(2)}</dd>
        </dl>
        <button
          onClick={copy}
          className="mt-2 rounded bg-zinc-900 px-2 py-0.5 text-xs text-white transition-colors hover:bg-zinc-700"
        >
          copiar valores
        </button>
      </div>
    </div>
  );
}
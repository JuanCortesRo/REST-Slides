"use client";

import { useSyncExternalStore } from "react";
import { transitionStore } from "./transitionStore";

export default function StageControls() {
  const stage = useSyncExternalStore(
    transitionStore.subscribe,
    transitionStore.getSnapshot,
    transitionStore.getServerSnapshot
  );

  return (
    <div className="fixed bottom-6 right-6 z-10 flex items-center gap-2 rounded-full bg-white/10 p-1.5 shadow-lg ring-1 ring-white/20 backdrop-blur">
      <button
        onClick={() => transitionStore.prev()}
        aria-label="stage anterior"
        disabled={stage === 0}
        className="flex h-9 w-9 items-center justify-center rounded-full bg-zinc-900 text-lg text-white transition-colors hover:bg-zinc-700 disabled:opacity-30"
      >
        ‹
      </button>
      <span className="px-1 font-mono text-sm text-white/70">{stage}</span>
      <button
        onClick={() => transitionStore.next()}
        aria-label="stage siguiente"
        className="flex h-9 w-9 items-center justify-center rounded-full bg-zinc-900 text-lg text-white transition-colors hover:bg-zinc-700"
      >
        ›
      </button>
    </div>
  );
}
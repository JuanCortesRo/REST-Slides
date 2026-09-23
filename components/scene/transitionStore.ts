let stage = 0;
const listeners = new Set<() => void>();

export const transitionStore = {
  getSnapshot(): number {
    return stage;
  },

  getServerSnapshot(): number {
    return stage;
  },

  subscribe(listener: () => void) {
    listeners.add(listener);
    return () => {
      listeners.delete(listener);
    };
  },

  next() {
    stage += 1;
    listeners.forEach((listener) => listener());
  },

  prev() {
    stage = Math.max(0, stage - 1);
    listeners.forEach((listener) => listener());
  },
};
export type CameraAngles = { azimuth: number; polar: number; distance: number };

let angles: CameraAngles = { azimuth: 0, polar: 90, distance: 0 };
const listeners = new Set<() => void>();

export const cameraStore = {
  getSnapshot(): CameraAngles {
    return angles;
  },

  getServerSnapshot(): CameraAngles {
    return angles;
  },

  subscribe(listener: () => void) {
    listeners.add(listener);
    return () => {
      listeners.delete(listener);
    };
  },

  set(next: CameraAngles) {
    angles = next;
    listeners.forEach((listener) => listener());
  },
};
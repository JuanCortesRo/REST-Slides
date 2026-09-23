export const MODEL_URL = "/models/REST.glb";

export const TUNNEL_URL = "/models/tunnel.glb";

// Tamaño/pose del túnel: ajustar TUNNEL_SCALE (compensa el tamaño real del
// modelo en Blender), TUNNEL_ROTATION (el eje del tubo está en Y en el GLB;
// rotarlo para que quede a lo largo de Z, hacia la cámara) y TUNNEL_POSITION.
export const TUNNEL_SCALE = 10;
export const TUNNEL_ROTATION: [number, number, number] = [0, Math.PI, 0];
export const TUNNEL_POSITION: [number, number, number] = [0, 0, 0];
export const TUNNEL_DURATION = 2;
// Espejo: el túnel en el GLB corre a lo largo de X (el nodo lo rota 90°);
// la otra mitad se refleja sobre el plano perpendicular al tubo (GLB X).
export const TUNNEL_MIRROR_SCALE: [number, number, number] = [-1, 1, 1];

// Depuración: deja el túnel sólido y emitivo brillante para ver ambos lados.
export const TUNNEL_DEBUG = false;

export const TITLE_FONT = "/fonts/Michroma.ttf";
export const SUBTITLE_FONT = "/fonts/Michroma.ttf";

export const OUTLINE_WIDTH = 0.01;
export const OUTLINE_COLOR = "#bcc8ee";
export const OUTLINE_OPACITY = 1;

export const CAMERA_POSITION: [number, number, number] = [-1.87, -1.08, 7.8];

export const CAMERA_FOV = 45;

export const INTERACTIVE_CAMERA = false;
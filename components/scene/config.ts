// Prefijo base para GitHub Pages: la web queda en un subdirectorio
// /REST-Slides/ del dominio. GitHub Actions lo inyecta en el build
// (NEXT_PUBLIC_GH_BASE_PATH=/REST-Slides); en local queda "" y nada cambia.
const GH_BASE_PATH = process.env.NEXT_PUBLIC_GH_BASE_PATH ?? "";

export const MODEL_URL = `${GH_BASE_PATH}/models/REST.glb`;

export const TUNNEL_URL = `${GH_BASE_PATH}/models/tunnel.glb`;

// Tamaño/pose del túnel: ajustar TUNNEL_SCALE (compensa el tamaño real del
// modelo en Blender), TUNNEL_ROTATION (el eje está en Y en el GLB; rotarlo
// para que quede a lo largo de Z, hacia la cámara) y TUNNEL_POSITION.
export const TUNNEL_SCALE = 10;
export const TUNNEL_ROTATION: [number, number, number] = [0, Math.PI, 0];
export const TUNNEL_POSITION: [number, number, number] = [0, 0, 0];
export const TUNNEL_DURATION = 2;
// Espejo: el túnel en el GLB corre a lo largo de X (el nodo lo rota 90°);
// la otra mitad se refleja sobre el plano perpendicular al tubo (GLB X).
export const TUNNEL_MIRROR_SCALE: [number, number, number] = [-1, 1, 1];

// Depuración: deja el túnel sólido y emitivo brillante para ver ambos lados.
export const TUNNEL_DEBUG = false;

export const TITLE_FONT = `${GH_BASE_PATH}/fonts/Michroma.ttf`;
export const SUBTITLE_FONT = `${GH_BASE_PATH}/fonts/Michroma.ttf`;

export const OUTLINE_WIDTH = 0.01;
export const OUTLINE_COLOR = "#bcc8ee";
export const OUTLINE_OPACITY = 1;

export const CAMERA_POSITION: [number, number, number] = [-1.87, -1.08, 6.9];

export const CAMERA_FOV = 45;

export const INTERACTIVE_CAMERA = false;

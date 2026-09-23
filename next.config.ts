import type { NextConfig } from "next";

// GitHub Pages sirve el sitio bajo un subdirectorio: /REST-Slides .
// En local (Dev) la variable no existe y queda vacío → rutas raíz normales.
const basePath = process.env.NEXT_PUBLIC_GH_BASE_PATH ?? "";

const nextConfig: NextConfig = {
  output: "export",
  allowedDevOrigins: ["192.168.1.9"],
  ...(basePath
    ? {
        basePath,
        // GitHub Actions (workflow) setea NEXT_PUBLIC_GH_BASE_PATH=/REST-Slides
        // en el build; esto reescribe links/<script> y las rutas dinámicas de
        // three (GLB/fuentes) se prefijan en config.ts con la misma variable.
      }
    : {}),
};

export default nextConfig;

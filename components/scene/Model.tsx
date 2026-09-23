"use client";

import { useMemo } from "react";
import { useGLTF } from "@react-three/drei";
import { Color, MeshPhysicalMaterial, type Mesh, type Object3D } from "three";
import { MODEL_URL } from "./config";

const MODEL_COLOR_A = "#bcc8ee";
const MODEL_COLOR_B = "#a8b9eb";

export default function Model() {
  const { scene } = useGLTF(MODEL_URL);

  const modelScene = useMemo(() => {
    const material = new MeshPhysicalMaterial({
      color: "#ffffff",
      metalness: 0.7,
      roughness: 0.2,
      clearcoat: 1,
      clearcoatRoughness: 0.1,
      envMapIntensity: 1.6,
      emissive: new Color(MODEL_COLOR_A),
      emissiveIntensity: 0.25,
    });

    const uniformA = { value: new Color(MODEL_COLOR_A) };
    const uniformB = { value: new Color(MODEL_COLOR_B) };
    material.onBeforeCompile = (shader) => {
      shader.uniforms.uColorA = uniformA;
      shader.uniforms.uColorB = uniformB;
      shader.vertexShader =
        `varying vec3 vWorldPos;\n` +
        shader.vertexShader.replace(
          "#include <worldpos_vertex>",
          `\n#include <worldpos_vertex>\n\tvWorldPos = (modelMatrix * vec4(position, 1.0)).xyz;\n`,
        );
      shader.fragmentShader =
        `varying vec3 vWorldPos;\n` +
        `uniform vec3 uColorA;\n` +
        `uniform vec3 uColorB;\n` +
        shader.fragmentShader.replace(
          "#include <color_fragment>",
          `\n\tfloat grad = smoothstep(-0.3, 0.3, vWorldPos.y);\n\tdiffuseColor.rgb *= mix(uColorA, uColorB, grad);\n\t#include <color_fragment>`,
        );
    };

    scene.traverse((object: Object3D) => {
      const mesh = object as Mesh;
      if (mesh.isMesh) {
        mesh.material = material;
      }
    });
    return scene;
  }, [scene]);

  return <primitive object={modelScene} dispose={null} />;
}
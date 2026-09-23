"use client";

import { useMemo } from "react";
import { useGLTF, Text } from "@react-three/drei";
import { Box3 } from "three";
import { MODEL_URL, TITLE_FONT, SUBTITLE_FONT, OUTLINE_WIDTH, OUTLINE_COLOR, OUTLINE_OPACITY } from "./config";

export default function SlideTexts() {
  const { scene } = useGLTF(MODEL_URL);

  const bounds = useMemo(() => {
    const box = new Box3().setFromObject(scene);
    return { minY: box.min.y, maxY: box.max.y };
  }, [scene]);

  return (
    <group>
<Text
        position={[0, bounds.maxY + 0.7, 0]}
        fontSize={0.3}
        font={TITLE_FONT}
        color="#bcc8ee"
        outlineWidth={OUTLINE_WIDTH}
        outlineColor={OUTLINE_COLOR}
        outlineOpacity={OUTLINE_OPACITY}
        letterSpacing={0.3}
        anchorX="center"
        anchorY="middle"
      >
        GRUPO 09
      </Text>

<Text
        position={[0, bounds.maxY + 0.40, 0]}
        fontSize={0.14}
        font={TITLE_FONT}
        fillOpacity={0.8}
        color="#bcc8ee"
        letterSpacing={0.1}
        anchorX="center"
        anchorY="middle"
      >
        presenta la arquitectura:
      </Text>

      <Text
        position={[0, bounds.minY - 0.5, 0]}
        fontSize={0.25}
        font={SUBTITLE_FONT}
        color="#bcc8ee"
        outlineWidth={OUTLINE_WIDTH-0.0085}
        outlineColor={OUTLINE_COLOR}
        outlineOpacity={OUTLINE_OPACITY}
        letterSpacing={0.15}
        anchorX="center"
        anchorY="middle"
      >
        {/* REPRESENTATIONAL STATE TRANSFER */}
        Representational State Transfer
      </Text>
    </group>
  );
}
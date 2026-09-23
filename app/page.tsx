import Scene from "@/components/scene/Scene";
import CameraHud from "@/components/scene/CameraHud";
import StageControls from "@/components/scene/StageControls";
import { INTERACTIVE_CAMERA } from "@/components/scene/config";

export default function Home() {
  return (
    <main className="relative h-screen w-screen overflow-hidden bg-gradient-to-b from-[#000020] via-[#0027bb] to-[#000020]">
      <Scene />
      {INTERACTIVE_CAMERA && <CameraHud />}
      <StageControls />
    </main>
  );
}
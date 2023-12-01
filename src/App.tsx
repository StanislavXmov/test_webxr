import { Canvas } from "@react-three/fiber";
import { Controllers, Hands, VRButton, XR } from "@react-three/xr";
import { SceneEnvironment } from "./environment/SceneEnvironment";
import { Scene } from "./level/Scene";

const App = () => {
  return (
    <>
      <VRButton />
      <Canvas>
        <XR>
          <SceneEnvironment />
          <Controllers />
          <Hands />
          <Scene />
        </XR>
      </Canvas>
    </>
  );
}

export default App;

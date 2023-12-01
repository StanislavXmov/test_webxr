import { Canvas } from "@react-three/fiber";
import { Controllers, Hands, VRButton, XR } from "@react-three/xr";
import { SceneEnvironment } from "./environment/SceneEnvironment";

const App = () => {
  return (
    <>
      <VRButton />
      <Canvas>
        <XR>
          <SceneEnvironment />
          <Controllers />
          <Hands />
        </XR>
      </Canvas>
    </>
  );
}

export default App;

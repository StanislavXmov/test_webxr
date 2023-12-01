import { Physics } from "@react-three/rapier";
import { Ground } from "./Ground";

export const Scene = () => {
  return (
    <>
      <Physics timeStep="vary">
        <Ground />
      </Physics>
    </>
  )
};

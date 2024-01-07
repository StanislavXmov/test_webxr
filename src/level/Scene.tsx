import { Physics } from "@react-three/rapier";
import { VRPlayer } from "../gameObjects/VRPlayer";
import { BlocksGroup } from "./pointer/BlocksGroup";
import Ground from "./pointer/Ground";

export const Scene = () => {
  return (
    <>
      <Physics timeStep="vary" debug={false}>
        <VRPlayer />
        <Ground />
        <BlocksGroup />
      </Physics>
    </>
  )
};

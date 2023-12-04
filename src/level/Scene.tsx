import { Physics } from "@react-three/rapier";
import { Ground } from "./Ground";
import { VRPlayer } from "../gameObjects/VRPlayer";
import { CharacterModel } from "../gameObjects/CharacterModel";
import { Vector3 } from "three";

export const Scene = () => {
  return (
    <>
      <Physics timeStep="vary">
        <VRPlayer />
        <Ground />
        {/* <CharacterModel position={new Vector3(7.17, 2.9, 4.69)} /> */}
      </Physics>
    </>
  )
};

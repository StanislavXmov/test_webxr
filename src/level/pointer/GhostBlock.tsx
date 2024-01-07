import { useGLTF } from "@react-three/drei";
import { Euler, Vector3 } from "three";
import { GLTF } from "three/examples/jsm/loaders/GLTFLoader";
import { Rotations, usePointer } from "../../store/usePonter";

interface SceneModel extends GLTF {
  nodes: any;
  materials: any;
}

export const setGhostRotation = (r: Rotations) => {
  if (r === "0") {
    return new Euler().setFromVector3(new Vector3());
  } else if (r === "90") {
    return new Euler().setFromVector3(new Vector3(0, Math.PI / 2, 0));
  } else if (r === "180") {
    return new Euler().setFromVector3(new Vector3(0, Math.PI, 0));
  } else if (r === "270") {
    return new Euler().setFromVector3(new Vector3(0, Math.PI + Math.PI / 2, 0));
  }
  return new Euler().setFromVector3(new Vector3());
}

const GhostBlock = () => {
  const position = usePointer(s => s.ghostPosition);
  const ghostRotation = usePointer(s => s.ghostRotation);
  const currentType = usePointer(s => s.currentType);
  const isHover = usePointer(s => s.isGhost);

  let nodes;
  if (currentType === 'Cube') {
    const model = useGLTF('./cube.glb') as SceneModel;
    nodes = model.nodes;
  } else if (currentType === 'Triangle') {
    const model = useGLTF('./cube2.glb') as SceneModel;
    nodes = model.nodes;
  }

  return (
    <mesh 
      position={position}
      rotation={setGhostRotation(ghostRotation)}
      geometry={nodes.Cube.geometry}
    >
      <meshStandardMaterial color={'#ffffff'} transparent opacity={isHover ? 0.8 : 0} />
    </mesh>
  );
}

export default GhostBlock
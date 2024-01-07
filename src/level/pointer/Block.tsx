import { Box, useGLTF } from "@react-three/drei";
import { RigidBody } from "@react-three/rapier";
import { Interactive, XRInteractionEvent } from "@react-three/xr";
import { Euler, MeshStandardMaterial, Vector3 } from "three";
import { GLTF } from "three/examples/jsm/loaders/GLTFLoader";
import { usePointer } from "../../store/usePonter";
import { setGhostRotation } from "./GhostBlock";
import { useCallback } from "react";
import useThrottledFunction from "../../hooks/useThrottle";

type BlockProps = {
  position: Vector3;
  rotation: Euler;
  type: 'Cube' | 'Triangle'
}

interface SceneModel extends GLTF {
  nodes: any;
  materials: any;
}

export const Block = ({ position, rotation, type }: BlockProps) => {
  const setPointer = usePointer(s => s.setPointers);
  const currentType = usePointer(s => s.currentType);
  const setHover = usePointer(s => s.setIsGhost);
  const setPosition = usePointer(s => s.setGhostPosition);
  const ghostRotation = usePointer(s => s.ghostRotation);

  let nodes, materials;
  if (type === 'Cube') {
    const model = useGLTF('./cube.glb') as SceneModel;
    nodes = model.nodes;
    materials = model.materials;
  } else if (type === 'Triangle') {
    const model = useGLTF('./cube2.glb') as SceneModel;
    nodes = model.nodes;
    materials = model.materials;
  }
  // const {nodes, materials} = useGLTF('./cube.glb') as SceneModel;

  const onHover = useCallback((e: XRInteractionEvent) => {
    setHover(true);

    if (e.intersections.length > 0) {
      const intersect = e.intersections[0];
      
      const position = new Vector3();
      if (intersect.face) {
        position.copy(intersect.point).add(intersect.face.normal);
      }
      position.divideScalar(2.5).floor().multiplyScalar(2.5).addScalar(1.25);
      setPosition(position);
    }
  }, []);

  const { throttledFn: throttledHover } = useThrottledFunction({
    callbackFn: onHover as <T>(args?: T | undefined) => any,
    throttleMs: 100
  });

  const onBlur = () => {
    setHover(false);
  }

  const onSelect = (e: XRInteractionEvent) => {
    if (e.intersections.length > 0) {
      const intersect = e.intersections[0];
      
      const position = new Vector3();
      if (intersect.face) {
        position.copy(intersect.point).add(intersect.face.normal);
      }
      position.divideScalar(2.5).floor().multiplyScalar(2.5).addScalar(1.25);
      setPointer({position, rotation: setGhostRotation(ghostRotation), type: currentType});
    }
  }

  return (
    <>
      {type === 'Cube' && (
        <group>
          <RigidBody 
            type="fixed"
            colliders="trimesh" 
            position={position}
            rotation={rotation}
          >
            <mesh castShadow receiveShadow geometry={nodes.Cube.geometry} material={materials['Material']} />
          </RigidBody>
          <Interactive 
            onSelect={onSelect} 
            // onHover={onHover} 
            // onMove={onHover} 
            onMove={throttledHover} 
            onBlur={onBlur}>
            <Box 
              args={[2.5, 2.5, 2.5]}
              position={position}
            >
              <meshStandardMaterial transparent opacity={0} />
            </Box>
          </Interactive>
        </group>
      )}
      {type === 'Triangle' && (
        <group>
          <RigidBody 
            type="fixed"
            colliders="trimesh" 
            position={position}
            rotation={rotation}
          >
            <mesh castShadow receiveShadow geometry={nodes.collider.geometry} material={new MeshStandardMaterial({transparent: true, opacity: 0})} />
          </RigidBody>
          <Interactive 
            onSelect={onSelect} 
            // onHover={onHover} 
            onMove={onHover} 
            onBlur={onBlur}>
            <Box 
              args={[2.5, 2.5, 2.5]}
              position={position}
            >
              <meshStandardMaterial transparent opacity={0} />
            </Box>
          </Interactive>
          <mesh 
            position={position}
            rotation={rotation}
            castShadow 
            receiveShadow 
            geometry={nodes.Cube.geometry} 
            material={materials['Material']}
          />
        </group>
      )}
    </>
  );
}
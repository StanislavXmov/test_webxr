import { useGLTF } from '@react-three/drei';
import { GLTF } from 'three/examples/jsm/loaders/GLTFLoader';
import { Bone, MeshStandardMaterial, SkinnedMesh, Vector3 } from 'three';

interface CharacterGLTF extends GLTF {
  nodes: {
    mixamorigHips: Bone;
    Cube: SkinnedMesh;
  }
  materials: {
    'Material.001': MeshStandardMaterial;
  }
};

export const CharacterModel = ({ position }:{ position: Vector3 }) => {
  const model = useGLTF('/character_model.glb') as CharacterGLTF;
  console.log(model);
  
  
  return (
    <group dispose={null} userData={{type: 'player'}} position={position}>
      <group name="Armature" rotation={[Math.PI / 2, 0, 0]} scale={0.01} position={[0, -0.9, 0]}>
        <primitive object={model.nodes.mixamorigHips} />
        <skinnedMesh 
          castShadow 
          name="Cube" 
          frustumCulled={false} 
          geometry={model.nodes.Cube.geometry} 
          material={model.materials['Material.001']} 
          skeleton={model.nodes.Cube.skeleton} 
        />
      </group>
    </group>
  );
};

useGLTF.preload('/character_model.glb');
import { Collider, RayColliderToi } from '@dimforge/rapier3d-compat';
import { useFrame } from '@react-three/fiber';
import { CapsuleCollider, RapierRigidBody, RigidBody, useRapier } from '@react-three/rapier';
import { useController, useXR } from '@react-three/xr';
import { useEffect, useMemo, useRef, useState } from 'react';
import { Vector3 } from 'three';
import { usePointer } from '../store/usePonter';
// import { Text } from '@react-three/drei';

const types: ['Cube', 'Triangle'] = ['Cube', 'Triangle'];
const rotations: ['0', '90', '180', '270'] = ['0', '90', '180', '270'];

// const keyHandler = (e: KeyboardEvent) => {
//   if (e.code === 'KeyE') {
//     const index = types.indexOf(currentType);
//     if (index >= 0 && index !== types.length - 1) {
//       setCurrentType(types[index + 1]);
//     } else {
//       setCurrentType(types[0]);
//     }
//   } else if (e.code === 'KeyR') {
//     const index = rotations.indexOf(ghostRotation);
//     if (index >= 0 && index !== rotations.length - 1) {
//       setGhostRotation(rotations[index + 1]);
//     } else {
//       setGhostRotation(rotations[0]);
//     }
//   }
// }

export const VRPlayer = () => {
  const [text, setText ] = useState('Debug');
  const size = 0.45;

  // const setPosition = usePosition(s => s.setPosition);
  const rigRef = useRef<RapierRigidBody>(null);
  
  const { player } = useXR();
  const { rapier, world } = useRapier();
  const controllerLeft = useController('left');
  const controllerRight = useController('right');

  const currentType = usePointer(s => s.currentType);
  const setCurrentType = usePointer(s => s.setCurrentType);

  const ghostRotation = usePointer(s => s.ghostRotation);
  const setGhostRotation = usePointer(s => s.setGhostRotation);

  const deadzone = 0.05;
  const forward = useRef(new Vector3());
  const horizontal = useRef(new Vector3());
  const position = useRef(new Vector3());
  const rotation = useRef(new Vector3());
  const y = useRef(0);

  const isCollision = useRef(false);
  let jump = false;
  let trigerTypeDate = new Date();
  let trigerRotationsDate = new Date();

  const rayOriginOffest = { x: 0, y: -size, z: 0 };
  const rayOrigin = useMemo(() => new Vector3(), []);
  const rayDir = { x: 0, y: -1, z: 0 };
  const rayCast = new rapier.Ray(rayOrigin, rayDir);
  let rayHit: RayColliderToi | null = null;

  useFrame(() => {
    position.current.set(0, 0, 0);
    if (player.position.y < -5) {
      const body = rigRef.current;
      if (body) {
        body.sleep();
        body.setTranslation(new Vector3(0, 1, 0), true);
        player.position.set(0, 1, 0);
        return;
      }
    }

    const velocity = rigRef.current?.linvel();
    const pos = rigRef.current?.translation();
    if (velocity) {
      if (velocity.y > y.current) {
        y.current = velocity.y / 10;
      } else {
        y.current = velocity.y;
      }
    }

    if (pos) {
      player.position.set(pos.x, pos.y, pos.z);
    }
    
    const YStickLeft = controllerLeft?.inputSource?.gamepad?.axes[3];
    const XStickLeft = controllerLeft?.inputSource?.gamepad?.axes[2];
    const XStickRight = controllerRight?.inputSource?.gamepad?.axes[2];

    const camera = player.children[0];
		const cameraMatrix = camera.matrixWorld.elements;
    
    forward.current
      .set(-cameraMatrix[8], -cameraMatrix[9], -cameraMatrix[10])
      .normalize();

    if (XStickLeft) {
        horizontal.current.copy(forward.current);
				horizontal.current.cross(camera.up).normalize();
				position.current.add(
					horizontal.current.multiplyScalar(
						(Math.abs(XStickLeft) > deadzone
							? XStickLeft
							: 0) * 10,
					),
				);
    }
    
    if (YStickLeft) {
      position.current.add(
        forward.current.multiplyScalar(
          (Math.abs(YStickLeft) > deadzone ? -YStickLeft : 0) * 10,
        ),
      );
      position.current.y = 0;
    }

    rigRef.current?.setLinvel({
      x: position.current.x,
      y: y.current,
      z: position.current.z
    }, true);

    if (XStickRight) {
      player.rotation.y -=
				(Math.abs(XStickRight) > deadzone ? XStickRight : 0) * 0.05;
    }

    // B = 5
    // A = 4
    const buttonA = controllerRight?.inputSource?.gamepad?.buttons[4]
    if (buttonA && (buttonA.pressed || buttonA.value > 0)) {
      jump = true;
    }

    const buttonX = controllerLeft?.inputSource?.gamepad?.buttons[4]
    if (buttonX && (buttonX.pressed || buttonX.value > 0)) {
      const trigerDate = new Date();
      if (trigerDate.getTime() - trigerTypeDate.getTime() > 1000) {
        trigerTypeDate = trigerDate
        const index = types.indexOf(currentType);
        if (index >= 0 && index !== types.length - 1) {
          setCurrentType(types[index + 1]);
        } else {
          setCurrentType(types[0]);
        }
      }
    }

    // right rotate
    const buttonB = controllerRight?.inputSource?.gamepad?.buttons[5]
    if (buttonB && (buttonB.pressed ||  buttonB.value > 0)) {
      const trigerDate = new Date();
      if (trigerDate.getTime() - trigerRotationsDate.getTime() > 1000) {
        trigerRotationsDate = trigerDate
        const index = rotations.indexOf(ghostRotation);
        if (index >= 0 && index !== rotations.length - 1) {
          setGhostRotation(rotations[index + 1]);
        } else {
          setGhostRotation(rotations[0]);
        }
      }
    }

    if (jump) {
      jump = false;
      if (rigRef.current) {
        const origin = rigRef.current.translation();
        rayOrigin.addVectors(new Vector3(origin.x, origin.y, origin.z), rayOriginOffest as THREE.Vector3);
        rayHit = world.castRay(
          rayCast,
          3,
          true,
          undefined,
          undefined,
          rigRef.current as unknown as Collider,
          undefined,
          ((collider) => !collider.isSensor())
        );
        if (rayHit && rayHit.toi < 1) {
          rigRef.current.setLinvel({ x: 0, y: 60, z: 0 }, true);
        }
      }
    }
  });

  return (
    <RigidBody
      position={[0, 1, 0]}
      ref={rigRef}
      restitution={0.2}
      friction={1}
      canSleep={false}
      colliders={false}
      enabledRotations={[false, true, false]}
      type="dynamic"
    >
      {/* Debug */}
      
      <CapsuleCollider args={[size, size]} mass={100} />
    </RigidBody>
  )
};

{/* Debug */}
{/* <Text position={[0, 1, -8]} color={'#000000'} anchorX="center"
  anchorY="middle">
  {text}
</Text> */}
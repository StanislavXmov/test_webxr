import { Collider, RayColliderToi } from '@dimforge/rapier3d-compat';
import { useFrame } from '@react-three/fiber';
import { CapsuleCollider, RapierRigidBody, RigidBody, useRapier } from '@react-three/rapier';
import { useController, useXR } from '@react-three/xr';
import { useMemo, useRef, useState } from 'react';
import { Vector3 } from 'three';

export const VRPlayer = () => {
  const [text, setText ] = useState('Debug');
  const size = 0.45;

  // const setPosition = usePosition(s => s.setPosition);
  const rigRef = useRef<RapierRigidBody>(null);
  
  const { player } = useXR();
  const { rapier, world } = useRapier();
  const controllerLeft = useController('left');
  const controllerRight = useController('right');

  const deadzone = 0.05;
  const forward = useRef(new Vector3());
  const horizontal = useRef(new Vector3());
  const position = useRef(new Vector3());
  const rotation = useRef(new Vector3());
  const y = useRef(0);

  const isCollision = useRef(false);
  let jump = false;

  const rayOriginOffest = { x: 0, y: -size, z: 0 };
  const rayOrigin = useMemo(() => new Vector3(), []);
  const rayDir = { x: 0, y: -1, z: 0 };
  const rayCast = new rapier.Ray(rayOrigin, rayDir);
  let rayHit: RayColliderToi | null = null;

  useFrame(() => {
    position.current.set(0, 0, 0);

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

    const buttonA = controllerRight?.inputSource?.gamepad?.buttons[4]
    if (buttonA && (buttonA.pressed || buttonA.value > 0)) {
      jump = true;
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
          rigRef.current.setLinvel({ x: 0, y: 45, z: 0 }, true);
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
      {/* <Text position={[0, 1, -2]} color={'#000000'} anchorX="center"
        anchorY="middle">
        {text}
      </Text> */}
      <CapsuleCollider args={[size, size]} mass={100} />
    </RigidBody>
  )
};

import { RigidBody } from "@react-three/rapier"
import { usePointer } from "../../store/usePonter";
import { Interactive, XRInteractionEvent } from "@react-three/xr";
import { Vector3 } from "three";
import { setGhostRotation } from "./GhostBlock";
import { useCallback } from "react";
import useThrottledFunction from "../../hooks/useThrottle";

const Ground = () => {
  const setPointer = usePointer(s => s.setPointers);
  const currentType = usePointer(s => s.currentType);
  const setHover = usePointer(s => s.setIsGhost);
  const setPosition = usePointer(s => s.setGhostPosition);
  const ghostRotation = usePointer(s => s.ghostRotation);

  const onHover = useCallback((e: XRInteractionEvent) => {
    setHover(true);

    if (e.intersections.length > 0) {
      const intersect = e.intersections[0];
      
      const position = new Vector3();
      if (intersect.face) {
        position.copy(intersect.point).add(intersect.face.normal);
      }
      position.divideScalar(2.5).floor().multiplyScalar(2.5).addScalar(1.25);

      if (position.y < 0) {
        position.y = 1.25;
      }
      
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
      if (position.y < 0) {
        position.y = 1.25;
      }
      setPointer({position, rotation: setGhostRotation(ghostRotation), type: currentType});
    }
  }

  return (
    <>
      <RigidBody 
        type="fixed"
        colliders="trimesh" 
      >
        <Interactive 
          onSelect={onSelect} 
          // onHover={onHover}
          // onMove={onHover}
          onMove={throttledHover}
          onBlur={onBlur}
        >
          <mesh rotation={[-Math.PI / 2, 0, 0]}>
            <planeGeometry args={[100* 0.8, 100* 0.8]} />
            <meshStandardMaterial color={"#4c92e2"} />
          </mesh>
        </Interactive>
      </RigidBody>
      <gridHelper args={[100 * 0.8, 40 * 0.8, "#ffffff", "#ffffff"]} position={[0, 0.02, 0]} />
    </>
  )
}

export default Ground
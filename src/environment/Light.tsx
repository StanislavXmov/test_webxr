// import { Color } from 'three';

export const Light = () => {
  return (
    <>
      <directionalLight
        intensity={1}
        castShadow={true}
        shadow-bias={-0.00015}
        shadow-radius={4}
        shadow-blur={10}
        shadow-mapSize={[2048, 2048]}
        position={[85.0, 80.0, 70.0]}
        shadow-camera-left={-30}
        shadow-camera-right={30}
        shadow-camera-top={30}
        shadow-camera-bottom={-30}
      />
      {/* <ambientLight color={new Color('#d1eaff')} intensity={4} /> */}
    </>
  )
};
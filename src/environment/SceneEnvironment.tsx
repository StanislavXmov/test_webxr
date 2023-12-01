import { Environment } from '@react-three/drei';
import { Light } from './Light';

export const SceneEnvironment = () => {
  return (
    <>
      <Environment
        files="/test.hdr"
        background
        blur={0.5}
      />
      <Light />
    </>
  )
};

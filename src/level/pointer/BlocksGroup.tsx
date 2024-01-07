import { Suspense } from "react";
import { Block } from "./Block";
import { usePointer } from "../../store/usePonter";
import GhostBlock from "./GhostBlock";

// const types: ['Cube', 'Triangle'] = ['Cube', 'Triangle'];
// const rotations: ['0', '90', '180', '270'] = ['0', '90', '180', '270'];

export const BlocksGroup = () => {
  const blocks = usePointer(s => s.pointers);

  // for test emulate events

  // const currentType = usePointer(s => s.currentType);
  // const setCurrentType = usePointer(s => s.setCurrentType);

  // const ghostRotation = usePointer(s => s.ghostRotation);
  // const setGhostRotation = usePointer(s => s.setGhostRotation);


  // const keyHandler = (e: KeyboardEvent) => {
  //   if (e.code === 'KeyE') {
  //     const index = types.indexOf(currentType);
  //     console.log(index);
      
  //     if (index >= 0 && index !== types.length - 1) {
  //       setCurrentType(types[index + 1]);
  //     } else {
  //       setCurrentType(types[0]);
  //     }
  //   } else if (e.code === 'KeyR') {
  //     const index = rotations.indexOf(ghostRotation);
  //     console.log(index);
      
  //     if (index >= 0 && index !== rotations.length - 1) {
  //       setGhostRotation(rotations[index + 1]);
  //     } else {
  //       setGhostRotation(rotations[0]);
  //     }
  //   }
  // }

  // useEffect(() => {
  //   document.addEventListener('keydown', keyHandler);
  //   return () => {
  //     document.removeEventListener('keydown', keyHandler);
  //   }
  //   // document.addEventListener('keyup', keyHandler);
  //   // return () => {
  //   //   document.removeEventListener('keyup', keyHandler);
  //   // }
  // }, [currentType, ghostRotation]);

  return (
    <group>
      {blocks.map((p, i) => <Block 
        key={i} 
        position={p.position}
        rotation={p.rotation}
        type={p.type}
      />)}
      <Suspense>
        <GhostBlock />
      </Suspense>
    </group>
  );
}

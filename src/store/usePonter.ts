import { Euler, Vector3 } from "three";
import { create } from "zustand";

type Pointer = {
  position: Vector3;
  rotation: Euler;
  type: 'Cube' | 'Triangle';
}

export type Rotations = '0' | '90' | '180' | '270';

interface PointersState {
  pointers: Pointer[];
  setPointers: (p: Pointer) => void;
  ghostPosition: Vector3;
  setGhostPosition: (v: Vector3) => void;
  ghostRotation: Rotations;
  setGhostRotation: (v: Rotations) => void;
  isGhost: boolean;
  setIsGhost: (v: boolean) => void;
  currentType: 'Cube' | 'Triangle';
  setCurrentType: (t: 'Cube' | 'Triangle') => void;
}

export const usePointer = create<PointersState>()(set => ({
  pointers: [
    // {
    //   position: new Vector3(1.25 * 2 + 1.25, 1.25, -1.25 * 2 -1.25),
    //   rotation: new Euler().setFromVector3(new Vector3()),
    //   type: 'Triangle'
    // },
    // {
    //   position: new Vector3(1.25 * 0 + 1.25, -1.25, -1.25 * 0 -1.25),
    //   rotation: new Euler().setFromVector3(new Vector3()),
    //   type: 'Cube'
    // },
  ],
  setPointers: p => set(state => ({pointers: [...state.pointers, p]})),
  ghostPosition: new Vector3(),
  setGhostPosition: v => set(() => ({ghostPosition: v})),
  ghostRotation: '0',
  setGhostRotation: v => set(() => ({ghostRotation: v})),
  isGhost: false,
  setIsGhost: (v) => set(() => ({isGhost: v})),
  currentType: 'Cube',
  setCurrentType: t => set(() => ({currentType: t})),
}));
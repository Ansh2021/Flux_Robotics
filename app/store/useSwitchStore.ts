import { create } from "zustand";

//This isn't my code.
//I'm too dumb to figure this out by myself.

// 1. Define the TypeScript blueprint for our state
interface SwitchState {
  isToggled: boolean;
  setIsToggled: (value: boolean) => void;
}

// 2. Create the store hook
export const useSwitchStore = create<SwitchState>((set) => ({
  isToggled: true, // Default initial value
  setIsToggled: (value) => set({ isToggled: value }), // Action to update it
}));

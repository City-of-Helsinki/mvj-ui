import type { RootState } from "@/root/types";
import { createStore } from "redux";
import rootReducer from "@/root/rootReducer";
export const getTestRootState = (
  overrides: Partial<RootState> = {},
): RootState => {
  const rootState = createStore(rootReducer);
  return { ...rootState.getState(), ...overrides };
};

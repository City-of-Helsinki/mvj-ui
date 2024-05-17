import type { Selector } from "src/types";
import type { RootState } from "src/root/types";
import type { LessorList } from "./types";
export const getLessorList: Selector<LessorList, void> = (state: RootState): LessorList => state.lessor.list;
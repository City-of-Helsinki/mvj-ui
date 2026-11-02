import type { Selector } from "@/types";
import type { ApiError } from "@/api/types";
export const getError: Selector<ApiError, void> = (state) => state.api.error;

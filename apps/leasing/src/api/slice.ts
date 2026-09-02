import { createSlice, type PayloadAction } from "@reduxjs/toolkit";
import type { ApiState } from "./types";
import type { ApiError } from "./types";

export const initialState: ApiState = {
  error: null,
};

const apiSlice = createSlice({
  name: "mvj/api",
  initialState,
  reducers: {
    receiveError: (state, { payload: error }: PayloadAction<ApiError>) => {
      state.error = error;
    },
    clearError: (state) => {
      state.error = null;
    },
  },
});

export const { receiveError, clearError } = apiSlice.actions;
export default apiSlice.reducer;

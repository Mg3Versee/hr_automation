/* eslint-disable @typescript-eslint/no-explicit-any */
import { createSlice } from "@reduxjs/toolkit";
import { runFullPipelineThunk } from "../thunk/pipelineThunk";

type PipelineState = {
  loading: boolean;
  error: string | null;
  lastResult: any | null;
};

const initialState: PipelineState = {
  loading: false,
  error: null,
  lastResult: null,
};

const pipelineSlice = createSlice({
  name: "pipeline",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(runFullPipelineThunk.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(runFullPipelineThunk.fulfilled, (state, { payload }) => {
        state.loading = false;
        state.lastResult = payload;
      })
      .addCase(runFullPipelineThunk.rejected, (state, { payload }) => {
        state.loading = false;
        state.error = (payload as string) ?? "Pipeline failed";
      });
  },
});

export default pipelineSlice.reducer;

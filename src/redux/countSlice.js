import { createSlice } from "@reduxjs/toolkit";

const countSlice = createSlice({
  name: "count",
  initialState: {
    state: {
      isLoading: false,
      countMessages: null,
      countEnAttent: null,
      countDuJour: null,
      terminerToday: null,
      cycleEnRetard: null,
    },
  },
  reducers: {
    setCountMessages(state, action) {
      state.countMessages = action.payload;
    },
    setCountEnAttent(state, action) {
      state.countEnAttent = action.payload;
    },
    setCountCycleEnAttent(state, action) {
      state.cycleEnRetard = action.payload;
    },
    setCountDuJour(state, action) {
      state.countDuJour = action.payload;
    },
    setTerminerToday(state, action) {
      state.terminerToday = action.payload;
    },
    setLoading(state) {
      state.isLoading = true;
    },
    clearLoading(state) {
      state.isLoading = false;
    },
  },
});

const countReducer = countSlice.reducer;
const countActions = countSlice.actions;

export { countActions, countReducer };

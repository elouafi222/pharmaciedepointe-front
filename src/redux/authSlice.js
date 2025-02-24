import { createSlice } from "@reduxjs/toolkit";
const authSlice = createSlice({
  name: "auth",
  initialState: {
    user: localStorage.getItem("pharmacie_de_la_ponite")
      ? JSON.parse(localStorage.getItem("pharmacie_de_la_ponite"))
      : null,
    loginError: null,
  },
  reducers: {
    login(state, action) {
      state.user = action.payload;
    },
    loginFailed(state, action) {
      state.loginError = action.payload;
    },
    logout(state) {
      state.user = null;
    },
  },
});
const authReducer = authSlice.reducer;
const authActions = authSlice.actions;
export { authActions, authReducer };

import { configureStore } from "@reduxjs/toolkit";
import { authReducer } from "./authSlice";
import { countReducer } from "./countSlice";

const store = configureStore({
  reducer: {
    auth: authReducer,
    count: countReducer,
  },
});

export default store;

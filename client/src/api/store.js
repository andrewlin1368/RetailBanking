import { configureStore } from "@reduxjs/toolkit";
import userSliceReducer from "./userSlice";
import api from "./api";

export const store = configureStore({
  reducer: { user: userSliceReducer, [api.reducerPath]: api.reducer },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(api.middleware),
});

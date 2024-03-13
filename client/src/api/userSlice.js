import { createSlice } from "@reduxjs/toolkit";
import { userApi } from "./userApi";

const setUser = (state, { payload }) => {
  state.user = payload.user;
  state.token = payload.token;
  state.accounts = payload.accounts;
  window.sessionStorage.setItem(
    "USER",
    JSON.stringify({
      user: payload.user,
      token: payload.token,
      accounts: payload.accounts,
    })
  );
  state.error = null;
};

const userSlice = createSlice({
  name: "userSlice",
  initialState: {
    user: window.sessionStorage.getItem("USER")
      ? JSON.parse(window.sessionStorage.getItem("USER")).user
      : null,
    token: window.sessionStorage.getItem("USER")
      ? JSON.parse(window.sessionStorage.getItem("USER")).token
      : null,
    accounts: window.sessionStorage.getItem("USER")
      ? JSON.parse(window.sessionStorage.getItem("USER")).accounts
      : [],
    error: null,
  },
  reducers: {
    logoutUser: (state) => {
      state.user = null;
      state.token = null;
      state.accounts = [];
      window.sessionStorage.removeItem("USER");
    },
  },
  extraReducers: (builder) => {
    builder.addMatcher(userApi.endpoints.login.matchFulfilled, setUser);
    builder.addMatcher(userApi.endpoints.register.matchFulfilled, setUser);
  },
});

export const { logoutUser } = userSlice.actions;
export default userSlice.reducer;

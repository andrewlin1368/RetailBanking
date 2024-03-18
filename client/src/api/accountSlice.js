import { accountApi } from "./accountApi";
import { createSlice } from "@reduxjs/toolkit";

const accountSlice = createSlice({
  name: "accountSlice",
  initialState: {
    user: null,
    accounts: [],
  },
  // extraReducers: (builder) => {
  //   builder.addMatcher(
  //     accountApi.endpoints.userInfo.matchFulfilled,
  //     (state, { payload }) => {
  //       state.user = payload.user;
  //       state.accounts = payload.accounts;
  //     }
  //   );
  // },
});

export default accountSlice.reducer;

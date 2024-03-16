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

const setAccount = (state, { payload }) => {
  const data = JSON.parse(window.sessionStorage.getItem("USER"));
  state.accounts = state.accounts.map((account) => {
    if (account.account_id === payload.account.account_id) {
      const transactions = account.transactions;
      transactions.unshift(payload.transaction);
      return { ...payload.account, transactions };
    } else return account;
  });
  data.accounts = state.accounts;
  window.sessionStorage.setItem("USER", JSON.stringify(data));
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
    builder.addMatcher(
      userApi.endpoints.addAccount.matchFulfilled,
      (state, { payload }) => {
        const accounts = Object.assign([], state.accounts);
        const account = { ...payload.account, transactions: [] };
        accounts.push(account);
        state.accounts = accounts;
        const data = JSON.parse(window.sessionStorage.getItem("USER"));
        data.accounts.push(account);
        window.sessionStorage.setItem("USER", JSON.stringify(data));
      }
    );
    builder.addMatcher(
      userApi.endpoints.editUser.matchFulfilled,
      (state, { payload }) => {
        state.user = payload.user;
        const data = JSON.parse(window.sessionStorage.getItem("USER"));
        data.user = payload.user;
        window.sessionStorage.setItem("USER", JSON.stringify(data));
      }
    );
    builder.addMatcher(userApi.endpoints.deposit.matchFulfilled, setAccount);
    builder.addMatcher(userApi.endpoints.withdrawal.matchFulfilled, setAccount);
    builder.addMatcher(
      userApi.endpoints.transfer.matchFulfilled,
      (state, { payload }) => {
        const data = JSON.parse(window.sessionStorage.getItem("USER"));
        state.accounts = state.accounts.map((account) => {
          if (account.account_id === payload.account.account_id) {
            const transactions = account.transactions;
            transactions.unshift(payload.transaction);
            return { ...payload.account, transactions };
          } else if (
            payload.to_account &&
            payload.to_account.account_id === account.account_id
          ) {
            const transactions = account.transactions;
            transactions.unshift(payload.to_transaction);
            return { ...payload.to_account, transactions };
          } else return account;
        });
        data.accounts = state.accounts;
        window.sessionStorage.setItem("USER", JSON.stringify(data));
      }
    );
  },
});

export const { logoutUser } = userSlice.actions;
export default userSlice.reducer;

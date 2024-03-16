import api from "./api";

export const userApi = api.injectEndpoints({
  endpoints: (builder) => ({
    login: builder.mutation({
      query: ({ username, password }) => ({
        url: "user/login",
        method: "POST",
        body: { username, password },
      }),
    }),
    register: builder.mutation({
      query: (body) => ({
        url: "user/register",
        method: "POST",
        body: body,
      }),
    }),
    addAccount: builder.mutation({
      query: (type) => ({
        url: "account/add",
        method: "POST",
        body: { type },
      }),
    }),
    editUser: builder.mutation({
      query: (body) => ({
        url: "user/edit",
        method: "PUT",
        body: body,
      }),
    }),
    deposit: builder.mutation({
      query: (body) => ({
        url: "account/deposit",
        method: "PUT",
        body: body,
      }),
    }),
    withdrawal: builder.mutation({
      query: (body) => ({
        url: "account/withdrawal",
        method: "PUT",
        body: body,
      }),
    }),
    transfer: builder.mutation({
      query: (body) => ({
        url: "account/transfer",
        method: "PUT",
        body: body,
      }),
    }),
  }),
});

export const {
  useLoginMutation,
  useRegisterMutation,
  useAddAccountMutation,
  useEditUserMutation,
  useDepositMutation,
  useWithdrawalMutation,
  useTransferMutation,
} = userApi;

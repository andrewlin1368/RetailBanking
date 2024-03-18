import api from "./api";

export const accountApi = api.injectEndpoints({
  endpoints: (builder) => ({
    userInfo: builder.mutation({
      query: (account_id) => ({
        url: "user/get",
        method: "POST",
        body: { account_id },
      }),
    }),
  }),
});

export const { useUserInfoMutation } = accountApi;

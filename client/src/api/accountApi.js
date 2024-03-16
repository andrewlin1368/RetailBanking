import api from "./api";

export const accountApi = api.injectEndpoints({
  endpoints: (builder) => ({
    userInfo: builder.mutation({
      query: (username) => ({
        url: "user/get",
        method: "POST",
        body: { username },
      }),
    }),
  }),
});

export const { useUserInfoMutation } = accountApi;

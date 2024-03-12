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
  }),
});

export const { useLoginMutation, useRegisterMutation } = userApi;

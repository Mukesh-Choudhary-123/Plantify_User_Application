import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { IP, SERVER } from "../../constant";

export const authApi = createApi({
  reducerPath: "authApi",
  baseQuery: fetchBaseQuery({
    baseUrl: `${SERVER}/user`,
    prepareHeaders: (headers) => {
      headers.set("ngrok-skip-browser-warning", "true");
      return headers;
    },
  }),
  endpoints: (builder) => ({
    login: builder.mutation({
      query: ({ email, password }) => ({
        url: "/login",
        method: "POST",
        body: { email, password },
      }),
    }),
    signup: builder.mutation({
      query: (credential) => ({
        url: "/signup",
        method: "POST",
        body: credential,
      }),
    }),
    userUpdate: builder.mutation({
      query: ({ id, address }) => ({
        url: `/${id}`,
        method: "PUT",
        body: { address },
      }),
    }),
    logout: builder.mutation({
      query: (credential) => ({
        url: "/logout",
        method: "POST",
        body: credential,
      }),
    }),
  }),
});

export const {
  useLoginMutation,
  useSignupMutation,
  useLogoutMutation,
  useUserUpdateMutation,
} = authApi;

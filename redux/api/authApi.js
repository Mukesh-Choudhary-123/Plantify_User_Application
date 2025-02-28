import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export const authApi = createApi({
  reducerPath: "authApi",
  baseQuery: fetchBaseQuery({
    baseUrl: "http://193.168.0.195:8000/api/v1/",
  }),
  endpoints: (builder) => ({
    login: builder.mutation({
      query: (credential) => ({
        url: "login",
        method: "POST",
        body: credential,
      }),
    }),
    signup: builder.mutation({
      query: (credential) => ({
        url: "signup",
        method: "POST",
        body:credential
      })
    }),
    logout: builder.mutation({
      query: (credential) => ({
        url: "logout",
        method: "POST",
        body:credential
      })
    })
  }),
});

// Export hooks for usage in functional components
export const { useLoginMutation, useSignupMutation ,useLogoutMutation } = authApi;

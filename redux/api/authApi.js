import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { IP } from "../../constant"; 

export const authApi = createApi({
  reducerPath: "authApi",
  baseQuery: fetchBaseQuery({
    baseUrl: `http://${IP}:8080/api/v1/user/`,
  }),
  endpoints: (builder) => ({
    login: builder.mutation({
      query: ({email , password}) => ({
        url: "login",
        method: "POST",
        body: {email , password},
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

export const { useLoginMutation, useSignupMutation ,useLogoutMutation } = authApi;

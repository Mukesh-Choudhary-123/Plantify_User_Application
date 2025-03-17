import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { IP } from "../../constant"; 

export const orderApi = createApi({
  reducerPath: "orderApi",
  baseQuery: fetchBaseQuery({
    baseUrl: `http://${IP}:8080/api/v1/`,
  }),
  endpoints: (builder) => ({
    getOrder: builder.query({
      query: () => "order/",
    }),
    createOrder: builder.mutation({
      query: (data) => ({
        url: "order/",
        method: "POST",
        body: data,
      }),
    }),
  }),
});

export const { useCreateOrderMutation, useGetOrderQuery } = orderApi;

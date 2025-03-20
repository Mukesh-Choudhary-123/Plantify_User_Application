import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { IP } from "../../constant"; 
import { cartApi } from "./cartApi"; 

export const orderApi = createApi({
  reducerPath: "orderApi",
  baseQuery: fetchBaseQuery({
    baseUrl: `http://${IP}:8080/api/v1/order`,
  }),
  endpoints: (builder) => ({
    getOrder: builder.query({
      query: (userId) => `/${userId}`,
    }),
    createOrder: builder.mutation({
      query: ({ id, items, shippingAddress }) => ({
        url: `/${id}`,
        method: "POST",
        body: { items, shippingAddress },
      }),
      async onQueryStarted({ id }, { dispatch, queryFulfilled }) {
        try {
          await queryFulfilled;
          dispatch(cartApi.util.invalidateTags([{ type: "Cart", id }]));
        } catch (error) {
          console.error("Order creation failed:", error);
        }
      },
    }),
  }),
});

export const { useCreateOrderMutation, useGetOrderQuery } = orderApi;



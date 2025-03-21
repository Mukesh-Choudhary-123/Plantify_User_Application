import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { IP } from "../../constant"; 
import { cartApi } from "./cartApi"; 

export const orderApi = createApi({
  reducerPath: "orderApi",
  baseQuery: fetchBaseQuery({
    baseUrl: `http://${IP}:8080/api/v1/order`,
  }),
  tagTypes: ["Order"],
  endpoints: (builder) => ({
    getOrder: builder.query({
      query: (userId) => `/${userId}`,
      // Tag this query with the userId so that when a mutation invalidates that tag, it will refetch.
      providesTags: (result, error, userId) => [{ type: "Order", id: userId }],
    }),
    createOrder: builder.mutation({
      query: ({ id, items, shippingAddress }) => ({
        url: `/${id}`,
        method: "POST",
        body: { items, shippingAddress },
      }),
      // Invalidate the Order tag for the given user id to trigger refetch in getOrder.
      invalidatesTags: (result, error, { id }) => [{ type: "Order", id }],
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

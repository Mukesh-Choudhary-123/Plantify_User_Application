import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { IP } from "../../constant"; 

export const cartApi = createApi({
  reducerPath: "cartApi",
  baseQuery: fetchBaseQuery({
    baseUrl: `http://${IP}:8080/api/v1/cart`,
  }),
  endpoints: (builder) => ({
    getCart: builder.query({
      query: () => "cart/",
    }),
    addToCart: builder.mutation({
      query: (data) => ({
        url: "cart/",
        method: "POST",
        body: data,
      }),
    }),
    removeFromCart: builder.mutation({
      query: (data) => ({
        url: "cart/",
        method: "DELETE",
        body: data,
      }),
    }),
    updateToCart: builder.mutation({
      query: (data) => ({
        url: "cart/",
        method: "PUT",
        body: data,
      }),
    }),
  }),
});

export const {
  useAddToCartMutation,
  useGetCartQuery,
  useRemoveFromCartMutation,
  useUpdateToCartMutation,
} = cartApi;

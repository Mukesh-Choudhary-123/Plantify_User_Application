import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { IP } from "../../constant"; 

export const wishlistApi = createApi({
  reducerPath: "wishlistApi",
  baseQuery: fetchBaseQuery({
    baseUrl: `http://${IP}:8080/api/v1/wishlist`,
  }),
  endpoints: (builder) => ({
    getWishlist: builder.query({
      query: (id) => `/${id}`,
    }),
    addToWishlist: builder.mutation({
      query: ({ id, productId }) => ({
        url: `/${id}`,
        method: "POST",
        body: {productId},
      }),
    }),
    removeFromWishlist: builder.mutation({
      query: (data) => ({
        url: "/",
        method: "DELETE",
        body: data,
      }),
    }),
  }),
});

export const {
  useAddToWishlistMutation,
  useGetWishlistQuery,
  useRemoveFromWishlistMutation,
} = wishlistApi;

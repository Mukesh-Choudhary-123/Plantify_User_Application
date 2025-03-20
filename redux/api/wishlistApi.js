import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { IP } from "../../constant"; 

export const wishlistApi = createApi({
  reducerPath: "wishlistApi",
  baseQuery: fetchBaseQuery({
    baseUrl: `http://${IP}:8080/api/v1/wishlist`,
  }),
  tagTypes: ["Wishlist"],
  endpoints: (builder) => ({
    getWishlist: builder.query({
      query: (id) => `/${id}`,
      providesTags: (result, error, id) => [{ type: "Wishlist", id }],
    }),
    addToWishlist: builder.mutation({
      query: ({ id, productId }) => ({
        url: `/${id}`,
        method: "POST",
        body: { productId },
      }),
      invalidatesTags: (result, error, { id }) => [{ type: "Wishlist", id }],
    }),
    removeFromWishlist: builder.mutation({
      query: ({ id, productId }) => ({
        url: `/${id}`,
        method: "DELETE",
        body: { productId },
      }),
      invalidatesTags: (result, error, { id }) => [{ type: "Wishlist", id }],
    }),
  }),
});

export const {
  useAddToWishlistMutation,
  useGetWishlistQuery,
  useRemoveFromWishlistMutation,
} = wishlistApi;

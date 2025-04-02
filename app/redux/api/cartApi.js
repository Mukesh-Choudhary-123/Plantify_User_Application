import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { IP, SERVER } from "../../../constant";


export const cartApi = createApi({
  reducerPath: "cartApi",
  baseQuery: fetchBaseQuery({
    baseUrl: `${SERVER}/cart`,
        prepareHeaders: (headers) => {
          headers.set("ngrok-skip-browser-warning", "true");
          return headers;
        },
  }),
  tagTypes: ["Cart"],
  endpoints: (builder) => ({
    getCart: builder.query({
      query: (id) => `/${id}`,
      providesTags: (result, error, id) => [{ type: "Cart", id }],
    }),
    addToCart: builder.mutation({
      query: ({ id, productId }) => ({
        url: `/${id}`,
        method: "POST",
        body: { productId },
      }),
      invalidatesTags: (result, error, { id }) => [{ type: "Cart", id }],
    }),
    removeFromCart: builder.mutation({
      query: ({ id, productId }) => ({
        url: `/${id}`,
        method: "DELETE",
        body: { productId },
      }),
      invalidatesTags: (result, error, { id }) => [{ type: "Cart", id }],
    }),
    updateToCart: builder.mutation({
      query: ({ id, productId, action }) => ({
        url: `/${id}`,
        method: "PUT",
        body: { productId, action },
      }),
      invalidatesTags: (result, error, { id }) => [{ type: "Cart", id }],
    }),
  }),
});

export const {
  useAddToCartMutation,
  useGetCartQuery,
  useRemoveFromCartMutation,
  useUpdateToCartMutation,
} = cartApi;

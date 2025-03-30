import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { IP, SERVER } from "../../constant"; 

export const productApi = createApi({
  reducerPath: "productApi",
  baseQuery: fetchBaseQuery({
    baseUrl: `${SERVER}/product`,
        prepareHeaders: (headers) => {
          headers.set("ngrok-skip-browser-warning", "true");
          return headers;
        },
  }),
  endpoints: (builder) => ({
    getProducts: builder.query({
      query: ({ page, limit, search = "", category = "" }) => {
        let queryStr = `/?page=${page}&limit=${limit}`;
        if (search) {
          queryStr += `&search=${encodeURIComponent(search)}`;
        }
        if (category) {
          queryStr += `&category=${encodeURIComponent(category)}`;
        }
        return queryStr;
      },
    }),
    productDetails: builder.query({
      query: (id) => `/${id}`,
    }),
    getProductsByCategory: builder.query({
      query: (category ) => ({
        url: `/category?category=${encodeURIComponent(category)}`,
        method: "GET",
      }),
    })
    
  }),
});

export const { useGetProductsQuery, useProductDetailsQuery ,useGetProductsByCategoryQuery} = productApi;

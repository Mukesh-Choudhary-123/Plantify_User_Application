import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { IP } from "../../constant"; 

export const productApi = createApi({
  reducerPath: "productApi",
  baseQuery: fetchBaseQuery({
    baseUrl: `http://${IP}:8080/api/v1/product`,
  }),
  endpoints: (builder) => ({
    getProducts: builder.query({
      // Accept pagination and filter params: { page, limit, search, category }
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
  }),
});

export const { useGetProductsQuery, useProductDetailsQuery } = productApi;

import { configureStore } from "@reduxjs/toolkit";
import { authApi } from "./api/authApi";
import { productApi } from "./api/productApi";
import { wishlistApi } from "./api/wishlistApi";
import authReducer from "./slices/authSlice";
import productReducer from "./slices/productSlice";
import { setupListeners } from "@reduxjs/toolkit/query";

export const store = configureStore({
  reducer: {
    auth: authReducer,
    product: productReducer,
    [authApi.reducerPath]: authApi.reducer,
    [productApi.reducerPath]: productApi.reducer,
    [wishlistApi.reducerPath]: wishlistApi.reducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(authApi.middleware, productApi.middleware ,wishlistApi.middleware),
});

setupListeners(store.dispatch);

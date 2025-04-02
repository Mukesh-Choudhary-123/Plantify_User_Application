import { configureStore } from "@reduxjs/toolkit";
import { authApi } from "./api/authApi";
import { productApi } from "./api/productApi";
import { wishlistApi } from "./api/wishlistApi";
import { cartApi } from "./api/cartApi";
import { orderApi } from "./api/orderApi";
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
    [cartApi.reducerPath]: cartApi.reducer,
    [orderApi.reducerPath]: orderApi.reducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(
      authApi.middleware,
      productApi.middleware,
      wishlistApi.middleware,
      cartApi.middleware,
      orderApi.middleware,
    ),
});

setupListeners(store.dispatch);

import { configureStore } from "@reduxjs/toolkit";
import { authApi } from "./api/authApi"
import { productApi } from "./api/productApi";
import rootReducer from "./reducers"; 
import { setupListeners } from "@reduxjs/toolkit/query";

export const store = configureStore({
  reducer: {
    ...rootReducer, 
    [authApi.reducerPath]: authApi.reducer,
    [productApi.reducerPath]: productApi.reducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(authApi.middleware, productApi.middleware),
});

setupListeners(store.dispatch);

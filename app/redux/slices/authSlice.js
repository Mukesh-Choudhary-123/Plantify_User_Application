import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  isAuthenticated: false,
  user: null,
  token: null,
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setCredentials: (state, action) => {
      const { user, token } = action.payload;
      state.isAuthenticated = true;
      state.user = user;
      state.token = token;
    },
    setAddress: (state, action) => {
      const { address } = action.payload;
      if (state.user) {
        state.user.address = address;
      }
    },
    setCart: (state, action) => {
      const { cart } = action.payload;
      if (state.user) {
        state.user.cart = cart;
      }
    },
    setWishlist: (state, action) => {
      const { wishlist } = action.payload;
      if (state.user) {
        state.user.wishlist = wishlist;
      }
    },
    logout: (state) => {
      state.isAuthenticated = false;
      state.user = null;
      state.token = null;
    },
  },
});

export const { setCredentials, setAddress, setCart, setWishlist, logout } =
  authSlice.actions;

export default authSlice.reducer;

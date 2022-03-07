import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  cartItems: [],
};


export const cartSlice = createSlice({
  name: "items",
  initialState,
  reducers: {
    // Add item to the state:
    addItem: (state, { payload }) => {
      const item = state.cartItems.find((i) => i.id === payload.id);
      if (item) {
        item.requested_quantity += payload.requested_quantity;
      } else {
        state.cartItems.push(payload);
      }
    },
    // if state -- 1 > 0, then deduct, else slice item from array:
    delItem: (state, { payload }) => {
      const item = state.cartItems.find((i) => i.id === payload.id);
      if (item && (item.requested_quantity - 1) > 0) {
        item.requested_quantity -= 1;
      } else {
        state.cartItems.splice(
          state.cartItems.findIndex((i) => i.id === payload.id),
          1);
      }
    },
    // handles free number input and sets qty, if === 0, slice it...:
    setQty: (state, { payload }) => {
      const item = state.cartItems.find((i) => i.id === payload.id);
      if (item && payload.requested_quantity > 0) {
        item.requested_quantity = payload.requested_quantity;
      } else if (payload.requested_quantity === 0) {
        state.cartItems.splice(
          state.cartItems.findIndex((i) => i.id === payload.id),
          1);
      }
    },
    resetCart: () => initialState,
  },
});

// Action creators are generated for each case reducer function
export const { addItem, delItem, setQty, resetCart } = cartSlice.actions;
export const selectItems = state => state.items.cartItems;
export default cartSlice.reducer;

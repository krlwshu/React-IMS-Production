import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  cartItems: [],
};
export const cartSlice = createSlice({
  name: "items",
  initialState,
  reducers: {
    addItem: (state, action) => {
      state.cartItems.map(item => {
        console.log(item.id)
        console.log(action.payload)

      })





    },
  },
});

// Action creators are generated for each case reducer function
export const { addItem } = cartSlice.actions;
export const selectItems = state => state.items.cartItems;
export default cartSlice.reducer;

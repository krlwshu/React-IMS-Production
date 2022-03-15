import { createSlice } from "@reduxjs/toolkit";

// null content required else it throws a wobbly before content is initialised!
const initialState = {
  user: { content: ['NULL'], auth: false },
};

// User reducer - upon successful login, authVerify (useToken.js) dispatches setUser
export const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    // Add item to the state:
    setUser: (state, { payload }) => {
      state.user = payload;
    },
    setAuth: (state, { payload }) => {
      state.user.auth = payload;
    },


  },
});

// Action creators are generated for each case reducer function
export const { setUser, setAuth } = userSlice.actions;
export const user = state => state.user.user;
export default userSlice.reducer;

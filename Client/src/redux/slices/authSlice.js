import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  user: localStorage.getItem("userInfo")
    ? JSON.parse(localStorage.getItem("userInfo"))
    : null,
  isSidebarOpen: false,
  users: [], // Add a users array to manage the list of users
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setCredentials: (state, action) => {
      state.user = action.payload;
      localStorage.setItem("userInfo", JSON.stringify(action.payload));
    },
    logout: (state) => {
      state.user = null;
      localStorage.removeItem("userInfo");
    },
    setOpenSidebar: (state, action) => {
      state.isSidebarOpen = action.payload;
    },
    setUsers: (state, action) => {
      state.users = action.payload;
    },
    updateUserInList: (state, action) => {
      const index = state.users.findIndex(user => user._id === action.payload._id);
      if (index !== -1) {
        state.users[index] = action.payload;
      }
    },
    addUserToList: (state, action) => {
      state.users.push(action.payload);
    },
  },
});

export const { setCredentials, logout, setOpenSidebar, setUsers, updateUserInList, addUserToList } = authSlice.actions;

export default authSlice.reducer;
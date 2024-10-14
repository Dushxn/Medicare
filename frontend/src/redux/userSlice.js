// src/store/userSlice.js
import { createSlice } from '@reduxjs/toolkit';

// Helper functions to manage localStorage
const saveUserToLocalStorage = (userInfo) => {
  localStorage.setItem('userInfo', JSON.stringify(userInfo));
};

const removeUserFromLocalStorage = () => {
  localStorage.removeItem('userInfo');
};

const getUserFromLocalStorage = () => {
  const userInfo = localStorage.getItem('userInfo');
  return userInfo ? JSON.parse(userInfo) : null;
};

const initialState = {
  userInfo: getUserFromLocalStorage(),
  isAuthenticated: !!getUserFromLocalStorage(),
};

const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    login: (state, action) => {
      state.userInfo = action.payload;
      state.isAuthenticated = true;
      saveUserToLocalStorage(action.payload);
    },
    logout: (state) => {
      state.userInfo = null;
      state.isAuthenticated = false;
      removeUserFromLocalStorage();
    },
  },
});

export const { login, logout } = userSlice.actions;

export default userSlice.reducer;

import { createSlice } from '@reduxjs/toolkit';
import axios from 'axios';

const initialState = {
  token: localStorage.getItem('token') || null,
  error: null,
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    loginSuccess: (state, action) => {
      state.token = action.payload;
      state.error = null;
      localStorage.setItem('token', action.payload);
    },
    loginFailure: (state, action) => {
      state.error = action.payload;
    },
    logout: (state) => {
      state.token = null;
      localStorage.removeItem('token');
    },
  },
});

export const { loginSuccess, loginFailure, logout } = authSlice.actions;

export const login = (credentials) => async (dispatch) => {
  try {
    const response = await axios.post('/api/login', credentials);
    dispatch(loginSuccess(response.data.access_token));
  } catch (error) {
    dispatch(loginFailure('Invalid credentials'));
  }
};

export default authSlice.reducer;

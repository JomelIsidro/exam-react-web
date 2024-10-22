import { configureStore } from '@reduxjs/toolkit';
import authReducer from './authSlice';
import geoReducer from './geoSlice';

const store = configureStore({
  reducer: {
    auth: authReducer,
    geo: geoReducer,
  },
});

export default store;

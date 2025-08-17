// src/store.js
import { configureStore } from '@reduxjs/toolkit';
import authReducer from './store/slices/authSlice'; // путь корректный, если файл находится в src/store/authSlices.js

const store = configureStore({
  reducer: {
    auth: authReducer,
  },
});

export default store;

import { configureStore } from '@reduxjs/toolkit';
import modalReducer from './slices/modalSlice';
import authReducer from './slices/authSlice';
import loadingReducer from './slices/loadingSlice';

const store = configureStore({
  reducer: {
    modal: modalReducer,
    auth: authReducer,
    loading: loadingReducer,
  },
});

export default store;

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

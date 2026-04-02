import storage from 'redux-persist/lib/storage';
import { createSlice } from '@reduxjs/toolkit';
import { RootState } from '@/store';

const initialState = {
  user: {
    name: '',
    id: 0,
    email: '',
    level: 0,
  },
  theme: 'light',
};

export const metaSlice = createSlice({
  name: 'meta',
  initialState: initialState,
  reducers: {
    setTheme: (state, action) => {
      state.theme = action.payload;
    },
    setUser: (state, action) => {
      state.user = action.payload;
    },
    deleteUser: (state) => {
      state.user = { ...initialState.user };
    }
  }
});

export const selectTheme = (state: RootState) => state.meta.theme;
export const selectUser = (state: RootState) => state.meta.user;

export const { setTheme, setUser, deleteUser } = metaSlice.actions;

export const persistMetaConfig = {
  key: 'meta',
  storage,
  version: 1,
};

export default metaSlice.reducer;
import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  id: '',
  role: '',
  groups: [],
  subscriptions: [],
  isLoaded: false
};

const sessionSlice = createSlice({
  name: 'session',
  initialState,
  reducers: {
    setSession(state, action) {
      const {
        id,
        role,
        groups,
        subscriptions
      } = action.payload;
      state.id = id;
      state.role = role;
      state.groups = groups;
      state.subscriptions = subscriptions;
      state.isLoaded = true;
    },
    clearSession(state) {
      return initialState;
    },
    updateSessionField(state, action) {
      const payload = action.payload;
      const updatedState = { ...state };

      Object.keys(payload).forEach((key) => {
        if (key in state) {
          updatedState[key] = payload[key];
        }
      });

      return updatedState;
    },
  },
});

export const {
  setSession,
  clearSession,
  updateSessionField
} = sessionSlice.actions;

export default sessionSlice.reducer;

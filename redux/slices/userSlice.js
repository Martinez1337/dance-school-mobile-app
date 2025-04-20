import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  id: '',
  first_name: '',
  middle_name: '',
  last_name: '',
  email: '',
  phone_number: '',
  description: ''
};

const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    setUser(state, action) {
      const {
        id,
        first_name,
        middle_name,
        last_name,
        email,
        phone_number,
        description
      } = action.payload;
      state.id = id;
      state.first_name = first_name;
      state.middle_name = middle_name;
      state.last_name = last_name;
      state.email = email;
      state.phone_number = phone_number;
      state.description = description;
    },
    clearUser(state) {
      return initialState;
    },
    updateUserField(state, action) {
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
  setUser,
  clearUser,
  updateUserField
} = userSlice.actions;

export default userSlice.reducer;

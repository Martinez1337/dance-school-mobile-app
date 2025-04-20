import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  id: '',
  name: '',
  description: ''
};

const levelSlice = createSlice({
  name: 'level',
  initialState,
  reducers: {
    setLevel(state, action) {
      const {
        id,
        name,
        description,
      } = action.payload;
      state.id = id;
      state.name = name;
      state.description = description;
    },
    clearLevel(state) {
      return initialState;
    },
    updateLevelField(state, action) {
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
  setLevel,
  clearLevel,
  updateLevelField
} = levelSlice.actions;

export default levelSlice.reducer;

// src/features/categories/categorySlice.js
import { createSlice } from "@reduxjs/toolkit";

const categorySlice = createSlice({
  name: "categories",
  initialState: [], // The state is an array of categories
  reducers: {
    addCategory: (state, action) => {
      state.push(action.payload); // Add a new category
    },
    removeCategory: (state, action) => {
      return state.filter((category) => category.id !== action.payload); // Remove by ID
    },
    updateCategory: (state, action) => {
      const index = state.findIndex(
        (category) => category.id === action.payload.id
      );
      if (index !== -1) {
        state[index] = action.payload; // Update category
      }
    },
    setCategories: (state, action) => {
      return action.payload; // Initialize the categories state
    },
  },
});

// Export actions and reducer
export const { addCategory, removeCategory, updateCategory, setCategories } =
  categorySlice.actions;
export default categorySlice.reducer;

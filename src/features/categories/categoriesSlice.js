import { createSlice } from "@reduxjs/toolkit";
import { persistReducer } from "redux-persist";
import storage from "redux-persist/lib/storage"; // defaults to localStorage for web

const initialState = []; // The state is an array of categories

const categoriesSlice = createSlice({
  name: "categories",
  initialState,
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
  categoriesSlice.actions;

const persistConfig = {
  key: "categories",
  storage,
};

const persistedCategoriesReducer = persistReducer(
  persistConfig,
  categoriesSlice.reducer
);

export default persistedCategoriesReducer;

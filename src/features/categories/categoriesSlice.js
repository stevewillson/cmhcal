import { createSlice } from "@reduxjs/toolkit";
import { persistReducer } from "redux-persist";
import storage from "redux-persist/lib/storage"; // defaults to localStorage for web

const initialState = { list: [] }; // The state is an array of categories

const categoriesSlice = createSlice({
  name: "categories",
  initialState,
  reducers: {
    addCategory: (state, action) => {
      state.list.push(action.payload); // Add a new category
    },
    removeCategory: (state, action) => {
      state.list = state.list.filter(
        (category) => category.id !== action.payload
      ); // Remove by ID
    },
    updateCategory: (state, action) => {
      const index = state.list.findIndex(
        (category) => category.id === action.payload.id
      );
      if (index !== -1) {
        state.list[index] = action.payload; // Update category
      }
    },
  },
});

// Export actions and reducer
export const { addCategory, removeCategory, updateCategory } =
  categoriesSlice.actions;

const persistConfig = {
  key: "categories",
  storage,
  whitelist: ["list"], // Only persist the list of categories
};

const persistedCategoriesReducer = persistReducer(
  persistConfig,
  categoriesSlice.reducer
);

export default persistedCategoriesReducer;

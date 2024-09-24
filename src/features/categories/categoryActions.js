// src/features/categories/categoryActions.js
import {
  addCategoryToDB,
  updateCategoryInDB,
  deleteCategoryFromDB,
  getAllCategoriesFromDB,
} from "../../app/db";
import {
  addCategory,
  removeCategory,
  updateCategory,
  setCategories,
} from "./categorySlice";

// Load categories from IndexedDB and set them in Redux store
export const loadCategoriesFromDB = async (dispatch) => {
  const categories = await getAllCategoriesFromDB();
  if (categories) {
    dispatch(setCategories(categories));
  }
};

// Add a new category
export const handleAddCategory = async (category, dispatch) => {
  // Add to Redux store
  dispatch(addCategory(category));

  // Add to IndexedDB
  await addCategoryToDB(category);
};

// Update a category
export const handleUpdateCategory = async (category, dispatch) => {
  // Update Redux store
  dispatch(updateCategory(category));

  // Update in IndexedDB
  await updateCategoryInDB(category);
};

// Remove a category
export const handleRemoveCategory = async (categoryId, dispatch) => {
  // Remove from Redux store
  dispatch(removeCategory(categoryId));

  // Remove from IndexedDB
  await deleteCategoryFromDB(categoryId);
};

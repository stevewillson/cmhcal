// src/features/organizations/organizationsSlice.js
import { createSlice } from "@reduxjs/toolkit";
import { persistReducer } from "redux-persist";
import storage from "redux-persist/lib/storage"; // defaults to localStorage for web

const initialState = []; // The state is an array of categories

const organizationsSlice = createSlice({
  name: "organizations",
  initialState, // The state is an array of organizations
  reducers: {
    addOrganization: (state, action) => {
      state.push(action.payload); // Add a new organization
    },
    removeOrganization: (state, action) => {
      return state.filter((organization) => organization.id !== action.payload); // Remove by ID
    },
    updateOrganization: (state, action) => {
      const index = state.findIndex(
        (organization) => organization.id === action.payload.id
      );
      if (index !== -1) {
        state[index] = action.payload; // Update organization fields
      }
    },
    setOrganizations: (state, action) => {
      return action.payload; // Set the organizations state with an array of organizations
    },
  },
});

// Export actions and reducer
export const {
  addOrganization,
  removeOrganization,
  updateOrganization,
  setOrganizations,
} = organizationsSlice.actions;

const persistConfig = {
  key: "organizations",
  storage,
};

const persistedOrganizationsReducer = persistReducer(
  persistConfig,
  organizationsSlice.reducer
);

export default persistedOrganizationsReducer;

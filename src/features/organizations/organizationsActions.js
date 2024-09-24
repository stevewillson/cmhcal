// src/features/organizations/organizationsActions.js
import {
  addOrganizationToDB,
  updateOrganizationInDB,
  deleteOrganizationFromDB,
  getAllOrganizationsFromDB,
} from "../../app/db"; // Import IndexedDB functions
import {
  addOrganization,
  updateOrganization,
  removeOrganization,
  setOrganizations,
} from "./organizationsSlice"; // Import Redux actions

// Load organizations from IndexedDB and set them in the Redux store
export const loadOrganizationsFromDB = async (dispatch) => {
  const organizations = await getAllOrganizationsFromDB();
  if (organizations) {
    dispatch(setOrganizations(organizations));
  }
};

// Add a new organization to both Redux and IndexedDB
export const handleAddOrganization = async (organization, dispatch) => {
  // Add to Redux store
  dispatch(addOrganization(organization));

  // Add to IndexedDB
  await addOrganizationToDB(organization);
};

// Update an organization in both Redux and IndexedDB
export const handleUpdateOrganization = async (organization, dispatch) => {
  // Update Redux store
  dispatch(updateOrganization(organization));

  // Update in IndexedDB
  await updateOrganizationInDB(organization);
};

// Remove an organization from both Redux and IndexedDB
export const handleRemoveOrganization = async (organizationId, dispatch) => {
  // Remove from Redux store
  dispatch(removeOrganization(organizationId));

  // Remove from IndexedDB
  await deleteOrganizationFromDB(organizationId);
};

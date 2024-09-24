// src/app/db.js
import { openDB } from "idb";

const DB_NAME = "calendarDB";
const DB_VERSION = 1;
const EVENTS_STORE = "events";
const CATEGORIES_STORE = "categories";
const ORGS_STORE = "organizations";
const SETTINGS_STORE = "settings"; // New store for settings (e.g., start and end dates)

// Function to open the database
const getDB = async () => {
  return openDB(DB_NAME, DB_VERSION, {
    upgrade(db) {
      // Ensure all stores are created during the upgrade
      if (!db.objectStoreNames.contains(EVENTS_STORE)) {
        db.createObjectStore(EVENTS_STORE, { keyPath: "id" });
      }
      if (!db.objectStoreNames.contains(CATEGORIES_STORE)) {
        db.createObjectStore(CATEGORIES_STORE, { keyPath: "id" });
      }
      if (!db.objectStoreNames.contains(ORGS_STORE)) {
        db.createObjectStore(ORGS_STORE, { keyPath: "id" });
      }
      if (!db.objectStoreNames.contains(SETTINGS_STORE)) {
        db.createObjectStore(SETTINGS_STORE, { keyPath: "setting" });
      }
    },
  });
};

// ------------------ Event Functions ------------------

// Add a new event to IndexedDB
export const addEventToDB = async (event) => {
  const db = await getDB();
  await db.put(EVENTS_STORE, event);
};

// Get all events from IndexedDB
export const getAllEventsFromDB = async () => {
  const db = await getDB();
  return await db.getAll(EVENTS_STORE);
};

// Update an event in IndexedDB
export const updateEventInDB = async (event) => {
  const db = await getDB();
  await db.put(EVENTS_STORE, event);
};

// Delete an event from IndexedDB by ID
export const deleteEventFromDB = async (eventId) => {
  const db = await getDB();
  await db.delete(EVENTS_STORE, eventId);
};

// ------------------ Category Functions ------------------

// Add a new category to IndexedDB
export const addCategoryToDB = async (category) => {
  const db = await getDB();
  await db.put(CATEGORIES_STORE, category);
};

// Get all categories from IndexedDB
export const getAllCategoriesFromDB = async () => {
  const db = await getDB();
  return await db.getAll(CATEGORIES_STORE);
};

// Update a category in IndexedDB
export const updateCategoryInDB = async (category) => {
  const db = await getDB();
  await db.put(CATEGORIES_STORE, category);
};

// Delete a category from IndexedDB by ID
export const deleteCategoryFromDB = async (categoryId) => {
  const db = await getDB();
  await db.delete(CATEGORIES_STORE, categoryId);
};

// ------------------ Organization Functions ------------------

// Add a new organization to IndexedDB
export const addOrganizationToDB = async (organization) => {
  const db = await getDB();
  await db.put(ORGS_STORE, organization);
};

// Get all organizations from IndexedDB
export const getAllOrganizationsFromDB = async () => {
  const db = await getDB();
  return await db.getAll(ORGS_STORE);
};

// Update an organization in IndexedDB
export const updateOrganizationInDB = async (organization) => {
  const db = await getDB();
  await db.put(ORGS_STORE, organization);
};

// Delete an organization from IndexedDB by ID
export const deleteOrganizationFromDB = async (organizationId) => {
  const db = await getDB();
  await db.delete(ORGS_STORE, organizationId);
};

// ------------------ Calendar View Settings ------------------

// Set start and end dates for the calendar view in IndexedDB
export const setCalendarViewSettingsToDB = async (settings) => {
  const db = await getDB();
  await db.put(SETTINGS_STORE, { setting: "calendarView", ...settings });
};

// Get start and end dates for the calendar view from IndexedDB
export const getCalendarViewSettingsFromDB = async () => {
  const db = await getDB();
  return await db.get(SETTINGS_STORE, "calendarView");
};

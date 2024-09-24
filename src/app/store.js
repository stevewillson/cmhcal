// src/app/store.js
import { configureStore } from "@reduxjs/toolkit";
import eventsReducer from "../features/events/eventsSlice";
import categoriesReducer from "../features/categories/categorySlice";
import organizationsReducer from "../features/organizations/organizationsSlice"; // Import organizations slice
import calendarReducer from "../features/calendar/calendarSlice";

const store = configureStore({
  reducer: {
    events: eventsReducer,
    categories: categoriesReducer,
    organizations: organizationsReducer,
    calendar: calendarReducer,
  },
});

export default store;

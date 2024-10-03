// src/app/store.js
import { configureStore } from "@reduxjs/toolkit";
import persistedEventsReducer from "../features/events/eventsSlice";
import persistedCategoriesReducer from "../features/categories/categoriesSlice";
import persistedOrganizationsReducer from "../features/organizations/organizationsSlice";
import persistedCalendarReducer from "../features/calendar/calendarSlice";
import persistStore from "redux-persist/es/persistStore";

export const store = configureStore({
  reducer: {
    events: persistedEventsReducer,
    categories: persistedCategoriesReducer,
    organizations: persistedOrganizationsReducer,
    settings: persistedCalendarReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoreActions: ["persist/PERSIST", "persist/REHYDRATE"],
      },
    }),
});

export const persistor = persistStore(store);

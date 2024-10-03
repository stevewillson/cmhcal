// src/features/calendar/calendarSlice.js
import { createSlice } from "@reduxjs/toolkit";
import { persistReducer } from "redux-persist";
import storage from "redux-persist/lib/storage"; // defaults to localStorage for web

const today = new Date();
const fortyDaysFromToday = new Date();
fortyDaysFromToday.setDate(today.getDate() + 40);

const initialState = {
  startDate: today.toISOString().split("T")[0], // set startDate to today
  endDate: fortyDaysFromToday.toISOString().split("T")[0], // set endDate to 40 days from today
};

const calendarSlice = createSlice({
  name: "settings",
  initialState,
  reducers: {
    setCalendarView: (state, action) => {
      state.startDate = action.payload.startDate;
      state.endDate = action.payload.endDate;
    },
  },
});

// Export the action and reducer
export const { setCalendarView } = calendarSlice.actions;

// Persist configuration for this slice
const persistConfig = {
  key: "settings",
  storage,
};

const persistedCalendarReducer = persistReducer(
  persistConfig,
  calendarSlice.reducer
);

export default persistedCalendarReducer;

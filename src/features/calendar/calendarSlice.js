// src/features/calendar/calendarSlice.js
import { createSlice } from "@reduxjs/toolkit";
import { persistReducer } from "redux-persist";
import storage from "redux-persist/lib/storage"; // defaults to localStorage for web

const initialState = {
  startDate: null,
  endDate: null,
};

const calendarSlice = createSlice({
  name: "calendar",
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
  key: "calendar",
  storage,
};

const persistedCalendarReducer = persistReducer(
  persistConfig,
  calendarSlice.reducer
);

export default persistedCalendarReducer;

// src/features/calendar/calendarSlice.js
import { createSlice } from "@reduxjs/toolkit";

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
export default calendarSlice.reducer;

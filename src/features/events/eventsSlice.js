// src/redux/store.js
import { createSlice } from "@reduxjs/toolkit";

// Events slice to manage calendar events in Redux
const eventsSlice = createSlice({
  name: "events",
  initialState: [], // Initial state as an empty array of events
  reducers: {
    // Action to add a new event
    addEvent: (state, action) => {
      state.push(action.payload); // Add event to the state array
    },
    // Action to remove an event by ID
    removeEvent: (state, action) => {
      return state.filter((event) => event.id !== action.payload); // Remove the event with the matching ID
    },
    // Action to update an event
    updateEvent: (state, action) => {
      const index = state.findIndex((event) => event.id === action.payload.id);
      if (index !== -1) {
        state[index] = action.payload; // Update the event in the state array
      }
    },
    // Action to initialize the events array (usually from IndexedDB)
    setEvents: (state, action) => {
      return action.payload; // Replace the current state with loaded events
    },
  },
});

// Export actions to be used in components
export const { addEvent, removeEvent, updateEvent, setEvents } =
  eventsSlice.actions;

export default eventsSlice.reducer;

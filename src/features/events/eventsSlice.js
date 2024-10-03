// src/features/events/eventsSlice.js
import { createSlice } from "@reduxjs/toolkit";
import { persistReducer } from "redux-persist";
import storage from "redux-persist/lib/storage"; // defaults to localStorage for web

const initialState = { list: [] }; // The state is an array of events

// Events slice to manage calendar events in Redux
const eventsSlice = createSlice({
  name: "events",
  initialState, // Initial state as an empty array of events
  reducers: {
    // Action to add a new event
    addEvent: (state, action) => {
      // add the payload to the state object
      state.list.push(action.payload); // Add event to the state array
    },
    // Action to remove an event by ID
    removeEvent: (state, action) => {
      state.list = state.list.filter((event) => event.id !== action.payload); // Remove the event with the matching ID
    },
    // Action to update an event
    updateEvent: (state, action) => {
      const index = state.list.findIndex(
        (event) => event.id === action.payload.id
      );
      if (index !== -1) {
        state.list[index] = action.payload; // Update the event in the state array
      }
    },
  },
});

// Export actions to be used in components
export const { addEvent, removeEvent, updateEvent, setEvents } =
  eventsSlice.actions;

const persistConfig = {
  key: "events",
  storage,
  whitelist: ["list"], // Only persist the list of events
};

const persistedEventsReducer = persistReducer(
  persistConfig,
  eventsSlice.reducer
);

export default persistedEventsReducer;

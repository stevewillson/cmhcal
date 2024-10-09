// src/features/calendar/calendarActions.js
import { v4 as uuidv4 } from "uuid"; // Import the UUID package
import { addEvent } from "../events/eventsSlice"; // Import Redux actions

// Add a new event to both Redux and IndexedDB
export const handleDateClick = async (info, dispatch, categories) => {
  const calendarApi = info.view.calendar;
  const title = prompt("Please enter a new title for your event");
  calendarApi.unselect(); // clear date selection

  if (!title.trim()) return;

  const defaultCategory = {
    name: "Uncategorized",
    id: "",
    color: "blue",
    textColor: "white",
  };

  const { name, id, color, textColor } = categories[0] || defaultCategory;

  const newEvent = {
    id: uuidv4(), // Generate a unique ID using UUID
    title: title.trim(),
    start: info.startStr, // Start date of the event
    end: info.endStr, // End date is optional
    resourceId: info.resource?.id, // Resource if in resource view
    url: "", // Default empty URL
    category: name,
    categoryId: id,
    color: color,
    textColor: textColor,
  };

  // Dispatch Redux action to add the new event to the store
  dispatch(addEvent(newEvent));
};

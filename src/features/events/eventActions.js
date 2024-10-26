// src/features/events/eventActions.js
import { updateEvent, removeEvent, addEvent } from "./eventsSlice"; // Import Redux actions
// import { v4 as uuidv4 } from "uuid"; // Import uuidv4 function

// Serialize the event object to a plain object
export const myToJSON = (fcEvent) => ({
  id: fcEvent.id,
  title: fcEvent.title,
  start: fcEvent.startStr, // Updated start date
  end: fcEvent.endStr, // Updated end date, if applicable
  resourceId: fcEvent.getResources().length
    ? fcEvent.getResources()[0].id
    : null, // Update resourceId if applicable
  url: fcEvent.url || "", // Keep or update the URL
  categoryId: fcEvent.extendedProps.categoryId || "", // Update the categoryId if available
  backgroundColor: fcEvent.backgroundColor || "blue", // Update the color if applicable
  textColor: fcEvent.textColor || "white",
});

export const handleEventRemove = (eventId, dispatch) => {
  dispatch(removeEvent(eventId));
};

export const modifyEventCategory = (
  event,
  categories,
  categoryId,
  dispatch
) => {
  const selectedCategory = categories.find(
    (category) => category.id === categoryId
  );
  if (!selectedCategory) return;

  const updatedEvent = {
    ...myToJSON(event),
    categoryId: selectedCategory.id,
    color: selectedCategory.color,
    textColor: selectedCategory.textColor,
  };

  dispatch(updateEvent(updatedEvent));
};

// called when using the edit modal, the event data is already in a JSON format
export const handleEventEdit = (eventData, dispatch) => {
  dispatch(updateEvent(eventData));
};

export const handleEventChange = (eventData, dispatch) => {
  const changedEvent = myToJSON(eventData);
  dispatch(updateEvent(changedEvent));
};

// Rename locally and also set the event name
export const renameEvent = (event) => {
  const eventTitle = prompt("Set the title", event.title);
  if (eventTitle) {
    event.setProp("title", eventTitle);
  }
};

export const handleEventAdd = (data, dispatch) => {
  if (!data.title.trim()) return;

  data.title = data.title.trim();

  // Dispatch Redux action to add the new event to the store
  dispatch(addEvent(data));
};

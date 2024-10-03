// src/features/events/eventActions.js
import { updateEvent, removeEvent } from "./eventsSlice"; // Import Redux actions

// serialize the event object to a plain object
const jsEventObj = (fcEvent) => {
  const jsEventObj = {
    id: fcEvent.id,
    title: fcEvent.title,
    start: fcEvent.startStr, // Updated start date
    end: fcEvent.endStr, // Updated end date, if applicable
    resourceId: fcEvent.getResources().length
      ? fcEvent.getResources()[0].id
      : null, // Update resourceId if applicable
    url: fcEvent.url || "", // Keep or update the URL
    categoryId: fcEvent.extendedProps.categoryId || "", // Update the categoryId if available
    // category: fcEvent.extendedProps.category || "Uncategorized", // Update the category if available
    color: fcEvent.backgroundColor || "blue", // Update the color if applicable
    textColor: fcEvent.textColor || "white",
  };
  return jsEventObj;
};

// Update an event in both Redux and IndexedDB after a drop (e.g., when the event's date is changed)
// export const handleEventDrop = async (info, dispatch) => {
//   const updatedEvent = jsEventObj(info.event);
//   handleEventUpdate(updatedEvent, dispatch);
// };

// Remove an event from both Redux and IndexedDB
export const handleEventRemove = async (eventId, dispatch) => {
  // Dispatch Redux action to remove the event from the store
  dispatch(removeEvent(eventId));
};

export const modifyEventCategory = async (
  event,
  categories,
  categoryId,
  dispatch
) => {
  const selectedCategory = categories.filter(
    (category) => category.id === categoryId
  );
  const newColor = selectedCategory[0].color;
  const newTextColor = selectedCategory[0].textColor;

  const updatedEvent = jsEventObj(event);
  // updatedEvent.category = selectedCategory[0].name;
  updatedEvent.categoryId = selectedCategory[0].id;
  updatedEvent.color = newColor;
  updatedEvent.textColor = newTextColor;

  dispatch(updateEvent(updatedEvent));
};

export const handleEventChange = async (info, dispatch) => {
  // eventChange is called after the eventDrop, this will update the database and redux store twice
  // TODO - only update those once
  const changedEvent = jsEventObj(info.event);
  dispatch(updateEvent(changedEvent));
};

// rename locally and also set the event name?
export const renameEvent = (event) => {
  // check to see whether the button 'X' was clicked to delete the event
  const eventTitle = prompt("Set the title", event.title);
  if (eventTitle !== "" && eventTitle !== null) {
    event.setProp("title", eventTitle);
  }
};

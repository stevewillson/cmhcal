// src/features/events/eventActions.js
import { updateEvent, removeEvent } from "./eventsSlice"; // Import Redux actions

// Serialize the event object to a plain object
const jsEventObj = (fcEvent) => ({
  id: fcEvent.id,
  title: fcEvent.title,
  start: fcEvent.startStr, // Updated start date
  end: fcEvent.endStr, // Updated end date, if applicable
  resourceId: fcEvent.getResources().length
    ? fcEvent.getResources()[0].id
    : null, // Update resourceId if applicable
  url: fcEvent.url || "", // Keep or update the URL
  categoryId: fcEvent.extendedProps.categoryId || "", // Update the categoryId if available
  color: fcEvent.backgroundColor || "blue", // Update the color if applicable
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
    ...jsEventObj(event),
    categoryId: selectedCategory.id,
    color: selectedCategory.color,
    textColor: selectedCategory.textColor,
  };

  dispatch(updateEvent(updatedEvent));
};

export const handleEventChange = (info, dispatch) => {
  const changedEvent = jsEventObj(info.event);
  dispatch(updateEvent(changedEvent));
};

// Rename locally and also set the event name
export const renameEvent = (event) => {
  const eventTitle = prompt("Set the title", event.title);
  if (eventTitle) {
    event.setProp("title", eventTitle);
  }
};

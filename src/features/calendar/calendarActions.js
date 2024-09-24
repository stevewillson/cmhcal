// src/features/calendar/calendarActions.js
import { getAllEventsFromDB } from "../../app/db"; // Import the utility function
import { v4 as uuidv4 } from "uuid"; // Import the UUID package
import { addEventToDB } from "../../app/db"; // Import IndexedDB functions
import { addEvent, setEvents } from "../events/eventsSlice"; // Import Redux actions
import { setCalendarView } from "./calendarSlice"; // Import Redux actions
import {
  setCalendarViewSettingsToDB,
  getCalendarViewSettingsFromDB,
} from "../../app/db"; // Import IndexedDB functions

// Load events from IndexedDB and set them in Redux store
export const loadEventsFromDB = async (dispatch) => {
  const storedEvents = await getAllEventsFromDB();
  if (storedEvents) {
    dispatch(setEvents(storedEvents));
  }
};

// Add a new event to both Redux and IndexedDB
export const handleDateClick = async (info, dispatch, categories) => {
  const calendarApi = info.view.calendar;
  const title = prompt("Please enter a new title for your event");
  calendarApi.unselect(); // clear date selection

  if (title.trim()) {
    // add an event to the first category
    let eventCategory = "";
    // let eventCategoryId = "";
    let eventColor = "blue";
    let textColor = "white";
    if (categories.length > 0) {
      eventCategory = categories[0].name;
      // eventCategoryId = categories[0].id;
      eventColor = categories[0].color;
      textColor = categories[0].textColor;
    }

    const newEvent = {
      id: uuidv4(), // Generate a unique ID using UUID
      title: title.trim(),
      start: info.startStr, // Start date of the event
      end: info.endStr, // End date is optional
      resourceId: info.resource?.id, // Resource if in resource view
      url: "", // Default empty URL
      category: eventCategory || "Uncategorized", // Default category
      color: eventColor || "blue", // Use category color or default
      textColor: textColor || "white", // Use category text color or default
    };
    // }
    // calendarApi.addEvent(
    //   {
    //     // will render immediately. will call handleEventAdd
    //     title,
    //     start: selectInfo.startStr,
    //     end: selectInfo.endStr,
    //     allDay: selectInfo.allDay,
    //     id: uuidv4(),
    //     resourceId: selectInfo.resource.id,
    //     url: "",
    //     color: eventColor,
    //     textColor: textColor,
    //     category: eventCategory,
    //     categoryId: eventCategoryId,
    //   },
    //   true
    // ); // temporary=true, will get overwritten when reducer gives new events
    // }

    // Dispatch Redux action to add the new event to the store
    dispatch(addEvent(newEvent));

    // Add the new event to IndexedDB
    await addEventToDB(newEvent);
  }
};

// Load calendar view settings (start and end date) from IndexedDB
export const loadCalendarViewSettings = async (dispatch) => {
  const settings = await getCalendarViewSettingsFromDB();
  if (settings) {
    dispatch(
      setCalendarView({
        startDate: settings.startDate,
        endDate: settings.endDate,
      })
    );
  }
};

// Save calendar view settings (start and end date) to IndexedDB
export const saveCalendarViewSettings = async (
  dispatch,
  startDate,
  endDate
) => {
  const settings = { startDate, endDate };

  // Save to IndexedDB
  await setCalendarViewSettingsToDB(settings);

  // Dispatch to Redux store
  dispatch(setCalendarView(settings));
};

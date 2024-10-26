// src/Calendar.jsx
import { useDispatch, useSelector } from "react-redux";
import { useState } from "react";
import { v4 as uuidv4 } from "uuid";

import DateSelectForm from "./DateSelectForm";
import FullCalendar from "@fullcalendar/react";
import EditModeForm from "./EditModeForm";
import interactionPlugin from "@fullcalendar/interaction";
import resourceTimelinePlugin from "@fullcalendar/resource-timeline";

import {
  handleEventRemove,
  handleEventChange,
  handleEventEdit,
  handleEventAdd,
  myToJSON,
} from "../events/eventActions"; // Other event-related actions
import { eventRender } from "../events/eventsHelpers"; // Import the new helper function

import EditEventModal from "../../components/EditEventModal/EditEventModal";

import {
  customSlotLabelContent,
  getDayViewConfig,
  getMonthViewConfig,
  getWeekViewConfig,
} from "./calendarHelpers";

import { resourceRender } from "../organizations/organizationsHelpers";

const Calendar = () => {
  const dispatch = useDispatch();
  const events = useSelector((state) => state.events.list); // Get events from Redux store
  const categories = useSelector((state) => state.categories.list); // Get categories from Redux store
  const organizations = useSelector((state) => state.organizations.list); // Get organizations from Redux store
  const settings = useSelector((state) => state.settings); // Get calendar settings from Redux store

  const [isEditEventModalOpen, setEditEventModalOpen] = useState(false);
  const [eventFormData, setEventFormData] = useState(null);

  const handleOpenAddEventModal = (dateSelectArg, categories) => {
    const calendarApi = dateSelectArg.view.calendar;
    calendarApi.unselect(); // clear date selection

    // make a list of the categories with the values of id and name
    const categoriesList = categories.map((category) => {
      return { id: category.id, name: category.name };
    });

    const newEvent = {
      id: uuidv4(), // Generate a unique ID using UUID
      title: "New Event",
      start: dateSelectArg.startStr, // Start date of the event
      end: dateSelectArg.endStr, // End date is optional
      resourceId: dateSelectArg.resource?.id, // Resource if in resource view
      url: "", // Default empty URL
      // if the categories exist, use the first one, otherwise use the default
      categoryId: categories[0] ? categories[0].id : "",
      backgroundColor: categories[0] ? categories[0].color : "blue",
      textColor: categories[0] ? categories[0].textColor : "white",
      isNewEvent: true,

      categories: categoriesList,
    };
    setEventFormData(newEvent);
    setEditEventModalOpen(true);
  };

  const handleEventClick = (clickInfo) => {
    // prevent the url link from being followed if one of the event buttons is clicked
    if (
      clickInfo.jsEvent?.target?.id !== undefined &&
      clickInfo.jsEvent?.target?.nodeName === "SELECT"
    ) {
      // clickInfo.jsEvent.stopImmediatePropagation();
    } else if (
      // update category button is clicked
      clickInfo.jsEvent?.target?.innerText !== undefined &&
      clickInfo.jsEvent.target.innerText === "Toggle Category"
    ) {
      clickInfo.jsEvent.preventDefault();
    } else if (
      // event will be removed if the 'X' button is clicked
      clickInfo.jsEvent?.target?.innerText !== undefined &&
      clickInfo.jsEvent.target.innerText === "X"
    ) {
      clickInfo.jsEvent.preventDefault();
    } else {
      handleOpenEditEventModal(clickInfo.event);
    }
    // can prevent the default loading of a url in the same windows and open it in a new window
    // if (info.event.url) {
    //   window.open(info.event.url);
    // }
  };

  const handleOpenEditEventModal = (eventData) => {
    // make a list of the categories with the values of id and name
    const categoriesList = categories.map((category) => {
      return { id: category.id, name: category.name };
    });

    let editEvent = myToJSON(eventData);
    editEvent.isNewEvent = false;

    editEvent.categories = categoriesList;

    setEventFormData(editEvent);
    setEditEventModalOpen(true);
  };

  const handleCloseEditEventModal = () => {
    // reset the form data
    setEventFormData(null);
    setEditEventModalOpen(false);
  };

  const handleFormSubmit = (eventData) => {
    // update the event with the category color and text color
    const selectedCategory = categories.find(
      (category) => category.id === eventData.categoryId
    );
    if (selectedCategory) {
      eventData.backgroundColor = selectedCategory.color;
      eventData.textColor = selectedCategory.textColor;
    }

    if (eventData.isNewEvent) {
      handleEventAdd(eventData, dispatch);
    } else {
      handleEventEdit(eventData, dispatch);
    }
    handleCloseEditEventModal();
  };

  // update when the 'add organization' button is pressed
  return (
    <div>
      <EditEventModal
        isOpen={isEditEventModalOpen}
        onSubmit={handleFormSubmit}
        onClose={handleCloseEditEventModal}
        initialData={eventFormData ? eventFormData : null}
      />
      <DateSelectForm />
      <EditModeForm />
      <FullCalendar
        plugins={[interactionPlugin, resourceTimelinePlugin]}
        //added to suppress license key prompt
        schedulerLicenseKey={"GPL-My-Project-Is-Open-Source"}
        initialView={"DayView"}
        timeZone={"local"}
        headerToolbar={{
          left: "",
          center: "title",
          right: "DayView,WeekView,MonthView",
        }}
        editable={true}
        height={"auto"}
        scrollTime={null}
        views={{
          DayView: getDayViewConfig(settings.startDate, settings.endDate),
          WeekView: getWeekViewConfig(settings.startDate, settings.endDate),
          MonthView: getMonthViewConfig(settings.startDate, settings.endDate),
        }}
        // set the top rows with custom data to display Month Year, Fiscal Year Week
        // Relative 'T' Week
        // Then various settings (Day and Narrow Day of the Week or Start / Stop day for weekly view)
        slotLabelContent={(arg) => customSlotLabelContent(arg)}
        events={events}
        resources={organizations}
        resourceAreaWidth={"10%"}
        resourceAreaHeaderContent={"Organization"}
        // add a 'Change Name' button when displaying resources (Organizations) on the left column
        resourceLabelContent={(info) =>
          resourceRender(info, settings.editMode, dispatch)
        }
        // order the resources (Organizations) by Title
        resourceOrder={"title"}
        // weeks begin on Monday
        firstDay={"1"}
        eventContent={(info) =>
          eventRender(info, categories, settings.editMode, dispatch)
        }
        // eventAdd and eventDrop are not specified because these
        // actions are managed by select and eventChange
        selectable={true}
        // when an empty part of the calendar is clicked
        select={(dateSelectArg) =>
          handleOpenAddEventModal(dateSelectArg, categories)
        }
        // handles when the event is clicked and released, not dragged
        eventClick={(info) => handleEventClick(info)}
        eventChange={(info) => handleEventChange(info.event, dispatch)}
        eventRemove={(info) => handleEventRemove(info.event.id, dispatch)} // Handle event removal
      />
    </div>
  );
};

export default Calendar;

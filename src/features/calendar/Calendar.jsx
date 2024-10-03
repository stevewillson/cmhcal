// src/Calendar.jsx
import { useState, useRef } from "react";
import FullCalendar from "@fullcalendar/react";

import interactionPlugin from "@fullcalendar/interaction";
import resourceTimelinePlugin from "@fullcalendar/resource-timeline";
import { useDispatch, useSelector } from "react-redux";
import { handleDateClick, saveCalendarViewSettings } from "./calendarActions"; // Import the new actions
import { handleEventRemove, handleEventChange } from "../events/eventActions"; // Other event-related actions
// import { addEvent } from "../events/eventsSlice"; // Import the new action
import { eventRender } from "../events/eventsHelpers"; // Import the new helper function

import {
  customSlotLabelContent,
  handleEventClick,
  getDayViewConfig,
  getMonthViewConfig,
  getWeekViewConfig,
} from "./calendarHelpers";

import { resourceRender } from "../organizations/organizationsHelpers";

const Calendar = () => {
  const calendarRef = useRef(null);
  const dispatch = useDispatch();
  const events = useSelector((state) => state.events.list); // Get events from Redux store
  const categories = useSelector((state) => state.categories.list); // Get categories from Redux store
  const organizations = useSelector((state) => state.organizations.list); // Get organizations from Redux store
  const settings = useSelector((state) => state.settings); // Get calendar settings from Redux store

  // Edit mode state
  const [editMode, setEditMode] = useState(false);

  // State for start and end dates
  const [startDate, setStartDate] = useState(settings.startDate);
  const [endDate, setEndDate] = useState(settings.endDate);

  // Toggle edit mode
  const toggleEditMode = () => {
    setEditMode((prevMode) => !prevMode);
  };

  const handleSaveCalendarView = (dispatch) => {
    //get the input for the startDateInput
    const startDate = document.getElementById("startDateInput").value;
    //get the input for the endDateInput
    const endDate = document.getElementById("endDateInput").value;
    //save the calendar view settings
    saveCalendarViewSettings(startDate, endDate, dispatch);
  };

  // only update when the 'add organization' button is pressed
  return (
    <div>
      <div>
        <label htmlFor="startDateInput">Start Date:</label>
        <input
          id="startDateInput"
          type="date"
          value={startDate}
          onChange={(e) => setStartDate(e.target.value)}
        />
        <label htmlFor="endDateInput">End Date:</label>
        <input
          id="endDateInput"
          type="date"
          value={endDate}
          onChange={(e) => setEndDate(e.target.value)}
        />
        <button onClick={() => handleSaveCalendarView(dispatch)}>
          Set Calendar View
        </button>
      </div>
      {/* Edit Mode Toggle */}
      <div>
        <label>
          <input
            id="editModeCheckbox"
            type="checkbox"
            checked={editMode}
            onChange={toggleEditMode}
          />
          Enable Edit Mode
        </label>
      </div>

      <FullCalendar
        ref={calendarRef}
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
        slotLabelContent={customSlotLabelContent}
        events={events}
        resources={organizations}
        resourceAreaWidth={"10%"}
        resourceAreaHeaderContent={"Organization"}
        // add a 'Change Name' button when displaying resources (Organizations) on the left column
        resourceLabelContent={(info) =>
          resourceRender(info, editMode, dispatch)
        }
        // order the resources (Organizations) by Title
        resourceOrder={"title"}
        // set week to begin on Monday
        firstDay={"1"}
        // when the event is clicked and released, not dragged

        eventContent={(info) =>
          eventRender(info, categories, editMode, dispatch)
        }
        // the eventAdd and eventDrop events are not handled because these
        // actions are managed by select and eventChange
        selectable={true}
        // when an empty part of the calendar is clicked
        select={(info) => handleDateClick(info, dispatch, categories)}
        eventClick={handleEventClick}
        eventChange={(info) => handleEventChange(info, dispatch)}
        eventRemove={(info) => handleEventRemove(info.event.id, dispatch)} // Handle event removal
      />
    </div>
  );
};

export default Calendar;

// src/Calendar.jsx
import { useState, useRef } from "react";
import FullCalendar from "@fullcalendar/react";

import interactionPlugin from "@fullcalendar/interaction";
import resourceTimelinePlugin from "@fullcalendar/resource-timeline";
import { useDispatch, useSelector } from "react-redux";
import { handleDateClick, saveCalendarViewSettings } from "./calendarActions"; // Import the new actions
import { handleEventRemove, handleEventChange } from "../events/eventActions"; // Other event-related actions
import { addEvent } from "../events/eventsSlice"; // Import the new action
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

  // Edit mode state
  const [editMode, setEditMode] = useState(false);

  // Calculate today’s date and forty days from today
  const today = new Date();
  const fortyDaysFromToday = new Date(today);
  fortyDaysFromToday.setDate(today.getDate() + 40);

  // State for start and end dates
  const [startDate, setStartDate] = useState(today.toISOString().split("T")[0]); // Default to today's date
  const [endDate, setEndDate] = useState(
    fortyDaysFromToday.toISOString().split("T")[0]
  ); // Default to 40 days from today

  // Handle saving calendar view settings
  const handleSaveCalendarView = () => {
    saveCalendarViewSettings(dispatch, startDate, endDate);
  };

  // Toggle edit mode
  const toggleEditMode = () => {
    setEditMode((prevMode) => !prevMode);
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
        <button onClick={handleSaveCalendarView}>Set Calendar View</button>
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
          DayView: getDayViewConfig(startDate, endDate),
          WeekView: getWeekViewConfig(startDate, endDate),
          MonthView: getMonthViewConfig(startDate, endDate),
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
        selectable={true}
        // when an empty part of the calendar is clicked
        select={(info) => handleDateClick(info, dispatch, categories)}
        // set week to begin on Monday
        firstDay={"1"}
        // when the event is clicked and released, not dragged
        eventClick={handleEventClick}
        eventContent={(info) =>
          eventRender(info, categories, editMode, dispatch)
        }
        eventAdd={(info) => dispatch(addEvent(info.event))}
        // eventDrop={(info) => handleEventDrop(info, dispatch)} // Handle event drop
        // this sometimes does not pass events
        eventChange={(info) => handleEventChange(info, dispatch)}
        eventRemove={(info) => handleEventRemove(info.event.id, dispatch)} // Handle event removal
      />
    </div>
  );
};

export default Calendar;

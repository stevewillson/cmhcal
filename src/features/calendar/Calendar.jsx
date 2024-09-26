// src/Calendar.jsx
import { useState } from "react";
import FullCalendar from "@fullcalendar/react";
import interactionPlugin from "@fullcalendar/interaction";
import resourceTimelinePlugin from "@fullcalendar/resource-timeline";
import { useDispatch, useSelector } from "react-redux";
import { handleDateClick, saveCalendarViewSettings } from "./calendarActions"; // Import the new actions
import {
  handleEventRemove,
  handleEventChange,
  renameEvent,
  modifyEventCategory,
} from "../events/eventActions"; // Other event-related actions
import { addEvent } from "../events/eventsSlice"; // Import the new action

import {
  customSlotLabelContent,
  handleEventClick,
  getDayViewConfig,
  getMonthViewConfig,
  getWeekViewConfig,
} from "./calendarHelpers";
import { updateOrganization } from "../organizations/organizationsSlice";
import { v4 as uuidv4 } from "uuid"; // Import the UUID package

const Calendar = () => {
  const dispatch = useDispatch();
  const events = useSelector((state) => state.events); // Get events from Redux store
  const categories = useSelector((state) => state.categories); // Get categories from Redux store
  const organizations = useSelector((state) => state.organizations); // Get organizations from Redux store

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

  const eventRender = (info, categories, editMode) => {
    // edit mode is now captured in the redux state
    if (info.view.type === "DayView") {
      if (editMode) {
        return (
          <>
            {<b>{info.event.title}</b>}
            {
              <>
                {" "}
                -{" "}
                <button onClick={() => renameEvent(info.event)}>
                  Edit Name
                </button>
              </>
            }
            {<> - </>}
            <div className="tooltip">
              <span className="tooltiptext">
                Hold CTRL + Click to change category
              </span>
              <select
                onChange={(event) =>
                  modifyEventCategory(
                    info.event,
                    categories,
                    event.target.selectedOptions[0].value,
                    dispatch
                  )
                }
                id={"changeEventCategory" + uuidv4()}
                // fullCalendar requires CTRL to be held down to select a form element within an event
                value={info.event.extendedProps.categoryId}
              >
                {categories.map((cat) => (
                  <option key={uuidv4()} value={cat.id}>
                    {cat.name}
                  </option>
                ))}
              </select>
            </div>
            {
              <>
                {" "}
                - <button onClick={() => info.event.remove()}>X</button>
              </>
            }
          </>
        );
      }
      return (
        <>
          <b>{info.event.title}</b>
        </>
      );
    } else if (
      info.view.type === "WeekView" ||
      info.view.type === "MonthView"
    ) {
      if (editMode) {
        return (
          <>
            <b>{info.event.title}</b>
            {
              <>
                {" "}
                - <b>{info.event.start.toISOString().slice(5, 10)}</b>
              </>
            }
            {
              <>
                {" "}
                - <b>{info.event.end.toISOString().slice(5, 10)}</b>
              </>
            }
            {
              <>
                {" "}
                -{" "}
                <button onClick={() => renameEvent(info.event)}>
                  Edit Name
                </button>
              </>
            }
            {<> - </>}
            <div className="tooltip">
              <span className="tooltiptext">
                Hold CTRL + Click to change category
              </span>
              <select
                onChange={(event) =>
                  modifyEventCategory(
                    info.event,
                    categories,
                    event.target.selectedOptions[0].value,
                    dispatch
                  )
                }
                id={"changeEventCategory" + uuidv4()}
                // fullCalendar requires CTRL to be held down to select a form element within an event
                value={info.event.extendedProps.categoryId}
              >
                {categories.map((cat) => (
                  <option key={uuidv4()} value={cat.id}>
                    {cat.name}
                  </option>
                ))}
              </select>
            </div>
            {
              <>
                {" "}
                - <button onClick={() => info.event.remove()}>X</button>
              </>
            }
          </>
        );
      }
      return (
        <>
          <b>{info.event.title}</b>
          {" - "}
          <b>{info.event.start.toISOString().slice(5, 10)}</b>
          {" - "}
          <b>{info.event.end.toISOString().slice(5, 10)}</b>
        </>
      );
    }
  };

  const resourceRender = (info, editMode, dispatch) => {
    return (
      <>
        {info.resource.title}
        {editMode && (
          <>
            {" "}
            -{" "}
            <button onClick={() => dispatch(updateOrganization(info.resource))}>
              Change Name
            </button>
          </>
        )}
      </>
    );
  };

  // const rsc = [
  //   { id: "a", title: "Resource A", parentId: "b" },
  //   { id: "b", title: "Resource B" },
  // ];

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
        // resources={rsc}
        resourceAreaWidth={"10%"}
        resourceAreaHeaderContent={"Organization"}
        // add a 'Change Name' button when displaying resources (Organizations) on the left column
        resourceLabelContent={(info) =>
          resourceRender(info, editMode, dispatch)
        }
        // order the resources (Organizations) by Title
        resourceOrder={"title"}
        resources={organizations}
        selectable={true}
        // when an empty part of the calendar is clicked
        select={(info) => handleDateClick(info, dispatch, categories)}
        // set week to begin on Monday
        firstDay={"1"}
        // when the event is clicked and released, not dragged
        eventClick={handleEventClick}
        eventContent={(info) => eventRender(info, categories, editMode)}
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

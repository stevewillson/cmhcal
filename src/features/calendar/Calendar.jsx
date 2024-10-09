// src/Calendar.jsx
import { useDispatch, useSelector } from "react-redux";
import DateSelectForm from "./DateSelectForm";
import FullCalendar from "@fullcalendar/react";
import EditModeForm from "./EditModeForm";
import interactionPlugin from "@fullcalendar/interaction";
import resourceTimelinePlugin from "@fullcalendar/resource-timeline";

import { handleDateClick } from "./calendarActions"; // Import the new actions
import { handleEventRemove, handleEventChange } from "../events/eventActions"; // Other event-related actions
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
  const dispatch = useDispatch();
  const events = useSelector((state) => state.events.list); // Get events from Redux store
  const categories = useSelector((state) => state.categories.list); // Get categories from Redux store
  const organizations = useSelector((state) => state.organizations.list); // Get organizations from Redux store
  const settings = useSelector((state) => state.settings); // Get calendar settings from Redux store

  // update when the 'add organization' button is pressed
  return (
    <div>
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
        select={(info) => handleDateClick(info, dispatch, categories)}
        // handles when the event is clicked and released, not dragged
        eventClick={(info) => handleEventClick(info)}
        eventChange={(info) => handleEventChange(info, dispatch)}
        eventRemove={(info) => handleEventRemove(info.event.id, dispatch)} // Handle event removal
      />
    </div>
  );
};

export default Calendar;

import React from 'react';
import FullCalendar from '@fullcalendar/react';
import resourceTimeline from '@fullcalendar/resource-timeline';
import interaction from '@fullcalendar/interaction';
import { useSelector } from 'react-redux';
import { v4 as uuidv4 } from 'uuid';
import { DateTime } from 'luxon';

// import { createEvent, updateEvent, deleteEvent } from './actions';
import { createEvent, updateEvent, updateEventCategory, deleteEvent } from './actions';

import { resourceRender } from './resourceHandler';

import { customSlotLabelContent } from './slotLabelContentDisplay';

const ResourceCalendar = () => {
  // get state values from redux
  var { editMode } = useSelector(state => state);

  const calState = useSelector(state => { 
    return { 
      calEvents: state.calEvents, 
      calResources: state.calResources, 
      calCategories: state.calCategories,
      calDateRangeStart: state.calDateRangeStart, 
      calDateRangeEnd: state.calDateRangeEnd,
      calUUID: state.calUUID,
    }}
  )
 
  const handleDateSelect = (selectInfo) => {
    let calendarApi = selectInfo.view.calendar
    let title = prompt('Please enter a new title for your event')

    calendarApi.unselect() // clear date selection

    if (title) {
      // add an event to the first category
      let eventCategory = '';
      let eventCategoryId = '';
      let eventColor = '';
      let textColor = '';
      if (calState.calCategories.length > 0) {
        eventCategory = calState.calCategories[0].name;
        eventCategoryId = calState.calCategories[0].id;
        eventColor = calState.calCategories[0].color;
        textColor = calState.calCategories[0].textColor || "";
      } 
      calendarApi.addEvent({ // will render immediately. will call handleEventAdd
        title,
        start: selectInfo.startStr,
        end: selectInfo.endStr,
        allDay: selectInfo.allDay,
        id: uuidv4(),
        resourceId: selectInfo.resource.id,
        url: '',
        color: eventColor,
        textColor: textColor,
        category: eventCategory,
        categoryId: eventCategoryId,
      }, true) // temporary=true, will get overwritten when reducer gives new events
    }
  };

  const handleEventAdd = (addInfo) => {
    // use this to call the create event function in the 'actions'
    createEvent(addInfo.event);
  }

  const handleEventChange = (changeInfo) => {
    // use this to call the create event function in the 'actions'
    updateEvent(changeInfo.event);
  }

  const handleEventRemove = (removeInfo) => {
    // use this to call the create event function in the 'actions'
    deleteEvent(removeInfo.event.id)
  }

  const renameEvent = (event) => {
    // check to see whether the button 'X' was clicked to delete the event
    const eventTitle = prompt("Set the title", event.title)
    if (eventTitle !== '' && eventTitle !== null) {
      event.setProp('title', eventTitle);
    }
  };

  /* 
  const setEventLink = (event) => {
    // check to see whether the button 'eventLink' was clicked to delete the event
    // allow setting a blank link ''
    const eventUrl = prompt("Set the event link", event.url)
    if (eventUrl !== null) {
      event.setProp('url', eventUrl);
    }
  };
  */

  // 2021-10-01 - Removed this from the event render area
  // <button onClick={() => setEventLink(info.event)}>Edit Link</button>
  //{' - '}
            

  const handleEventClick = (clickInfo) => {
    // prevent the url link from being followed if one of the event buttons is clicked
    if (clickInfo.jsEvent?.target?.id !== undefined && clickInfo.jsEvent?.target?.nodeName === "SELECT") {
      // clickInfo.jsEvent.stopImmediatePropagation();
    } else if (clickInfo.jsEvent?.target?.innerText !== undefined && clickInfo.jsEvent.target.innerText === "Toggle Category") {
       clickInfo.jsEvent.preventDefault();
    } else if (clickInfo.jsEvent?.target?.innerText !== undefined && clickInfo.jsEvent.target.innerText === "Edit Name") {
      clickInfo.jsEvent.preventDefault();
    //} else if (clickInfo.jsEvent?.toElement?.innerText !== undefined && clickInfo.jsEvent.toElement.innerText === "Edit Link") {
    //  clickInfo.jsEvent.preventDefault();
    } else if (clickInfo.jsEvent?.target?.innerText !== undefined && clickInfo.jsEvent.target.innerText === "X") {
      clickInfo.jsEvent.preventDefault();
    }
    // can prevent the default loading of a url in the same windows and open it in a new window
    // if (info.event.url) {
    //   window.open(info.event.url);
    // }

  }

  const modifyEventCategory = (event, categoryId) => {
    // get the color for the category to update the event
    const selectedCategory = calState.calCategories.filter(category => category.id === categoryId);
    const newColor = selectedCategory[0].color;
    const categoryName = selectedCategory[0].name;
    const newTextColor = selectedCategory[0].textColor;
    updateEventCategory(event.id, categoryName, categoryId, newColor, newTextColor);
  }

  const eventRender = (info) => {
    // edit mode is now captured in the redux state
    if (info.view.type === "DayView") {
      if (editMode) {
        return (
          <>
            {<b>{info.event.title}</b>}
            {<> - <button onClick={() => renameEvent(info.event)}>Edit Name</button></>}
            {<> - </>}
	          <div className="tooltip">
	            <span className="tooltiptext">Hold CTRL + Click to change category</span>
                <select
                  onChange={event => modifyEventCategory(info.event, event.target.selectedOptions[0].value)} 
                  id={"changeEventCategory"+uuidv4()}
                  // fullCalendar requires CTRL to be held down to select a form element within an event
                  value={info.event.extendedProps.categoryId}
                >
                {calState.calCategories.map(cat => 
                  <option 
                    key={uuidv4()} 
                    value={cat.id}
                  >
                  {cat.name}
                  </option>
                )}
                </select> 
	          </div>
            {<> - <button onClick={() => info.event.remove()}>X</button></>}
          </>
        )
      }
      return (
        <>
          <b>{info.event.title}</b> 
        </>
      )
      } else if (info.view.type === "WeekView" || info.view.type === "MonthView") {
      if (editMode) {
        return (
          <>
            <b>{info.event.title}</b>
            {<> - <b>{info.event.start.toISOString().slice(5,10)}</b></>}
            {<> - <b>{info.event.end.toISOString().slice(5,10)}</b></>}
            {<> - <button onClick={() => renameEvent(info.event)}>Edit Name</button></>}
            {<> - </>}
	          <div className="tooltip">
	            <span className="tooltiptext">Hold CTRL + Click to change category</span>
                <select
                  onChange={event => modifyEventCategory(info.event, event.target.selectedOptions[0].value)} 
                  id={"changeEventCategory"+uuidv4()}
                  // fullCalendar requires CTRL to be held down to select a form element within an event
                  value={info.event.extendedProps.categoryId}
                >
                {calState.calCategories.map(cat => 
                  <option 
                    key={uuidv4()} 
                    value={cat.id}
                  >
                  {cat.name}
                  </option>
                )}
                </select>
            </div>
            {<> - <button onClick={() => info.event.remove()}>X</button></>}
          </>
        )
      }
      return (
        <>
          <b>{info.event.title}</b>
          {' - '}
          <b>{info.event.start.toISOString().slice(5,10)}</b>
          {' - '}
          <b>{info.event.end.toISOString().slice(5,10)}</b>
        </>
      )
    }
  }

  // start weekView on a Monday,
  // if not, then fullCalendar will not allow the left most date column
  // to be selected because it is not fully included in the visible range 
  const setWeekViewStartDate = () => {
    // take the input date and find the previous monday to set the start date in the week view mode
    const calDateStart = DateTime.fromFormat(calState.calDateRangeStart, 'yyyy-LL-dd');
    
    // subtract days to set newCalDateStart to the prior Monday
    const newCalDateStart = calDateStart.minus({ days: (calDateStart.weekday - 1) });
    
    return newCalDateStart.toISODate();
  }

  const setWeekViewEndDate = () => {
    // take the input date and find the next Monday to set the end date in the week view mode
    const calDateEnd = DateTime.fromFormat(calState.calDateRangeEnd, 'yyyy-LL-dd');
      
    // add days to set newCalDateEnd to the next Monday
    const newCalDateEnd = calDateEnd.plus({ days: (8 - calDateEnd.weekday) });
    
    return newCalDateEnd.toISODate();
  }

  // start monthView on a the first day of the month,
  // if not, then fullCalendar will not allow the left most date column
  // to be selected because it is not fully included in the visible range 
  const setMonthViewStartDate = () => {
    // take the input date and find the first day of the month to set the start date in month view mode
    const calDateStart = DateTime.fromFormat(calState.calDateRangeStart, 'yyyy-LL-dd');
    
    // subtract days to set newCalDateStart to the first day of the month
    const newCalDateStart = calDateStart.minus({ days: (calDateStart.day - 1) });
    
    return newCalDateStart.toISODate();
  }

  const setMonthViewEndDate = () => {
    // take the input date and find the first day of the next month to set the end date in month view mode
    const calDateEnd = DateTime.fromFormat(calState.calDateRangeEnd, 'yyyy-LL-dd');
    
    // add days to set newCalDateEnd to the first day of the next month
    const newCalDateEnd = calDateEnd.plus({ days: (calDateEnd.daysInMonth - calDateEnd.day + 1) });
    
    return newCalDateEnd.toISODate();
  }

  return (
    <FullCalendar
      //added to suppress license key prompt
      schedulerLicenseKey={'GPL-My-Project-Is-Open-Source'}
      initialView={'DayView'}
      timeZone={'local'}
      plugins={[ interaction, resourceTimeline ]} 
      headerToolbar={{
        left: '',
        center: 'title',
        right: 'DayView,WeekView,MonthView',
      }}
      editable={true}
      height={'auto'}
      scrollTime={null}
      views={{
        'DayView': {
          type: 'resourceTimeline',
          visibleRange: {
            start: calState.calDateRangeStart,
            end: calState.calDateRangeEnd, 
          },
          buttonText: 'Day View',
          slotLabelInterval: { days: 1 },
          slotLabelFormat: [
            { month: 'short', year: '2-digit' },
            { week: 'short' },
            { week: 'short' },
            { day: 'numeric', weekday: 'narrow' },
          ],
        },
        'WeekView': {
          type: 'resourceTimeline',
          visibleRange: {
            // find the previous Monday to set the start date to before the selected date
            start: setWeekViewStartDate(),
            // find the next Monday to set the end date to after the selected date
            end: setWeekViewEndDate(), 
          },
          buttonText: "Week View",
          slotDuration: { weeks: 1 },
          slotLabelInterval: { weeks: 1 },
          slotLabelFormat: [
            { month: 'short', year: '2-digit' },
            { week: 'short' },
            { week: 'short' },
            { week: 'short' },
          ]
        },
        'MonthView': {
          type: 'resourceTimeline',
          visibleRange: {
            // find the previous Monday to set the start date to before the selected date
            start: setMonthViewStartDate(),
            // find the next Monday to set the end date to after the selected date
            end: setMonthViewEndDate(), 
          },
          buttonText: "Month View",
          slotDuration: { months: 1 },
          slotLabelInterval: { months: 1 },
          slotLabelFormat: [
            { month: 'short', year: '2-digit' },
            { week: 'short' },
            { week: 'short' },
            { week: 'short' },
          ]
        }
      }}
      // set the top rows with custom data to display Month Year, Fiscal Year Week
      // Relative 'T' Week
      // Then various settings (Day and Narrow Day of the Week or Start / Stop day for weekly view)
      slotLabelContent={customSlotLabelContent}
      events={calState.calEvents}
      resources={calState.calResources}
      selectable={true}
      eventClick={handleEventClick}
      select={handleDateSelect}
      eventContent={eventRender}
      resourceAreaWidth={'10%'}
      resourceAreaHeaderContent={'Organization'}
      // add a 'Change Name' button when displaying resources (Organizations) on the left column
      resourceLabelContent={resourceRender}
      // order the resources (Organizations) by Title
      resourceOrder={'title'}
      // set week to begin on Monday
      firstDay={'1'}
      eventAdd={handleEventAdd}
      eventChange={handleEventChange}
      eventRemove={handleEventRemove}
    />
  );
};

export default ResourceCalendar;

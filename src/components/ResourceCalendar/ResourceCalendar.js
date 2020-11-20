import React from 'react';
import FullCalendar from '@fullcalendar/react';
import resourceTimeline from '@fullcalendar/resource-timeline';
import interaction from '@fullcalendar/interaction';
import { useSelector } from 'react-redux';
import { useDispatch } from 'react-redux';
import { v4 as uuidv4 } from 'uuid';
import { DateTime } from 'luxon';

const ResourceCalendar = () => {
  // get state values from redux
  var { calDateRangeStart, calDateRangeEnd, calEvents, calCategories, calResources } = useSelector(state => state);
  
  const dispatch = useDispatch();
 
  const addEventSelected = (info) => {
    //console.log('EVENT SELECT')
    //console.log(info)
    const start = new DateTime.fromISO(info.startStr)
    const end = new DateTime.fromISO(info.endStr)
    const eventName = prompt("Set the title")
    if (eventName !== '' && eventName !== null) {
      dispatch({ 
        type: 'CREATE_EVENT', 
        payload: {
          title: eventName,
          start: start.toISODate(),
          end: end.toISODate(),
          id: uuidv4(),
          resourceId: info.resource.id,
          url: ''
        },
      });
    };
  };

  const renameEvent = (id) => {
    //console.log('EVENT CLICK')
    // check to see whether the button 'X' was clicked to delete the event
    const eventName = prompt("Set the title")
    if (eventName !== '' && eventName !== null) {
      dispatch({ 
        type: 'UPDATE_EVENT', 
        payload: {
          title: eventName,
          id: id,
        },
      });
    }
  };

  const setEventLink = (id) => {
    //console.log('EVENT CLICK')
    // check to see whether the button 'eventLink' was clicked to delete the event
    // allow setting a blank link ''
    const eventLinkName = prompt("Set the event link")
    dispatch({ 
      type: 'UPDATE_EVENT', 
      payload: {
        url: eventLinkName || '' ,
        id: id,
      },
    });
  };

  const eventResize = (info) => {
    const start = new DateTime.fromISO(info.event.start.toISOString());
    const end = new DateTime.fromISO(info.event.end.toISOString());
    // this will explicitly set the event end time
    dispatch({ 
      type: 'UPDATE_EVENT', 
      payload: {
        start: start.toISODate(),
        end: end.toISODate(),
        id: info.event.id,
      },
    });
  };

  const eventDrop = (info) => {
    const start = new DateTime.fromISO(info.event.start.toISOString());
    const end = new DateTime.fromISO(info.event.end.toISOString());
    let eventResource = ''
    // set the event end time
    if (info.newResource !== null) {
      eventResource = info.newResource.id;
    } else {
      eventResource = info.event.getResources()[0].id;
    }
    dispatch({ 
      type: 'UPDATE_EVENT', 
      payload: {
        start: start.toISODate(),
        end: end.toISODate(),
        id: info.event.id,
        resourceId: eventResource,
      },
    });
  };

  const toggleEventCategory = (id, curCategory) => {
    // choose the next category
    const catNameList = calCategories.map(category => category.name)
    const catColorList = calCategories.map(category => category.color)
    let curIndex = catNameList.indexOf(curCategory)
    if (curIndex  === catNameList.length - 1 || curIndex === -1) {
      curIndex = 0;
    } else {
      curIndex = curIndex + 1;
    }
    const newIndex = curIndex;
    const newCategory = catNameList[newIndex];
    const newColor = catColorList[newIndex];
    //Choose the event category
    // get a dropdown with the available categories
    dispatch({
      type: 'UPDATE_EVENT',
      payload: {
        category: newCategory,
        color: newColor,
        id: id,
      }
    })
  }

  const eventRender = (info) => {
    //console.log('EVENT RENDER');
    // SIDE EFFECT, how to move this outside of the eventContent location?
    /*
    if (info.event.extendedProps.category) {
      const eventCat = calCategories.filter(category => category.name === info.event.extendedProps.category) 
      if (eventCat.length > 0) {
        info.event.setProp('backgroundColor', eventCat[0].color);
        //info.el.style.backgroundColor = eventCat[0].color;
      }
    }
    */

    let editModeBtn = document.getElementById("editModeCheckbox");
    let editMode = true;
    if (editModeBtn !== null) {
      editMode = editModeBtn.checked;
    } 
    if (info.view.type === "ShortRange") {
      if (editMode) {
        return (
          <>
            <b>{info.event.title}</b>
            {' - '}
            <button onClick={() => renameEvent(info.event.id)}>Edit Name</button>
            {' - '}
            <button onClick={() => setEventLink(info.event.id)}>Edit Link</button>
            {' - '}
            <button onClick={() => toggleEventCategory(info.event.id, info.event.extendedProps.category)}>Toggle Cat</button>  
            {' - '}
            <button onClick={() => deleteEvent(info.event.id)}>X</button>
          </>
        )
      }
      return (
        <>
          <b>{info.event.title}</b> 
        </>
      )
    } else if (info.view.type === "LongRange") {
      if (editMode) {
        return (
          <>
            <b>{info.event.title}</b>
            {' - '}
            <b>{info.event.start.toISOString().slice(5,10)}</b>
            {' - '}
            <b>{info.event.end.toISOString().slice(5,10)}</b>
            {' - '}
            <button onClick={() => renameEvent(info.event.id)}>Edit Name</button>
            {' - '}
            <button onClick={() => setEventLink(info.event.id)}>Edit Link</button>
            {' - '}
            <button onClick={() => toggleEventCategory(info.event.id, info.event.extendedProps.category)}>Toggle Cat</button>  
            {' - '}
            <button onClick={() => deleteEvent(info.event.id)}>X</button>
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
  const deleteEvent = (id) => {
    //console.log('DELETE EVENT');
    dispatch({
      type: 'DELETE_EVENT',
      payload: {
        id: id,
      }
    })
  }

  const renameResource = (resource) => {
    //console.log('RENAME RESOURCE')
    //console.log(resource)
    const resourceName = prompt("Set the organization title")
    if (resourceName !== '' && resourceName !== null) {
      dispatch({ 
        type: 'UPDATE_ORG', 
        payload: {
          title: resourceName,
          id: resource.id,
        },
      });
    };
  }

  const resourceRender = (info) => {
    let editModeBtn = document.getElementById("editModeCheckbox");
    let editMode = true;
    if (editModeBtn !== null) {
      editMode = editModeBtn.checked;
    } 
    if (editMode) {
      return (
        <>
          {info.resource.title}
          {' - '}
          <button onClick={() => renameResource(info.resource)}>Change Name</button>  
        </>
      )  
    }
    return (
      <>
        {info.resource.title}
      </>
    )
  }

  const customSlotLabelContent = (arg) => {
    // for arg.level '1', display the FY Week (starting on week 1)
    if (arg.level === 1) {
      let calDate = DateTime.fromJSDate(arg.date);
      let fyStart = DateTime.local(2020, 10, 1);
      let weekDiff = calDate.diff(fyStart, ['weeks']);
      let weekNum = Math.ceil(weekDiff.weeks);
      return 'FY W' + weekNum;
      // get the date, calculate how many weeks after October 1st this date is
      // return that for the weeks
    } else if (arg.level === 2) {
      // here put in the 'T' week with relative 'T' + / - numbers
      // get the current date, calculate week differences
      let calDate = DateTime.fromJSDate(arg.date);
      let nowDate = DateTime.local();
      let weekDiff = calDate.diff(nowDate, ['weeks']);
      let weekNum = Math.ceil(weekDiff.weeks);
      if (weekNum > 0) {
        return 'T+' + weekNum;
      }
      return 'T' + weekNum;
    } else if (arg.level ===3 && arg.view.type === "LongRange") {
      // put in start / stop dates for the long range calendar week view
      let calDate = DateTime.fromJSDate(arg.date);
      let weekEndDate = calDate.plus({ days: 6 })
      return calDate.toFormat('ddMMM').toUpperCase() + ' - ' + weekEndDate.toFormat('ddMMM').toUpperCase()
    }
  }

  // make sure that the LongRange view starts on a Monday,
  // if not, then fullCalendar will not allow the left most date column
  // to be selected because it is not fully included in the visible range 
  const setLongRangeStartDate = () => {
    // take the input date and find the previous monday to set the start date in long range mode
    let calDateStart = DateTime.fromFormat(calDateRangeStart, 'yyyy-LL-dd');
    let newCalDateStart = calDateStart;
    // hacky way of making sure that the calendar starts on a Monday when set to week granularity
    while (newCalDateStart.weekday !== 1) {
      newCalDateStart = newCalDateStart.minus({ days: 1 })
    }
    return newCalDateStart.toISODate();
  }

  const setLongRangeEndDate = () => {
    // take the input date and find the next Monday to set the end date in long range mode
    let calDateEnd = DateTime.fromFormat(calDateRangeEnd, 'yyyy-LL-dd');
    let newCalDateEnd = calDateEnd;
    // hacky way of making sure that the calendar ends on a Monday when set to week granularity
    while (newCalDateEnd.weekday !== 1) {
      newCalDateEnd = newCalDateEnd.plus({ days: 1 })
    }
    return newCalDateEnd.toISODate();
  }

  var calendarRef = React.createRef();

  return (
    <React.Fragment>
      <FullCalendar
        ref={calendarRef}
        //added to suppress license key prompt
        schedulerLicenseKey={'GPL-My-Project-Is-Open-Source'}
        initialView={'ShortRange'}
        timeZone={'local'}
        plugins={[ interaction, resourceTimeline ]} 
        headerToolbar={{
          left: '',
          center: 'title',
          right: 'SuperShortRange ShortRange LongRange',
        }}
        editable={true}
        height={'auto'}
        views={{
          "SuperShortRange": {
            type: 'resourceTimeline',
            visibleRange: {
              start: calDateRangeStart,
              end: calDateRangeEnd, 
            },
            slotDuration: { minutes: 30 },
            slotLabelInterval: { hours: 1 },
            slotLabelFormat: [
              { month: 'short', year: '2-digit' },
              { week: 'short' },
              { week: 'short' },
              { day: 'numeric', weekday: 'narrow' },
              { hour: 'numeric' }
            ],
          },
          "ShortRange": {
            type: 'resourceTimeline',
            visibleRange: {
              start: calDateRangeStart,
              end: calDateRangeEnd, 
            },
            slotLabelInterval: { days: 1 },
            slotLabelFormat: [
              { month: 'short', year: '2-digit' },
              { week: 'short' },
              { week: 'short' },
              { day: 'numeric', weekday: 'narrow' },
            ],
          },
          "LongRange": {
            type: 'resourceTimeline',
            visibleRange: {
              // find the previous Monday to set the start date to before the selected date
              start: setLongRangeStartDate(),
              // find the next Monday to set the end date to after the selected date
              end: setLongRangeEndDate(), 
            },
            slotDuration: { weeks: 1 },
            slotLabelInterval: { weeks: 1 },
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
        events={calEvents}
        resources={calResources}
        selectable={true}
        eventResize={eventResize}
        eventDrop={eventDrop}
        select={addEventSelected}
        eventContent={eventRender}
        resourceAreaHeaderContent={'Organization'}
        // add a 'Change Name' button when displaying resources (Organizations) on the left column
        resourceLabelContent={resourceRender}
        // order the resources (Organizations) by Title
        resourceOrder={'title'}
        // set week to begin on Monday
        firstDay={'1'}
      />
    </React.Fragment>
  );
};

export default ResourceCalendar;
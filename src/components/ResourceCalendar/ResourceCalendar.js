import React from 'react';
import { useSelector } from 'react-redux';
import { useDispatch } from 'react-redux';
import FullCalendar from '@fullcalendar/react'
import resourceTimeline from '@fullcalendar/resource-timeline'
import interaction from '@fullcalendar/interaction'
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
    //debugger;

    let editMode = document.getElementById("editModeCheckbox").checked;
    //debugger;
    if (info.view.type === "ShortRange") {
      if (editMode) {
        return (
          <>
            <b>{info.event.title}</b>
            {' - '}
            <button onClick={() => renameEvent(info.event.id)}>Edit Name</button>
            {' - '}
            <button onClick={() => deleteEvent(info.event.id)}>X</button>
            {' - '}
            <button onClick={() => toggleEventCategory(info.event.id, info.event.extendedProps.category)}>Toggle Cat</button>  
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
            <button onClick={() => deleteEvent(info.event.id)}>X</button>
            {' - '}
            <button onClick={() => toggleEventCategory(info.event.id, info.event.extendedProps.category)}>Toggle Cat</button>  
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
    let editMode = document.getElementById("editModeCheckbox").checked;
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

  /*
  const resourceGroupRender = (info) => {
    // CONSTRAINT - the resource groups will always be within the resources
    if (info.groupValue !== undefined) {
      let calendarApi = calendarRef.current.getApi();
      let calResource = calendarApi.getResourceById(info.groupValue);
      //debugger;
      let resourceTitle = calResource.title;   
      return (
        <>
          {resourceTitle}
          {' - '}
          <button onClick={() => renameResource(calResource._resource)}>Change Name</button>  
        </>
      )
    } else {
      return (
        <>
          {""}
        </>
      )
    }   
  }
  */
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
      // get he current date, calculate week differences
      let calDate = DateTime.fromJSDate(arg.date);
      let nowDate = DateTime.local();
      let weekDiff = calDate.diff(nowDate, ['weeks']);
      let weekNum = Math.ceil(weekDiff.weeks);
      if (weekNum > 0) {
        return 'T+' + weekNum;
      }
      return 'T' + weekNum;
    }

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
          right: 'ShortRange LongRange',
        }}
        editable={true}
        height={'auto'}
        views={{
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
              { day: 'numeric' },
            ],
            slotLabelContent: customSlotLabelContent,
          },
          "LongRange": {
            type: 'resourceTimeline',
            visibleRange: {
              start: calDateRangeStart,
              end: calDateRangeEnd, 
            },
            slotLabelInterval: { weeks: 1 },
            slotLabelFormat: [
              { month: 'short', year: '2-digit' },
              { week: 'short' }
            ]
          }
        }}
        events={calEvents}
        resources={calResources}
        selectable={true}
        eventResize={eventResize}
        eventDrop={eventDrop}
        select={addEventSelected}
        eventContent={eventRender}
        resourceAreaHeaderContent={'Organization'}
        resourceLabelContent={resourceRender}
        resourceOrder={'title'}
        //resourceGroupField={'parent'}
        //resourceGroupLabelContent={resourceGroupRender}
      
      />
    </React.Fragment>
  );
};

export default ResourceCalendar;
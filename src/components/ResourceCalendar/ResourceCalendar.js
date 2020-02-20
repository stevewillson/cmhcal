import React from 'react';
import ReactDOM from 'react-dom';
import { useSelector } from 'react-redux';
import { useDispatch } from 'react-redux';
import FullCalendar from '@fullcalendar/react'
import resourceTimeline from '@fullcalendar/resource-timeline'
import interaction from '@fullcalendar/interaction'
import '../../assets/main.scss' // webpack must be configured to do this
import uuid from 'uuid';
import { DateTime } from 'luxon';

const ResourceCalendar = () => {
  // get state values from redux
  const calDateRangeStart = useSelector(state => state.calDateRangeStart)
  const calDateRangeEnd = useSelector(state => state.calDateRangeEnd)
  const calResources = useSelector(state => state.calResources);
  const calEvents = useSelector(state => state.calEvents);
  const calCategories = useSelector(state => state.calCategories);
  
  const dispatch = useDispatch();
 
  const addEventSelected = (info) => {
    console.log('EVENT SELECT TIME')
    console.log(info)
    const start = new DateTime.fromISO(info.startStr)
    const end = new DateTime.fromISO(info.endStr)
    const eventName = prompt("Set the title")
    if (eventName !== '' && eventName !== null) {
      dispatch({ 
        type: 'ADDEVENT', 
        payload: {
          event: {
            title: eventName,
            start: start.toISODate(),
            end: end.toISODate(),
            id: uuid.v4(),
            resourceId: info.resource.id,
          },
        },
      });
    };
    // when I use 'eventRender' the vertical spacing
    // of events is incorrect, rerender the calendar to
    // correct the spacing
    const calendarApi = calendarRef.current.getApi()
    calendarApi.render()
  };

  const renameEvent = (id) => {
    console.log('EVENT CLICK')
    // check to see whether the button 'X' was clicked to delete the event
    const eventName = prompt("Set the title")
    if (eventName !== '' && eventName !== null) {
      dispatch({ 
        type: 'EDITEVENTNAME', 
        payload: {
          event: {
            title: eventName,
            id: id,
          },
        },
      });
    }
    // when I use 'eventRender' the vertical spacing
    // of events is incorrect, rerender the calendar to
    // correct the spacing
    const calendarApi = calendarRef.current.getApi()
    calendarApi.render()
  };

  const eventResize = (info) => {
    //console.log('EVENT RESIZE OR DROP')
    //console.log(info)
    const start = new DateTime.fromISO(info.event.start.toISOString());
    const end = new DateTime.fromISO(info.event.end.toISOString());
    // this will explicitly set the event end time
    dispatch({ 
      type: 'EDITEVENTTIME', 
      payload: {
        event: {
          start: start.toISODate(),
          end: end.toISODate(),
          id: info.event.id,
        },
      },
    });
    // when I use 'eventRender' the vertical spacing
    // of events is incorrect, rerender the calendar to
    // correct the spacing
    const calendarApi = calendarRef.current.getApi()
    calendarApi.render()
  };

  const eventDrop = (info) => {
    //console.log('EVENT DROP')
    //console.log(info)
    const start = new DateTime.fromISO(info.event.start.toISOString());
    const end = new DateTime.fromISO(info.event.end.toISOString());
    // set the event end time
    if (info.newResource !== null) {
      dispatch({ 
        type: 'EDITEVENTRESOURCETIME', 
        payload: {
          event: {
            start: start.toISODate(),
            end: end.toISODate(),
            id: info.event.id,
            resourceId: info.newResource.id,
          },
        },
      });
    } else {
      dispatch({ 
        type: 'EDITEVENTTIME', 
        payload: {
          event: {
            start: start.toISODate(),
            end: end.toISODate(),
            id: info.event.id,
          },
        },
      });
    }
    // when I use 'eventRender' the vertical spacing
    // of events is incorrect, rerender the calendar to
    // correct the spacing
    const calendarApi = calendarRef.current.getApi()
    calendarApi.render()
  };

  const toggleEventCategory = (id, curCategory) => {
    // choose the next category
    const catNameList = calCategories.map(category => category.name)
    let curIndex = catNameList.indexOf(curCategory)
    if (curIndex  === catNameList.length - 1 || curIndex === -1) {
      curIndex = 0;
    } else {
      curIndex = curIndex + 1;
    }
    const newIndex = curIndex;
    const newCategory = catNameList[newIndex];
    
    //Choose the event category
    // get a dropdown with the available categories
    dispatch({
      type: 'EDITEVENTCATEGORY',
      payload: {
        event: {
          category: newCategory,
          id: id,
        }
      }
    })
  }

  const eventRender = (info) => {
    console.log('EVENT RENDER');
    //console.log(info);
    ReactDOM.render(
      <React.Fragment>
        <span className="fc-title-wrap">
          <span className="fc-title fc-sticky">
            {info.event.title}{' - '}
            <button onClick={() => renameEvent(info.event.id)}>Edit Name</button>
            {' - '}
            <button onClick={() => deleteEvent(info.event.id)}>X</button>
            {' - '}
            <button onClick={() => toggleEventCategory(info.event.id, info.event.extendedProps.category)}>Toggle Cat</button>
          </span>
        </span>
        <div className="fc-resizer fc-start-resizer"></div>
        <div className="fc-resizer fc-end-resizer"></div>
      </React.Fragment>,
      info.el
    );
    // check to see what category the event is associated with, get the color for that category
    if (info.event.extendedProps.category) {
      const eventCat = calCategories.filter(category => category.name === info.event.extendedProps.category) 
      if (eventCat.length > 0) {
        info.el.style.backgroundColor = eventCat[0].color;
      }
    }
  }

  const deleteEvent = (id) => {
    console.log('DELETE EVENT');
    dispatch({
      type: 'DELETEEVENT',
      payload: {
        id: id,
      }
    })
  }

  const renameResource = (resource) => {
    console.log('RENAME RESOURCE')
    console.log(resource)
    const resourceName = prompt("Set the organization title")
    if (resourceName !== '' && resourceName !== null) {
      dispatch({ 
        type: 'EDITORGNAME', 
        payload: {
          resource: {
            title: resourceName,
            id: resource.id,
          },
        },
      });
    };
    // when I use 'eventRender' the vertical spacing
    // of events is incorrect, rerender the calendar to
    // correct the spacing
    const calendarApi = calendarRef.current.getApi()
    calendarApi.render()
  }

  const resourceRender = (info) => {
    //console.log('RESOURCE RENDER')
    //console.log(info)
    info.el.addEventListener("click", () => renameResource(info.resource))
  }

  const calendarRef = React.useRef()

  return (
    <React.Fragment>
      <FullCalendar 
        ref={calendarRef}
        //added to suppress license key prompt
        schedulerLicenseKey={'GPL-My-Project-Is-Open-Source'}
        defaultView={'RefreshView'}
        timeZone={'local'}
        plugins={[ interaction, resourceTimeline ]} 
        resourceLabelText={'Organization'}
        header={{
          left: '',
          center: 'title',
          right: 'RefreshView',
        }}
        editable={true}
        height={'auto'}
        views={{
          RefreshView: {
            type: 'resourceTimeline',
            visibleRange: {
              start: calDateRangeStart,
              end: calDateRangeEnd, 
            },
          }
        }}
        slotLabelInterval={{ days: 1 }}
        events={calEvents}
        resources={calResources}
        selectable={true}
        //eventClick={eventClick}
        eventResize={eventResize}
        eventDrop={eventDrop}
        select={addEventSelected}
        eventRender={eventRender}
        resourceRender={resourceRender}
      />
    </React.Fragment>
  );
};

export default ResourceCalendar;
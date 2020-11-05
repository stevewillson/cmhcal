import React from 'react';
import { useSelector } from 'react-redux';
import { useDispatch } from 'react-redux';
import FullCalendar from '@fullcalendar/react'
import resourceTimeline from '@fullcalendar/resource-timeline'
import interaction from '@fullcalendar/interaction'
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
    //console.log('EVENT SELECT')
    //console.log(info)
    const start = new DateTime.fromISO(info.startStr)
    const end = new DateTime.fromISO(info.endStr)
    const eventName = prompt("Set the title")
    if (eventName !== '' && eventName !== null) {
      dispatch({ 
        type: 'CREATE_EVENT', 
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
  };

  const renameEvent = (id) => {
    //console.log('EVENT CLICK')
    // check to see whether the button 'X' was clicked to delete the event
    const eventName = prompt("Set the title")
    if (eventName !== '' && eventName !== null) {
      dispatch({ 
        type: 'UPDATE_EVENT', 
        payload: {
          event: {
            title: eventName,
            id: id,
          },
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
        event: {
          start: start.toISODate(),
          end: end.toISODate(),
          id: info.event.id,
        },
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
        event: {
          start: start.toISODate(),
          end: end.toISODate(),
          id: info.event.id,
          resourceId: eventResource,
        },
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
      type: 'EDITEVENTCATEGORY',
      payload: {
        event: {
          category: newCategory,
          color: newColor,
          id: id,
        }
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
          resource: {
            title: resourceName,
            id: resource.id,
          },
        },
      });
    };
  }

  const resourceRender = (info) => {
    return (
      <>
        {info.resource.title}
        {' - '}
        <button onClick={() => renameResource(info.resource)}>Change Name</button>  
      </>
    )
  }

  return (
    <React.Fragment>
      <FullCalendar 
        //added to suppress license key prompt
        schedulerLicenseKey={'GPL-My-Project-Is-Open-Source'}
        initialView={'RefreshView'}
        timeZone={'local'}
        plugins={[ interaction, resourceTimeline ]} 
        resourceAreaHeaderContent={'Organization'}
        headerToolbar={{
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
        eventResize={eventResize}
        eventDrop={eventDrop}
        select={addEventSelected}
        eventContent={eventRender}
        resourceLabelContent={resourceRender}
        resourceOrder={'title'}
      
      />
    </React.Fragment>
  );
};

export default ResourceCalendar;
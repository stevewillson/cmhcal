// allow the calendar to abstract the backend for future extension
// put the 'dispatch' actions here, add backend 'requests' in future
// import { requestEventsInRange, requestEventCreate, requestEventUpdate, requestEventDelete } from './requests'

import { store } from '../../configureStore';

export const createEvent = (plainEventObject) => {
  store.dispatch({ 
    type: 'CREATE_EVENT', 
    payload: {
      title: plainEventObject.title,
      start: plainEventObject.start.toISOString().replace(/T.*$/, ''),
      end: plainEventObject.end.toISOString().replace(/T.*$/, ''),
      id: plainEventObject.id,
      resourceId: plainEventObject.getResources()[0]._resource.id,
      url: plainEventObject.url,
      color: plainEventObject.backgroundColor,
      extendedProps: { category: plainEventObject.extendedProps.category }
    },
  });
}

export const updateEvent = (plainEventObject) => {
  store.dispatch({ 
    type: 'UPDATE_EVENT', 
    payload: {
      title: plainEventObject.title,
      start: plainEventObject.start.toISOString().replace(/T.*$/, ''),
      end: plainEventObject.end.toISOString().replace(/T.*$/, ''),
      id: plainEventObject.id,
      resourceId: plainEventObject.getResources()[0]._resource.id,
      url: plainEventObject.url,
      category: plainEventObject.extendedProps.category,
      color: plainEventObject.backgroundColor
    },
  });
}

export const deleteEvent = (eventId) => {
  store.dispatch({
    type: 'DELETE_EVENT',
    payload: {
      id: eventId,
    }
  })
}
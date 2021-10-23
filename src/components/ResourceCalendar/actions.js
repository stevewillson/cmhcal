// allow the calendar to abstract the backend for future extension
// put the 'dispatch' actions here, add backend 'requests' in future
// import { requestEventsInRange, requestEventCreate, requestEventUpdate, requestEventDelete } from './requests'

import { store } from '../../configureStore';

export const createEvent = (plainEventObject) => {
  store.dispatch({ 
    type: 'CREATE_EVENT', 
    payload: {
      start: plainEventObject.startStr,
      end: plainEventObject.endStr,
      title: plainEventObject.title,
      id: plainEventObject.id,
      resourceId: plainEventObject.getResources()[0]._resource.id,
      url: plainEventObject.url,
      category: plainEventObject.extendedProps.category,
      categoryId: plainEventObject.extendedProps.categoryId,
      color: plainEventObject.backgroundColor,
      textColor: plainEventObject.textColor,
    },
  });
}

export const updateEvent = (plainEventObject) => {
  store.dispatch({ 
    type: 'UPDATE_EVENT', 
    payload: {
      title: plainEventObject.title,
      start: plainEventObject.startStr,
      end: plainEventObject.endStr,
      id: plainEventObject.id,
      resourceId: plainEventObject.getResources()[0]._resource.id,
      url: plainEventObject.url,
      category: plainEventObject.extendedProps.category,
      categoryId: plainEventObject.extendedProps.categoryId,
      color: plainEventObject.backgroundColor,
      textColor: plainEventObject.textColor,
    },
  });
}

export const updateEventCategory = (eventId, categoryName, categoryId, eventColor, eventTextColor) => {
  store.dispatch({ 
    type: 'UPDATE_EVENT', 
    payload: {
      id: eventId,
      category: categoryName,
      categoryId: categoryId,
      color: eventColor,
      textColor: eventTextColor,
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
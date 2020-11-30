// this will be where the 'dispatch' actions are
// allow the calendar to abstract the backend for future extension

// put the 'dispatch' actions here for now
// import { requestEventsInRange, requestEventCreate, requestEventUpdate, requestEventDelete } from './requests'

import { store } from '../../configureStore';

export const createEvent = (plainEventObject) => {
  store.dispatch({ 
    type: 'CREATE_EVENT', 
    payload: {
      title: plainEventObject.title,
      start: plainEventObject.start.toISOString().slice(0.10),
      end: plainEventObject.end.toISOString().slice(0,10),
      id: plainEventObject.id,
      resourceId: plainEventObject.getResources()[0]._resource.id,
      url: ''
    },
  });
}

export const updateEvent = (plainEventObject) => {
// check how the event was changed, update only that part of the event

  //debugger;
  store.dispatch({ 
    type: 'UPDATE_EVENT', 
    payload: {
      title: plainEventObject.title,
      start: plainEventObject.start.toISOString().slice(0.10),
      end: plainEventObject.end.toISOString().slice(0,10),
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

  /*

  updateEvent(plainEventObject) {
    return (dispatch) => {
      return requestEventUpdate(plainEventObject).then(() => {
        dispatch({
          type: 'UPDATE_EVENT',
          plainEventObject
        })
      })
    }
  },

  deleteEvent(eventId) {
    return (dispatch) => {
      return requestEventDelete(eventId).then(() => {
        dispatch({
          type: 'DELETE_EVENT',
          eventId
        })
      })
    }
  }

  */
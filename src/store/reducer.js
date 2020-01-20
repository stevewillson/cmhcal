import { DateTime } from 'luxon';
const calDateRangeStart = DateTime.local().toFormat('yyyy-MM-dd');
const calDateRangeEnd = DateTime.local().plus({ days: 30 }).toFormat('yyyy-MM-dd');

const initialState = {
  calEvents: [],
  calResources: [],
  calDateRangeStart: calDateRangeStart,
  calDateRangeEnd: calDateRangeEnd,
}

const reducer = (state = initialState, action) => {
    // ADD EVENTS
  if (action.type === 'ADDEVENT') {
    const updatedEvents = [...state.calEvents, action.payload.event]
    return {
      ...state,
      calEvents: updatedEvents,
    }
  } else if (action.type === 'EDITEVENTNAME') {
    // need to update to update the name supplied
    // find the event that matches the id
    let events = [];
    events = state.calEvents.slice()
    const updatedEvents = events.map(event => {
      if (event.id === action.payload.event.id) {
        return {
          ...event,
          title: action.payload.event.title,
        }
      }
      return {
        ...event
      };
    })
    return {
      ...state,
      calEvents: updatedEvents,
    }
  } else if (action.type === 'EDITORGNAME') {
    // need to update to update the name supplied
    // find the event that matches the id
    let resources = [];
    resources = state.calResources.slice()
    const updatedResources = resources.map(resource => {
      if (resource.id === action.payload.resource.id) {
        return {
          ...resource,
          title: action.payload.resource.title,
        }
      }
      return {
        ...resource
      };
    })
    return {
      ...state,
      calResources: updatedResources,
    }
  
  } else if (action.type === 'EDITEVENTTIME') {
    // find the event that matches the id do not edit the resource that the event is associated with

    let events = [];
    events = state.calEvents.slice()
   
    const updatedEvents = events.map(event => {
      if (event.id === action.payload.event.id) {
        return {
          ...event,
          start: action.payload.event.start,
          end: action.payload.event.end,
        }
      }
      return {
        ...event
      };
    })
    return {
      ...state,
      calEvents: updatedEvents,
    }
  } else if (action.type === 'EDITEVENTRESOURCETIME') {
    // find the event that matches the id
    let events = [];
    events = state.calEvents.slice()
   
    const updatedEvents = events.map(event => {
      if (event.id === action.payload.event.id) {
        return {
          ...event,
          start: action.payload.event.start,
          end: action.payload.event.end,
          resourceId: action.payload.event.resourceId,
        }
      }
      return {
        ...event
      };
    })
    return {
      ...state,
      calEvents: updatedEvents,
    }
  } else if (action.type === 'ADDORG') {
    const updatedOrgs = [...state.calResources, { id: action.payload.id, title: action.payload.title }];
    // TODO: check if the org already exists in the array, if yes do not add it
    return {
      ...state,
      calResources: updatedOrgs,
    }
  } else if (action.type === 'IMPORTDATA') {
    // import the data that was read from the file
    return {
      ...state,
      calEvents: action.payload.calEvents,
      calResources: action.payload.calResources,
      calDateRangeStart: action.payload.calDateRangeStart,
      calDateRangeEnd: action.payload.calDateRangeEnd,
    }
  } else if (action.type === 'CALDATERANGESTART') {
  // import the data that was read from the file
    return {
      ...state,
      calDateRangeStart: action.payload.date,
    }
  } else if (action.type === 'CALDATERANGEEND') {
  // import the data that was read from the file
    return {
      ...state,
      calDateRangeEnd: action.payload.date,
    }
  } else if (action.type === 'DELETEEVENT') {
    let newCalEvents = state.calEvents.slice()
    newCalEvents = newCalEvents.filter(event => event.id !== action.payload.id);
    return {
      ...state,
      calEvents: newCalEvents
    }
  } else if (action.type === 'DELETEORG') {
    let newCalResources = state.calResources.slice()
    newCalResources = newCalResources.filter(resource => resource.id !== action.payload.id);
    return {
      ...state,
      calResources: newCalResources
    }
  }
  return state;
}

export default reducer;
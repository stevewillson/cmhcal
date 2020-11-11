import { DateTime } from 'luxon';
const calDateRangeStart = DateTime.local().toFormat('yyyy-MM-dd');
const calDateRangeEnd = DateTime.local().plus({ days: 30 }).toFormat('yyyy-MM-dd');

const initialState = {
  calEvents: [],
  calResources: [],
  calCategories: [],
  calDateRangeStart: calDateRangeStart,
  calDateRangeEnd: calDateRangeEnd,
  datePickerStartDate: new Date(),
}

const reducer = (state = initialState, action) => {
  // EVENT MANIPULATION
  // ADD EVENTS
  if (action.type === 'CREATE_EVENT') {
    const updatedEvents = [...state.calEvents, action.payload]
    return {
      ...state,
      calEvents: updatedEvents,
    }
  } else if (action.type === 'UPDATE_EVENT') {
    // need to update to update the name supplied
    // find the event that matches the id
    let events = state.calEvents.slice()
    const updatedEvents = events.map(event => {
      if (event.id === action.payload.id) {
        // only update things that are set in the action.payload
        let newStart = action.payload.start || event.start;
        let newEnd = action.payload.end || event.end;
        let newTitle = action.payload.title || event.title;
        let newResourceId = action.payload.resourceId || event.resourceId;
        let newCategory = action.payload.category || event.category;
        let newColor = action.payload.color || event.color;
        return {
          ...event,
          start: newStart,
          end: newEnd,
          title: newTitle,
          resourceId: newResourceId,
          category: newCategory,
          color: newColor,
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
  // DELETE EVENT
  } else if (action.type === 'DELETE_EVENT') {
    let newCalEvents = state.calEvents.slice()
    newCalEvents = newCalEvents.filter(event => event.id !== action.payload.id);
    return {
      ...state,
      calEvents: newCalEvents
    }
  // ORG (RESOURCE) MANIPULATION
  // ADD ORG
  // Organizations will have a 'children' key that is an array of their children
  // id: uuidv4, title: string, children: [] 
  } else if (action.type === 'CREATE_ORG') {
    const origOrgs = [...state.calResources];
    let newOrgs;
    // append the organization as a child of the org with id: ID
    if (action.payload.parent !== "None") {
      newOrgs = origOrgs.map(org => {
        if(org.id === action.payload.parent) {
          // check to see if there is a 'children' property
          // if not, create an empty 'children' array
          if (!org.hasOwnProperty('children')) {
            org.children = [];
          }
          // TODO: Add way to next organizations to arbitrary depth, 
          // currently only allow 1 level deep
          org.children.push(
            { 
              "id": action.payload.id,
              "title": action.payload.title,
              "children": [],
            }
          )
        }
        return org;
      })  
    } else {
      debugger
      newOrgs = [
        ...state.calResources, 
        { 
          "id": action.payload.id, 
          "title": action.payload.title,
          "children": [], 
        }
      ];
    }
    // TODO: check if the org already exists in the array, if yes do not add it
    return {
      ...state,
      calResources: newOrgs,
    }
  // EDIT ORG NAME
  } else if (action.type === 'UPDATE_ORG') {
    // need to update consoleto update the name supplied
    // find the event that matches the id
    let resources = [];
    resources = state.calResources.slice()
    const updatedResources = resources.map(resource => {
      if (resource.id === action.payload.id) {
        return {
          ...resource,
          title: action.payload.title,
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
  } else if (action.type === 'DELETE_ORG') {
    let newCalResources = state.calResources.slice()
    newCalResources = newCalResources.filter(resource => resource.id !== action.payload.id);
    return {
      ...state,
      calResources: newCalResources
    }
  // CATEGORY MANIPULATION
  } else if (action.type === 'CREATE_CATEGORY') {
    const newCategories = [...state.calCategories, { 
      id: action.payload.id, 
      name: action.payload.name, 
      color: action.payload.color 
    }]
    return {
      ...state,
      calCategories: newCategories
    }

  } else if (action.type === 'UPDATE_CATEGORY') {
    // INSERT CODE FOR UPDATING A CATEGORY NAME HERE
  } else if (action.type === 'DELETE_CATEGORY') {
    let newCalCategories = state.calCategories.slice()
    newCalCategories = newCalCategories.filter(resource => resource.id !== action.payload.id);
    return {
      ...state,
      calCategories: newCalCategories
    }
  } else if (action.type === 'IMPORT_DATA') {
    // import the data that was read from the file
    return {
      ...state,
      calEvents: action.payload.calEvents,
      calResources: action.payload.calResources,
      calCategories: action.payload.calCategories,
      calDateRangeStart: action.payload.calDateRangeStart,
      calDateRangeEnd: action.payload.calDateRangeEnd,
    }
  } else if (action.type === 'CAL_DATE_RANGE_START') {
  // import the data that was read from the file
    return {
      ...state,
      calDateRangeStart: action.payload.date,
    }
  } else if (action.type === 'CAL_DATE_RANGE_END') {
  // import the data that was read from the file
    return {
      ...state,
      calDateRangeEnd: action.payload.date,
    }
  }
  return state;
}

export default reducer;
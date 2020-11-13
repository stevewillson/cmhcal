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

  // take an initial object, a label, search value (id) and newValue
  // go through the object until the particular ID is found, then update that object
  // object = calResource
  // key 'id'
  // val 'parentId'
  // if found, then set 'children' to newVal
  var updateObjectById = function(obj, key, val, newVal) {
    var newValue = newVal;
    var objects = [];
    for (var i in obj) {
      if (!obj.hasOwnProperty(i)) { continue };
      if (typeof obj[i] == 'object') {
        objects = objects.concat(updateObjectById(obj[i], key, val, newValue));
      } else if (i === key && obj[key] === val) {
        if (!obj.hasOwnProperty('children')) {
          obj.children = [];  
        }
        obj.children.push(newVal)
      }
    }
    return obj
  }
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
        let newUrl = action.payload.url || event.url;
        return {
          ...event,
          start: newStart,
          end: newEnd,
          title: newTitle,
          resourceId: newResourceId,
          category: newCategory,
          color: newColor,
          url: newUrl,
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
    let orgCopy;
    let newOrgs;
    // create a 'deep copy' of the array
    if (state.calResources !== undefined) {
      orgCopy = JSON.parse(JSON.stringify(state.calResources));
    }

    // append the organization as a child of the org with id: ID
    if (action.payload.parent === "None") {
      newOrgs = orgCopy;
      newOrgs.push({
        "id": action.payload.id,
        "title": action.payload.title,
        "children": [],
      })
    } else {
      newOrgs = updateObjectById(orgCopy, 'id', action.payload.parent, 
        {
          "id": action.payload.id,
          "title": action.payload.title,
          "children": [],
        }
        )
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
  } else if(action.type === 'PURGE_CALENDAR') {
    //console.log('Purging calendar')
    return initialState;
  }
  return state;
}

export default reducer;
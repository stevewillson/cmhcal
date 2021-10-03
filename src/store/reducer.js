import { DateTime } from 'luxon';
import { v4 as uuidv4 } from 'uuid';

const calDateRangeStart = DateTime.local().toFormat('yyyy-MM-dd');
const calDateRangeEnd = DateTime.local().plus({ weeks: 6 }).toFormat('yyyy-MM-dd');

const calResourceUuid = uuidv4();
const calEventUuid = uuidv4();
const calCategoryUuid = uuidv4();

const defaultCalResources = [
  {
    "id": calResourceUuid,
    "title":"Org 1",
    "parentId":"",
  }];

const defaultCalEvents = [
  {
    "title":"Event 1",
    "start": DateTime.local().plus({ days: 3 }).toFormat('yyyy-MM-dd'),
    "end": DateTime.local().plus({ days: 8 }).toFormat('yyyy-MM-dd'),
    "id": calEventUuid,
    "resourceId": calResourceUuid,
    "category":"Category 1",
    "color":"orange",
    "url":"",
  }];

const defaultCalCategories = [
  {
    "id": calCategoryUuid,
    "name":"Category 1",
    "color":"orange",
  }];

const initialState = {
  calEvents: defaultCalEvents,
  calResources: defaultCalResources,
  calCategories: defaultCalCategories,
  calDateRangeStart: calDateRangeStart,
  calDateRangeEnd: calDateRangeEnd,
  datePickerStartDate: new Date(),
  editMode: true,
  displayCategories: true,
  displayOrganizations: true,
}

const emptyState = {
  calEvents: [],
  calResources: [],
  calCategories: [],
  calDateRangeStart: calDateRangeStart,
  calDateRangeEnd: calDateRangeEnd,
  datePickerStartDate: new Date(),
  editMode: true,
  displayCategories: true,
  displayOrganizations: true,
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
      calEvents: newCalEvents,
    }
  // ORG (RESOURCE) MANIPULATION
  // ADD ORG
  // Organizations will have a 'parentId' key that connects them with their parent organization
  // id: uuidv4, title: string, parentId: uuidv4
  } else if (action.type === 'CREATE_ORG') {
    let orgCopy;
    let newOrgs;
    let parentId;
    // create a 'deep copy' of the array
    if (state.calResources !== undefined) {
      orgCopy = JSON.parse(JSON.stringify(state.calResources));
    } else {
      orgCopy = [];
    }

    newOrgs = orgCopy;
    // append the organization as a child of the org with id: ID
    
    // set the parent id to either "" or the uuid of the parent
    parentId = action.payload.parent === "None" ? "" : action.payload.parent;

    newOrgs.push({
      "id": action.payload.id,
      "title": action.payload.title,
      "parentId": parentId,
    })
    // TODO: check if the org already exists in the array, if yes do not add it
    return {
      ...state,
      calResources: newOrgs,
    }
  // EDIT ORG NAME
  } else if (action.type === 'UPDATE_ORG') {
    // find the organization that matches the id
    const updatedResources = state.calResources.map(resource => {
      if (resource.id === action.payload.id) {
        return {
          ...resource,
          // set that organization's title
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
    // remove the resource that contains the uuid
    // also remove resources that have it as the 'parentId'
    let parentId = action.payload.id;

    let resourcesToDelete = [];
    resourcesToDelete.push(parentId);

    // create a structure that has a child/parent connection
    let parentAndChildObj = state.calResources.map(resource => {
      return {
        child: resource.id,
        parent: resource.parentId,
      }});

    // iterate through the parentAndChildObj to check to see if there are occurrences of 
    // parent, if there are, add them to the resourcesToDelete, if there are none, then break

    while (true) {
      let checkAgain = false;
      parentAndChildObj.forEach(parChild => {
        if (resourcesToDelete.indexOf(parChild.parent) !== -1) {
          resourcesToDelete.push(parChild.child)
          checkAgain = true;
        }
      })
      // only keep the resources that are not in the resources to delete array
      parentAndChildObj = parentAndChildObj.filter(parChild => resourcesToDelete.indexOf(parChild.parent) === -1)
      if (checkAgain === false) {
        break;
      }
    }
    
    let newCalResources = state.calResources.slice();
    // filter out resource ids that are not present in the calResources array
    newCalResources = newCalResources.filter(resource => resourcesToDelete.indexOf(resource.id) === -1);
    return {
      ...state,
      calResources: newCalResources,
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
      calCategories: newCategories,
    }

  } else if (action.type === 'UPDATE_CATEGORY_NAME') {
    // need to update console to update the name supplied
    // find the event that matches the id
    const updatedCategories = state.calCategories.map(category => {
      if (category.id === action.payload.id) {
        return {
          ...category,
          name: action.payload.name,
        };
      }
      return {
        ...category
      };
    })
    return {
      ...state,
      calCategories: updatedCategories,
    }

  } else if (action.type === 'UPDATE_CATEGORY_COLOR') {
    // need to update console to update the name supplied
    // find the event that matches the id
    const updatedCategories = state.calCategories.map(category => {
      if (category.id === action.payload.id) {
        return {
          ...category,
          color: action.payload.color,
        };
      }
      return {
        ...category
      };
    })
    return {
      ...state,
      calCategories: updatedCategories,
    }
  } else if (action.type === 'DELETE_CATEGORY') {
    let newCalCategories = state.calCategories.slice()
    newCalCategories = newCalCategories.filter(resource => resource.id !== action.payload.id);
    return {
      ...state,
      calCategories: newCalCategories,
    }
  } else if (action.type === 'CAL_DATE_RANGE_START') {
  // import the data that was read from the file
    if (action.payload.date !== '') {
      return {
        ...state,
        calDateRangeStart: action.payload.date,
      }  
    }
  } else if (action.type === 'CAL_DATE_RANGE_END') {
  // import the data that was read from the file
    if (action.payload.date !== '') {
      return {
        ...state,
        calDateRangeEnd: action.payload.date,
      }  
    }
  } else if (action.type === 'CAL_UUID') {
    // import the data that was read from the file
      if (action.payload.uuid !== '') {
        return {
          ...state,
          calUUID: action.payload.uuid,
        }  
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
      calUUID: action.payload.calUUID,
    }
  } else if(action.type === 'PURGE_CALENDAR') {
    //console.log('Purging calendar')
    //return initialState;
    if (action.payload.purgeType === 'initial') {
      return initialState;
    } else if (action.payload.purgeType === 'yes') {
      return emptyState;
    }
  } else if(action.type === 'SET_EDIT_MODE') {
    return {
      ...state,
      editMode: action.payload.editModeOn,
    }
  } else if(action.type === 'SET_DISPLAY_ORGANIZATIONS') {
    return {
      ...state,
      displayOrganizations: action.payload.displayOrganizations,
    }
  } else if(action.type === 'SET_DISPLAY_CATEGORIES') {
    return {
      ...state,
      displayCategories: action.payload.displayCategories,
    }
  }
  return state;
}

export default reducer;
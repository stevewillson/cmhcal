import { DateTime } from 'luxon';
import { v4 as uuidv4 } from 'uuid';

import '../components/helperFunctions';

const calDateRangeStart = DateTime.local().toFormat('yyyy-MM-dd');
const calDateRangeEnd = DateTime.local().plus({ weeks: 6 }).toFormat('yyyy-MM-dd');

const calResourceUuid = uuidv4();
const calEventUuid = uuidv4();
const calCategoryUuid = uuidv4();

const defaultCalResources = [
  {
    "id": calResourceUuid,
    "title":"Org 1",
    "children":[]
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
    "url": '',
  }];

const defaultCalCategories = [
  {
    "id": calCategoryUuid,
    "name":"Category 1",
    "color":"orange"
  }];

const initialState = {
  calEvents: defaultCalEvents,
  calResources: defaultCalResources,
  calCategories: defaultCalCategories,
  calDateRangeStart: calDateRangeStart,
  calDateRangeEnd: calDateRangeEnd,
  datePickerStartDate: new Date(),
  editMode: true,
}

const emptyState = {
  calEvents: [],
  calResources: [],
  calCategories: [],
  calDateRangeStart: calDateRangeStart,
  calDateRangeEnd: calDateRangeEnd,
  datePickerStartDate: new Date(),
  editMode: true,
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
    } else {
      orgCopy = [];
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
    // need to update console to update the name supplied
    // find the event that matches the id
    let flatObj = JSON.flatten(state.calResources);
    let flatObjKeys = Object.keys(flatObj);
    let path = '';
    for (var i = 0; i < flatObjKeys.length; i = i + 1) {
      if (flatObj[flatObjKeys[i]] === action.payload.id) {
        // found the object! now get the path
        path = flatObjKeys[i];
      }
      if (path !== '') {
        break;
      }
    }
    // remove the trailing '.id' from the path
    let modPath = path.slice(0,-3);
    
    // modify the object at modPath + .'title'
    flatObj[modPath + '.title'] = action.payload.title;

    // rebuild the nested object using unflatten
    let newCalResources = JSON.unflatten(flatObj);
    
    return {
      ...state,
      calResources: newCalResources
    }

  } else if (action.type === 'DELETE_ORG') {
    let flatObj = JSON.flatten(state.calResources);

    // make a full copy of the calResources object
    var newCalResources = JSON.unflatten(flatObj);

    let flatObjKeys = Object.keys(flatObj);
    var path = '';
    for (let i = 0; i < flatObjKeys.length; i = i + 1) {
      if (flatObj[flatObjKeys[i]] === action.payload.id) {
        // found the object! now get the path
        path = flatObjKeys[i];
      }
      if (path !== '') {
        break;
      }
    }
    // have the path now remove the last bit of the path
    // remove the last three characters, it's the '.id'
    let modPath = path.slice(0,-3);

    let pathParts = modPath.split('.');

    // remove the object specified by the path in the object
    pathParts.reduce ((acc, key, index) => {
      if (index === pathParts.length - 1) {
        let keyNum = parseInt(key);
        // at the lowest child node, now remove the particular object
        acc.splice(keyNum, 1)
        return acc;
      }
      return acc[key];
    }, newCalResources)

    // newCalResources is modified with the target value removed

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
    // need to update console to update the name supplied
    // find the event that matches the id
    const updatedCategories = state.calCategories.map(category => {
      if (category.id === action.payload.id) {
        return {
          ...category,
          name: action.payload.title,
        }
      }
      return {
        ...category
      };
    })
    return {
      ...state,
      calCategories: updatedCategories,
    }
    // TODO, update the event category names to match the new category

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
  }
  return state;
}

export default reducer;
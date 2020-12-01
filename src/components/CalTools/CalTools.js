import React from 'react';
import { useSelector } from 'react-redux';
import { useDispatch } from 'react-redux';

import DateRangeSelect from './DateRangeSelect';

import AddOrganizationDisplay from './AddOrganizationDisplay';
import AddCategoryDisplay from './AddCategoryDisplay';
import CategoryDisplay from './CategoryDisplay';
import OrganizationDisplay from './OrganizationDisplay';

const CalTools = () => {
  const dispatch = useDispatch();

  // get state values from redux
  const calState = useSelector(state => { 
    return { 
      calEvents: state.calEvents, 
      calResources: state.calResources, 
      calCategories: state.calCategories,
      calDateRangeStart: state.calDateRangeStart, 
      calDateRangeEnd: state.calDateRangeEnd, 
    }})

  const importData = async (event) => {
    const importFile = event.target.files[0];
    try {
      const fileContents = await readFile(importFile);
      const jsonData = JSON.parse(fileContents)

      // iterate through the events in the import file and import them in one by one
      // set the state here from redux

      // if there are no events on the calendar, use the 'import data' function
      if (calState.calEvents.length === 0) {
        // the calendar is empty, just add the resources
        dispatch({
          type: 'IMPORT_DATA',
          payload: {
            calEvents: jsonData.calEvents,
            calResources: jsonData.calResources,
            calCategories: jsonData.calCategories,
            calDateRangeStart: jsonData.calDateRangeStart,
            calDateRangeEnd: jsonData.calDateRangeEnd,
          },
        });  
      } else {
        const curCalResourceIds = calState.calResources.map(resource => resource.id);
        const curCalCategoryIds = calState.calCategories.map(category => category.id);
        const curCalEventIds = calState.calEvents.map(event => event.id);
        // first create resources and categories
        jsonData.calResources.forEach(resource => {
          if (curCalResourceIds.indexOf(resource.id) === -1) {
            dispatch({ 
              type: 'CREATE_ORG', 
              payload: {
                title: resource.title,
                id: resource.id,        
              },
            });
          }
        })
        jsonData.calCategories.forEach(category =>{
          if (curCalCategoryIds.indexOf(category.id) === -1) {
            dispatch({ 
              type: 'CREATE_CATEGORY', 
              payload: {
                id: category.id,
                name: category.name,
                color: category.color,       
              },
            });
          }
        })
        jsonData.calEvents.forEach(event => {
          if (curCalEventIds.indexOf(event.id) === -1) {
            dispatch({ 
              type: 'CREATE_EVENT', 
              payload: {
                title: event.title,
                start: event.start,
                end: event.end,
                id: event.id,
                resourceId: event.resourceId,
                color: event.color || '',
                url: event.url || '',
              },
            });
          }
        })
      }
      // if there are events, then append the events and add categories
    } catch (e) {
      console.log(e.message);
    }
  };

  // read the binary contents of the file
  const readFile = file => {
    const temporaryFileReader = new FileReader();
    return new Promise((resolve, reject) => {
      temporaryFileReader.onerror = () => {
        temporaryFileReader.abort();
        reject(new DOMException('Problem parsing input file.'));
      };
      temporaryFileReader.onload = () => {
        let text = temporaryFileReader.result;
        resolve(text);
      }
      temporaryFileReader.readAsText(file);
    });
  };

  const exportData = (state) => {
    const outData = JSON.stringify(state);
    //Download the file as a JSON formatted text file
    var downloadLink = document.createElement("a");
    var blob = new Blob(["\ufeff", outData]);
    var url = URL.createObjectURL(blob);
    downloadLink.href = url;
    const outFileName = 'cmhcal_output.txt'
    downloadLink.download = outFileName;  //Name the file here
    document.body.appendChild(downloadLink);
    downloadLink.click();
    document.body.removeChild(downloadLink);
  }

  const purgeCalendar = () => {
    let purgePrompt = prompt("Type 'yes' to confirm clearing the calendar,\ntype 'initial' to load a new default state");
    dispatch({
      type: 'PURGE_CALENDAR',
      payload: {
        purgeType: purgePrompt,
      }
    })  
  }

  const toggleEditMode = (event) => {
    dispatch({
      type: 'SET_EDIT_MODE',
      payload: {
        editModeOn: event.target.checked,
      }
    })
  }

  return (
    <React.Fragment>
      <div className="top-tools">
        <label htmlFor='importDataFile'>Import File:</label>
        <input 
          type="file" 
          id="importDataFile" 
          onChange={importData}
        />
        <button onClick={() => exportData(calState)}>Export</button>
        <button  
          onClick={() => purgeCalendar()} 
        >
          Clear Calendar and Local Storage
        </button>
      </div>
      <DateRangeSelect />
      <AddOrganizationDisplay />
      <AddCategoryDisplay />
      <div>
        <input
          type="checkbox" 
          id="editModeCheckbox"
          defaultChecked={true}
          // set the redux state to capture 'editMode' for shared state
          onChange={toggleEditMode}
        />
        <label htmlFor="editModeCheckbox">Edit Mode On</label>
      </div>
      <CategoryDisplay />
      <OrganizationDisplay />
    </React.Fragment>
  );
};

export default CalTools;
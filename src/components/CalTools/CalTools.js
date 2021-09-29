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

  // make a hidden file chooser button

  const hiddenFileChooserButton = {
    display: 'none'
  }

  // get state values from redux
  const calState = useSelector(state => { 
    return { 
      calEvents: state.calEvents, 
      calResources: state.calResources, 
      calCategories: state.calCategories,
      calDateRangeStart: state.calDateRangeStart, 
      calDateRangeEnd: state.calDateRangeEnd, 
    }})

  const handleImportDataButton = async () => {
    try {
      var input = document.getElementById("importDataFile");
      input.onchange = async function() {
        const importFile = input.files[0];
        const fileContents = await readFile(importFile);
        const jsonData = JSON.parse(fileContents)

        // iterate through the events in the import file and import them in one by one

        // iterate through to add each event
        const curCalResourceIds = calState.calResources.map(resource => resource.id);
        const curCalCategoryNames = calState.calCategories.map(category => category.name);
        const curCalEventIds = calState.calEvents.map(event => event.id);
        // first create resources and categories
        // we don't save the parent of a child resource
        // need to make a 'getParent' function to return the id of the child's parent
        jsonData.calResources.forEach(resource => {
          // check to see if the imported resource id is not already in the calendar
          if (curCalResourceIds.indexOf(resource.id) === -1) {
            let parentId = resource.parentId === "" ? "None" : resource.parentId;
            dispatch({ 
              type: 'CREATE_ORG', 
              payload: {
                title: resource.title,
                id: resource.id,
                parent: parentId,  
              },
            });
          }
        })
        jsonData.calCategories.forEach(category =>{
          if (curCalCategoryNames.indexOf(category.name) === -1) {
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
        // reset the input value to allow for additional files to be imported
        input.value = null;
      }
      input.click();
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
                <input 
                  type="file" 
                  id="importDataFile"
                  style={hiddenFileChooserButton} 
                />
                <button onClick={() => handleImportDataButton()}>Import</button>
                <button onClick={() => exportData(calState)}>Export</button>
                <button onClick={() => purgeCalendar()}>Clear Calendar and Local Storage</button>
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
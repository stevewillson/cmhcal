import React, { useState } from 'react';
import { useSelector } from 'react-redux';
import { useDispatch } from 'react-redux';
import { v4 as uuidv4 } from 'uuid';

const CalTools = () => {
  // get state values from redux
  var calDateRangeStart = useSelector(state => state.calDateRangeStart)
  var calDateRangeEnd = useSelector(state => state.calDateRangeEnd)
  var calResources = useSelector(state => state.calResources);
  var calCategories = useSelector(state => state.calCategories);
  
  const dispatch = useDispatch();

  const [addOrgName, setAddOrgName] = useState('');
  const [addParentOrgName, setAddParentOrgName] = useState('None');
  const [addCatName, setAddCatName] = useState('');
  const [addCatColor, setAddCatColor] = useState('');

  const calState = useSelector(state => { 
    return { 
      calEvents: state.calEvents, 
      calResources: state.calResources, 
      calCategories: state.calCategories,
      calDateRangeStart: state.calDateRangeStart, 
      calDateRangeEnd: state.calDateRangeEnd, 
    }})

  const btnStyle = {
    backgroundColor: '#707070',
    color: 'white',
    border: 'none',
    borderRadius: '12px',
    cursor: 'pointer',
    margin: '6px',
    textAlign: 'center',
    fontSize: '16px',
  } 
  
  const addOrg = (orgName, parentOrgName) => {
    dispatch({ 
      type: 'CREATE_ORG', 
      payload: { 
        title: orgName,
        id: uuidv4(),
        parent: parentOrgName || 'None',
      }
    });
    setAddOrgName('');
  }

  const addCat = (catName, catColor) => {
    dispatch({ 
      type: 'CREATE_CATEGORY', 
      payload: {
        id: uuidv4(),
        name: catName,
        color: catColor,
      }
    });
    setAddCatName('');
    setAddCatColor('');
  }

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

  const deleteCat = (id) => {
    console.log('DELETE CATEGORY');
    dispatch({
      type: 'DELETE_CATEGORY',
      payload: {
        id: id,
      }
    })
  }

  const deleteOrg = (id) => {
    console.log('DELETE ORG');
    dispatch({
      type: 'DELETE_ORG',
      payload: {
        id: id,
      }
    })
  }

  const renameOrg = (event) => {
    //console.log('RENAME ORG')
    //console.log(event)
    if (event.target.innerText !== 'X') {
      const resourceName = prompt("Set the organization title")
      if (resourceName !== '' && resourceName !== null) {
        dispatch({ 
          type: 'UPDATE_ORG', 
          payload: {
            title: resourceName,
            id: event.target.dataset.orgId,
          },
        });
      };
    }
  }

  return (
    <React.Fragment>
      <div>
        <label htmlFor='importDataFile'>Import File:</label>
        <input 
          type="file" 
          id="importDataFile" 
          onChange={importData}
          style={btnStyle}
        />
        <button style={btnStyle} onClick={() => exportData(calState)}>Export</button>
      </div>
      <label htmlFor='fromDate'>Display From:</label> 
      <input
        id='fromDate'
        type='date'
        value={calDateRangeStart}
        onChange={event => dispatch({ type: 'CAL_DATE_RANGE_START', payload: { date: event.target.value }})} 
      />
      <label htmlFor='toDate'>To:</label>
      <input
        id='toDate'
        type='date'
        value={calDateRangeEnd}
        onChange={event => dispatch({ type: 'CAL_DATE_RANGE_END', payload: { date: event.target.value }})}
      />
      <div>
        <label htmlFor='addOrgText'>Add Organization:</label>
        <input
          id='addOrgText'
          type='text'
          value={addOrgName}
          onChange={event => setAddOrgName(event.target.value)}
        />
        
        <label htmlFor='addOrgParent'>Set Parent Organization:</label>
        <select
          onChange={event => setAddParentOrgName(event.target.selectedOptions[0].value)} 
          id="addOrgParent" 
          value={addParentOrgName}      
        >
          <option 
            key={uuidv4()} 
            value={"None"}
          >
          {"None"}
          </option>
          {calResources.map(org => 
            <option 
              key={uuidv4()} 
              value={org.id}
            >
            {org.title}
            </option>
          )}
        </select>

        <button 
          type="button" 
          onClick={() => addOrg(addOrgName, addParentOrgName)} 
        >
          Add Organization
        </button>
      </div>
      <div>
        <label htmlFor='addCatNameText'>Add Category:</label>
        <input
          id='addCatNameText'
          type='text'
          value={addCatName}
          onChange={event => setAddCatName(event.target.value)}
        />
        <label htmlFor='addCatColorText'>Color:</label>
        <input
          id='addCatColorText'
          type='text'
          value={addCatColor}
          onChange={event => setAddCatColor(event.target.value)}
        />
        <button 
          type="button" 
          onClick={() => addCat(addCatName, addCatColor)} 
        >
          Add Category
        </button>
        <input
          type="checkbox" 
          id="editModeCheckbox"
          defaultChecked={true}
          //onChange={() => refreshCal()} 
          // TODO: Refresh the calendar when the box is toggled
        />
        <label htmlFor="editModeCheckbox">Edit Mode On</label>
      </div>
      <div>
      <h4>Categories:</h4>
      {calCategories.map((category) => 
        <div key={uuidv4()} style={{ backgroundColor: category.color }}>
          {category.name}
          <button onClick={() => deleteCat(category.id)}>X</button>
        </div>
      )}
      </div>
      <div>
      <h4>Organizations:</h4>
      {calResources.map((resource) => 
        <div key={uuidv4()} data-org-id={resource.id} onClick={renameOrg}>
          {resource.title}
          <button onClick={() => deleteOrg(resource.id)}>X</button>
        </div>
      )}
      </div>
    </React.Fragment>
  );
};

export default CalTools;
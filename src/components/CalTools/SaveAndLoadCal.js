import React, { useState } from 'react';
import { useSelector } from 'react-redux';
import { useDispatch } from 'react-redux';

const SaveAndLoadCal = () => {
  const dispatch = useDispatch();
  const [loadFileUrl, setLoadFileUrl] = useState('');
  const [saveFileUrl, setSaveFileUrl] = useState('');
  
  // get state values from redux
  const calState = useSelector(state => { 
    return { 
      calEvents: state.calEvents, 
      calResources: state.calResources, 
      calCategories: state.calCategories,
      calDateRangeStart: state.calDateRangeStart, 
      calDateRangeEnd: state.calDateRangeEnd, 
    }})

  const loadFile = async (loadFileUrl) => {
    try {
      fetch(loadFileUrl, {
        method: 'get',
        headers: {
          "Accept": "application/json;odata=verbose"
        },
        credentials: 'same-origin'
      })
        .then(response => response.text())
        .then(data => {
          let jsonVals = JSON.parse(data)
          console.log(jsonVals)
          loadDataFromContent(jsonVals)
          
          
          // now import the data
        }).catch(error => {
        // Handle error
          console.log(error.message);
        });
      } catch (e) {
        console.log(e.message);
      }
    };

  const loadDataFromContent = (jsonData) => {
      // iterate through the events in the import file and import them in one by one
      // set the redux state

      // if there are no events on the calendar, use the 'import data' action
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
        // if there are events, then append the events and add categories
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
    }

  const saveFile = (saveFileUrl, state) => {
    const outData = JSON.stringify(state);
    //Download the file as a JSON formatted text file
    //const outFileName = 'cmhcal_output.txt'

    // TODO - https://sharepoint.stackexchange.com/questions/238383/the-security-validation-for-this-page-is-invalid-and-might-be-corrupted-when-t
    fetch(saveFileUrl, {
      method: 'post',
      headers: {
        "Accept": "application/json;odata=verbose"
        // "X-RequestDigest": ADD DATA
      },
      credentials: 'same-origin',
      body: outData
    }).then(results => results.text())
      .then((data) => {
        console.log(data);
        console.log('Sucessfully saved file to ' + saveFileUrl);
    }).catch(error => {
      // Handle error
        console.log(error.message);
    });
    //return response.json(); 
  }

  return (
    <React.Fragment>
      <div>
        <label htmlFor='loadFileUrl'>Load File URL:</label>
        <input
          id='loadFileUrl'
          type='text'
          value={loadFileUrl}
          onChange={event => setLoadFileUrl(event.target.value)}
        />
        <button 
          type="button" 
          id="loadFile" 
          onClick={() => loadFile(loadFileUrl)}
        >Load
        </button>
        <label htmlFor='saveFileUrl'>Save File URL:</label>
        <input
          id='saveFileUrl'
          type='text'
          value={saveFileUrl}
          onChange={event => setSaveFileUrl(event.target.value)}
        />
        <button 
          type="button" 
          id="saveFile" 
          onClick={() => saveFile(saveFileUrl, calState)}
        >Save 
        </button>
      </div>
    </React.Fragment>
  );
};

export default SaveAndLoadCal;
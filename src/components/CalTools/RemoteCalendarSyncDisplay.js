import React, { useState } from 'react';
import { useSelector } from 'react-redux';
import { useDispatch } from 'react-redux';

const RemoteCalendarSyncDisplay = () => {
  // get state values from redux
  const dispatch = useDispatch();

  const calState = useSelector(state => { 
    return { 
      calEvents: state.calEvents, 
      calResources: state.calResources, 
      calCategories: state.calCategories,
      calDateRangeStart: state.calDateRangeStart, 
      calDateRangeEnd: state.calDateRangeEnd,
      calUUID: state.calUUID,
    }})

  const [calUUID, setCalUUID] = useState(calState.calUUID);

  const postData = (state, uuid) => {
    const replaceUUID = uuid.replace( /[^0-9a-z-]/gi , "");
    const trimUUID = replaceUUID.trim();
    const url = "https://cmhcal.com/calendar.php";
    fetch(url, {
      method: 'POST',
      mode: 'cors',
      cache: 'no-cache',
      headers: {
        'Content-Type': 'application/json',
        'X-File-Name': trimUUID,
      },
      body: JSON.stringify(state),
    }).catch(err => console.log(err));
  };

  const fetchData = (uuid) => {
    const replaceUUID = uuid.replace( /[^0-9a-z-]/gi , "");
    const trimUUID = replaceUUID.trim();
    // request the calendar by the uuid
    const url = "https://cmhcal.com/calendar/" + trimUUID;
    fetch(url, {
      method: 'GET',
      mode: 'cors',
      cache: 'no-cache',
    })
    .then(response => response.json())
    .then(data => {
      const jsonData = data;
      dispatch({
        type: 'IMPORT_DATA',
        payload: {
          calEvents: jsonData.calEvents,
          calResources: jsonData.calResources,
          calCategories: jsonData.calCategories,
          calDateRangeStart: jsonData.calDateRangeStart,
          calDateRangeEnd: jsonData.calDateRangeEnd,
          calUUID: jsonData.calUUID,
        },
      }); 
    }).catch(err => console.log(err));
  };
  
  return (
    <div>
      <label htmlFor='calUUID'>Calendar UUID:</label>
      <input
        id='calUUID'
        type='text'
        size='36'
        value={calState.calUUID}
        onChange={event => setCalUUID(event.target.value)}
      />
      <> - </>
      <button 
        type="button" 
        onClick={() => postData(calState, calUUID)}
      >
      Save Calendar
      </button>
      <> - </>
      <button 
        type="button" 
        onClick={() => fetchData(calUUID)}
      >
      Load Calendar
      </button>
    </div>
  );
};

export default RemoteCalendarSyncDisplay;
import React, { useState } from 'react';
import { useSelector } from 'react-redux';
import { useDispatch } from 'react-redux';
import { v4 as uuidv4 } from 'uuid';

const RemoteCalendarSyncDisplay = () => {
  // get state values from redux
  const dispatch = useDispatch();

  const [calUUID, setCalUUID] = useState(uuidv4());

  const calState = useSelector(state => { 
    return { 
      calEvents: state.calEvents, 
      calResources: state.calResources, 
      calCategories: state.calCategories,
      calDateRangeStart: state.calDateRangeStart, 
      calDateRangeEnd: state.calDateRangeEnd,
      calUUID: state.calUUID,
    }})
 
  const postData = (state, uuid) => {
    const trimUUID = uuid.trim();
    const url = "https://cmhcal.com/calendar.php";
    const response = fetch(url, {
      method: 'POST',
      mode: 'cors',
      cache: 'no-cache',
      headers: {
        'Content-Type': 'application/json',
        'X-FILE-NAME': trimUUID,
      },
      body: JSON.stringify(state),
    }).then(data => {
      //console.log(data);
    }).catch(err => console.log(err));
    console.log(response);
  };

  const fetchData = (uuid) => {
    const trimUUID = uuid.trim();
    // request the value
    const url = "https://cmhcal.com/calendar/" + trimUUID;
    const response = fetch(url, {
      method: 'GET',
      mode: 'cors',
      cache: 'no-cache',
    }).then(response => response.json())
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
    console.log(response);
  };
  

  return (
    <div>
      <label htmlFor='calUUID'>Calendar UUID:</label>
      <input
        id='calUUID'
        type='text'
        size='36'
        value={calUUID}
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
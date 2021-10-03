import React, { useState } from 'react';
import { useSelector } from 'react-redux';
// import { useDispatch } from 'react-redux';
import { v4 as uuidv4 } from 'uuid';

const RemoteCalendarSyncDisplay = () => {
  // get state values from redux
//  const dispatch = useDispatch();

  const [calUUID, setCalUUID] = useState(uuidv4());

  const calState = useSelector(state => { 
    return { 
      calEvents: state.calEvents, 
      calResources: state.calResources, 
      calCategories: state.calCategories,
      calDateRangeStart: state.calDateRangeStart, 
      calDateRangeEnd: state.calDateRangeEnd, 
    }})
 
  const postData = (state, uuid) => {
    const url = "https://cmhcal.com/calendar.php";
    const response = fetch(url, {
      method: 'POST',
      mode: 'cors',
      cache: 'no-cache',
      headers: {
        'Content-Type': 'application/json',
        'X-FILE-NAME': uuid,
      },
      body: JSON.stringify(state),
    }).then(data => {
      console.log(data);
    }).catch(err => console.log(err));
    console.log(response);
  };

  const fetchData = () => {

  }

  return (
    <div>
      <label htmlFor='calUUID'>Calendar UUID:</label>
      <input
        id='calUUID'
        type='text'
        size='30'
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
        onClick={() => fetchData()}
      >
      Load Calendar
      </button>
    </div>
  );
};

export default RemoteCalendarSyncDisplay;
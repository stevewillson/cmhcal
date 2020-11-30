import React from 'react';
import { useSelector } from 'react-redux';
import { useDispatch } from 'react-redux';

const DateRangeSelect = () => {
  // get state values from redux
  var calDateRangeStart = useSelector(state => state.calDateRangeStart)
  var calDateRangeEnd = useSelector(state => state.calDateRangeEnd)
  
  const dispatch = useDispatch();

  return (
    <React.Fragment>          
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
    </React.Fragment>
  );
};

export default DateRangeSelect;
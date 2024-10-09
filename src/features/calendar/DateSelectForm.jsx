import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { setCalendarView } from "./calendarSlice";

const DateSelectForm = () => {
  const settings = useSelector((state) => state.settings); // Get calendar settings from Redux store

  // start and end date state
  const [startDate, setStartDate] = useState(settings.startDate);
  const [endDate, setEndDate] = useState(settings.endDate);
  const dispatch = useDispatch();

  const handleSaveCalendarView = () => {
    //save the calendar view settings
    dispatch(setCalendarView({ startDate, endDate }));
  };

  return (
    <div>
      <label htmlFor="startDateInput">Start Date:</label>
      <input
        id="startDateInput"
        type="date"
        value={startDate}
        onChange={(e) => setStartDate(e.target.value)}
      />
      <label htmlFor="endDateInput">End Date:</label>
      <input
        id="endDateInput"
        type="date"
        value={endDate}
        onChange={(e) => setEndDate(e.target.value)}
      />
      <button onClick={handleSaveCalendarView}>Set Calendar View</button>
    </div>
  );
};

export default DateSelectForm;

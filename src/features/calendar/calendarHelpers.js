import { DateTime } from "luxon";
// import { v4 as uuidv4 } from "uuid"; // Import the UUID package

// start weekView on a Monday,
// if not, then fullCalendar will not allow the left most date column
// to be selected because it is not fully included in the visible range
export const setWeekViewStartDate = (inputDate) => {
  // take the input date and find the previous monday to set the start date in the week view mode
  const calDateStart = DateTime.fromFormat(inputDate, "yyyy-LL-dd");

  // subtract days to set newCalDateStart to the prior Monday
  const newCalDateStart = calDateStart.minus({
    days: calDateStart.weekday - 1,
  });

  return newCalDateStart.toISODate();
};

export const setWeekViewEndDate = (inputDate) => {
  // take the input date and find the next Monday to set the end date in the week view mode
  const calDateEnd = DateTime.fromFormat(inputDate, "yyyy-LL-dd");

  // add days to set newCalDateEnd to the next Monday
  const newCalDateEnd = calDateEnd.plus({ days: 8 - calDateEnd.weekday });

  return newCalDateEnd.toISODate();
};

// start monthView on a the first day of the month,
// if not, then fullCalendar will not allow the left most date column
// to be selected because it is not fully included in the visible range
export const setMonthViewStartDate = (inputDate) => {
  // take the input date and find the first day of the month to set the start date in month view mode
  const calDateStart = DateTime.fromFormat(inputDate, "yyyy-LL-dd");

  // subtract days to set newCalDateStart to the first day of the month
  const newCalDateStart = calDateStart.minus({ days: calDateStart.day - 1 });

  return newCalDateStart.toISODate();
};

export const setMonthViewEndDate = (inputDate) => {
  // take the input date and find the first day of the next month to set the end date in month view mode
  const calDateEnd = DateTime.fromFormat(inputDate, "yyyy-LL-dd");

  // add days to set newCalDateEnd to the first day of the next month
  const newCalDateEnd = calDateEnd.plus({
    days: calDateEnd.daysInMonth - calDateEnd.day + 1,
  });

  return newCalDateEnd.toISODate();
};

export const customSlotLabelContent = (arg) => {
  // Display:
  // Month / YY
  // FY Week
  // T Week
  // Date / Day of Week

  if (arg.level === 0) {
    return arg.text.toUpperCase();
  }

  // for arg.level '1', display the FY Week (starting on week 1)
  else if (arg.level === 1) {
    const calDate = DateTime.fromJSDate(arg.date);
    // to calculate the Fiscal Year week, need to find the number of weeks from
    // the previous Monday to the prior October 1

    // first, get the previous Monday
    let prevMonday = calDate.minus({ days: calDate.weekday - 1 });

    let dateYear = calDate.year;
    if (calDate.month < 10) {
      // use October 1 from the previous year if the month is before October
      dateYear = dateYear - 1;
    }
    let fyStart = DateTime.local(dateYear, 10, 1);
    let weekDiff = prevMonday.diff(fyStart, ["weeks"]);
    let weekNum = Math.ceil(weekDiff.weeks);
    return "FY W" + weekNum;
    // get the date, calculate how many weeks after October 1st this date is
    // return that for the weeks
  } else if (arg.level === 2) {
    // here put in the 'T' week with relative 'T' + / - numbers
    // get the current date, calculate T week differences
    const calDate = DateTime.fromJSDate(arg.date);

    // subtract days to set calPrevMonday to the prior Monday
    let calPrevMonday = calDate.minus({ days: calDate.weekday - 1 });

    const nowDate = DateTime.local();

    const nowPrevMonday = nowDate.minus({ days: nowDate.weekday - 1 });

    let weekDiff = calPrevMonday.diff(nowPrevMonday, ["weeks"]);
    let weekNum = Math.ceil(weekDiff.weeks);
    if (weekNum > 0) {
      return "T+" + weekNum;
    } else if (weekNum === 0) {
      return "T";
    } else {
      return "T" + weekNum;
    }
  } else if (
    arg.level === 3 &&
    (arg.view.type === "WeekView" || arg.view.type === "MonthView")
  ) {
    // put in start / stop dates for the long range calendar week view
    const calDate = DateTime.fromJSDate(arg.date);
    const weekEndDate = calDate.plus({ days: 6 });
    return (
      calDate.toFormat("ddMMM").toUpperCase() +
      " - " +
      weekEndDate.toFormat("ddMMM").toUpperCase()
    );
  } else if (arg.level === 3 && arg.view.type === "DayView") {
    return arg.text;
  }
};

export const handleEventClick = (clickInfo) => {
  // prevent the url link from being followed if one of the event buttons is clicked
  if (
    clickInfo.jsEvent?.target?.id !== undefined &&
    clickInfo.jsEvent?.target?.nodeName === "SELECT"
  ) {
    // clickInfo.jsEvent.stopImmediatePropagation();
  } else if (
    clickInfo.jsEvent?.target?.innerText !== undefined &&
    clickInfo.jsEvent.target.innerText === "Toggle Category"
  ) {
    clickInfo.jsEvent.preventDefault();
  } else if (
    clickInfo.jsEvent?.target?.innerText !== undefined &&
    clickInfo.jsEvent.target.innerText === "Edit Name"
  ) {
    clickInfo.jsEvent.preventDefault();
    //} else if (clickInfo.jsEvent?.toElement?.innerText !== undefined && clickInfo.jsEvent.toElement.innerText === "Edit Link") {
    //  clickInfo.jsEvent.preventDefault();
  } else if (
    clickInfo.jsEvent?.target?.innerText !== undefined &&
    clickInfo.jsEvent.target.innerText === "X"
  ) {
    clickInfo.jsEvent.preventDefault();
  }
  // can prevent the default loading of a url in the same windows and open it in a new window
  // if (info.event.url) {
  //   window.open(info.event.url);
  // }
};

// Function to get the configuration for the Day View
export const getDayViewConfig = (startDate, endDate) => ({
  type: "resourceTimeline",
  visibleRange: {
    start: startDate,
    end: endDate,
  },
  buttonText: "Day View",
  slotLabelInterval: { days: 1 },
  slotLabelFormat: [
    { month: "short", year: "2-digit" },
    { week: "short" },
    { week: "short" },
    { day: "numeric", weekday: "narrow" },
  ],
});

// Function to get the configuration for the Week View
export const getWeekViewConfig = (startDate, endDate) => ({
  type: "resourceTimeline",
  visibleRange: {
    start: setWeekViewStartDate(startDate),
    end: setWeekViewEndDate(endDate),
  },
  buttonText: "Week View",
  slotDuration: { weeks: 1 },
  slotLabelInterval: { weeks: 1 },
  slotLabelFormat: [
    { month: "short", year: "2-digit" },
    { week: "short" },
    { week: "short" },
    { week: "short" },
  ],
});

// Function to get the configuration for the Month View
export const getMonthViewConfig = (startDate, endDate) => ({
  type: "resourceTimeline",
  visibleRange: {
    start: setMonthViewStartDate(startDate),
    end: setMonthViewEndDate(endDate),
  },
  buttonText: "Month View",
  slotDuration: { months: 1 },
  slotLabelInterval: { months: 1 },
  slotLabelFormat: [
    { month: "short", year: "2-digit" },
    { week: "short" },
    { week: "short" },
    { week: "short" },
  ],
});

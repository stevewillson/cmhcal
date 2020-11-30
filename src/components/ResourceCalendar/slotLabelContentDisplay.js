import { DateTime } from 'luxon';

export const customSlotLabelContent = (arg) => {

  // Display:
  // Month / YY
  // FY Week
  // T Week
  // Date / Day of Week

  // for arg.level '1', display the FY Week (starting on week 1)
  if (arg.level === 1) {
    let calDate = DateTime.fromJSDate(arg.date);
    // to calculate the Fiscal Year week, need to find the number of weeks from
    // the previous Monday to the prior October 1

    // first, get the Monday
    let prevMonday = calDate;
    // hacky way of making sure that the calendar ends on a Monday when set to week granularity
    while (prevMonday.weekday !== 1) {
      prevMonday = prevMonday.minus({ days: 1 })
    }  
    
    let dateYear = calDate.year;
    if (calDate.month < 10) {
      // use October 1 from the previous year if the month is before October
      dateYear = dateYear - 1;
    }
    let fyStart = DateTime.local(dateYear, 10, 1);
    let weekDiff = prevMonday.diff(fyStart, ['weeks']);
    let weekNum = Math.ceil(weekDiff.weeks);
    return 'FY W' + weekNum;
    // get the date, calculate how many weeks after October 1st this date is
    // return that for the weeks
  } else if (arg.level === 2) {
    // here put in the 'T' week with relative 'T' + / - numbers
    // get the current date, calculate week differences
    let calDate = DateTime.fromJSDate(arg.date);
    // first, get the Monday
    let calPrevMonday = calDate;
    // hacky way of making sure that the calendar ends on a Monday when set to week granularity
    while (calPrevMonday.weekday !== 1) {
      calPrevMonday = calPrevMonday.minus({ days: 1 })
    }
    
    let nowPrevMonday = DateTime.local();
    while (nowPrevMonday.weekday !== 1) {
      nowPrevMonday = nowPrevMonday.minus({ days: 1 })
    }
    
    let weekDiff = calPrevMonday.diff(nowPrevMonday, ['weeks']);
    let weekNum = Math.ceil(weekDiff.weeks);
    if (weekNum > 0) {
      return 'T+' + weekNum;
    }
    return 'T' + weekNum;
  } else if (arg.level === 3 && arg.view.type === 'WeekView') {
    // put in start / stop dates for the long range calendar week view
    let calDate = DateTime.fromJSDate(arg.date);
    let weekEndDate = calDate.plus({ days: 6 })
    return calDate.toFormat('ddMMM').toUpperCase() + ' - ' + weekEndDate.toFormat('ddMMM').toUpperCase()
  }
}

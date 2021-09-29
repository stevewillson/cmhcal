import { DateTime } from 'luxon';

export const customSlotLabelContent = (arg) => {

  // Display:
  // Month / YY
  // FY Week
  // T Week
  // Date / Day of Week

  // for arg.level '1', display the FY Week (starting on week 1)
  if (arg.level === 1) {
    const calDate = DateTime.fromJSDate(arg.date);
    // to calculate the Fiscal Year week, need to find the number of weeks from
    // the previous Monday to the prior October 1

    // first, get the previous Monday
    let prevMonday = calDate.minus({ days: (calDate.weekday - 1) })
    
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
    // get the current date, calculate T week differences
    const calDate = DateTime.fromJSDate(arg.date);

    // subtract days to set calPrevMonday to the prior Monday
    let calPrevMonday = calDate.minus({ days: (calDate.weekday - 1) });
    
    const nowDate = DateTime.local();

    const nowPrevMonday = nowDate.minus({ days: (nowDate.weekday - 1) });
        
    let weekDiff = calPrevMonday.diff(nowPrevMonday, ['weeks']);
    let weekNum = Math.ceil(weekDiff.weeks);
    if (weekNum > 0) {
      return 'T+' + weekNum;
    }
    return 'T' + weekNum;
  } else if (arg.level === 3 && (arg.view.type === 'WeekView' || arg.view.typ === 'MonthView')) {
    // put in start / stop dates for the long range calendar week view
    const calDate = DateTime.fromJSDate(arg.date);
    const weekEndDate = calDate.plus({ days: 6 })
    return calDate.toFormat('ddMMM').toUpperCase() + ' - ' + weekEndDate.toFormat('ddMMM').toUpperCase()
  }
}

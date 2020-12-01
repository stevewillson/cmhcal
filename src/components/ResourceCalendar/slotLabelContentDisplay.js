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
    
    // subtract days to set prevMonday to the prior Monday    
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

  } else if (arg.level === 2) {
    // at level 2 put in the 'T' week with relative 'T' + / - numbers
    // get the current date, calculate T week differences
    const calDate = DateTime.fromJSDate(arg.date);
    // subtract days to set calPrevMonday to the prior Monday,
    let calPrevMonday = calDate.minus({ days: (calDate.weekday - 1) })
    
    const nowDate = DateTime.local();
    // subtract days to set nowPrevMonday to the prior Monday,
    // or the current day if it is Monday
    const nowPrevMonday = nowDate.minus({ days: (nowDate.weekday - 1) })
    
    const weekDiff = calPrevMonday.diff(nowPrevMonday, ['weeks']);
    const weekNum = Math.ceil(weekDiff.weeks);
    if (weekNum > 0) {
      return 'T+' + weekNum;
    } else if (weekNum === 0) {
      return 'T';
    }
    return 'T' + weekNum;
    
  } else if (arg.level === 3 && arg.view.type === 'WeekView') {
    // put in start / stop dates for the long range calendar week view
    const calDate = DateTime.fromJSDate(arg.date);
    // add 6 days to show the end day of the week
    const weekEndDate = calDate.plus({ days: 6 })
    return calDate.toFormat('ddMMM').toUpperCase() + ' - ' + weekEndDate.toFormat('ddMMM').toUpperCase()
  }
}

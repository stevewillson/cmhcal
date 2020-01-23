import React, { useState } from 'react';
import { useSelector } from 'react-redux';
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { DateTime } from 'luxon';
import uuid from 'uuid';

const ExportTemplate = () => {
  // have a datepicker select option to choose the n-day for the template
  // have a selection box for the resource
  // have an 'Export' button
  // get the events for that resource and export them to a json file
  const organizations = useSelector(state => state.calResources);
  const calState = useSelector(state => { 
    return { 
      calEvents: state.calEvents, 
      calResources: state.calResources, 
      calCategories: state.calCategories,
      calDateRangeStart: state.calDateRangeStart, 
      calDateRangeEnd: state.calDateRangeEnd, 
    }})
  // local state for the number of elements in the form

  const [dDay, setDDay] = useState(new Date());

  const onExportClick = (dDay, calState) => {
    // read the selected value
    const selEl = document.getElementById('selectOrgExportOption')
    const selVal = selEl.options[selEl.selectedIndex].value;

    const outFilename = document.getElementById('filenameExport').value;
    
    // filter the events to be about the selected org
    const orgEvents = calState.calEvents.filter(event => event.resourceId === selVal);

    // now edit the start and end dates to be days relative to the nDay
    const templateEvents = orgEvents.map(event => {
      const luxStart = DateTime.fromISO(event.start);
      const luxEnd = DateTime.fromISO(event.end);
      const luxDDay = DateTime.fromISO(dDay.toISOString().slice(0,10));
      
      const startOffset = luxDDay.diff(luxStart, 'days');
      const endOffset = luxDDay.diff(luxEnd, 'days');
      return {
        title: event.title,
        startOffset: startOffset.days,
        endOffset: endOffset.days,
      }
    })

    exportData(templateEvents, outFilename);
  }

  const exportData = (jsonData, outFilename) => {
    const outData = JSON.stringify(jsonData);
    //Download the file as a JSON formatted text file
    var downloadLink = document.createElement("a");
    var blob = new Blob(["\ufeff", outData]);
    var url = URL.createObjectURL(blob);
    downloadLink.href = url;
    downloadLink.download = outFilename;  //Name the file here
    document.body.appendChild(downloadLink);
    downloadLink.click();
    document.body.removeChild(downloadLink);
  }

  return (
    <div>
    <h4>Export Template</h4>
    <label>Org:
    <select id="selectOrgExportOption">
      {organizations.map(category => <option key={uuid.v4()} value={category.id}>{category.title}</option>)}
    </select>
    </label>
    <label>D-Day
    <DatePicker
      placeholderText={'Choose the Event D-Day'}
      selected={dDay}
      onChange={date => setDDay(date)}
    />
    </label>
    <label>Filename:
    <input type="text" id="filenameExport" />
    </label>
    <button type="button" onClick={() => {onExportClick(dDay, calState)}} >Export Template</button>
    </div>
  );
}

export default ExportTemplate;
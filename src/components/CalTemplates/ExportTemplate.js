import React, { useState } from 'react';
import { useSelector } from 'react-redux';
import { DateTime } from 'luxon';
import { v4 as uuidv4 } from 'uuid';

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

  const today = new Date();
  const [dDay, setDDay] = useState(today.toISOString().slice(0,10));
  const [selOptId, setSelOptId] = useState('');
  const [exportFilename, setExportFilename] = useState('');

  const onExportClick = (calState, selOptId, dDay, exportFilename) => {
    // filter the events to be about the selected org
    const orgEvents = calState.calEvents.filter(event => event.resourceId === selOptId);

    // now edit the start and end dates to be days relative to the nDay
    const templateEvents = orgEvents.map(event => {
      const luxStart = DateTime.fromISO(event.start);
      const luxEnd = DateTime.fromISO(event.end);
      const luxDDay = DateTime.fromISO(dDay);
      
      // relative to the 'dDay'
      // days in the future have positive offsets,
      // days in the past have negative offsets
      const startOffset = luxStart.diff(luxDDay, 'days');
      const endOffset = luxEnd.diff(luxDDay, 'days');
      return {
        title: event.title,
        startOffset: startOffset.days,
        endOffset: endOffset.days,
      }
    })
    exportData(templateEvents, exportFilename);
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

  // after a calendar is loaded, set the selected org option to be the first value if it is not set
  if (organizations.length > 0 && selOptId === '') {
    setSelOptId(organizations[0].id)
  }

  return (
    <div>
    <h4>Export Template</h4>
    <label htmlFor='selectOrgExportOption'>Org:</label>
    <select 
      onChange={event => setSelOptId(event.target.selectedOptions[0].value)} 
      id="selectOrgExportOption" 
      value={selOptId}
    >
      {organizations.map(category => 
        <option 
          key={uuidv4()} 
          value={category.id}
        >
          {category.title}
        </option>
      )}
    </select>
    <label htmlFor='exportDDay'>D-Day</label>
    <input
      id='exportDDay'
      type='date'
      value={dDay}
      onChange={event => setDDay(event.target.value)}
    />
    <label htmlFor='filenameExport'>Filename:</label>
    <input 
      type="text" 
      id="filenameExport"
      onChange={event => setExportFilename(event.target.value)}
    />
    <button 
      type="button" 
      onClick={() => onExportClick(calState, selOptId, dDay, exportFilename)} 
    >
      Export Template
    </button>
    </div>
  );
}

export default ExportTemplate;
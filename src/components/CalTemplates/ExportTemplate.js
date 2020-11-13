import React, { useState } from 'react';
import { useSelector } from 'react-redux';
import { DateTime } from 'luxon';
import { v4 as uuidv4 } from 'uuid';

const ExportTemplate = () => {
  // have a datepicker select option to choose the n-day for the template
  // have a selection box for the resource
  // have an 'Export' button
  // get the events for that resource and export them to a json file
  const calState = useSelector(state => { 
    return { 
      calEvents: state.calEvents,
      calCategories: state.calCategories,
      calDateRangeStart: state.calDateRangeStart, 
      calDateRangeEnd: state.calDateRangeEnd, 
      calResources: state.calResources,
    }})
    
  // local state for the number of elements in the form
  const today = new Date();
  const [dDay, setDDay] = useState(today.toISOString().slice(0,10));
  const [selOptId, setSelOptId] = useState('');
  const [exportFilename, setExportFilename] = useState('');

  const flatten = (obj, path = '') => {      
    if (!(obj instanceof Object)) return {[path.replace(/\-$/g, '')]:obj};
    // get the keys
    // check if the descended object have a 'children' property, if yes, then call flatten recursively on the children
    // if no, or the children array is empty, then this is a 'leaf' node with no children
    return Object.keys(obj).reduce((output, key) => {
      if (obj instanceof Array) {
        return {...output, ...flatten(obj[key], path)}
      }
      if (key === 'children' && obj.children.length > 0) {
        // we have a non-zero length children object, call flatten again
        return {...output, ...flatten(obj.children, path + obj.title + '-' )}
      } else if (key === 'id') {
        return {...output, [path + obj.title]: obj[key]}
      }
      return {...output}
    }, {});
  }
  
  // this will take an array with the following structure
  // { id: 'ID', title: 'TITLE', children: [] }
  // it will then output the following objects
  // { id: 'ID', path: 'PATH-PATH-PATH' }
  const flattenGenArray = (obj) => {
    const flatObj = flatten(obj);
    let newFlatObj = [];
    // loop through the flat object and then make a new object with id and title pairs
    for(var i = 0; i < Object.keys(flatObj).length; i = i + 1) {
      newFlatObj.push({
        title: Object.keys(flatObj)[i],
        id: flatObj[Object.keys(flatObj)[i]],
      })
    }
    
    return newFlatObj;
  }

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
        category: event.category,
        color: event.color,
        url: event.url,
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
  if (calState.calResources !== undefined) {
    if (calState.calResources.length > 0 && selOptId === '') {
      setSelOptId(calState.calResources[0].id)
    }  
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
      {flattenGenArray(calState.calResources).map(organization => 
        <option 
          key={uuidv4()} 
          value={organization.id}
        >
          {organization.title}
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
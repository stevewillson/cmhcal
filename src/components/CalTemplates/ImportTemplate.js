import React, { useState } from 'react';
import { useSelector } from 'react-redux';
import { useDispatch } from 'react-redux';
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { DateTime } from 'luxon';
import uuid from 'uuid';

const ImportTemplate = () => {
	const btnStyle = {
    backgroundColor: '#707070',
    color: 'white',
    border: 'none',
    borderRadius: '12px',
    cursor: 'pointer',
    margin: '6px',
    textAlign: 'center',
    fontSize: '16px',
  } 
	
  const dispatch = useDispatch();
	// get the events for that resource and export them to a json file
	const organizations = useSelector(state => state.calResources)

  // local state for the number of elements in the form
  const [dDay, setDDay] = useState(new Date());
  const [selOptId, setSelOptId] = useState('');

  const onImportClick = async () => {    
    // read the selected org value
    const selEl = document.getElementById('selectOrgImportOption') 
    const selVal = selEl.options[selEl.selectedIndex].value;

    const datePickerValJSDate = new Date(document.getElementById('importFileDatePicker').value)

    const importFile = document.getElementById('templateInputFile').files[0];
    const fileContents = await readFile(importFile);
    const jsonData = JSON.parse(fileContents)
    
    // now edit the start and end dates to be days relative to the dDay
    jsonData.forEach(event => {
	    const luxDDay = DateTime.fromISO(datePickerValJSDate.toISOString().slice(0,10));
			const start = luxDDay.plus({ days: event.startOffset });
			const end = luxDDay.plus({ days: event.endOffset });

	    // need to do many dispatches for each event in the selection		
			dispatch({ 
				type: 'ADDEVENT', 
				payload: {
					event: {
						title: event.title,
						start: start.toISODate(),
						end: end.toISODate(),
						id: uuid.v4(),
						resourceId: selVal,
					},
				},
			});
		});
  }

  // read the binary contents of the file
  const readFile = file => {
    const temporaryFileReader = new FileReader();
    return new Promise((resolve, reject) => {
      temporaryFileReader.onerror = () => {
        temporaryFileReader.abort();
        reject(new DOMException('Problem parsing input file.'));
      };
      temporaryFileReader.onload = () => {
        let text = temporaryFileReader.result;
        resolve(text);
      }
      temporaryFileReader.readAsText(file);
    });
  };

  // after a calendar is loaded, set the selected org option to be the first value if it is not set
  if (organizations.length > 0 && selOptId === '') {
    setSelOptId(organizations[0].id)
  }
  

  return (
    <div>
		<h4>Import Template</h4>
		<label>Org:
    <select
      onChange={event => setSelOptId(event.target.selectedOptions[0].value)} 
      id="selectOrgImportOption" 
      value={selOptId}      
    >
      {organizations.map(category => 
        <option 
          key={uuid.v4()} 
          value={category.id}
        >
          {category.title}
        </option>
      )}
    </select>
		</label>
		<label>D-Day
    <DatePicker
      id={'importFileDatePicker'}
      placeholderText={'Choose the Event D-Day'}
      selected={dDay}
      onChange={date => setDDay(date)}
    />
		</label>
    <label>Import File: 
			<input 
				type="file" 
        id="templateInputFile" 
				style={btnStyle}
			/>
    </label>
    <button type="button" onClick={onImportClick} >Import Template</button>
    </div>
  );
}

export default ImportTemplate;
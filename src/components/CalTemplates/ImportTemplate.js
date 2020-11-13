import React, { useState } from 'react';
import { useSelector } from 'react-redux';
import { useDispatch } from 'react-redux';
import { DateTime } from 'luxon';
import { v4 as uuidv4 } from 'uuid';

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
	
  const dispatch = useDispatch();
	// get the events for that resource and export them to a json file
	const organizations = useSelector(state => state.calResources)

  // local state for the number of elements in the form
  const today = new Date();
  const [dDay, setDDay] = useState(today.toISOString().slice(0,10));
  const [selOptId, setSelOptId] = useState('');

  const onImportClick = async (dDay, selOptId) => {    
    const importFile = document.getElementById('templateInputFile').files[0];
    const fileContents = await readFile(importFile);
    const jsonData = JSON.parse(fileContents)
    
    // now edit the start and end dates to be days relative to the dDay
    jsonData.forEach(event => {
	    const luxDDay = DateTime.fromISO(dDay);
			const start = luxDDay.plus({ days: event.startOffset });
			const end = luxDDay.plus({ days: event.endOffset });

	    // do a dispatch for each event in the selection		
			dispatch({ 
				type: 'CREATE_EVENT', 
				payload: {
          title: event.title,
          start: start.toISODate(),
          end: end.toISODate(),
          id: uuidv4(),
          resourceId: selOptId,
          color: event.color || '',
          url: event.url || '',
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
  if (organizations !== undefined) {
    if (organizations.length > 0 && selOptId === '') {
      setSelOptId(organizations[0].id)
    }  
  }
  
  return (
    <div>
		<h4>Import Template</h4>
		<label htmlFor='selectOrgImportOption'>Org:</label>
    <select
      onChange={event => setSelOptId(event.target.selectedOptions[0].value)} 
      id="selectOrgImportOption" 
      value={selOptId}      
    >
      {flattenGenArray(organizations).map(org => 
        <option 
          key={uuidv4()} 
          value={org.id}
        >
          {org.title}
        </option>
      )}
    </select>
		<label htmlFor='importFileDatePicker'>D-Day</label>
    <input
      id='importFileDatePicker'
      type='date'
      value={dDay}
      onChange={event => setDDay(event.target.value)}
    />
    <label htmlFor='templateInputFile'>Import File:</label> 
			<input 
				type="file" 
        id="templateInputFile" 
				style={btnStyle}
			/>
    <button type="button" 
      onClick={() => onImportClick(dDay, selOptId)} 
    >
      Import Template
    </button>
    </div>
  );
}

export default ImportTemplate;
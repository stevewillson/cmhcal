import React, { useState } from 'react';
import { useSelector } from 'react-redux';
import { useDispatch } from 'react-redux';
import '../../assets/main.scss' // webpack must be configured to do this
import uuid from 'uuid';

const CalTools = () => {
  // get state values from redux
  const calDateRangeStart = useSelector(state => state.calDateRangeStart)
  const calDateRangeEnd = useSelector(state => state.calDateRangeEnd)
  const calResources = useSelector(state => state.calResources);
  const calCategories = useSelector(state => state.calCategories);
  
  const dispatch = useDispatch();

  const [addOrgName, setAddOrgName] = useState('');
  const [addCatName, setAddCatName] = useState('');
  const [addCatColor, setAddCatColor] = useState('');

  const calState = useSelector(state => { 
    return { 
      calEvents: state.calEvents, 
      calResources: state.calResources, 
      calCategories: state.calCategories,
      calDateRangeStart: state.calDateRangeStart, 
      calDateRangeEnd: state.calDateRangeEnd, 
    }})

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
  
  const addOrg = (orgName) => {
    dispatch({ 
      type: 'ADDORG', 
      payload: { 
        title: orgName,
        id: uuid.v4(), 
      }
    });
    setAddOrgName('');
  }

  const addCat = (catName, catColor) => {
    dispatch({ 
      type: 'ADDCATEGORY', 
      payload: { 
        category: {
          id: uuid.v4(),
          name: catName,
          color: catColor,
        } 
      }
    });
    setAddCatName('');
    setAddCatColor('');
  }

  const importData = async (event) => {
    const importFile = event.target.files[0];
    try {
      const fileContents = await readFile(importFile);
      const jsonData = JSON.parse(fileContents)
      // set the state here from redux
      dispatch({
        type: 'IMPORTDATA',
        payload: {
          calEvents: jsonData.calEvents,
          calResources: jsonData.calResources,
          calCategories: jsonData.calCategories,
          calDateRangeStart: jsonData.calDateRangeStart,
          calDateRangeEnd: jsonData.calDateRangeEnd,
        },
      });
    } catch (e) {
      console.log(e.message);
    }
  };

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

  const exportData = (state) => {
    const outData = JSON.stringify(state);
    //Download the file as a JSON formatted text file
    var downloadLink = document.createElement("a");
    var blob = new Blob(["\ufeff", outData]);
    var url = URL.createObjectURL(blob);
    downloadLink.href = url;
    const outFileName = 'cmhcal_output.txt'
    downloadLink.download = outFileName;  //Name the file here
    document.body.appendChild(downloadLink);
    downloadLink.click();
    document.body.removeChild(downloadLink);
  }

  const deleteCat = (id) => {
    console.log('DELETE CATEGORY');
    dispatch({
      type: 'DELETECATEGORY',
      payload: {
        id: id,
      }
    })
  }

  const deleteOrg = (id) => {
    console.log('DELETE ORG');
    dispatch({
      type: 'DELETEORG',
      payload: {
        id: id,
      }
    })
  }

  const renameOrg = (event) => {
    console.log('RENAME ORG')
    console.log(event)
    if (event.target.innerText !== 'X') {
      const resourceName = prompt("Set the organization title")
      if (resourceName !== '' && resourceName !== null) {
        dispatch({ 
          type: 'EDITORGNAME', 
          payload: {
            resource: {
              title: resourceName,
              id: event.target.dataset.orgId,
            },
          },
        });
      };
    }
  }

  return (
    <React.Fragment>
      <div>
        <label htmlFor='importDataFile'>Import File:</label>
        <input 
          type="file" 
          id="importDataFile" 
          onChange={importData}
          style={btnStyle}
        />
        <button style={btnStyle} onClick={() => exportData(calState)}>Export</button>
      </div>
      <label htmlFor='fromDate'>Display From:</label> 
      <input
        id='fromDate'
        type='date'
        value={calDateRangeStart}
        onChange={event => dispatch({ type: 'CALDATERANGESTART', payload: { date: event.target.value }})} 
      />
      <label htmlFor='toDate'>To:</label>
      <input
        id='toDate'
        type='date'
        value={calDateRangeEnd}
        onChange={event => dispatch({ type: 'CALDATERANGEEND', payload: { date: event.target.value }})}
      />
      <div>
        <label htmlFor='addOrgText'>Add Organization:</label>
        <input
          id='addOrgText'
          type='text'
          value={addOrgName}
          onChange={event => setAddOrgName(event.target.value)}
        />
        <button 
          type="button" 
          onClick={() => addOrg(addOrgName)} 
        >
          Add Organization
        </button>
      </div>
      <div>
        <label htmlFor='addCatNameText'>Add Category:</label>
        <input
          id='addCatNameText'
          type='text'
          value={addCatName}
          onChange={event => setAddCatName(event.target.value)}
        />
        <label htmlFor='addCatColorText'>Color:</label>
        <input
          id='addCatColorText'
          type='text'
          value={addCatColor}
          onChange={event => setAddCatColor(event.target.value)}
        />
        <button 
          type="button" 
          onClick={() => addCat(addCatName, addCatColor)} 
        >
          Add Category
        </button>
      </div>
      <div>
      <h4>Categories:</h4>
      {calCategories.map((category) => 
        <div key={uuid.v4()} style={{ backgroundColor: category.color }}>
          {category.name}
          <button onClick={() => deleteCat(category.id)}>X</button>
        </div>
      )}
      </div>
      <div>
      <h4>Organizations:</h4>
      {calResources.map((resource) => 
        <div key={uuid.v4()} data-org-id={resource.id} onClick={renameOrg}>
          {resource.title}
          <button onClick={() => deleteOrg(resource.id)}>X</button>
        </div>
      )}
      </div>
    </React.Fragment>
  );
};

export default CalTools;
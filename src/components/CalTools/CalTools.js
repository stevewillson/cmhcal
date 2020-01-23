import React from 'react';
import { useSelector } from 'react-redux';
import { useDispatch } from 'react-redux';
import '../../assets/main.scss' // webpack must be configured to do this
import uuid from 'uuid';
import { DateTime } from 'luxon';
import { Form, Field } from 'react-final-form';
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
//import SequenceAdder from './SequenceAdder';

const CalTools = () => {
  // get state values from redux
  const calDateRangeStart = useSelector(state => state.calDateRangeStart)
  const calDateRangeEnd = useSelector(state => state.calDateRangeEnd)
  const calResources = useSelector(state => state.calResources);
  const calCategories = useSelector(state => state.calCategories);
  
  const dispatch = useDispatch();

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
  
  const onOrgSubmit = values => {
    dispatch({ 
      type: 'ADDORG', 
      payload: { 
        title: values.addOrg,
        id: uuid.v4(), 
      }
    });
  }

  const onCatSubmit = values => {
    dispatch({ 
      type: 'ADDCATEGORY', 
      payload: { 
        category: {
          id: uuid.v4(),
          name: values.addCat,
          color: values.catColor,
        } 
      }
    });
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

  const deleteCategory = (id) => {
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
      <form>
        <label>Import File: 
        <input 
          type="file" 
          id="timeInput" 
          onChange={importData}
          style={btnStyle}
        />
        </label>
        <button style={btnStyle} onClick={() => exportData(calState)}>Export</button>
      </form>
      Display From: 
      <DatePicker
        selected={DateTime.fromISO(calDateRangeStart).toJSDate()}
        onChange={(date) => dispatch({ type: 'CALDATERANGESTART', payload: { date: date.toISOString().slice(0,10) }})} //only when value has changed
      />
      To:
      <DatePicker
        selected={DateTime.fromISO(calDateRangeEnd).toJSDate()}
        onChange={(date) => dispatch({ type: 'CALDATERANGEEND', payload: { date: date.toISOString().slice(0,10) }})} //only when value has changed
      />
      <Form 
        onSubmit={onOrgSubmit}
        initialValues={{}}
        render={({ handleSubmit, form, submitting, pristine, values }) => (
          <form onSubmit={async event => { 
            await handleSubmit(event)
            form.reset()
          }}>
            <div>
              <label>Add Organization: </label>
              <Field 
                name="addOrg" 
                component="input"
                type="text" 
                placeholder="Organization Name" 
              />
              <button 
                type="submit"
                disabled={submitting || pristine}
              >
                Add Organization
              </button>
            </div>
          </form>
        )}
      />
      <Form 
        onSubmit={onCatSubmit}
        initialValues={{}}
        render={({ handleSubmit, form, submitting, pristine, values }) => (
          <form onSubmit={async event => { 
            await handleSubmit(event)
            form.reset()
          }}>
            <div>
              <label>Add Category: </label>
              <Field 
                name="addCat" 
                component="input"
                type="text" 
                placeholder="Category Name" 
              />
              <label>Color: </label>
              <Field 
                name="catColor" 
                component="input"
                type="text" 
                placeholder="Category Color" 
              />
              <button 
                type="submit"
                disabled={submitting || pristine}
              >
                Add Category
              </button>
            </div>
          </form>
        )}
      />
      <div>
      <h4>Categories:</h4>
      {calCategories.map((category) => 
        <div key={uuid.v4()} style={{ backgroundColor: category.color }}>
          {category.name}
          <button onClick={() => deleteCategory(category.id)}>X</button>
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
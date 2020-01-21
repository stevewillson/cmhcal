import React from 'react';
import ReactDOM from 'react-dom';
import { useSelector } from 'react-redux';
import { useDispatch } from 'react-redux';
import "../../../node_modules/react-datepicker/dist/react-datepicker.css";
import FullCalendar from '@fullcalendar/react'
import resourceTimeline from '@fullcalendar/resource-timeline'
import interaction from '@fullcalendar/interaction'
import '../../assets/main.scss' // webpack must be configured to do this
import uuid from 'uuid';
import { DateTime } from 'luxon';
import { Form, Field } from 'react-final-form';
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

const ResourceCalendar = () => {
  // get state values from redux
  const calDateRangeStart = useSelector(state => state.calDateRangeStart)
  const calDateRangeEnd = useSelector(state => state.calDateRangeEnd)
  const calResources = useSelector(state => state.calResources);
  const calEvents = useSelector(state => state.calEvents);
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
  
  const addEventSelected = (info) => {
    console.log('EVENT SELECT TIME')
    console.log(info)
    const start = new DateTime.fromISO(info.startStr)
    const end = new DateTime.fromISO(info.endStr)
    const eventName = prompt("Set the title")
    if (eventName !== '' && eventName !== null) {
      dispatch({ 
        type: 'ADDEVENT', 
        payload: {
          event: {
            title: eventName,
            start: start.toISODate(),
            end: end.toISODate(),
            id: uuid.v4(),
            resourceId: info.resource.id,
            color: '',
          },
        },
      });
    };
    // when I use 'eventRender' the vertical spacing
    // of events is incorrect, rerender the calendar to
    // correct the spacing
    const calendarApi = calendarRef.current.getApi()
    calendarApi.render()
  };

  const renameEvent = (id) => {
    console.log('EVENT CLICK')
    // check to see whether the button 'X' was clicked to delete the event
    const eventName = prompt("Set the title")
    if (eventName !== '' && eventName !== null) {
      dispatch({ 
        type: 'EDITEVENTNAME', 
        payload: {
          event: {
            title: eventName,
            id: id,
          },
        },
      });
    }
    // when I use 'eventRender' the vertical spacing
    // of events is incorrect, rerender the calendar to
    // correct the spacing
    const calendarApi = calendarRef.current.getApi()
    calendarApi.render()
  };

  const eventResize = (info) => {
    //console.log('EVENT RESIZE OR DROP')
    //console.log(info)
    const start = new DateTime.fromISO(info.event.start.toISOString());
    const end = new DateTime.fromISO(info.event.end.toISOString());
    // this will explicitly set the event end time
    dispatch({ 
      type: 'EDITEVENTTIME', 
      payload: {
        event: {
          start: start.toISODate(),
          end: end.toISODate(),
          id: info.event.id,
        },
      },
    });
    // when I use 'eventRender' the vertical spacing
    // of events is incorrect, rerender the calendar to
    // correct the spacing
    const calendarApi = calendarRef.current.getApi()
    calendarApi.render()
  };

  const eventDrop = (info) => {
    //console.log('EVENT DROP')
    //console.log(info)
    const start = new DateTime.fromISO(info.event.start.toISOString());
    const end = new DateTime.fromISO(info.event.end.toISOString());
    // set the event end time
    if (info.newResource !== null) {
      dispatch({ 
        type: 'EDITEVENTRESOURCETIME', 
        payload: {
          event: {
            start: start.toISODate(),
            end: end.toISODate(),
            id: info.event.id,
            resourceId: info.newResource.id,
          },
        },
      });
    } else {
      dispatch({ 
        type: 'EDITEVENTTIME', 
        payload: {
          event: {
            start: start.toISODate(),
            end: end.toISODate(),
            id: info.event.id,
          },
        },
      });
    }
    // when I use 'eventRender' the vertical spacing
    // of events is incorrect, rerender the calendar to
    // correct the spacing
    const calendarApi = calendarRef.current.getApi()
    calendarApi.render()
  };

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
      // when I use 'eventRender' the vertical spacing
      // of events is incorrect, rerender the calendar to
      // correct the spacing
      const calendarApi = calendarRef.current.getApi()
      calendarApi.render()
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

  const toggleEventCategory = (id, curCategory) => {
    // choose the next category
    const catNameList = calCategories.map(category => category.name)
    let curIndex = catNameList.indexOf(curCategory)
    if (curIndex  === catNameList.length - 1 || curIndex === -1) {
      curIndex = 0;
    } else {
      curIndex = curIndex + 1;
    }
    const newIndex = curIndex;
    const newCategory = catNameList[newIndex];
    
    //Choose the event category
    // get a dropdown with the available categories
    dispatch({
      type: 'EDITEVENTCATEGORY',
      payload: {
        event: {
          category: newCategory,
          id: id,
        }
      }
    })
  }

  const eventRender = (info) => {
    console.log('EVENT RENDER');
    //console.log(info);
    ReactDOM.render(
      <React.Fragment>
        <span className="fc-title-wrap">
          <span className="fc-title fc-sticky">
            {info.event.title}{' - '}
            <button onClick={() => renameEvent(info.event.id)}>Edit Name</button>
            {' - '}
            <button onClick={() => deleteEvent(info.event.id)}>X</button>
            {' - '}
            <button onClick={() => toggleEventCategory(info.event.id, info.event.extendedProps.category)}>Toggle Cat</button>
          </span>
        </span>
        <div className="fc-resizer fc-start-resizer"></div>
        <div className="fc-resizer fc-end-resizer"></div>
      </React.Fragment>,
      info.el
    );
    // check to see what category the event is associated with, get the color for that category
    if (info.event.extendedProps.category) {
      const eventCat = calCategories.filter(category => category.name === info.event.extendedProps.category) 
      if (eventCat.length > 0) {
        info.el.style.backgroundColor = eventCat[0].color;
      }
    }
    // explicitly specify the color for the event
    /*
    if (info.event.color) {
      info.el.css('background-color', info.event.color)
    }
    */
  }

  const deleteEvent = (id) => {
    console.log('DELETE EVENT');
    dispatch({
      type: 'DELETEEVENT',
      payload: {
        id: id,
      }
    })
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

  const renameResource = (resource) => {
    console.log('RENAME RESOURCE')
    console.log(resource)
    const resourceName = prompt("Set the organization title")
    if (resourceName !== '' && resourceName !== null) {
      dispatch({ 
        type: 'EDITORGNAME', 
        payload: {
          resource: {
            title: resourceName,
            id: resource.id,
          },
        },
      });
    };
    // when I use 'eventRender' the vertical spacing
    // of events is incorrect, rerender the calendar to
    // correct the spacing
    const calendarApi = calendarRef.current.getApi()
    calendarApi.render()
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
    // when I use 'eventRender' the vertical spacing
    // of events is incorrect, rerender the calendar to
    // correct the spacing
    const calendarApi = calendarRef.current.getApi()
    calendarApi.render()
  }

  const resourceRender = (info) => {
    //console.log('RESOURCE RENDER')
    //console.log(info)
    info.el.addEventListener("click", () => renameResource(info.resource))
    /*
    ReactDOM.render(
      <React.Fragment>
      {info.resource.title} - <button onClick={() => deleteOrg(info.resource.id)}>X</button>
      </React.Fragment>,
      info.el
    );
    */
  }

  const calendarRef = React.useRef()

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
      Categories:
      {calCategories.map((category) => 
        <div style={{ backgroundColor: category.color }}>
          {category.name}
          <button onClick={() => deleteCategory(category.id)}>X</button>
        </div>
      )}
      Organizations:
      {calResources.map((resource) => 
        <div data-org-id={resource.id} onClick={renameOrg}>
          {resource.title}
          <button onClick={() => deleteOrg(resource.id)}>X</button>
        </div>
      )}
      <FullCalendar 
        ref={calendarRef}
        //added to suppress license key prompt
        schedulerLicenseKey={'GPL-My-Project-Is-Open-Source'}
        defaultView={'RefreshView'}
        timeZone={'local'}
        plugins={[ interaction, resourceTimeline ]} 
        resourceLabelText={'Organization'}
        header={{
          left: '',
          center: 'title',
          right: 'RefreshView',
        }}
        editable={true}
        height={'auto'}
        views={{
          RefreshView: {
            type: 'resourceTimeline',
            visibleRange: {
              start: calDateRangeStart,
              end: calDateRangeEnd, 
            },
          }
        }}
        slotLabelInterval={{ days: 1 }}
        events={calEvents}
        resources={calResources}
        selectable={true}
        //eventClick={eventClick}
        eventResize={eventResize}
        eventDrop={eventDrop}
        select={addEventSelected}
        eventRender={eventRender}
        resourceRender={resourceRender}
      />
    </React.Fragment>
  );
};

export default ResourceCalendar;
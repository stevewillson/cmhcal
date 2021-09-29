import React from 'react';
import { useSelector } from 'react-redux';
import { useDispatch } from 'react-redux';
import { v4 as uuidv4 } from 'uuid';

const OrganizationDisplay = () => {
  // get state values from redux
  var { displayOrganizations } = useSelector(state => state);
  
  const dispatch = useDispatch();

  const calState = useSelector(state => { 
    return { 
      calResources: state.calResources,
    }})

  const deleteOrg = (id) => {
    //console.log('DELETE ORG');
    dispatch({
      type: 'DELETE_ORG',
      payload: {
        id: id,
      }
    })
  }

  const renameOrg = (event) => {
    //console.log('RENAME ORG')
    //console.log(event)
    if (event.target.innerText !== 'X') {
      const resourceName = prompt("Set the organization title")
      if (resourceName !== '' && resourceName !== null) {
        dispatch({ 
          type: 'UPDATE_ORG', 
          payload: {
            title: resourceName,
            id: event.target.dataset.orgId,
          },
        });
      };
    }
  }

  const toggleDisplayOrganizations = (event) => {
    dispatch({
      type: 'SET_DISPLAY_ORGANIZATIONS',
      payload: {
        displayOrganizations: event.target.checked,
      }
    })
  }

  return (
    <React.Fragment>        
      <div className="top-organizations">
      <h4>Organizations
      <input
        type="checkbox" 
        id="displayOrganizationsCheckbox"
        defaultChecked={true}
        // set the redux state to capture 'displayOrganizations' for shared state
        onChange={toggleDisplayOrganizations}
      />
      <label htmlFor="displayOrganizationsCheckbox">Show</label>
      </h4>
      {displayOrganizations && calState.calResources.map((resource) => 
        <div key={uuidv4()} data-org-id={resource.id} onClick={renameOrg}>
          {resource.title}
          <button onClick={() => deleteOrg(resource.id)}>X</button>
        </div>
      )}
      </div>
    </React.Fragment>
  );
};

export default OrganizationDisplay;
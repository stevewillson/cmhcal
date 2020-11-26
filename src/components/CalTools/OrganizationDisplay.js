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

  const flatten = (obj, path = '') => {      
    if (!(obj instanceof Object)) return {[path.replace(/-$/g, '')]:obj};
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
      {displayOrganizations && flattenGenArray(calState.calResources).map((resource) => 
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
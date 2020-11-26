import React, { useState } from 'react';
import { useSelector } from 'react-redux';
import { useDispatch } from 'react-redux';
import { v4 as uuidv4 } from 'uuid';

const AddOrganizationDisplay = () => {
  // get state values from redux
  const dispatch = useDispatch();

  const [addOrgName, setAddOrgName] = useState('');
  const [addParentOrgId, setAddParentOrgId] = useState('None');

  const calState = useSelector(state => { 
    return { 
      calEvents: state.calEvents, 
      calResources: state.calResources, 
      calCategories: state.calCategories,
      calDateRangeStart: state.calDateRangeStart, 
      calDateRangeEnd: state.calDateRangeEnd, 
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

  const addOrg = (orgName, parentOrgId) => {
    if (orgName === '') {
      alert('Please specify an organization name');
    } else {
      dispatch({ 
        type: 'CREATE_ORG', 
        payload: { 
          title: orgName,
          id: uuidv4(),
          parent: parentOrgId || 'None',
        }
      });
      setAddOrgName('');
    }
  }

  return (
    <div>
      <label htmlFor='addOrgText'>Add Organization:</label>
      <input
        id='addOrgText'
        type='text'
        value={addOrgName}
        onChange={event => setAddOrgName(event.target.value)}
      />
      <label htmlFor='addOrgParent'>Set Parent Organization:</label>
      <select
        onChange={event => setAddParentOrgId(event.target.selectedOptions[0].value)} 
        id="addOrgParent" 
        value={addParentOrgId}      
      >
        <option 
          key={uuidv4()} 
          value={"None"}
        >
        {"None"}
        </option>
        {flattenGenArray(calState.calResources).map(org => 
        <option 
          key={uuidv4()} 
          value={org.id}
        >
        {org.title}
        </option>
        )}
      </select>
      <button 
        type="button" 
        onClick={() => addOrg(addOrgName, addParentOrgId)}
      >
      Add Organization
      </button>
    </div>
  );
};

export default AddOrganizationDisplay;
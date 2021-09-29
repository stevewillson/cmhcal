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
        {calState.calResources.map(org => 
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
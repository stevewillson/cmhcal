import { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { v4 as uuidv4 } from "uuid";
import { handleAddOrganization } from "./organizationsActions";

const AddOrganizationForm = () => {
  const [orgName, setOrgName] = useState('');
  const [parentOrgId, setParentOrgId] = useState('None');

  const dispatch = useDispatch();
  const organizations = useSelector((state) => state.organizations);

  const handleAddNewOrganization = (orgName, parentOrgId) => {
    if (orgName.trim()) {
      const newOrg = {
        "title": orgName,
        "id": uuidv4(),
        "parentId": parentOrgId || "None",
      };
      handleAddOrganization(newOrg, dispatch);
      setOrgName("");
      setParentOrgId("None");
    } else {
      alert("Please specify an organization name");
    }
  };

  return (
    <div>
      <label htmlFor='addOrgName'>Add Organization: </label>
      <input
        id="addOrgName"
        type="text"
        value={orgName}
        onChange={(e) => setOrgName(e.target.value)}
        placeholder="Organization Name"
      />
      <label htmlFor="addOrgParent">Parent Organization:</label>
      <select
        onChange={(event) =>
          setParentOrgId(event.target.selectedOptions[0].value)
        }
        id="addOrgParent"
        value={parentOrgId}
      >
        <option key={uuidv4()} value={"None"}>
          {"None"}
        </option>
        {organizations.map((org) => (
          <option key={uuidv4()} value={org.id}>
            {org.title}
          </option>
        ))}
      </select>
      <button onClick={()=>handleAddNewOrganization(orgName, parentOrgId)}>Add Organization</button>
    </div>
  );
};

export default AddOrganizationForm;

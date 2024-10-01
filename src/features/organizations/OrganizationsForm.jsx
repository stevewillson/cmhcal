// import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { v4 as uuidv4 } from "uuid";
import { addOrganization } from "./organizationsSlice";

export const OrganizationsForm = () => {
  const dispatch = useDispatch();
  const organizations = useSelector((state) => state.organizations.list);

  const handleAddNewOrganization = () => {
    // get the value from the input fields
    // get input from the field with id addOrgName
    const orgName = document.getElementById("addOrgName").value;
    // get the value from the select field
    const parentOrgId = document.getElementById("addOrgParent").value;

    if (orgName.trim()) {
      const orgId = uuidv4();
      const newOrg = {
        title: orgName,
        id: orgId,
        parentId: parentOrgId || "",
      };
      dispatch(addOrganization(newOrg));
      // set the addOrgName field to empty
      document.getElementById("addOrgName").value = "";
      // set the addOrgParent field to None
      document.getElementById("addOrgParent").value = "";
    } else {
      alert("Please specify an organization name");
    }
  };
  return (
    <div>
      <label htmlFor="addOrgName">Add Organization: </label>
      <input id="addOrgName" type="text" placeholder="Organization Name" />
      <label htmlFor="addOrgParent">Parent Organization:</label>
      <select id="addOrgParent">
        <option key={uuidv4()} value={""}>
          {"None"}
        </option>
        {organizations.map((org) => (
          <option key={uuidv4()} value={org.id}>
            {org.title}
          </option>
        ))}
      </select>
      <button onClick={handleAddNewOrganization}>Add Organization</button>
    </div>
  );
};

export default OrganizationsForm;

import { updateOrganization, removeOrganization } from "./organizationsSlice";

const handleRenameOrganization = (info, dispatch) => {
  // prompt for new organization name
  const newOrgName = prompt(
    "Enter a new organization name:",
    info.resource.title
  );
  // check to see whether the button 'X' was clicked to delete the event
  if (newOrgName !== "" && newOrgName !== null) {
    info.resource.setProp("title", newOrgName);
    dispatch(updateOrganization(info.resource.toPlainObject()));
  }
};

// handleRemoveOrganization function
const handleRemoveOrganization = (info, dispatch) => {
  // check if the organization has any children, if so, then set those children to this organization's parent
  const { resource } = info;
  const parentOrg = resource.getParent();
  const parentOrgId = parentOrg ? parentOrg.id : "";
  const childrenOrgs = resource.getChildren();
  // go through each child and set the parent to the parentOrg
  childrenOrgs.forEach((child) => {
    const childObj = child.toPlainObject();
    childObj.parentId = parentOrgId;
    dispatch(updateOrganization(childObj));
  });
  dispatch(removeOrganization(info.resource.id));
};

export const resourceRender = (info, editMode, dispatch) => {
  if (editMode) {
    return (
      <>
        <button onClick={() => handleRenameOrganization(info, dispatch)}>
          {info.resource.title}
        </button>{" "}
        -{" "}
        <button onClick={() => handleRemoveOrganization(info, dispatch)}>
          X
        </button>
      </>
    );
  }
  return <>{info.resource.title}</>;
};

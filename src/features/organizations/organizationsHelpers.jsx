import { updateOrganization } from "./organizationsSlice";

// handleUpdateOrganization function

// TODO rename organizations
// export const handleUpdateOrganization = (info, editMode, dispatch) => {
//     // prompt for new organization name
//     const newOrgName = prompt("Enter a new organization name:");
//     // if the user entered a name

//     // rename locally and also set the event name?
//     // check to see whether the button 'X' was clicked to delete the event
//     const eventTitle = prompt("Set the title", event.title);
//     if (eventTitle !== "" && eventTitle !== null) {
//       event.setProp("title", eventTitle);
//     }
//   };

//   if (editMode) {
//     return (
//       <button
//         onClick={() =>
//           dispatch(updateOrganization(info.resource.toPlainObject()))
//         }
//       >
//         Save
//       </button>
//     );
//   }
// };

export const resourceRender = (info, editMode, dispatch) => {
  return (
    <>
      {info.resource.title}
      {editMode && (
        <>
          {" "}
          -{" "}
          <button
            onClick={() =>
              dispatch(updateOrganization(info.resource.toPlainObject()))
            }
          >
            Change Name
          </button>
        </>
      )}
    </>
  );
};

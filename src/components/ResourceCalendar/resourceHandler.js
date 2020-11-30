import { store } from '../../configureStore';

export const renameResource = (resource) => {
    //console.log('RENAME RESOURCE')
    //console.log(resource)
    const resourceName = prompt("Set the organization title")
    if (resourceName !== '' && resourceName !== null) {
      store.dispatch({ 
        type: 'UPDATE_ORG', 
        payload: {
          title: resourceName,
          id: resource.id,
        },
      });
    };
  }

export const resourceRender = (info) => {
  let editModeBtn = document.getElementById("editModeCheckbox");
  let editMode = true;
  if (editModeBtn !== null) {
    editMode = editModeBtn.checked;
  } 
  if (editMode) {
    return (
      <>
        {info.resource.title}
        {' - '}
        <button onClick={() => renameResource(info.resource)}>Change Name</button>  
      </>
    )  
  }
  return (
    <>
      {info.resource.title}
    </>
  )
}
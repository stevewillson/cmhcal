import { store } from '../../configureStore';

export const renameResource = (resource) => {
    //console.log('RENAME RESOURCE')
    //console.log(resource)
    const resourceName = prompt("Set the organization title", resource.title)
    if (resourceName !== '' && resourceName !== null && resourceName !== resource.title) {
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
  
  const editModeBtn = document.getElementById("editModeCheckbox");
  const editMode = editModeBtn !== null ? editModeBtn.checked : true;
  
  return (
    <>
      {info.resource.title}
      {editMode && <> - <button onClick={() => renameResource(info.resource)}>Change Name</button></>}  
    </>
  )
}
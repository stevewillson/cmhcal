import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { v4 as uuidv4 } from 'uuid';

const AddCategoryDisplay = () => {
  // get state values from redux

  const dispatch = useDispatch();

  const [addCatName, setAddCatName] = useState('');
  const [addCatColor, setAddCatColor] = useState('');

  const addCat = (catName, catColor) => {
    if (catName === '') {
      alert('Please specify a category name');
    } else {
      dispatch({ 
        type: 'CREATE_CATEGORY', 
        payload: {
          id: uuidv4(),
          name: catName,
          color: catColor,
        }
      });
      setAddCatName('');
      setAddCatColor('');  
    }
  }

  return (
    <React.Fragment>
      <label htmlFor='addCatNameText'>Add Category:</label>
      <input
        id='addCatNameText'
        type='text'
        value={addCatName}
        onChange={event => setAddCatName(event.target.value)}
      />
      <label htmlFor='addCatColorText'>Color:</label>
      <input
        id='addCatColorText'
        type='text'
        value={addCatColor}
        onChange={event => setAddCatColor(event.target.value)}
      />
      <button 
        type="button" 
        onClick={() => addCat(addCatName, addCatColor)} 
      >
        Add Category
      </button>
    </React.Fragment>
  );
};

export default AddCategoryDisplay;
import React from 'react';
import { useSelector } from 'react-redux';
import { useDispatch } from 'react-redux';
import { v4 as uuidv4 } from 'uuid';

const CategoryDisplay = () => {
  var calCategories = useSelector(state => state.calCategories);
  var { displayCategories, editMode } = useSelector(state => state);
  
  const dispatch = useDispatch();

  const deleteCat = (id) => {
    // console.log('DELETE CATEGORY');
    dispatch({
      type: 'DELETE_CATEGORY',
      payload: {
        id: id,
      }
    })
  }

  const changeCatName = (id, curName) => {
    const categoryName = prompt("Set the category title", curName);
    if (categoryName !== '' && categoryName !== null && categoryName !== curName) {
      dispatch({ 
        type: 'UPDATE_CATEGORY_NAME', 
        payload: {
          name: categoryName,
          id: id,
        },
      });
    };
  }

  

  const changeCatColor = (id, curColor) => {
    // TODO get the previous color and if the color is updated
    // change all events with that color to the new color
    const categoryColor = prompt("Set the category color", curColor)
    if (categoryColor !== '' && categoryColor !== null) {
      dispatch({ 
        type: 'UPDATE_CATEGORY_COLOR', 
        payload: {
          color: categoryColor,
          id: id,
        },
      });
    };
  }

  const changeCatTextColor = (id, curTextColor) => {
    // TODO get the previous color and if the color is updated
    // change all events with that color to the new color
    const categoryTextColor = prompt("Set the category text color", curTextColor)
    if (categoryTextColor !== '' && categoryTextColor !== null) {
      dispatch({ 
        type: 'UPDATE_CATEGORY_TEXT_COLOR', 
        payload: {
          textColor: categoryTextColor,
          id: id,
        },
      });
    };
  }

  const toggleDisplayCategories = (event) => {
    dispatch({
      type: 'SET_DISPLAY_CATEGORIES',
      payload: {
        displayCategories: event.target.checked,
      }
    })
  }
  return (
    <React.Fragment>
      <div className="top-categories">
      <h4>Categories
        <input
          type="checkbox" 
          id="displayCategoriesCheckbox"
          defaultChecked={true}
          // set the redux state to capture 'displayCategories' for shared state
          onChange={toggleDisplayCategories}
        />
        <label htmlFor="displayCategoriesCheckbox">Show</label>
      </h4>
      {displayCategories && calCategories.map((category) => 
        <div key={uuidv4()} data-cat-id={category.id} style={{ backgroundColor: category.color, color: category.textColor }}>
          {category.name}
          {editMode && <> - <button onClick={() => changeCatName(category.id, category.name)}>Change Name</button></>}
          {editMode && <> - <button onClick={() => changeCatColor(category.id, category.color)}>Change Color</button></>}
          {editMode && <> - <button onClick={() => changeCatTextColor(category.id, category.textColor)}>Change Text Color</button></>}
          {editMode && <> - <button onClick={() => deleteCat(category.id, category.name)}>X</button></>}
        </div>
      )}
      </div>
    </React.Fragment>
  );
};

export default CategoryDisplay;
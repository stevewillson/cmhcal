import React from 'react';
import { useSelector } from 'react-redux';
import { useDispatch } from 'react-redux';
import { v4 as uuidv4 } from 'uuid';

const CategoryDisplay = () => {
  var calCategories = useSelector(state => state.calCategories);
  var { displayCategories } = useSelector(state => state);
  
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

  const renameCat = (event) => {
    //console.log('RENAME CAT')
    //console.log(event)
    if (event.target.innerText !== 'X') {
      const categoryName = prompt("Set the category title")
      if (categoryName !== '' && categoryName !== null) {
        dispatch({ 
          type: 'UPDATE_CATEGORY', 
          payload: {
            title: categoryName,
            id: event.target.dataset.catId,
          },
        });
      };
    }
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
        <div key={uuidv4()} data-cat-id={category.id} style={{ backgroundColor: category.color }} onClick={renameCat}>
          {category.name}
          <button onClick={() => deleteCat(category.id)}>X</button>
        </div>
      )}
      </div>
    </React.Fragment>
  );
};

export default CategoryDisplay;
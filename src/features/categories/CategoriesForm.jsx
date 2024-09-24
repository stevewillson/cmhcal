import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { v4 as uuidv4 } from "uuid";
import { handleAddCategory, loadCategoriesFromDB, handleRemoveCategory} from '../categories/categoryActions'; // Import category actions

const CategoriesForm = () => {
    // State for managing categories
    const [newCategoryName, setNewCategoryName] = useState('');
    const [newCategoryColor, setNewCategoryColor] = useState('#ffffff');
    const [newCategoryTextColor, setNewCategoryTextColor] = useState('#000000');

    // Display categories mode state
  const [displayCategories, setDisplayCategories] = useState(true);
  const [editCategories, setEditCategories] = useState(false);


  const dispatch = useDispatch();
  const categories = useSelector((state) => state.categories); // Get categories from Redux store

  // Load events and calendar view settings from IndexedDB when the component mounts
  useEffect(() => {
    loadCategoriesFromDB(dispatch); // Load categories from IndexedDB
  }, [dispatch]);

  // Handle adding a new category
  const handleAddNewCategory = () => {
    if (newCategoryName.trim()) {

      // create the new category object here
      const newCat = {"id": uuidv4(), "name": newCategoryName, "color": newCategoryColor, "textColor": newCategoryTextColor}
      handleAddCategory(newCat, dispatch);
      setNewCategoryName(''); // Reset form
      setNewCategoryColor('#ffffff'); // Reset form
      setNewCategoryTextColor('#000000'); // Reset form
    }
  };

   // Toggle display mode
   const toggleDisplayCategories = () => {
    setDisplayCategories((prevMode) => !prevMode);
  };

     // Toggle edit mode
     const toggleEditCategories = () => {
      setEditCategories((prevMode) => !prevMode);
    };
  

  return (
    <><div>
          <label htmlFor='addCategoryName'>Add Category: </label>
          <input
            id="addCategoryName"
            type="text"
            value={newCategoryName}
            onChange={(e) => setNewCategoryName(e.target.value)}
            placeholder="Category Name"
          />
          <label htmlFor="addCategoryTextColor">Text Color: </label>
          <input
            id="addCategoryTextColor"
            type="color"
            value={newCategoryTextColor}
            onChange={(e) => setNewCategoryTextColor(e.target.value)}
          />
          <label htmlFor='addCategoryColor'>Background Color: </label>
          <input
            id="addCategoryColor"
            type="color"
            value={newCategoryColor}
            onChange={(e) => setNewCategoryColor(e.target.value)}
          />
          <button onClick={handleAddNewCategory}>Add Category</button>
        </div>

      <>
      <div className="top-categories">
      <h3>Categories
        <input
          type="checkbox" 
          id="displayCategoriesCheckbox"
          checked={displayCategories}
          // TODO? set the redux state to capture 'displayCategories' for shared state
          onChange={toggleDisplayCategories}
        />
        <label htmlFor="displayCategoriesCheckbox">Show</label>
        <input
          type="checkbox" 
          id="editCategoriesCheckbox"
          checked={editCategories}
          // TODO? set the redux state to capture 'editCategories' for shared state
          onChange={toggleEditCategories}
        />
        <label htmlFor="editCategoriesCheckbox">Edit</label>
      </h3>
      {displayCategories && categories.map((category) => 
        <div key={uuidv4()} data-cat-id={category.id} style={{ backgroundColor: category.color, color: category.textColor }}>
          {category.name}
          {/* {editCategories && <> - <button onClick={() => changeCatName(category.id, category.name)}>Change Name</button></>} */}
          {/* {editCategories && <> - <button onClick={() => changeCatTextColor(category.id, category.textColor)}>Change Text Color</button></>} */}
          {/* {editCategories && <> - <button onClick={() => changeCatColor(category.id, category.color)}>Change Color</button></>} */}
          {/* {editCategories && <> - <button onClick={() => handleUpdateCategory(category.id)}>Change Color</button></>} */}
          {editCategories && <> - <button onClick={() => handleRemoveCategory(category.id, dispatch)}>X</button></>}
        </div>
      )}
      </div>
    </>
      </>
  );
};

export default CategoriesForm;

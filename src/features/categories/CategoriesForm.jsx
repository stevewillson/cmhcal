import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { v4 as uuidv4 } from "uuid";
import { addCategory, removeCategory } from "./categoriesSlice";

const CategoriesForm = () => {
  const [newCategoryName, setNewCategoryName] = useState("");
  const [newCategoryColor, setNewCategoryColor] = useState("#ffffff");
  const [newCategoryTextColor, setNewCategoryTextColor] = useState("#000000");
  const [displayCategories, setDisplayCategories] = useState(true);
  const [editCategories, setEditCategories] = useState(false);

  const dispatch = useDispatch();
  const categories = useSelector((state) => state.categories.list || []);

  const handleAddNewCategory = () => {
    if (newCategoryName.trim()) {
      const newCat = {
        id: uuidv4(),
        name: newCategoryName,
        color: newCategoryColor,
        textColor: newCategoryTextColor,
      };
      dispatch(addCategory(newCat));
      resetForm();
    }
  };

  const resetForm = () => {
    setNewCategoryName("");
    setNewCategoryColor("#ffffff");
    setNewCategoryTextColor("#000000");
  };

  const toggleDisplayCategories = () => {
    setDisplayCategories((prevMode) => !prevMode);
  };

  const toggleEditCategories = () => {
    setEditCategories((prevMode) => !prevMode);
  };

  return (
    <>
      <div>
        <label htmlFor="addCategoryName">Add Category: </label>
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
        <label htmlFor="addCategoryColor">Background Color: </label>
        <input
          id="addCategoryColor"
          type="color"
          value={newCategoryColor}
          onChange={(e) => setNewCategoryColor(e.target.value)}
        />
        <button onClick={handleAddNewCategory}>Add Category</button>
      </div>

      <div className="top-categories">
        <h3>
          Categories
          <input
            type="checkbox"
            id="displayCategoriesCheckbox"
            checked={displayCategories}
            onChange={toggleDisplayCategories}
          />
          <label htmlFor="displayCategoriesCheckbox">Show</label>
          <input
            type="checkbox"
            id="editCategoriesCheckbox"
            checked={editCategories}
            onChange={toggleEditCategories}
          />
          <label htmlFor="editCategoriesCheckbox">Edit</label>
        </h3>
        {displayCategories &&
          categories.map((category) => (
            <div
              key={category.id}
              data-cat-id={category.id}
              style={{
                backgroundColor: category.color,
                color: category.textColor,
              }}
            >
              {category.name}
              {editCategories && (
                <>
                  {" "}
                  -{" "}
                  <button onClick={() => dispatch(removeCategory(category.id))}>
                    X
                  </button>
                </>
              )}
            </div>
          ))}
      </div>
    </>
  );
};

export default CategoriesForm;

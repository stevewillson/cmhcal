import { useDispatch, useSelector } from "react-redux";
import { setEditMode } from "./calendarSlice";

const EditModeForm = () => {
  const { editMode } = useSelector((state) => state.settings);
  const dispatch = useDispatch();

  const handleChange = () => {
    dispatch(setEditMode(!editMode));
  };

  return (
    <div>
      <label htmlFor="editModeCheckbox">
        <input
          id="editModeCheckbox"
          type="checkbox"
          checked={editMode}
          onChange={handleChange}
        />
        Edit Mode
      </label>
    </div>
  );
};

export default EditModeForm;

import { useState, useEffect, useRef } from "react";
import PropTypes from "prop-types";
import "./EditEventModal.css";
import { v4 as uuidv4 } from "uuid";
import Modal from "../Modal/Modal";

const initialEventModalData = {
  title: "",
  start: "",
  end: "",
  categories: [],
};

const EditEventModal = ({ onSubmit, isOpen, onClose, initialData }) => {
  const focusInputRef = useRef(null);
  const [modalState, setModalState] = useState(initialEventModalData);

  useEffect(() => {
    if (isOpen) {
      setModalState(initialData || initialEventModalData);
      if (focusInputRef.current) {
        setTimeout(() => {
          focusInputRef.current.focus();
        }, 0);
      }
    }
  }, [isOpen, initialData]);

  const handleInputChange = (event) => {
    const { name, value } = event.target;
    setModalState((prevFormData) => ({
      ...prevFormData,
      [name]: value,
    }));
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    // get the form state here
    onSubmit(modalState);
    setModalState(initialEventModalData);
  };

  return (
    <Modal hasCloseBtn={true} isOpen={isOpen} onClose={onClose}>
      <form onSubmit={handleSubmit}>
        <div className="form-row">
          <label htmlFor="title">Event Name</label>
          <input
            ref={focusInputRef}
            type="title"
            id="title"
            name="title"
            value={modalState.title ? modalState.title : ""}
            onChange={handleInputChange}
            required
          />
        </div>
        <div className="form-row">
          <label htmlFor="start">Start Date</label>
          <input
            type="date"
            name="start"
            value={modalState.start ? modalState.start : ""}
            onChange={handleInputChange}
            placeholder="Start Date"
          />
        </div>
        <div className="form-row">
          <label htmlFor="end">End Date</label>
          <input
            type="date"
            name="end"
            value={modalState.end ? modalState.end : ""}
            onChange={handleInputChange}
            placeholder="End Date"
          />
        </div>
        <div className="form-row">
          <label htmlFor="categoryId">Category</label>
          <select
            onChange={handleInputChange}
            type="text"
            name="categoryId"
            // id={"changeEventCategory" + uuidv4()}
            value={modalState.categoryId}
          >
            {modalState.categories.map((cat) => (
              <option key={uuidv4()} value={cat.id}>
                {cat.name}
              </option>
            ))}
          </select>
        </div>
        <div className="form-row">
          <button type="submit">Submit</button>
        </div>
      </form>
    </Modal>
  );
};
EditEventModal.propTypes = {
  onSubmit: PropTypes.func.isRequired,
  isOpen: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  initialData: PropTypes.object,
};

export default EditEventModal;

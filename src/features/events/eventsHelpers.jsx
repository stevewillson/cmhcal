import { v4 as uuidv4 } from "uuid"; // Import the UUID package
import { renameEvent, modifyEventCategory } from "./eventActions"; // Other event-related actions

const renderEditMode = (info, categories, dispatch) => (
  <>
    <b>{info.event.title}</b>
    {" - "}
    <button onClick={() => renameEvent(info.event)}>Edit Name</button>
    {" - "}
    <div className="tooltip">
      <span className="tooltiptext">Hold CTRL + Click to change category</span>
      <select
        onChange={(event) =>
          modifyEventCategory(
            info.event,
            categories,
            event.target.selectedOptions[0].value,
            dispatch
          )
        }
        id={"changeEventCategory" + uuidv4()}
        value={info.event.extendedProps.categoryId}
      >
        {categories.map((cat) => (
          <option key={uuidv4()} value={cat.id}>
            {cat.name}
          </option>
        ))}
      </select>
    </div>
    {" - "}
    <button onClick={() => info.event.remove()}>X</button>
  </>
);

const renderEventDates = (info) => (
  <>
    {" - "}
    <b>{info.event.start.toISOString().slice(5, 10)}</b>
    {" - "}
    <b>{info.event.end.toISOString().slice(5, 10)}</b>
  </>
);

export const eventRender = (info, categories, editMode, dispatch) => {
  if (info.view.type === "DayView") {
    return editMode ? (
      renderEditMode(info, categories, dispatch)
    ) : (
      <b>{info.event.title}</b>
    );
  } else if (info.view.type === "WeekView" || info.view.type === "MonthView") {
    return (
      <>
        <b>{info.event.title}</b>
        {renderEventDates(info)}
        {editMode && renderEditMode(info, categories, dispatch)}
      </>
    );
  }
};

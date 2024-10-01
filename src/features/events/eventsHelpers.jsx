import { v4 as uuidv4 } from "uuid"; // Import the UUID package
import { renameEvent, modifyEventCategory } from "./eventActions"; // Other event-related actions
export const eventRender = (info, categories, editMode, dispatch) => {
  // edit mode is now captured in the redux state
  if (info.view.type === "DayView") {
    if (editMode) {
      return (
        <>
          {<b>{info.event.title}</b>}
          {
            <>
              {" "}
              -{" "}
              <button onClick={() => renameEvent(info.event)}>Edit Name</button>
            </>
          }
          {<> - </>}
          <div className="tooltip">
            <span className="tooltiptext">
              Hold CTRL + Click to change category
            </span>
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
              // fullCalendar requires CTRL to be held down to select a form element within an event
              value={info.event.extendedProps.categoryId}
            >
              {categories.map((cat) => (
                <option key={uuidv4()} value={cat.id}>
                  {cat.name}
                </option>
              ))}
            </select>
          </div>
          {
            <>
              {" "}
              - <button onClick={() => info.event.remove()}>X</button>
            </>
          }
        </>
      );
    }
    return (
      <>
        <b>{info.event.title}</b>
      </>
    );
  } else if (info.view.type === "WeekView" || info.view.type === "MonthView") {
    if (editMode) {
      return (
        <>
          <b>{info.event.title}</b>
          {
            <>
              {" "}
              - <b>{info.event.start.toISOString().slice(5, 10)}</b>
            </>
          }
          {
            <>
              {" "}
              - <b>{info.event.end.toISOString().slice(5, 10)}</b>
            </>
          }
          {
            <>
              {" "}
              -{" "}
              <button onClick={() => renameEvent(info.event)}>Edit Name</button>
            </>
          }
          {<> - </>}
          <div className="tooltip">
            <span className="tooltiptext">
              Hold CTRL + Click to change category
            </span>
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
              // fullCalendar requires CTRL to be held down to select a form element within an event
              value={info.event.extendedProps.categoryId}
            >
              {categories.map((cat) => (
                <option key={uuidv4()} value={cat.id}>
                  {cat.name}
                </option>
              ))}
            </select>
          </div>
          {
            <>
              {" "}
              - <button onClick={() => info.event.remove()}>X</button>
            </>
          }
        </>
      );
    }
    return (
      <>
        <b>{info.event.title}</b>
        {" - "}
        <b>{info.event.start.toISOString().slice(5, 10)}</b>
        {" - "}
        <b>{info.event.end.toISOString().slice(5, 10)}</b>
      </>
    );
  }
};

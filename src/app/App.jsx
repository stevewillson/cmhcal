// src/App.jsx
import Calendar from "../features/calendar/Calendar";
import CategoriesForm from "../features/categories/CategoriesForm";
import OrganizationsForm from "../features/organizations/OrganizationsForm";
import "./App.css";

function App() {
  return (
    <div className="App">
      <OrganizationsForm />
      <CategoriesForm />
      <Calendar />
    </div>
  );
}

export default App;

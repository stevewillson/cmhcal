import React from 'react';
import ResourceCalendar from '../components/ResourceCalendar/ResourceCalendar';
import CalTools from '../components/CalTools/CalTools';
import ImportTemplate from '../components/CalTemplates/ImportTemplate';
import ExportTemplate from '../components/CalTemplates/ExportTemplate';

import './App.css';

const App = () => {
  return (
    <div className="App">    
      <div className="grid-container">
        <div className="top-left-layout">
          <CalTools />
        </div>
        <div className="top-right-layout">
          <ExportTemplate />
          <ImportTemplate />
        </div>
        <div className="cal-layout">
          <ResourceCalendar />
        </div>
      </div>
    </div>
  );
}

export default App;
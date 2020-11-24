import React from 'react';
import ResourceCalendar from '../components/ResourceCalendar/ResourceCalendar';
import CalTools from '../components/CalTools/CalTools';

import './App.css';

const App = () => {
  return (
    <div className="App">    
      <div className="grid-container">
        <div>
          <CalTools />
        </div>
        <div className="cal-layout">
          <ResourceCalendar />
        </div>
      </div>
    </div>
  );
}

export default App;
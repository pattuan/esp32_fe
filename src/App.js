import React from 'react';
import './App.css';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import AppDEMO from './component/ToggleButton';
import Login from './login';
import Form from './form';

function App() {
  return (
    <div className="App">
      <Router basename="/esp32_fe">
        <Routes>
          <Route path="/" element={<Login />} />
          <Route path="/AppDEMO" element={<AppDEMO />} />
          <Route path="/form" element={<Form />} />
        </Routes>
      </Router>
    </div>
  );
}

export default App;
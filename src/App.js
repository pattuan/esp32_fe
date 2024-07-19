import React from 'react';
import './App.css';
import { HashRouter, Route, Routes } from 'react-router-dom';
import AppDEMO from './component/ToggleButton';
import Login from './login';
import Form from './form';
import Camera from './camera';
function App() {
  return (
    <div className="App">
      <HashRouter basename="/esp32_fe">
        <Routes>
          <Route exact path="/" element={<Login />}/>
          <Route path="/AppDEMO" element={<AppDEMO />} />
          <Route path="/form" element={<Form />} />
          <Route path="/camera" element={<Camera />} />
        </Routes>
      </HashRouter>
    </div>
  );
}

export default App;
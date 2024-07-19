import React from 'react';
import './App.css';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import AppDEMO from './component/ToggleButton';
import Login from './login';
import Register from './register';
import Form from './form/form';
import Camera from './camera/camera';
function App() {
  return (
    <div className="App">
        <Routes>
          <Route exact path="/" element={<Login />}/>
          <Route path="/AppDEMO" element={<AppDEMO />} />
          <Route path="/form" element={<Form />} />
          <Route path="/camera" element={<Camera />} />
          <Route path="/register" element={<Register />} />
        </Routes>
    </div>
  );
}

export default App;
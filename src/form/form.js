import React, { useState, useEffect } from 'react';
import Form from '@rjsf/core';
import validator from '@rjsf/validator-ajv8';
import * as Realm from "realm-web";
import config from '../config';
import "./index_form.css";
import Swal from 'sweetalert2'

const app = new Realm.App({ id: `${config.API}` });
const user = app.currentUser;
const YOUR_ACCESS_KEY_HERE_W3 = config.YOUR_ACCESS_KEY_HERE_W3;
const App = () => {
  const [jsonSchemaInput, setJsonSchemaInput] = useState({});
  const [formDataGiamSat, setFormDataGiamSat] = useState({});
  const [jsonSchemaInputMeeting, setJsonSchemaInputMeeting] = useState({});
  const [formDataMeeting, setFormDataMeeting] = useState({});
  const [isLoading, setIsLoading] = useState(false);

  const fetchDataNetSalaryModule = async () => {
    try {
      const functionName = "get_module_info";
      const res = await user?.callFunction(functionName);
      setJsonSchemaInput(res?.public?.input?.jsonSchema?.Giam_sat);
      setJsonSchemaInputMeeting(res?.public?.input?.jsonSchema?.Meeting);
      console.log("ress: ", res);
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };

  const onSubmitGiamSat = async ({ formData }) => {
    setIsLoading(true);
    try {
      await fetchData({ data: formData });
      setTimeout(() => {
        console.log("Form data:", formData);
        setIsLoading(false);
      }, 2000);
    } catch (error) {
      console.log(error.error);
      setIsLoading(false);
    }
  };

  const onSubmitMeeting = async ({ formData }) => {
    setIsLoading(true);
    try {
      await fetchDataMeeting({ data: formData });
      setTimeout(() => {
        console.log("Form data:", formData);
        setIsLoading(false);
      }, 2000);
    } catch (error) {
      console.log(error.error);
      setIsLoading(false);
    }
  };

  const fetchData = async (formData) => {
    const functionName = "data_giamsat";
    const args = [formData, user.id];
    try {
      const res = await user.callFunction(functionName, ...args);
      console.log("success: ", res);
    } catch (error) {
      console.log("err:", error.error);
    }

    // Gửi dữ liệu lên Web3Forms
    const formDataToSend = new FormData();
    formDataToSend.append("access_key", YOUR_ACCESS_KEY_HERE_W3);
  
    // Chuyển đổi formData thành chuỗi dễ đọc
    for (const key in formData) {
      const value = formData[key];
      if (typeof value === 'object') {
        formDataToSend.append(key, formatJsonToReadableString(value));
      } else {
        formDataToSend.append(key, value);
      }
    }
  
    try {
      const response = await fetch("https://api.web3forms.com/submit", {
        method: "POST",
        body: formDataToSend,
      });
  
      const data = await response.json();
      if (!data.success) {
        throw new Error(data.message);
      }
      console.log("success (Web3Forms): ", data);
      Swal.fire({
        title: "Success!",
        text: "Message sent successfully!",
        icon: "success"
      });
    } catch (error) {
      console.log("err (Web3Forms):", error);
      throw error;
    }

  };

  const formatJsonToReadableString = (json) => {
    const formatObject = (obj, indentLevel = 1) => {
      const indent = '  '.repeat(indentLevel);
      return Object.keys(obj).map(key => {
        const value = obj[key];
        if (typeof value === 'object' && value !== null) {
          return `${indent}${key}:\n${formatObject(value, indentLevel + 1)}`;
        }
        return `${indent}${key}: ${value}`;
      }).join('\n');
    };
    
    return `Data:\n${formatObject(json)}`;
  };
  
  
  
  const fetchDataMeeting = async (formData) => {
    // Gửi dữ liệu lên MongoDB
    const functionName = "data_meeting";
    const args = [formData, user.id];
    try {
      const res = await user.callFunction(functionName, ...args);
      console.log("success (MongoDB): ", res);
    } catch (error) {
      console.log("err (MongoDB):", error.error);
      throw error;
    }
  
    // Gửi dữ liệu lên Web3Forms
    const formDataToSend = new FormData();
    formDataToSend.append("access_key", YOUR_ACCESS_KEY_HERE_W3);
  
    // Chuyển đổi formData thành chuỗi dễ đọc
    for (const key in formData) {
      const value = formData[key];
      if (typeof value === 'object') {
        formDataToSend.append(key, formatJsonToReadableString(value));
      } else {
        formDataToSend.append(key, value);
      }
    }
  
    try {
      const response = await fetch("https://api.web3forms.com/submit", {
        method: "POST",
        body: formDataToSend,
      });
  
      const data = await response.json();
      if (!data.success) {
        throw new Error(data.message);
      }
      console.log("success (Web3Forms): ", data);
      Swal.fire({
        title: "Success!",
        text: "Message sent successfully!",
        icon: "success"
      });
    } catch (error) {
      console.log("err (Web3Forms):", error);
      throw error;
    }
  };
  

  useEffect(() => {
    fetchDataNetSalaryModule();
  }, []);

  return (
    <div>
      <nav>
        <ul>
          <li>
            <button className="nav-button" onClick={() => window.location.href = "/esp32_fe/#/camera"}>
              CAMERA
            </button>
          </li>
          <li>
            <button className="nav-button" onClick={() => window.location.href = "/esp32_fe/#/AppDEMO"}>
              APP
            </button>
          </li>
          <li>
            <button className="nav-button" onClick={() => window.location.href = "/esp32_fe/#/"}>
              LOGIN
            </button>
          </li>
          <li>
            <button className="nav-button" onClick={() => window.location.href = "/esp32_fe/#/register"}>
              REGISTER
            </button>
          </li>
        </ul>
      </nav>
      <div className="form-container">
        <h2 style={{
          fontSize: '1.5rem',
          color: '#007bff',
          marginBottom: '5px',
          padding: '10px 15px',
          border: '2px solid #007bff',
          borderRadius: '10px',
          backgroundColor: '#f0f8ff',
          boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)',
          textAlign: 'center',
          textTransform: 'uppercase',
          letterSpacing: '1px',
          transition: 'all 0.3s ease',
          display: 'inline-block',
          width: 'auto'
        }}>Giám Sát</h2>
        <Form
          className="custom-form"
          schema={jsonSchemaInput}
          validator={validator}
          formData={formDataGiamSat}
          onSubmit={onSubmitGiamSat}
        />
      </div>
      <div className="form-container">
        <h2 style={{
          fontSize: '1.5rem',
          color: '#007bff',
          marginBottom: '5px',
          padding: '10px 15px',
          border: '2px solid #007bff',
          borderRadius: '10px',
          backgroundColor: '#f0f8ff',
          boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)',
          textAlign: 'center',
          textTransform: 'uppercase',
          letterSpacing: '1px',
          transition: 'all 0.3s ease',
          display: 'inline-block',
          width: 'auto'
        }}>Meeting</h2>
        <Form
          className="custom-form"
          schema={jsonSchemaInputMeeting}
          validator={validator}
          formData={formDataMeeting}
          onSubmit={onSubmitMeeting}
        />
      </div>
    </div>
  );
};

export default App;

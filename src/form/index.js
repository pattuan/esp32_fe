import React, { useState, useEffect } from 'react';
import Form from '@rjsf/core';
import validator from '@rjsf/validator-ajv8';
import * as Realm from "realm-web";
import config from '../config';
import "./index.css";

const app = new Realm.App({ id: `${config.API}` });
const user = app.currentUser;

const App = () => {
  const [jsonSchemaInput, setJsonSchemaInput] = useState({});
  const [formData, setFormData] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [OutData, setOutData] = useState([]);

  const fetchDataNetSalaryModule = async () => {
    try {
      const functionName = "get_module_info";
      const res = await user?.callFunction(functionName);
      setJsonSchemaInput(res?.public?.input?.jsonSchema?.Giám_sát);
      console.log("ress: ", res);
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };

  const onSubmit = async ({ formData }) => {
    setIsLoading(true);
    try {
      // await fetchData({ data: formData });
      await OutData();
      setTimeout(() => {
        console.log("Form data:", formData);
        setIsLoading(false);
      }, 2000); // Simulating 2 seconds delay for API call or processing
    } catch (error) {
      console.log(error.error);
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchDataNetSalaryModule();
  }, []);

  return (
    <Form
      className="custom-form"
      schema={jsonSchemaInput}
      validator={validator}
      formData={formData}
      onSubmit={onSubmit}
    />
  );
};

export default App;

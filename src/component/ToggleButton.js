import React, { useState, useEffect } from 'react';
import './ToggleButton.css'; // Import CSS để đổi màu nền nút
import { FaRegLightbulb, FaLightbulb } from "react-icons/fa";
import { RiAlarmWarningLine, RiAlarmWarningFill } from "react-icons/ri";
import { AiFillSecurityScan, AiOutlineSecurityScan, AiFillCheckCircle, AiFillCloseCircle } from "react-icons/ai";
import { WiThermometer, WiHumidity } from "react-icons/wi";


const ToggleButton = () => {
  const [ledState, setLedState] = useState(false);
  const [relay1State, setRelay1State] = useState(false);
  const [buttonState, setButtonState] = useState(false);
  const [buttonRelay1State, setButtonRelay1State] = useState(false);
  const [pirState, setPirState] = useState(false);
  const [temperature, setTemperature] = useState(0); // Chỉnh lại để lưu trữ giá trị thực tế của nhiệt độ
  const [humidity, setHumidity] = useState(0); // Chỉnh lại để lưu trữ giá trị thực tế của độ ẩm
  const [magnet, setmagnet] = useState(0);
  const [xoState, setXoState] = useState(false); // State cho nút X và O

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch('https://ap-southeast-1.aws.data.mongodb-api.com/app/nfc-fe-syyvhfs/endpoint/getdevice');
        if (!response.ok) {
          throw new Error('Failed to fetch data');
        }
        const data = await response.json();
        console.log('Fetched data:', data);
        if (data.length > 0) {
          setLedState(data[0].led_state === 1);
          setButtonState(data[0].button_state === 1);
          setRelay1State(data[0].relay1_state === 1);
          setButtonRelay1State(data[0].button_state_relay1 === 1);
          setPirState(data[0].pir_state === 1);
          setTemperature(data[0].temp_state); // Lưu giá trị thực tế của nhiệt độ
          setHumidity(data[0].humi_state); // Lưu giá trị thực tế của độ ẩm
          setmagnet(data[0].magnet_state === 1);
        }
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    fetchData();

    const intervalId = setInterval(fetchData, 5000);

    return () => clearInterval(intervalId);
  }, []);

  const handleToggle = async () => {
    const newLedState = !ledState;
    setLedState(newLedState);

    const jsonData = JSON.stringify({
      "room 1": {
        "button_state": buttonState ? 1 : 0,
        "led_state": newLedState ? 1 : 0,
        "relay1_state": relay1State ? 1 : 0,
        "xo_state": xoState ? 1 : 0
      },
      "updated_at": Date.now(),
      "platform": "web"
    });

    console.log('Sending data:', jsonData);

    try {
      const response = await fetch('https://ap-southeast-1.aws.data.mongodb-api.com/app/nfc-fe-syyvhfs/endpoint/device', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: jsonData
      });

      if (!response.ok) {
        throw new Error('Failed to update data');
      }

      const result = await response.json();
      console.log('Update result:', result);
    } catch (error) {
      console.error('Error updating data:', error);
    }
  };

  const handleToggleRelay = async () => {
    const newRelay1State = !relay1State;
    setRelay1State(newRelay1State);

    const jsonData = JSON.stringify({
      "room 1": {
        "button_state_relay1": buttonRelay1State ? 1 : 0,
        "relay1_state": newRelay1State ? 1 : 0,
        "led_state": ledState ? 1 : 0,
        "xo_state": xoState ? 1 : 0
      },
      "updated_at": Date.now(),
      "platform": "web"
    });

    console.log('Sending data relay:', jsonData);

    try {
      const response = await fetch('https://ap-southeast-1.aws.data.mongodb-api.com/app/nfc-fe-syyvhfs/endpoint/device', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: jsonData
      });

      if (!response.ok) {
        throw new Error('Failed to update data');
      }

      const result = await response.json();
      console.log('Update result:', result);
    } catch (error) {
      console.error('Error updating data:', error);
    }
  };
  const handleToggleXO = async () => {
    const newXoState = !xoState;
    setXoState(newXoState);
  
    // Chuẩn bị dữ liệu JSON để gửi đi
    const jsonData = JSON.stringify({
      "room 1": {
        "xo_state": newXoState ? 1 : 0, // Chuyển đổi newXoState thành 0 hoặc 1
        "led_state": ledState ? 1 : 0,
        "relay1_state": relay1State ? 1 : 0,
      },
      "updated_at": Date.now(),
      "platform": "web"
    });
  
    console.log('Sending data for X and O:', jsonData);
  
    try {
      const response = await fetch('https://ap-southeast-1.aws.data.mongodb-api.com/app/nfc-fe-syyvhfs/endpoint/device', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: jsonData
      });
  
      if (!response.ok) {
        throw new Error('Failed to update data');
      }
  
      const result = await response.json();
      console.log('Update result:', result);
    } catch (error) {
      console.error('Error updating data for X and O:', error);
    }
  };  

  return (
    <div className="container">
      <div className="grid-container">
        {/* Grid Item 1 */}
        <div className="grid-item">
          <div className="room">
            <h1><span className="bold">PHÒNG</span> CEO</h1>
            {/* Nút X và O */}
            <div className="xo-button">
              <button onClick={handleToggleXO}>
                {xoState ? <AiFillCheckCircle size={35} color="green" /> : <AiFillCloseCircle size={35} color="red" />}
              </button>
            </div>
            <div className="control">
              <div className="device-group">
                {/* Device 1 - Light */}
                <div className="device">
                  {ledState ? <FaLightbulb size={50} color="yellow" /> : <FaRegLightbulb size={50} color="gray" />}
                  <h2>Công tắc đèn</h2>
                  <button onClick={handleToggle} className={ledState ? 'button-on' : 'button-off'}>
                    {ledState ? 'ON' : 'OFF'}
                  </button>
                </div>

                {/* Device 2 - Security */}
                <div className="device">
                  {relay1State ? <AiFillSecurityScan size={50} color="blue" /> : <AiOutlineSecurityScan size={50} color="gray" />}
                  <h2>Công tắc an ninh</h2>
                  <button onClick={handleToggleRelay} className={relay1State ? 'button-on' : 'button-off'}>
                    {relay1State ? 'ON' : 'OFF'}
                  </button>
                </div>
              </div>
              {/* Sensor Data - Temperature and Humidity */}
              <div className="sensor-data">
                <div className="temperature">
                  <h2>Nhiệt độ</h2>
                  <p>{temperature}°C</p> {/* Hiển thị giá trị thực tế của nhiệt độ */}
                  {/* Thay icon nhiệt độ */}
                  <WiThermometer size={50} color="orange" />
                </div>
                <div className="humidity">
                  <h2>Độ ẩm</h2>
                  <p>{humidity}%</p> {/* Hiển thị giá trị thực tế của độ ẩm */}
                  {/* Thay icon độ ẩm */}
                  <WiHumidity size={50} color="blue" />
                </div>
              </div>
              {/* Status - PIR */}
              <div className="status">
                {pirState ? <RiAlarmWarningFill size={50} color="red" /> : <RiAlarmWarningLine size={50} color="gray" />}
                <h2>Cảnh báo vật thể</h2>
                <p>{pirState ? 'CÓ TRỘM CHUYỂN ĐỘNG' : 'BÌNH THƯỜNG'}</p>
                {magnet ? <RiAlarmWarningFill size={50} color="red" /> : <RiAlarmWarningLine size={50} color="gray" />}
                <h2>Cảnh báo cửa</h2>
                <p>{magnet ? 'CÓ TRỘM MỞ CỬA' : 'BÌNH THƯỜNG'}</p>
              </div>
            </div>
          </div>
        </div>
        {/* Additional grid items can be added here */}
      </div>
    </div>
  );
};

export default ToggleButton;

import React, { useState, useEffect } from 'react';
import './ToggleButton.css'; // Import CSS để đổi màu nền nút
import { FaRegLightbulb, FaLightbulb } from "react-icons/fa";
import { RiAlarmWarningLine, RiAlarmWarningFill } from "react-icons/ri";
import { AiFillSecurityScan, AiOutlineSecurityScan, AiFillCheckCircle, AiFillCloseCircle } from "react-icons/ai";
import { WiThermometer, WiHumidity } from "react-icons/wi";

const ROOM_1 = "room 1";
const ROOM_2 = "room 2";
const ROOM_3 = "room 3";

const ToggleButton = () => {
  const [ledState, setLedState] = useState(false);
  const [relay1State, setRelay1State] = useState(false);
  const [buttonState, setButtonState] = useState(false);
  const [buttonRelay1State, setButtonRelay1State] = useState(false);
  const [pirState, setPirState] = useState(false);
  const [temperature, setTemperature] = useState(0); // Chỉnh lại để lưu trữ giá trị thực tế của nhiệt độ
  const [humidity, setHumidity] = useState(0); // Chỉnh lại để lưu trữ giá trị thực tế của độ ẩm
  const [magnet, setMagnet] = useState(0);
  const [xoState, setXoState] = useState(false); // State cho nút X và O

  const [ledState2, setLedState2] = useState(false);
  const [relay2State, setRelay2State] = useState(false);
  const [magnet2, setMagnet2] = useState(0);

  const [magnet3, setMagnet3] = useState(0);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch('https://ap-southeast-1.aws.data.mongodb-api.com/app/nfc-fe-syyvhfs/endpoint/getdevice');
        if (!response.ok) {
          throw new Error('Failed to fetch data');
        }
        const data = await response.json();
        console.log(`${new Date().getMilliseconds()} Fetched data:`, data);
        if (data.length > 0) {
          setLedState(data[0][ROOM_1].led_state === 1);
          setButtonState(data[0][ROOM_1].button_state === 1);
          setRelay1State(data[0][ROOM_1].relay_state === 1);
          setButtonRelay1State(data[0][ROOM_1].button_state_relay === 1);
          setPirState(data[0][ROOM_1].pir_state === 1);
          setTemperature(data[0][ROOM_1].temp_state); // Lưu giá trị thực tế của nhiệt độ
          setHumidity(data[0][ROOM_1].humi_state); // Lưu giá trị thực tế của độ ẩm
          setMagnet(data[0][ROOM_1].magnet_state === 1);

          setLedState2(data[0][ROOM_2]?.led_state === 1);
          setRelay2State(data[0][ROOM_2]?.relay_state === 1);
          setMagnet2(data[0][ROOM_2]?.magnet_state === 1);

          setMagnet3(data[0][ROOM_3]?.magnet_state === 1);
        }

        console.log("end interval");
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    const intervalId = setInterval(fetchData, 700);

    return () => clearInterval(intervalId);
  }, []);
  const handleToggle = async (room, newLedState) => {
    console.log("new led state", newLedState);

    const jsonData = JSON.stringify({
      "room": {
        "button_state": buttonState ? 1 : 0,
        "led_state": newLedState ? 1 : 0,
        "relay_state": room === ROOM_1 ? relay1State ? 1 : 0 : relay2State ? 1 : 0, // Chỉnh lại để đảm bảo relay_state đúng
        "xo_state": xoState ? 1 : 0,
      },
      "room_name": room,
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

  const handleToggleRelay = async (room, newRelayState) => {
    console.log("new relay state", newRelayState);

    const jsonData = JSON.stringify({
      "room": {
        "button_state_relay": buttonRelay1State ? 1 : 0,
        "relay_state": newRelayState ? 1 : 0,
        "led_state": room === ROOM_1 ? ledState ? 1 : 0 : ledState2 ? 1 : 0, // Chỉnh lại để đảm bảo led_state đúng
        "xo_state": xoState ? 1 : 0,
      },
      "room_name": room,
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

  const handleToggleXO = async (room) => {
    const newXoState = !xoState;
    setXoState(newXoState);

    const jsonData = JSON.stringify({
      "room": {
        "xo_state": newXoState ? 1 : 0,
        "led_state": ledState ? 1 : 0,
        "relay_state": relay1State ? 1 : 0,
      },
      "room_name": room,
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
      <nav>
        <ul>
          <li>
            <button className="nav-button" onClick={() => window.location.href = "/esp32_fe/#/form"}>
              FORM
            </button>
          </li>
          <li>
            <button className="nav-button" onClick={() => window.location.href = "/esp32_fe/#/camera"}>
              CAMERA
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
      <div className="grid-container">
        {/* Grid Item 1 */}
        <div className="grid-item">
          <div className="room">
            <h1><span className="bold">PHÒNG</span> CEO</h1>
            {/* Nút X và O */}
            <div className="xo-button">
              <button onClick={() => handleToggleXO(ROOM_1)}>
                {xoState ? <AiFillCheckCircle size={35} color="green" /> : <AiFillCloseCircle size={35} color="red" />}
              </button>
            </div>
            <div className="control">
              <div className="device-group">
                {/* Device 1 - Light */}
                <div className="device">
                  {ledState ? <FaLightbulb size={50} color="yellow" /> : <FaRegLightbulb size={50} color="gray" />}
                  <h2>Công tắc đèn</h2>
                  <button onClick={() => {
                    const newLedState = !ledState;
                    setLedState(newLedState);
                    handleToggle(ROOM_1, newLedState);
                  }} className={ledState ? 'button-on' : 'button-off'}>
                    {ledState ? 'ON' : 'OFF'}
                  </button>
                </div>
                {/* Device 2 - Security */}
                <div className="device">
                  {relay1State ? <AiFillSecurityScan size={50} color="blue" /> : <AiOutlineSecurityScan size={50} color="gray" />}
                  <h2>Công tắc an ninh</h2>
                  <button onClick={() => {
                    const newRelayState = !relay1State;
                    setRelay1State(newRelayState);
                    handleToggleRelay(ROOM_1, newRelayState);
                  }} className={relay1State ? 'button-on' : 'button-off'}>
                    {relay1State ? 'ON' : 'OFF'}
                  </button>
                </div>
              </div>
              {/* Sensor Data - Temperature and Humidity */}
              <div className="sensor-data">
                <div className="temperature">
                  <h2>Nhiệt độ</h2>
                  <p>{temperature}°C</p> {/* Hiển thị giá trị thực tế của nhiệt độ */}
                  <WiThermometer size={50} color="orange" />
                </div>
                <div className="humidity">
                  <h2>Độ ẩm</h2>
                  <p>{humidity}%</p> {/* Hiển thị giá trị thực tế của độ ẩm */}
                  <WiHumidity size={50} color="blue" />
                </div>
              </div>
              {/* PIR and Magnet State */}
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
        {/* Grid Item 2 */}
        <div className="grid-item">
          <div className="room">
            <h1><span className="bold">PHÒNG</span> NHÂN VIÊN</h1>
            {/* Nút X và O
            <div className="xo-button">
              <button onClick={() => handleToggleXO(ROOM_2)}>
                {xoState ? <AiFillCheckCircle size={35} color="green" /> : <AiFillCloseCircle size={35} color="red" />}
              </button>
            </div> */}
            <div className="control">
              <div className="device-group">
                {/* Device 1 - Light */}
                <div className="device">
                  {ledState2 ? <FaLightbulb size={50} color="yellow" /> : <FaRegLightbulb size={50} color="gray" />}
                  <h2>Công tắc đèn</h2>
                  <button onClick={() => {
                    const newLedState2 = !ledState2;
                    setLedState2(newLedState2);
                    handleToggle(ROOM_2, newLedState2);
                  }} className={ledState2 ? 'button-on' : 'button-off'}>
                    {ledState2 ? 'ON' : 'OFF'}
                  </button>
                </div>
                {/* Device 2 - Security */}
                <div className="device">
                  {relay2State ? <AiFillSecurityScan size={50} color="blue" /> : <AiOutlineSecurityScan size={50} color="gray" />}
                  <h2>Công tắc an ninh</h2>
                  <button onClick={() => {
                    const newRelayState2 = !relay2State;
                    setRelay2State(newRelayState2);
                    handleToggleRelay(ROOM_2, newRelayState2);
                  }} className={relay2State ? 'button-on' : 'button-off'}>
                    {relay2State ? 'ON' : 'OFF'}
                  </button>
                </div>
              </div>
              {/* Sensor Data - Temperature and Humidity */}
              <div className="sensor-data">
                <div className="temperature">
                  <h2>Nhiệt độ</h2>
                  <p>{temperature}°C</p> {/* Hiển thị giá trị thực tế của nhiệt độ */}
                  <WiThermometer size={50} color="orange" />
                </div>
                <div className="humidity">
                  <h2>Độ ẩm</h2>
                  <p>{humidity}%</p> {/* Hiển thị giá trị thực tế của độ ẩm */}
                  <WiHumidity size={50} color="blue" />
                </div>
              </div>
              {/* PIR and Magnet State */}
              <div className="status">
                {/* {pirState ? <RiAlarmWarningFill size={50} color="red" /> : <RiAlarmWarningLine size={50} color="gray" />}
                <h2>Cảnh báo vật thể</h2>
                <p>{pirState ? 'CÓ TRỘM CHUYỂN ĐỘNG' : 'BÌNH THƯỜNG'}</p> */}
                {magnet2 ? <RiAlarmWarningFill size={50} color="red" /> : <RiAlarmWarningLine size={50} color="gray" />}
                <h2>Cảnh báo cửa</h2>
                <p>{magnet2 ? 'CÓ TRỘM MỞ CỬA' : 'BÌNH THƯỜNG'}</p>
              </div>
            </div>
          </div>
        </div>
        {/* Grid Item 3 */}
        <div className="grid-item">
          <div className="room">
            <h1><span className="bold">PHÒNG</span> ĂN</h1>
            {/* Nút X và O
            <div className="xo-button">
              <button onClick={() => handleToggleXO(ROOM_2)}>
                {xoState ? <AiFillCheckCircle size={35} color="green" /> : <AiFillCloseCircle size={35} color="red" />}
              </button>
            </div> */}
            <div className="control">
              <div className="device-group">
                {/* Device 1 - Light */}
                <div className="device">
                  {ledState2 ? <FaLightbulb size={50} color="yellow" /> : <FaRegLightbulb size={50} color="gray" />}
                  <h2>Công tắc đèn</h2>
                  <button onClick={() => {
                    const newLedState2 = !ledState2;
                    setLedState2(newLedState2);
                    handleToggle(ROOM_2, newLedState2);
                  }} className={ledState2 ? 'button-on' : 'button-off'}>
                    {ledState2 ? 'ON' : 'OFF'}
                  </button>
                </div>
                {/* Device 2 - Security */}
                <div className="device">
                  {relay2State ? <AiFillSecurityScan size={50} color="blue" /> : <AiOutlineSecurityScan size={50} color="gray" />}
                  <h2>Công tắc an ninh</h2>
                  <button onClick={() => {
                    const newRelayState2 = !relay2State;
                    setRelay2State(newRelayState2);
                    handleToggleRelay(ROOM_2, newRelayState2);
                  }} className={relay2State ? 'button-on' : 'button-off'}>
                    {relay2State ? 'ON' : 'OFF'}
                  </button>
                </div>
              </div>
              {/* Sensor Data - Temperature and Humidity */}
              <div className="sensor-data">
                <div className="temperature">
                  <h2>Nhiệt độ</h2>
                  <p>{temperature}°C</p> {/* Hiển thị giá trị thực tế của nhiệt độ */}
                  <WiThermometer size={50} color="orange" />
                </div>
                <div className="humidity">
                  <h2>Độ ẩm</h2>
                  <p>{humidity}%</p> {/* Hiển thị giá trị thực tế của độ ẩm */}
                  <WiHumidity size={50} color="blue" />
                </div>
              </div>
              {/* PIR and Magnet State */}
              <div className="status">
                {/* {pirState ? <RiAlarmWarningFill size={50} color="red" /> : <RiAlarmWarningLine size={50} color="gray" />}
                <h2>Cảnh báo vật thể</h2>
                <p>{pirState ? 'CÓ TRỘM CHUYỂN ĐỘNG' : 'BÌNH THƯỜNG'}</p> */}
                {magnet3 ? <RiAlarmWarningFill size={50} color="red" /> : <RiAlarmWarningLine size={50} color="gray" />}
                <h2>Cảnh báo cửa</h2>
                <p>{magnet3 ? 'CÓ TRỘM MỞ CỬA' : 'BÌNH THƯỜNG'}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ToggleButton;

import React, { useRef, useEffect, useState } from 'react';
import { ReactMediaRecorder } from "react-media-recorder";
import './camera.css'; // Import CSS nếu cần

const App = () => {
  const videoRef = useRef(null);
  const [photo, setPhoto] = useState(null);
  const [message, setMessage] = useState('');
  const [audioOnOff, setAudio] = useState(true);
  const [isRecording, setIsRecording] = useState(false);
  const [showRecordedVideo, setShowRecordedVideo] = useState(true); // Trạng thái để điều khiển việc hiển thị video đã ghi

  useEffect(() => {
    const startCamera = async () => {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({ video: true });
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
        }
      } catch (err) {
        console.error("Error accessing the camera: ", err);
      }
    };

    startCamera();

    return () => {
      if (videoRef.current && videoRef.current.srcObject) {
        const stream = videoRef.current.srcObject;
        const tracks = stream.getTracks();
        tracks.forEach(track => track.stop());
      }
    };
  }, []);

  const capturePhoto = () => {
    const canvas = document.createElement('canvas');
    const video = videoRef.current;
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    const context = canvas.getContext('2d');
    context.drawImage(video, 0, 0, canvas.width, canvas.height);
    const photoDataUrl = canvas.toDataURL('image/png');
    setPhoto(photoDataUrl);
    setMessage('Photo captured successfully!');
  };

  const deletePhoto = () => {
    setPhoto(null);
    setMessage('Photo deleted.');
    setTimeout(() => {
      setMessage('');
    }, 1000);
  };

  const download = (mediaBlobUrl) => {
    if (!mediaBlobUrl) return null;
    return (
      <a href={mediaBlobUrl} download="video.mp4">
        <button-camera id="mediaDownload">Download Video</button-camera>
      </a>
    );
  };

  const recordedVideo = (mediaBlobUrl, status) => {
    if (status === 'stopped' && showRecordedVideo) {
      return (
        <div className='recorded-video'>
          <div>Recorded Video</div>
          <video width="100%" src={mediaBlobUrl} controls></video>
        </div>
      );
    }
  };

  return (
    <div className='App'>
      <nav>
        <ul>
          <li><button className="nav-button" onClick={() => window.location.href = "/esp32_fe/#/form"}>FORM</button></li>
          <li><button className="nav-button" onClick={() => window.location.href = "/esp32_fe/#/AppDEMO"}>APP</button></li>
          <li><button className="nav-button" onClick={() => window.location.href = "/esp32_fe/#/"}>LOGIN</button></li>
          <li><button className="nav-button" onClick={() => window.location.href = "/esp32_fe/#/register"}>REGISTER</button></li>
        </ul>
      </nav>
      <div className='container-camera'>
        <div className='camera-section'>
          <video ref={videoRef} autoPlay width="100%" height="auto" />
          <div className='camera-buttons'>
            <button-camera onClick={capturePhoto}>Capture Photo</button-camera>
            {photo && (
              <>
                <a href={photo} download="captured-photo.png">
                  <button-camera>Download Photo</button-camera>
                </a>
                <button-camera onClick={deletePhoto}>Delete Photo</button-camera>
              </>
            )}
          </div>
        </div>
        <div className='photo-display'>
          {photo && (
            <div>
              <img src={photo} alt="Captured" />
            </div>
          )}
          {message && <p>{message}</p>}
        </div>
        <div className='video-controls'>
          <ReactMediaRecorder
            video
            audio={audioOnOff}
            mimeType="video/mp4"
            render={({ status, startRecording, stopRecording, mediaBlobUrl, previewStream }) => (
              <div className='mediaRecorderWrapper'>
                <div className='mediaRecorderWrapper__buttons'>
                  <div>Status: {status}</div>
                  <div>Keep Mic On: {'' + audioOnOff}</div>
                  <button-camera onClick={() => { startRecording(); setIsRecording(true); }}>Start Recording</button-camera>
                  <button-camera onClick={() => { stopRecording(); setIsRecording(false); }}>Stop Recording</button-camera>
                  <button-camera onClick={() => setAudio(!audioOnOff)}>Mic On or Off</button-camera>
                  {download(mediaBlobUrl)}
                  <button-camera onClick={() => setShowRecordedVideo(prev => !prev)}>
                    {showRecordedVideo ? 'Hide Recorded Video' : 'Show Recorded Video'}
                  </button-camera>
                </div>
                {recordedVideo(mediaBlobUrl, status)}
                {isRecording && previewStream && (
                  <div className='live-preview'>
                    <video
                      width="100%"
                      height="auto"
                      autoPlay
                      src={previewStream}
                    />
                  </div>
                )}
              </div>
            )}
          />
        </div>
      </div>
    </div>
  );
};

export default App;

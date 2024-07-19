import React, { useRef, useEffect, useState } from 'react';
import './index.css'; // Import CSS nếu cần

const App = () => {
  const videoRef = useRef(null);
  const [photo, setPhoto] = useState(null);
  const [message, setMessage] = useState('');

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
    canvas.width = videoRef.current.videoWidth;
    canvas.height = videoRef.current.videoHeight;
    const context = canvas.getContext('2d');
    context.drawImage(videoRef.current, 0, 0, canvas.width, canvas.height);
    const photoDataUrl = canvas.toDataURL('image/png');
    setPhoto(photoDataUrl);
    setMessage('Photo captured successfully!');
  };

  const deletePhoto = () => {
    setPhoto(null);
    setMessage('Photo deleted.');
  };

  return (
    <div className='App'>
      <div className='container'>
        <div className='camera'>
          <video ref={videoRef} autoPlay width="100%" height="100%" />
          <button onClick={capturePhoto}>Capture photo</button>
        </div>
        <div className='photo-display'>
          {photo && (
            <div>
              <img src={photo} alt="Captured" />
              <div className='actions'>
                <a href={photo} download="captured-photo.png">
                  <button>Download Photo</button>
                </a>
                <button onClick={deletePhoto}>Delete Photo</button>
              </div>
            </div>
          )}
          {message && <p>{message}</p>}
        </div>
      </div>
    </div>
  );
};

export default App;

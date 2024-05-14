import React, { useState } from 'react';
import Tesseract from 'tesseract.js';
import './App.css';

function App() {
  const [text, setText] = useState('');
  const [imageUrl, setImageUrl] = useState('');

  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    const imageUrl = URL.createObjectURL(file);
    setImageUrl(imageUrl);
    
    const { data } = await Tesseract.recognize(file, 'ara+eng', { logger: (m) => console.log(m) });
    setText(data.text);
  };

  const handleCameraCapture = async () => {
    const mediaStream = await navigator.mediaDevices.getUserMedia({ video: true });
    const video = document.createElement('video');
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');

    video.srcObject = mediaStream;
    video.play();

    video.onplay = async () => {
      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;

      ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
      canvas.toBlob(async (blob) => {
        const file = new File([blob], 'captured-image.png', { type: 'image/png' });
        const imageUrl = URL.createObjectURL(file);
        setImageUrl(imageUrl);

        const { data } = await Tesseract.recognize(file, 'ara+eng', { logger: (m) => console.log(m) });
        setText(data.text);
      }, 'image/png');
    };
  };

  return (
    <div className="container">
      <h1>Arabic & English OCR</h1>
      <button onClick={handleCameraCapture}>Capture from Camera</button>
      <input type="file" accept="image/*" onChange={handleImageUpload} />
      {imageUrl && <img src={imageUrl} alt="Uploaded" className="image-preview" />}
      <div className="output">{text}</div>
    </div>
  );
}

export default App;

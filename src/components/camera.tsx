import React, { useRef } from 'react';
import { Box, Button } from '@mui/material';

const Camera: React.FC<{ onCapture: (dataUrl: string) => void }> = ({ onCapture }) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const startCamera = async () => {
    if (navigator.mediaDevices.getUserMedia) {
      const stream = await navigator.mediaDevices.getUserMedia({ video: true });
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
      }
    }
  };

  const captureImage = () => {
    if (videoRef.current && canvasRef.current) {
      const context = canvasRef.current.getContext('2d');
      if (context) {
        context.drawImage(videoRef.current, 0, 0, canvasRef.current.width, canvasRef.current.height);
        const dataUrl = canvasRef.current.toDataURL('image/png');
        onCapture(dataUrl);
      }
    }
  };

  return (
    <Box bgcolor={'black'} maxWidth={'25vw'}>   
      <video ref={videoRef} autoPlay style={{ border:'12px', borderColor:'orange', width: '40%' }} />
      <canvas ref={canvasRef} style={{ display: 'none' ,}} width="640" height="480" />
      <Button  variant="contained" color="primary" onClick={startCamera}>
        Start Camera
      </Button>
      <Button variant="contained" color="secondary" onClick={captureImage}>
        Capture Image
      </Button>
    </Box> 
  );
};

export default Camera;

'use client'
import React, { useState, useEffect } from 'react';
import { Container, Typography, Button, CircularProgress, Alert, Box } from '@mui/material';
import Camera from '@/src/components/camera';
import UploadedImages from '@/src/components/UploadedImages';
import { classifyImage } from '@/src/lib/api';
import { db, storage, auth } from '@/src/lib/firebase';
import { ref, uploadString, getDownloadURL } from 'firebase/storage';
import { collection, addDoc, Timestamp } from 'firebase/firestore';
import { onAuthStateChanged } from 'firebase/auth';

const uploadImage = async (imageData: string, classification: string) => {
  const imageName = `images/${new Date().getTime()}.png`;
  const imageRef = ref(storage, imageName);

  await uploadString(imageRef, imageData, 'data_url');

  const imageUrl = await getDownloadURL(imageRef);

  const imageDoc = {
    imageUrl,
    classification,
    createdAt: Timestamp.now()
  };
  await addDoc(collection(db, 'images'), imageDoc);

  return imageUrl;
};

const NextPage: React.FC = () => {
  const [user, setUser] = useState<any>(null);
  const [capturedImage, setCapturedImage] = useState<string | null>(null);
  const [classification, setClassification] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
    });
    return () => unsubscribe();
  }, []);

  const handleCapture = (dataUrl: string) => {
    setCapturedImage(dataUrl);
    setClassification(null);
    setError(null);
    setSuccess(null);
  };

  const handleClassify = async () => {
    if (!capturedImage) return;
  
    setLoading(true);
    setError(null);
    try {
      const result = await classifyImage(capturedImage);
      if (typeof result === 'string') {
        setClassification(result);
      } else {
        throw new Error('Invalid classification result');
      }
    } catch (error) {
      console.error('Error classifying image:', error);
      setError('Failed to classify the image. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleUpload = async () => {
    if (!capturedImage || !classification) return;

    setUploading(true);
    setError(null);
    try {
      const imageUrl = await uploadImage(capturedImage, classification);
      console.log('Image uploaded to:', imageUrl);
      setSuccess('Image uploaded successfully!');
    } catch (error) {
      console.error('Error uploading image:', error);
      setError('Failed to upload the image. Please try again.');
    } finally {
      setUploading(false);
    }
  };

  return (
    <Box maxWidth="100vw" style={{ marginTop: '0rem' }} sx={{ backgroundColor: 'gray', height:'100vh' }}>
      <Typography variant="h4" component="h1" gutterBottom>
        Capture, Classify, and Upload Image
      </Typography>
    
      <Camera onCapture={handleCapture} />
      {capturedImage && (
        <Box mt={2}>
          <Typography variant="h6" component="h2" gutterBottom>
            Captured Image
          </Typography>
          <img src={capturedImage} alt="Captured" style={{ width: '100%', marginBottom: '1rem' }} />
          <Button
            variant="contained"
            color="primary"
            onClick={handleClassify}
            style={{ marginTop: '1rem' }}
            disabled={loading}
          >
            Classify Image
          </Button>
          {loading && <CircularProgress style={{ marginLeft: '1rem' }} />}
          {classification && (
            <Box mt={2}>
              <Typography variant="h6" component="h2">
                Classification: {classification}
              </Typography>
              <Button
                variant="contained"
                color="secondary"
                onClick={handleUpload}
                style={{ marginTop: '1rem' }}
                disabled={uploading}
              >
                Upload Image
              </Button>
              {uploading && <CircularProgress style={{ marginLeft: '1rem' }} />}
            </Box>
          )}
        </Box>
      )}
      {error && (
        <Alert severity="error" style={{ marginTop: '2rem' }}>
          {error}
        </Alert>
      )}
      {success && (
        <Alert severity="success" style={{ marginTop: '2rem' }}>
          {success}
        </Alert>
      )}
      <UploadedImages />
    </Box>
  );
};

export default NextPage;

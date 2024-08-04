import React, { useEffect, useState } from 'react';
import { db, storage } from '@/src/lib/firebase';
import { collection, query, orderBy, onSnapshot, doc, deleteDoc } from 'firebase/firestore';
import { ref, deleteObject } from 'firebase/storage';
import {
  Container,
  Typography,
  Grid,
  Card,
  CardMedia,
  CardContent,
  TextField,
  IconButton,
  Snackbar,
  Alert
} from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';

interface ImageData {
  id: string;
  imageUrl: string;
  classification: string;
  createdAt: any;
}

const UploadedImages: React.FC = () => {
  const [images, setImages] = useState<ImageData[]>([]);
  const [filter, setFilter] = useState<string>('');
  const [snackbarOpen, setSnackbarOpen] = useState<boolean>(false);
  const [snackbarMessage, setSnackbarMessage] = useState<string>('');
  const [snackbarSeverity, setSnackbarSeverity] = useState<'success' | 'error'>('success');

  useEffect(() => {
    const q = query(collection(db, 'images'), orderBy('createdAt', 'desc'));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const imagesData: ImageData[] = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data()
      })) as ImageData[];
      setImages(imagesData);
    });

    return () => unsubscribe();
  }, []);

  const handleDelete = async (id: string, imageUrl: string) => {
    try {
      // Delete from Firestore
      await deleteDoc(doc(db, 'images', id));
      // Delete from Storage
      const imageRef = ref(storage, imageUrl);
      await deleteObject(imageRef);
      setSnackbarMessage('Image deleted successfully!');
      setSnackbarSeverity('success');
      setSnackbarOpen(true);
    } catch (error) {
      console.error('Error deleting image:', error);
      setSnackbarMessage('Error deleting image. Please try again.');
      setSnackbarSeverity('error');
      setSnackbarOpen(true);
    }
  };

  const filteredImages = images.filter((image) =>
    image.classification.toLowerCase().includes(filter.toLowerCase())
  );

  return (
    <Container maxWidth="md" style={{ marginTop: '2rem' }}>
      <Typography variant="h5" component="h2" gutterBottom>
        Uploaded Images
      </Typography>
      <TextField
        label="Filter by Classification"
        fullWidth
        margin="normal"
        value={filter}
        onChange={(e) => setFilter(e.target.value)}
      />
      <Grid container spacing={3}>
        {filteredImages.map((image) => (
          <Grid item xs={12} sm={6} md={4} key={image.id}>
            <Card>
              <CardMedia component="img" image={image.imageUrl} alt={image.classification} style={{ height: 200 }} />
              <CardContent style={{ display: 'flex', alignItems: 'center' }}>
                <Typography variant="body2" color="textSecondary" component="p" style={{ flexGrow: 1 }}>
                  {image.classification}
                </Typography>
                <IconButton
                  color="secondary"
                  onClick={() => handleDelete(image.id, image.imageUrl)}
                >
                  <DeleteIcon />
                </IconButton>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>
      <Snackbar
        open={snackbarOpen}
        autoHideDuration={6000}
        onClose={() => setSnackbarOpen(false)}
      >
        <Alert onClose={() => setSnackbarOpen(false)} severity={snackbarSeverity}>
          {snackbarMessage}
        </Alert>
      </Snackbar>
    </Container>
  );
};

export default UploadedImages;

import axios from 'axios';

// Set up axios instance with base URL and headers
const api = axios.create({
  baseURL: 'https://api.openai.com/v1', // Replace with your API base URL
  headers: {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${process.env.NEXT_PUBLIC_OPENAI_API_KEY}`
  }
});

// Function to classify image
export const classifyImage = async (imageData: string) => {
  try {
    const response = await api.post('/classify', { image: imageData });
    // Assuming the response contains the classification result in response.data.classification
    return response.data.classification;
  } catch (error) {
    console.error('Error classifying image:', error);
    throw error;
  }
};

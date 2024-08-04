import { storage, db } from '@/src/lib/firebase';
import { ref, uploadString, getDownloadURL } from 'firebase/storage';
import { collection, addDoc, Timestamp } from 'firebase/firestore';

export const uploadImage = async (imageData: string, classification: string) => {
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

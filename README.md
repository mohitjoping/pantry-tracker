# Grocery Tracker

Grocery Tracker is a web application that allows users to capture images of grocery items using their browser's camera, classify these images using a GPT-based vision API, and store the images and their classifications in Firebase.

## Features

- Capture images using the browser camera.
- Classify images using a GPT-based vision API.
- Store images and their classifications in Firebase Firestore.
- View previously uploaded images and their classifications.

## Technologies Used

- **Next.js**: React framework for server-side rendering and static site generation.
- **Firebase**: Backend services including Firestore, Authentication, and Storage.
- **Material-UI**: React components for faster and easier web development.
- **OpenAI API**: For image classification.

## Getting Started

### Prerequisites

- Node.js and npm installed on your machine.
- Firebase project set up.
- OpenAI API key.

### Installation

1. Clone the repository:
    ```bash
    git clone https://github.com/mohitjoping/pantry-tracker.git
    cd grocery-tracker
    ```

2. Install the dependencies:
    ```bash
    npm install
    ```

3. Create a `.env.local` file in the root of the project and add your Firebase and OpenAI configuration:
    ```env
    NEXT_PUBLIC_FIREBASE_API_KEY=your_firebase_api_key
    NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your_firebase_auth_domain
    NEXT_PUBLIC_FIREBASE_PROJECT_ID=your_firebase_project_id
    NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your_firebase_storage_bucket
    NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your_firebase_messaging_sender_id
    NEXT_PUBLIC_FIREBASE_APP_ID=your_firebase_app_id
    NEXT_PUBLIC_OPENAI_API_KEY=your_openai_api_key
    ```

4. Run the development server:
    ```bash
    npm run dev
    ```

5. Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

## Project Structure

- `src/`: Contains the main source code for the application.
  - `components/`: Contains React components.
  - `lib/`: Contains Firebase and API utilities.
  - `pages/`: Contains Next.js pages.

## Usage

1. **Capture Image**: Use the camera component to capture an image of a grocery item.
2. **Classify Image**: Use the "Classify Image" button to classify the captured image using the GPT-based vision API.
3. **Upload Image**: After classification, upload the image and its classification to Firebase Firestore.
4. **View Uploaded Images**: View previously uploaded images and their classifications.

## Firebase Configuration

Ensure you have set up Firebase in your project and initialized Firestore, Storage, and Authentication. The configuration should be added to the `.env.local` file as shown in the installation steps.

## Contributing

1. Fork the repository.
2. Create a new branch (`git checkout -b feature/your-feature`).
3. Commit your changes (`git commit -am 'Add some feature'`).
4. Push to the branch (`git push origin feature/your-feature`).
5. Create a new Pull Request.

## License

This project is licensed under the MIT License. See the [LICENSE](LICENSE) file for more details.

## Acknowledgements

- [Next.js](https://nextjs.org/)
- [Firebase](https://firebase.google.com/)
- [Material-UI](https://material-ui.com/)
- [OpenAI](https://www.openai.com/)

---

Made with ❤️ by [Mohit Joping](https://github.com/mohitjoping)

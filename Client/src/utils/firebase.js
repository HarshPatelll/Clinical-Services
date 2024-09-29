// Import the functions you need from the SDKs you need
import { initializeApp} from "firebase/app";
// import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: import.meta.env.VITE_APP_FIREBASE_API_KEY,
  authDomain: "task-manager-39f18.firebaseapp.com",
  projectId: "task-manager-39f18",
  storageBucket: "task-manager-39f18.appspot.com",
  messagingSenderId: "446001247672",
  appId: "1:446001247672:web:6de7cb50843142d6b24b4d",
  measurementId: "G-GNZD1PM6Q6"
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);
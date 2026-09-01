import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";

const firebaseConfig = {
  apiKey: "AIzaSyD9MdOzTksQRY06A6NWXjoO84IR8hGKRoo",
  authDomain: "openitinstitute-c8d2d.firebaseapp.com",
  projectId: "openitinstitute-c8d2d",
  storageBucket: "openitinstitute-c8d2d.firebasestorage.app",
  messagingSenderId: "743723985348",
  appId: "1:743723985348:web:8ed900711caec24dfa5c91",
  measurementId: "G-T9TXSCFR81"
};

const app = initializeApp(firebaseConfig);

const analytics = getAnalytics(app);

export { app, analytics };
// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getAuth } from "firebase/auth";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyAZxLnDOxw_04UzYI_o4ZTGAxSdlkv4Jqc",
  authDomain: "note-mark-c425e.firebaseapp.com",
  projectId: "note-mark-c425e",
  storageBucket: "note-mark-c425e.firebasestorage.app",
  messagingSenderId: "279395682484",
  appId: "1:279395682484:web:cba186070bd93d18d2efe1",
  measurementId: "G-4MT84C5FQC",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);

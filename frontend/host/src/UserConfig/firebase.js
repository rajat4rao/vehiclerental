import { initializeApp } from "firebase/app";
import { getStorage } from "firebase/storage";

const SharedConfig = {
  apiKey: "AIzaSyB55aWX02mZXjON7O2rSFtV7xGnYkXmh7E",
  authDomain: "carrentalmanagement-ebec0.firebaseapp.com",
  projectId: "carrentalmanagement-ebec0",
  storageBucket: "carrentalmanagement-ebec0.appspot.com",
  messagingSenderId: "846581571029",
  appId: "1:846581571029:web:3c9464ab36da0aaa60f15c",
  measurementId: "G-96DLX646TJ"
};

const app1 = initializeApp(SharedConfig,"CustomerSite");
export const storage1=getStorage(app1)
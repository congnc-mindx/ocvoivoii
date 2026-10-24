// src/firebase.js
import { getApp, getApps, initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyDoZZ_iDjD2S6Oug1Xt4A-8ABCOE8ymA3A",
  authDomain: "ocvoivoii-3b61b.firebaseapp.com",
  projectId: "ocvoivoii-3b61b",
  storageBucket: "ocvoivoii-3b61b.firebasestorage.app",
  messagingSenderId: "959348152939",
  appId: "1:959348152939:web:6325b91be2f112952eef2e",
  measurementId: "G-97L09QQPD2",
};

export const firebaseConfigured = Boolean(
  firebaseConfig.apiKey && firebaseConfig.projectId && firebaseConfig.appId,
);

let db = null;
let auth = null;

if (firebaseConfigured) {
  const app = getApps().some((instance) => instance.name === "[DEFAULT]")
    ? getApp()
    : initializeApp(firebaseConfig);

  db = getFirestore(app);
  auth = getAuth(app);
}

export { db, auth };

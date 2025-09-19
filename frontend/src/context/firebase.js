// src/context/firebase.js
import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider, FacebookAuthProvider, OAuthProvider } from "firebase/auth";

// Read config from Vite env vars
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID,
};

// Basic guard to help during local setup
const missingKeys = Object.entries(firebaseConfig)
  .filter(([_, v]) => !v)
  .map(([k]) => k);
if (missingKeys.length) {
  // eslint-disable-next-line no-console
  console.warn(
    `Firebase config missing env vars: ${missingKeys.join(", ")}. ` +
      `Set them in .env (e.g., VITE_FIREBASE_API_KEY, VITE_FIREBASE_AUTH_DOMAIN, VITE_FIREBASE_PROJECT_ID, VITE_FIREBASE_APP_ID).`
  );
}

let app;
let auth;
try {
  if (!missingKeys.length) {
    app = initializeApp(firebaseConfig);
    auth = getAuth(app);
  } else {
    // eslint-disable-next-line no-console
    console.error('Firebase not initialized due to missing config. Social login will be disabled.');
  }
} catch (e) {
  // eslint-disable-next-line no-console
  console.error('Failed to initialize Firebase:', e);
}

// Providers
const googleProvider = new GoogleAuthProvider();
const facebookProvider = new FacebookAuthProvider();
const appleProvider = new OAuthProvider('apple.com');

export { auth, googleProvider, facebookProvider, appleProvider };

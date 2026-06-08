import { initializeApp } from 'firebase/app';
import { getDatabase, ref, onValue, push, set, increment, update, runTransaction } from 'firebase/database';

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  databaseURL: process.env.NEXT_PUBLIC_FIREBASE_DATABASE_URL,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID
};

let app = null;
let db = null;

try {
  // Only initialize if API key is provided to avoid crashes when users haven't setup Firebase yet
  if (firebaseConfig.apiKey && firebaseConfig.apiKey !== 'undefined') {
    app = initializeApp(firebaseConfig);
    db = getDatabase(app);
  } else {
    console.warn("Firebase config is missing. Real-time Pin Potha will fall back to local mode. Add NEXT_PUBLIC_FIREBASE_API_KEY to your .env file to enable global chat.");
  }
} catch (e) {
  console.error("Firebase init error", e);
}

export { db, ref, onValue, push, set, increment, update, runTransaction };

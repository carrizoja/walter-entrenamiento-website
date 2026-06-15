import { getApp, getApps, initializeApp } from 'firebase/app';
import { getAuth, type Auth } from 'firebase/auth';
import { getFirestore, type Firestore } from 'firebase/firestore';
import { requireEnv } from './firebase-env';

let auth: Auth | null = null;
let db: Firestore | null = null;
let firebaseConfigError: string | null = null;

try {
  const env = requireEnv([
    'PUBLIC_FIREBASE_API_KEY',
    'PUBLIC_FIREBASE_AUTH_DOMAIN',
    'PUBLIC_FIREBASE_PROJECT_ID',
    'PUBLIC_FIREBASE_STORAGE_BUCKET',
    'PUBLIC_FIREBASE_MESSAGING_SENDER_ID',
    'PUBLIC_FIREBASE_APP_ID',
  ]);

  const firebaseConfig = {
    apiKey: env.PUBLIC_FIREBASE_API_KEY,
    authDomain: env.PUBLIC_FIREBASE_AUTH_DOMAIN,
    projectId: env.PUBLIC_FIREBASE_PROJECT_ID,
    storageBucket: env.PUBLIC_FIREBASE_STORAGE_BUCKET,
    messagingSenderId: env.PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
    appId: env.PUBLIC_FIREBASE_APP_ID,
  };

  // Initialize Firebase only if it hasn't been initialized yet
  const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();
  auth = getAuth(app);
  db = getFirestore(app);
} catch (error) {
  firebaseConfigError = error instanceof Error ? error.message : 'Firebase client initialization failed.';
  console.warn('[firebase] Client initialization disabled:', firebaseConfigError);
}

export { auth, db, firebaseConfigError };

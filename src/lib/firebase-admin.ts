import { cert, getApp, getApps, initializeApp } from 'firebase-admin/app';
import { getAuth } from 'firebase-admin/auth';
import { getFirestore } from 'firebase-admin/firestore';
import { getStorage } from 'firebase-admin/storage';
import { readEnv } from './firebase-env';

const serviceAccountKey = readEnv('FIREBASE_SERVICE_ACCOUNT_KEY');
const storageBucket = readEnv('PUBLIC_FIREBASE_STORAGE_BUCKET');

let app;

if (!getApps().length) {
  try {
    if (serviceAccountKey) {
      const serviceAccount = JSON.parse(serviceAccountKey);
      app = initializeApp({
        credential: cert(serviceAccount),
        storageBucket,
      });
    } else {
      console.warn('FIREBASE_SERVICE_ACCOUNT_KEY is not set. Firebase admin features are disabled.');
    }
  } catch (error) {
    console.error('Firebase admin initialization error', error);
  }
} else {
  app = getApp();
}

export const adminAuth = app ? getAuth(app) : null;
export const adminDb = app ? getFirestore(app) : null;
export const adminStorage = app ? getStorage(app) : null;

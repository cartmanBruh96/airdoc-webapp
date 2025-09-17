import { initializeApp, getApps, getApp } from 'firebase/app';
import { Auth, connectAuthEmulator, getAuth } from 'firebase/auth';
import { connectFunctionsEmulator, getFunctions } from 'firebase/functions';

const PROJECT_ID = process.env.NEXT_PUBLIC_PROJECT_ID!;
const FIREBASE_WEB_API_KEY = process.env.NEXT_PUBLIC_FIREBASE_WEB_API_KEY!;
const IS_DEVELOPMENT = process.env.NEXT_PUBLIC_ENV === 'local';

const firebaseConfig = {
    apiKey: FIREBASE_WEB_API_KEY,
    authDomain: `${PROJECT_ID}.firebaseapp.com`,
    projectId: PROJECT_ID,
    storageBucket: `${PROJECT_ID}.appspot.com`,
};

// Initialize Firebase only if it hasn't been initialized yet
// This prevents errors in a Next.js environment where code can run multiple times
let firebaseApp;
if (!getApps().length) {
    firebaseApp = initializeApp(firebaseConfig);
} else {
    firebaseApp = getApp();
}

// Initialize Firebase Authentication and get a reference to the service
const auth = getAuth(firebaseApp);
const functions = getFunctions(firebaseApp);

if (IS_DEVELOPMENT) {
    connectAuthEmulator(auth, 'http://127.0.0.1:9099');
    connectFunctionsEmulator(functions, '127.0.0.1', 5001);
}

export { auth, firebaseApp, functions };

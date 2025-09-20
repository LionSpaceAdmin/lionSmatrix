'use client';
import {initializeApp, getApp, getApps} from 'firebase/app';

const firebaseConfig = {
  apiKey: 'TODO: Your API key',
  authDomain: 'TODO: Your auth domain',
  projectId: 'TODO: Your project ID',
  storageBucket: 'TODO: Your storage bucket',
  messagingSenderId: 'TODO: Your messaging sender ID',
  appId: 'TODO: Your app ID',
};

const app = getApps().length ? getApp() : initializeApp(firebaseConfig);

export {app};

import { initializeApp } from 'firebase/app'
import { getFirestore } from 'firebase/firestore'
import { getAuth } from 'firebase/auth'

const firebaseConfig = {
  apiKey: process.env.REACT_APP_API_KEY,
  authDomain: "tasks-2fec0.firebaseapp.com",
  projectId: "tasks-2fec0",
  storageBucket: "tasks-2fec0.appspot.com",
  messagingSenderId: "153090426320",
  appId: "1:153090426320:web:4c32b098ecbee3497e25d5"
};

const firebaseApp = initializeApp(firebaseConfig);

const db = getFirestore(firebaseApp);
const auth = getAuth(firebaseApp)

export { db, auth };


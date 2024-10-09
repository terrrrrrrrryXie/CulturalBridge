// Import the functions you need from the SDKs you need
import { initializeApp } from 'firebase/app'
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries
import { getFirestore } from 'firebase/firestore'

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: 'REDACTED_GOOGLE_API_KEY',
  authDomain: 'culturalbridge-5fb9b.firebaseapp.com',
  projectId: 'culturalbridge-5fb9b',
  storageBucket: 'culturalbridge-5fb9b.appspot.com',
  messagingSenderId: '49922027736',
  appId: '1:49922027736:web:46e119632022aaaae9e7ad'
}

// Initialize Firebase
initializeApp(firebaseConfig)
const db = getFirestore()
export default db

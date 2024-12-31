import { initializeApp } from 'firebase/app'
import { getFirestore } from 'firebase/firestore'
import { getAuth } from 'firebase/auth'
import { getStorage } from 'firebase/storage'

const firebaseConfig = {
  apiKey: "AIzaSyDj5MCPGgKMe3ixd0oIhdELpNSz5-8KL9I",
  authDomain: "eart-1180e.firebaseapp.com",
  projectId: "eart-1180e",
  storageBucket: "eart-1180e.firebasestorage.app",
  messagingSenderId: "931756859047",
  appId: "1:931756859047:web:43d1f5dd5f2ecf66634582",
  measurementId: "G-G0V3EGSW99"
}

const app = initializeApp(firebaseConfig)

export const db = getFirestore(app)
export const auth = getAuth(app)
export const storage = getStorage(app)
export default app

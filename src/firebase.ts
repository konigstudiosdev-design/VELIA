import { initializeApp } from 'firebase/app'
import { getAnalytics, isSupported } from 'firebase/analytics'
import { getAuth } from 'firebase/auth'
import { getFirestore } from 'firebase/firestore'
import { getStorage } from 'firebase/storage'
import { getFunctions } from 'firebase/functions'

// Your web app's Firebase configuration for velia-36dcf
const firebaseConfig = {
  apiKey: "AIzaSyAcELKVDGPSHJqKxShEb_4zQWogKKiXS9Y",
  authDomain: "velia-36dcf.firebaseapp.com",
  projectId: "velia-36dcf",
  storageBucket: "velia-36dcf.firebasestorage.app",
  messagingSenderId: "791426216552",
  appId: "1:791426216552:web:858edea1f87b50623701dd",
  measurementId: "G-BL83XNCNKQ"
}

// Initialize Firebase
export const app = initializeApp(firebaseConfig)

// Analytics (initialized asynchronously if supported)
export let analytics: ReturnType<typeof getAnalytics> | null = null
if (typeof window !== 'undefined') {
  isSupported().then((supported) => {
    if (supported) {
      analytics = getAnalytics(app)
    }
  })
}

// Export Firebase services
export const auth = getAuth(app)
export const db = getFirestore(app)
export const storage = getStorage(app)
export const functions = getFunctions(app)

export default app

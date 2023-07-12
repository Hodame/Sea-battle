import { initializeApp } from "firebase/app"
import { getDatabase } from "firebase/database"

const firebaseConfig = {
  apiKey: "AIzaSyCKscA-49j6Kf2JK2LctqwGLpot3oDoO64",
  authDomain: "sea-batle-b286a.firebaseapp.com",
  projectId: "sea-batle-b286a",
  storageBucket: "sea-batle-b286a.appspot.com",
  messagingSenderId: "854239492380",
  appId: "1:854239492380:web:200a8aac089bfda3c6a2d9",
  databaseURL: "https://sea-batle-b286a-default-rtdb.europe-west1.firebasedatabase.app",
}

const app = initializeApp(firebaseConfig)
const db = getDatabase(app)

export { db }

import { initializeApp } from "firebase/app";
import {
  getAuth,
  signInWithPopup,
  GoogleAuthProvider,
  signOut,
} from "firebase/auth";
import { getFirestore, getDoc, doc } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyAuXq_jNSmMoUrwQP2jb0E8g_PmXUkZkq8",
  authDomain: "login-rym.firebaseapp.com",
  databaseUrl: "https://login-rym.firebaseio.com",
  projectId: "login-rym",
  storageBucket: "login-rym.appspot.com",
  messagingSenderId: "172947871961",
  appId: "1:172947871961:web:2c6b8e466d9eccfb3c86c8",
  measurementId: "G-YCDJ5Y9G3K",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
var db = getFirestore(app);

export const getFavs = async (id) => {
  const docRef = doc(db, "favs", id);
  const docSnap = await getDoc(docRef);
  if (docSnap.exists()) {
    const data = docSnap.data();
    return data.array.map((e) => e);
  } else {
    return console.log("not exist");
  }
};

export function signOutGoogle() {
  const auth = getAuth();
  signOut(auth);
}

export function loginWithGoogle() {
  const provider = new GoogleAuthProvider();

  const auth = getAuth();
  return signInWithPopup(auth, provider).then((result) => {
    // This gives you a Google Access Token. You can use it to access the Google API.
    const credential = GoogleAuthProvider.credentialFromResult(result);
    return result.user;
  });
}

export { db };

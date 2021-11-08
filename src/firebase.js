import { initializeApp } from "firebase/app";
import {
  getAuth,
  signInWithPopup,
  GoogleAuthProvider,
  signOut,
} from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyAuXq_jNSmMoUrwQP2jb0E8g_PmXUkZkq8",
  authDomain: "login-rym.firebaseapp.com",
  projectId: "login-rym",
  storageBucket: "login-rym.appspot.com",
  messagingSenderId: "172947871961",
  appId: "1:172947871961:web:2c6b8e466d9eccfb3c86c8",
  measurementId: "G-YCDJ5Y9G3K",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

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
  /*   let provider = new GoogleAuthProvider();
  return firebase
    .auth()
    .signInWithPopup(provider)
    .then((snap) => snap.user); */
}

// Import the functions you need from the SDKs you need
import { initializeApp } from 'firebase/app';
import { getAuth, GoogleAuthProvider, FacebookAuthProvider } from 'firebase/auth';
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: 'AIzaSyCfoH_s6A1wYC40LYQYAjlDlyrhHfnfD6w',
  authDomain: 'johnwick21.firebaseapp.com',
  projectId: 'johnwick21',
  storageBucket: 'johnwick21.appspot.com',
  messagingSenderId: '51366769810',
  appId: '1:51366769810:web:dd99d287eff7d8033fa24b',
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const googleProvider = new GoogleAuthProvider();
googleProvider.setCustomParameters({ prompt: 'select_account' });
const facebookProvider = new FacebookAuthProvider();

export { auth, googleProvider, facebookProvider };

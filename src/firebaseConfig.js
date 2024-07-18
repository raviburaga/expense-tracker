import { initializeApp } from 'firebase/app';
import {
  getAuth,
  RecaptchaVerifier,
  signInWithPhoneNumber,
  PhoneAuthProvider,
  signInWithCredential
} from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import { getStorage } from 'firebase/storage';

// Your Firebase configuration object
const firebaseConfig = {
    apiKey: "AIzaSyDuCVKZL1p8sx-RbAXzbN6wxN5I4epEfWY",
    authDomain: "expensetracker-db97a.firebaseapp.com",
    projectId: "expensetracker-db97a",
    storageBucket: "expensetracker-db97a.appspot.com",
    messagingSenderId: "321471951310",
    appId: "1:321471951310:web:857d479f8caac415a37b9f",
    measurementId: "G-0CBPZEH0PP"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Firebase services
const auth = getAuth(app);
const firestore = getFirestore(app);
const storage = getStorage(app);

// Recaptcha setup
const setupRecaptcha = (elementId) => {
  window.recaptchaVerifier = new RecaptchaVerifier(elementId, {
    'size': 'invisible',
    'callback': (response) => {
      console.log('Recaptcha verified');
    }
  }, auth);
  window.recaptchaVerifier.render();
};

// Send OTP
const sendOtp = async (phoneNumber) => {
  setupRecaptcha('recaptcha-container');
  const appVerifier = window.recaptchaVerifier;
  try {
    const confirmationResult = await signInWithPhoneNumber(auth, phoneNumber, appVerifier);
    return confirmationResult.verificationId;
  } catch (error) {
    console.error('Error sending OTP:', error);
    throw error;
  }
};

// Verify OTP
const verifyOtp = async (verificationId, otp) => {
  const credential = PhoneAuthProvider.credential(verificationId, otp);
  try {
    const userCredential = await signInWithCredential(auth, credential);
    return userCredential.user;
  } catch (error) {
    console.error('Error verifying OTP:', error);
    throw error;
  }
};

export { auth, firestore, storage, setupRecaptcha, sendOtp, verifyOtp };

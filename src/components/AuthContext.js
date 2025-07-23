import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { getAuth, onAuthStateChanged, signOut } from 'firebase/auth';
import { initializeApp } from 'firebase/app';
import { getMessaging, getToken } from 'firebase/messaging';

// Firebase config
const firebaseConfig = {

    apiKey: "YOUR_API_KEY",
  authDomain: "YOUR_APP.firebaseapp.com",
  projectId: "YOUR_PROJECT_ID",
  storageBucket: "YOUR_APP.appspot.com",
  messagingSenderId: "YOUR_SENDER_ID",
  appId: "YOUR_APP_ID"

  // Your Firebase config here
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const messaging = getMessaging(app);

// Create context
const AuthContext = createContext();

// ✅ Provider
export const AuthProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null);
  const [fcmToken, setFcmToken] = useState(null);

  // ✅ Wrap in useCallback to avoid eslint warning
  const requestForNotificationPermissionAndGetToken = useCallback(async () => {
    try {
      const token = await getToken(messaging, {
        vapidKey: 'YOUR_VAPID_KEY',
      });
      if (token) {
        console.log('FCM Token:', token);
        setFcmToken(token);
      } else {
        console.log('No registration token available. Request permission to generate one.');
      }
    } catch (error) {
      console.error('Error getting FCM token:', error);
    }
  }, []);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setCurrentUser(user);
    });

    requestForNotificationPermissionAndGetToken(); // ✅ Called here

    return () => unsubscribe();
  }, [requestForNotificationPermissionAndGetToken]); // ✅ Added to dependency array

  const logout = () => signOut(auth);

  return (
    <AuthContext.Provider value={{ currentUser, fcmToken, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

// Custom hook
export const useAuth = () => useContext(AuthContext);

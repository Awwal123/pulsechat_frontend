importScripts(
  "https://www.gstatic.com/firebasejs/12.19.0/firebase-app-compat.js"
);

importScripts(
  "https://www.gstatic.com/firebasejs/12.19.0/firebase-messaging-compat.js"
);

self.skipWaiting();

firebase.initializeApp({
  apiKey: "AIzaSyCUc_wUu_Zt98myEYPoLSf6GfVj0-obr4Q",
  authDomain: "pulse-chat-ea310.firebaseapp.com",
  projectId: "pulse-chat-ea310",
  storageBucket: "pulse-chat-ea310.firebasestorage.app",
  messagingSenderId: "9601107946",
  appId: "1:9601107946:web:100c8392f90d65f8f39493",
});

const messaging = firebase.messaging();

messaging.onBackgroundMessage((payload) => {
  console.log(
    "[firebase-messaging-sw.js] Background message:",
    payload
  );
});
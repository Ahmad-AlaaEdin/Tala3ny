// In: public/firebase-messaging-sw.js

// Import the Firebase app and messaging compat scripts
// (Use the versions matching your project's firebase version)
importScripts(
  "https://www.gstatic.com/firebasejs/9.21.0/firebase-app-compat.js"
);
importScripts(
  "https://www.gstatic.com/firebasejs/9.21.0/firebase-messaging-compat.js"
);

// !! IMPORTANT !!
// Add your Firebase project's configuration object here.
// You can copy this directly from your 'src/config/firebase.ts' file.
const firebaseConfig = {
  apiKey: "AIzaSyDa-gBADXDWnC6GxriBHGedHEl2xo7yhkQ",
  authDomain: "tala3ny-5e4d9.firebaseapp.com",
  projectId: "tala3ny-5e4d9",
  storageBucket: "tala3ny-5e4d9.firebasestorage.app",
  messagingSenderId: "76162891753",
  appId: "1:76162891753:web:e8038890d500db3530d578",
  measurementId: "G-XQ9KVES9WC",
};
// Initialize Firebase
firebase.initializeApp(firebaseConfig);

// Retrieve an instance of Firebase Messaging
const messaging = firebase.messaging();

// Optional: Handle background messages
// This is triggered when the app is in the background or closed
messaging.onBackgroundMessage((payload) => {
  console.log(
    "[firebase-messaging-sw.js] Received background message: ",
    payload
  );

  // Customize the notification here
  const notificationTitle = payload.notification.title;
  const notificationOptions = {
    body: payload.notification.body,
    icon: "/icon.png", // Make sure you have an icon in /public
  };

  self.registration.showNotification(notificationTitle, notificationOptions);
});

importScripts(
  "https://www.gstatic.com/firebasejs/9.21.0/firebase-app-compat.js"
);
importScripts(
  "https://www.gstatic.com/firebasejs/9.21.0/firebase-messaging-compat.js"
);

const firebaseConfig = {
  apiKey: "AIzaSyDa-gBADXDWnC6GxriBHGedHEl2xo7yhkQ",
  authDomain: "tala3ny-5e4d9.firebaseapp.com",
  projectId: "tala3ny-5e4d9",
  storageBucket: "tala3ny-5e4d9.firebasestorage.app",
  messagingSenderId: "76162891753",
  appId: "1:76162891753:web:e8038890d500db3530d578",
  measurementId: "G-XQ9KVES9WC",
};

firebase.initializeApp(firebaseConfig);

const messaging = firebase.messaging();

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

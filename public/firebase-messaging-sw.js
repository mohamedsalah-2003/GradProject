importScripts('https://www.gstatic.com/firebasejs/10.14.1/firebase-app-compat.js');
importScripts('https://www.gstatic.com/firebasejs/10.14.1/firebase-messaging-compat.js');

// ⚠️ Service Worker مش بيقرأ process.env — لازم القيم تكون hardcoded هنا
firebase.initializeApp({
 apiKey: "AIzaSyCKZCY2n7imCskly4iDFZWDyVC4oRIGPC8",
 projectId: "aegisiq-b6034",
  messagingSenderId: "1042362177694",
  appId: "1:1042362177694:web:e6ed432d6afcca166a838f",
});

const messaging = firebase.messaging();

// Background notification
messaging.onBackgroundMessage((payload) => {
  self.registration.showNotification(
    payload.notification?.title || "AegisIQ Alert",
    {
      body: payload.notification?.body || "An anomaly was detected.",
      icon: "/logo.png",
      data: payload.data,
    }
  );
});

// لما يضغط على الـ notification
self.addEventListener("notificationclick", (event) => {
  event.notification.close();
  const alertId = event.notification.data?.alertId;
  if (alertId) {
    event.waitUntil(clients.openWindow(`/alerts/${alertId}`));
  }
});
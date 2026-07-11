// config/firebase.web.ts

const FIREBASE_CONFIG = {
  apiKey: "AIzaSyCKZCY2n7imCskly4iDFZWDyVC4oRIGPC8",
  authDomain: "aegisiq-b6034.firebaseapp.com",
  projectId: "aegisiq-b6034",
  storageBucket: "aegisiq-b6034.firebasestorage.app",
  messagingSenderId: "1042362177694",
  appId: "1:1042362177694:web:e6ed432d6afcca166a838f",
};

// helper بيلود script من CDN
function loadScript(src: string): Promise<void> {
  return new Promise((resolve, reject) => {
    // لو موجود خلاص متحملوش تاني
    if (document.querySelector(`script[src="${src}"]`)) {
      resolve();
      return;
    }
    const script = document.createElement("script");
    script.src = src;
    script.onload = () => resolve();
    script.onerror = reject;
    document.head.appendChild(script);
  });
}

export const getWebMessaging = async () => {
  if (!("serviceWorker" in navigator)) return null;

  try {
    // 1. حمّل Firebase من CDN — بيتجاوز Metro خالص
    await loadScript(
      "https://www.gstatic.com/firebasejs/10.14.1/firebase-app-compat.js"
    );

    // 2. init لو مش initialized
    const fb = (window as any).firebase;
    if (!fb.apps.length) {
      fb.initializeApp(FIREBASE_CONFIG);
    }

    // 3. سجّل الـ Service Worker
    await navigator.serviceWorker.register("/firebase-messaging-sw.js");
    await navigator.serviceWorker.ready;
    console.log("✅ Firebase web messaging ready");

    return fb.messaging();
  } catch (err) {
    console.warn("❌ FCM web setup failed:", err);
    return null;
  }
};
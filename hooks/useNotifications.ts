import { useEffect, useRef } from "react";
import { Alert, Platform } from "react-native";
import { useRouter } from "expo-router";

// Native only
let messaging: any = null;
if (Platform.OS !== "web") {
  messaging = require("@react-native-firebase/messaging").default;
}

export function useNotifications() {
  const router = useRouter();
  const isMounted = useRef(true);

  useEffect(() => {
    isMounted.current = true;

    // ── WEB ──────────────────────────────────────────────────────────────────
    if (Platform.OS === "web") {
      let unsubscribeWeb: (() => void) | undefined;

      const setupWeb = async () => {
        try {
          const { getWebMessaging } = await import("@/config/firebase.web");
          const { onMessage } = await import("firebase/messaging");

          const messagingInstance = await getWebMessaging();
          if (!messagingInstance) return;

          // Foreground — الـ service worker بيتكلم الـ background تلقائياً
          unsubscribeWeb = onMessage(messagingInstance, (remoteMessage) => {
            const alertId = remoteMessage.data?.alertId;

            // Web مش عنده Alert.alert — نستخدم Notification API
            if (Notification.permission === "granted") {
              const notif = new Notification(
                remoteMessage.notification?.title || "AegisIQ Alert",
                {
                  body: remoteMessage.notification?.body,
                  icon: "/logo.png",
                  data: remoteMessage.data,
                }
              );

              notif.onclick = () => {
                if (alertId && isMounted.current) {
                  router.push(`/alerts/${alertId}`);
                }
              };
            }
          });
        } catch (err) {
          console.warn("Web FCM setup failed:", err);
        }
      };

      setupWeb();

      return () => {
        isMounted.current = false;
        unsubscribeWeb?.();
      };
    }

    // ── NATIVE (Android / iOS) ────────────────────────────────────────────────
    if (!messaging) return;

    const unsubscribeForeground = messaging().onMessage(async (remoteMessage: any) => {
      Alert.alert(
        remoteMessage.notification?.title || "System Alert",
        remoteMessage.notification?.body || "An anomaly was detected.",
        [
          {
            text: "View Details",
            onPress: () => {
              if (remoteMessage.data?.alertId) {
                router.push(`/alerts/${remoteMessage.data.alertId}`);
              }
            },
          },
          { text: "Dismiss", style: "cancel" },
        ]
      );
    });

    const unsubscribeNotificationOpened = messaging().onNotificationOpenedApp(
      (remoteMessage: any) => {
        if (remoteMessage.data?.alertId) {
          router.push(`/alerts/${remoteMessage.data.alertId}`);
        }
      }
    );

    messaging()
      .getInitialNotification()
      .then((remoteMessage: any) => {
        if (remoteMessage?.data?.alertId) {
          setTimeout(() => {
            if (isMounted.current) {
              router.push(`/alerts/${remoteMessage.data.alertId}`);
            }
          }, 1200);
        }
      });

    return () => {
      isMounted.current = false;
      unsubscribeForeground();
      unsubscribeNotificationOpened();
    };
  }, [router]);
}
import { getToken } from "firebase/messaging";

import {
  firebaseVapidKey,
  getFirebaseMessaging,
} from "../firebase";

import { notificationService } from "./api";

export async function setupNotifications(): Promise<string | null> {
  try {
    if (!("Notification" in window)) {
      console.log("Notifications are not supported.");
      return null;
    }

    const permission = await Notification.requestPermission();

    if (permission !== "granted") {
      console.log("Notification permission was not granted.");
      return null;
    }

    const registration = await navigator.serviceWorker.register(
      "/firebase-messaging-sw.js",
    );

    await navigator.serviceWorker.ready;

    const messaging = await getFirebaseMessaging();

    if (!messaging) {
      console.log("Firebase Messaging is not supported.");
      return null;
    }

    const token = await getToken(messaging, {
      vapidKey: firebaseVapidKey,
      serviceWorkerRegistration: registration,
    });

    if (!token) {
      console.log("Could not get FCM token.");
      return null;
    }

    console.log("🔥 FCM Token:", token);

    await notificationService.saveDeviceToken(token);

    console.log("✅ FCM token saved to Laravel.");

    return token;
  } catch (error) {
    console.error("❌ Failed to setup notifications:", error);
    return null;
  }
}
import { Injectable } from "@angular/core"
import { getMessaging, getToken, onMessage } from "firebase/messaging"
import { initializeApp } from "firebase/app"
import { environment } from "../../environments/environment"
import { AlertService } from "./alert.service"

@Injectable({ providedIn: "root" })
export class FirebaseWebService {
 private messaging = getMessaging(initializeApp(environment.firebase))

 async requestPermissionAndToken(): Promise<string | null> {
  const permission = await Notification.requestPermission()
  if (permission !== "granted") {
   console.warn("Permission not granted for notifications")
   return null
  }

  try {
   const token = await getToken(this.messaging, {
    vapidKey: environment.firebase.vapidKey
   })
   console.log("Web FCM token:", token)
   AlertService.showAlert("Alert", "Web FCM token:" + JSON.stringify(token))
   return token
  } catch (err) {
   console.error("Error getting token:", err)
   AlertService.showAlert("Error", "Error getting token:" + JSON.stringify(err))
   return null
  }
 }

 listenToForegroundMessages() {
  onMessage(this.messaging, (payload) => {
   console.log("Foreground notification received:", payload)
   AlertService.showAlert("Alert", "Foreground notification received:" + JSON.stringify(payload))
   // Optionally show alert or custom toast
  })
 }
}
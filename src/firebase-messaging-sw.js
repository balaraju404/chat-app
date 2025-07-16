importScripts("https://www.gstatic.com/firebasejs/10.12.2/firebase-app-compat.js")
importScripts("https://www.gstatic.com/firebasejs/10.12.2/firebase-messaging-compat.js")

import { environment } from "../src/environments/environment"

firebase.initializeApp(environment.firebase)
const messaging = firebase.messaging()

messaging.onBackgroundMessage(function (payload) {
 console.log("[firebase-messaging-sw.js] Received background message", payload)
 const { title, body } = payload.notification
 const options = {
  body,
  icon: "/assets/icons/icon-72x72.png",
  data: payload.data
 }
 self.registration.showNotification(title, options)
})
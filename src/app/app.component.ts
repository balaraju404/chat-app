import { Component, inject } from "@angular/core"
import { Capacitor } from "@capacitor/core"
import { IonApp, IonRouterOutlet, ModalController } from "@ionic/angular/standalone"
import { PushNotifications, Token, PushNotificationSchema, ActionPerformed } from "@capacitor/push-notifications"
import { AlertService } from "./utils/alert.service"
import { Constants } from "./utils/constants.service"
import { LSService } from "./utils/ls-service.service"
import { FriendChatPage } from "./layout/home/chat/friend-chat/friend-chat.page"
import { ApiService } from "./utils/api.service"
import { FirebaseWebService } from "./utils/firebase-web.service"

@Component({
 selector: "app-root",
 templateUrl: "app.component.html",
 imports: [IonApp, IonRouterOutlet],
})
export class AppComponent {
 private readonly modalCtrl = inject(ModalController)
 private readonly apiService = inject(ApiService)
 private firebaseWeb = inject(FirebaseWebService)
 ngOnInit() {
  this.initializeApp()
 }

 initializeApp() {
  if (Capacitor.getPlatform() === "web") {
   this.intializeWebApp()
  } else if (Capacitor.getPlatform() === "android" || Capacitor.getPlatform() === "ios") {
   this.intializeMobileApp()
  } else {
   console.log("Push Notifications not supported on this platform")
  }
 }
 intializeWebApp() {
  this.firebaseWeb.requestPermissionAndToken().then(token => {
   if (token) {
    // Save token to DB (via your API service)
    LSService.setItem(Constants.LS_DEVICE_TOKEN_ID, token)
    // this.apiService.postApi(Constants.getApiUrl(Constants.SAVE_TOKEN_URL), { token }).subscribe()
   }
  })

  this.firebaseWeb.listenToForegroundMessages()
 }
 intializeMobileApp() {
  PushNotifications.requestPermissions().then(result => {
   if (result.receive === "granted") {
    PushNotifications.register()
   } else {
    AlertService.showAlert("Error", "Push permission not granted")
   }
  })

  PushNotifications.addListener("registration", async (token: Token) => {
   if (token?.value) await LSService.setItem(Constants.LS_DEVICE_TOKEN_ID, token.value)
  })

  PushNotifications.addListener("registrationError", (error: any) => {
   AlertService.showAlert("Error", "Push registration error: " + JSON.stringify(error))
  })

  PushNotifications.addListener("pushNotificationReceived", (notification: PushNotificationSchema) => {
   AlertService.showAlert("Notification", "Notification received: " + JSON.stringify(notification))
   const data = notification.notification?.["data"] || ""
   if (data) this.onNotificationReceived(data)
  })

  PushNotifications.addListener("pushNotificationActionPerformed", (notification: ActionPerformed) => {
   AlertService.showAlert("Notification", "Notification action performed: " + JSON.stringify(notification))
   const data = notification.notification?.["data"] || ""
   if (data) this.onClickNotification(data)
  })
 }
 onNotificationReceived(data: any) {
  const type = Number(data["type"] || 0)
  switch (type) {
   case 1:
    break
   case 2:
    this.updateMsgStatus(JSON.parse(data["data"]))
    break
   case 3:
    break
   case 4:
    break
  }
 }
 onClickNotification(data: any) {
  const type = Number(data["type"] || 0)
  switch (type) {
   case 1:
    break
   case 2:
    this.openFriendChatModal(JSON.parse(data["data"]))
    break
   case 3:
    break
   case 4:
    break
  }
 }
 async openFriendChatModal(item: any) {
  const data = { _id: item["ref_id"], user_id: item["sender_id"], username: item["username"] }
  const modal = await this.modalCtrl.create({
   component: FriendChatPage,
   componentProps: { friendData: data }
  })
  await modal.present()
 }

 updateMsgStatus(data: any) {
  const url = Constants.getApiUrl(Constants.UPDATE_MSG_URL)
  const payload = { msg_id: data["ref_id"], receiver_id: data["sender_id"], message_status: 1 }
  this.apiService.putApi(url, payload).subscribe({
   next: (res: any) => { }
  })
 }
}
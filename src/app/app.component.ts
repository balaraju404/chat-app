import { Component, inject } from "@angular/core"
import { Capacitor } from "@capacitor/core"
import { IonApp, IonRouterOutlet, ModalController } from "@ionic/angular/standalone"
import { PushNotifications, Token, PushNotificationSchema, ActionPerformed } from "@capacitor/push-notifications"
import { AlertService } from "./utils/alert.service"
import { Constants } from "./utils/constants.service"
import { LSService } from "./utils/ls-service.service"
import { FriendChatPage } from "./layout/home/chat/friend-chat/friend-chat.page"

@Component({
 selector: "app-root",
 templateUrl: "app.component.html",
 imports: [IonApp, IonRouterOutlet],
})
export class AppComponent {
 private readonly modalCtrl = inject(ModalController)
 ngOnInit() {
  this.initializeApp()
 }

 initializeApp() {
  if (Capacitor.getPlatform() === 'android' || Capacitor.getPlatform() === 'ios') {
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
   })

   PushNotifications.addListener("pushNotificationActionPerformed", (notification: ActionPerformed) => {
    AlertService.showAlert("Notification", "Notification action performed: " + JSON.stringify(notification))
    const data = notification.notification?.["data"] || ""
    if (data) this.onClickNotification(data)
   })
  } else {
   console.log("Push Notifications not supported on web")
   // Optional: Fallback to web-based notifications using the Web Notifications API
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
  const data = { user_id: item["ref_id"], username: item["username"] }
  const modal = await this.modalCtrl.create({
   component: FriendChatPage,
   componentProps: { friendData: data }
  })
  await modal.present()
 }
}
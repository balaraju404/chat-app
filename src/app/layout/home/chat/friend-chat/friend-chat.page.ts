import { Component, Input, inject, CUSTOM_ELEMENTS_SCHEMA } from "@angular/core"
import { CommonModule } from "@angular/common"
import { FormsModule } from "@angular/forms"
import { ApiService } from "src/app/utils/api.service"
import { ToastService } from "src/app/utils/toast.service"
import { Constants } from "src/app/utils/constants.service"
import { Utils } from "src/app/utils/utils.service"
import { LSService } from "src/app/utils/ls-service.service"
import {
 IonHeader, IonToolbar, IonButtons, IonButton, IonIcon, IonAvatar, IonContent, IonRefresherContent, IonRefresher, IonFooter,
 IonItem, IonTextarea, ModalController
} from "@ionic/angular/standalone"
import { SocketService } from "src/app/utils/socket.service"

@Component({
 selector: "app-friend-chat",
 templateUrl: "./friend-chat.page.html",
 styleUrls: ["./friend-chat.page.scss"],
 standalone: true,
 imports: [IonItem, IonFooter, IonRefresher, IonRefresherContent, IonContent, IonAvatar, IonIcon, IonButton, IonButtons, IonTextarea,
  IonToolbar, IonHeader, CommonModule, FormsModule],
 schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class FriendChatPage {
 @Input() friendData: any = {}

 private readonly apiService = inject(ApiService)
 private readonly modalCtrl = inject(ModalController)
 private readonly toastService = inject(ToastService)

 userData: any = {}
 chatData: any[] = []
 msgValue: string = ""
 isUpdate: boolean = false
 receiveMsg: any
 isSendingMsg: boolean = false
 foundUnread: boolean = false
 skeletonArr: any[] = Array.from({ length: 8 })
 isLoadingMessages: boolean = true
 isIntialLoad: boolean = true

 ngOnInit() {
  this.initializeChat()
 }
 async initializeChat() {
  this.userData = await LSService.getItem(Constants.LS_USER_DATA_KEY)
  this.getChatDetails()
  this.receiveMsg = SocketService.msgSubject.subscribe((data) => {
   if (data["sender_id"] == this.friendData["user_id"]) {
    data["is_today"] = true
    data["show_unread"] = !this.foundUnread
    this.foundUnread = true
    this.chatData.push(data)
   }
  })

  SocketService.updateMsgStatusSubject.subscribe((data) => {
   console.log(data);
   const id = data["_id"] || ""
   const index = this.chatData.findIndex((item) => item["_id"] == id)
   if (index != -1) {
    this.chatData[index]["message_status"] = data["message_status"]
   }
  })
 }

 getChatDetails(event: any = null) {
  this.isLoadingMessages = true
  const payload = { friend_id: this.friendData["user_id"] }
  const url = Constants.getApiUrl(Constants.GET_FRIENDS_MSGS_URL)
  this.apiService.postApi(url, payload).subscribe({
   next: (res: any) => {
    this.isLoadingMessages = false
    this.isIntialLoad = false
    const data = res["data"] || []
    this.dataModifier(data)
    this.scrollToBottom()
    if (event) event.target.complete()
   },
   error: (err) => {
    this.isLoadingMessages = false
    const errMsg = Utils.getErrorMessage(err)
    this.toastService.showToastWithCloseButton(errMsg, "danger")
    if (event) event.target.complete()
   }
  })
 }
 dataModifier(data: any) {
  this.foundUnread = false
  data.forEach((m: any) => {
   m["is_today"] = Utils.isToday(m["created_at"])
   if (!this.foundUnread && m["sender_id"] != this.userData["user_id"] && m["is_seen"] == 0) {
    m["show_unread"] = true
    this.foundUnread = true
   }
  })
  this.chatData = data
 }

 sendMessage() {
  if (!this.msgValue.trim() || this.isSendingMsg) return
  const payload = { receiver_id: this.friendData["user_id"], msg: this.msgValue.trim() }
  const url = Constants.getApiUrl(Constants.SEND_MSG_URL)
  this.isSendingMsg = true
  this.apiService.postApi(url, payload).subscribe({
   next: (res: any) => {
    this.isSendingMsg = false
    if (res["status"]) {
     this.isUpdate = true
     this.msgValue = ""
     this.getChatDetails()
    }
   }, error: (err) => {
    this.isSendingMsg = false
    const errMsg = Utils.getErrorMessage(err)
    this.toastService.showToastWithCloseButton(errMsg, "danger")
   }
  })
 }

 dismissModal() {
  this.modalCtrl.dismiss({ is_updated: this.isUpdate })
 }

 refreshData(event: any) {
  this.getChatDetails(event)
 }

 private scrollToBottom() {
  this.isIntialLoad = true
  setTimeout(() => {
   const el = document.getElementById("last-msg")
   if (el) el.scrollIntoView({ behavior: "smooth" })
  }, 100)
 }
}
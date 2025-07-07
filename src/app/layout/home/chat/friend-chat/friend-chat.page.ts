import { Component, Input, inject, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ApiService } from 'src/app/utils/api.service';
import { ToastService } from 'src/app/utils/toast.service';
import { Constants } from 'src/app/utils/constants.service';
import { Utils } from 'src/app/utils/utils.service';
import { LSService } from 'src/app/utils/ls-service.service';
import {
 IonHeader, IonToolbar, IonButtons, IonButton, IonIcon, IonAvatar, IonContent, IonRefresherContent, IonRefresher, IonFooter,
 IonItem, IonTextarea, ModalController
} from "@ionic/angular/standalone";
import { SocketService } from 'src/app/utils/socket.service';

@Component({
 selector: 'app-friend-chat',
 templateUrl: './friend-chat.page.html',
 styleUrls: ['./friend-chat.page.scss'],
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

 async ngOnInit() {
  this.userData = await LSService.getItem(Constants.LS_USER_DATA_KEY)
  this.getChatDetails()
  this.receiveMsg = SocketService.msgSubject.subscribe((data) => {
   if (data["sender_id"] == this.friendData["user_id"]) {
    data["is_today"] = true
    this.chatData.push(data)
   }
  })
 }

 getChatDetails(event: any = null) {
  const payload = { friend_id: this.friendData["user_id"] }
  const url = Constants.getApiUrl(Constants.GET_FRIENDS_MSGS_URL)
  this.apiService.postApi(url, payload).subscribe({
   next: (res: any) => {
    const data = res["data"] || []
    this.dataModifier(data)
    this.scrollToBottom()
    if (event) event.target.complete()
   }, error: (err) => {
    const errMsg = Utils.getErrorMessage(err)
    this.toastService.showToastWithCloseButton(errMsg, "danger")
    if (event) event.target.complete()
   }
  })
 }
 dataModifier(data: any) {
  data.forEach((m: any) => {
   m["is_today"] = Utils.isToday(m["created_at"])
  })
  this.chatData = data
 }

 sendMessage() {
  if (!this.msgValue.trim()) return
  const payload = { username: this.userData["username"], receiver_id: this.friendData["user_id"], msg: this.msgValue.trim() }
  const url = Constants.getApiUrl(Constants.SEND_MSG_URL)
  this.apiService.postApi(url, payload).subscribe({
   next: (res: any) => {
    if (res["status"]) {
     this.isUpdate = true
     this.msgValue = ""
     this.getChatDetails()
    }
   }, error: (err) => {
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
  setTimeout(() => {
   const el = document.getElementById("last-msg")
   if (el) el.scrollIntoView({ behavior: "smooth" })
  }, 100)
 }
}
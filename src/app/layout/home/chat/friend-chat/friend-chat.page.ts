import { Component, Input, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ApiService } from 'src/app/utils/api.service';
import { ToastService } from 'src/app/utils/toast.service';
import { Constants } from 'src/app/utils/constants.service';
import { Utils } from 'src/app/utils/utils.service';
import { LSService } from 'src/app/utils/ls-service.service';
import {
 IonHeader, IonToolbar, IonButtons, IonButton, IonIcon, IonAvatar, IonContent, IonRefresherContent, IonRefresher, IonFooter,
 IonItem, IonInput, ModalController
} from "@ionic/angular/standalone";

@Component({
 selector: 'app-friend-chat',
 templateUrl: './friend-chat.page.html',
 styleUrls: ['./friend-chat.page.scss'],
 standalone: true,
 imports: [IonItem, IonFooter, IonRefresher, IonRefresherContent, IonContent, IonAvatar, IonIcon, IonButton, IonButtons, IonInput,
  IonToolbar, IonHeader, CommonModule, FormsModule]
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

 async ngOnInit() {
  this.userData = await LSService.getItem(Constants.LS_USER_DATA_KEY)
  this.getChatDetails()
 }

 async getChatDetails(event: any = null) {
  const payload = { friend_id: this.friendData["user_id"] }
  const url = Constants.getApiUrl(Constants.GET_FRIENDS_MSGS_URL)

  try {
   const observable$ = await this.apiService.postApi(url, payload)
   observable$.subscribe({
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
  } catch (error) {
   console.error("Failed to call API:", error)
   if (event) event.target.complete()
  }
 }
 dataModifier(data: any) {
  data.forEach((m: any) => {
   m["is_today"] = Utils.isToday(m["created_at"])
  })
  this.chatData = data
 }

 async sendMessage() {
  if (!this.msgValue.trim()) return
  const payload = { receiver_id: this.friendData["user_id"], msg: this.msgValue.trim() }
  const url = Constants.getApiUrl(Constants.SEND_MSG_URL)

  try {
   const observable$ = await this.apiService.postApi(url, payload)
   observable$.subscribe({
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
  } catch (error) {
   console.error("Failed to call API:", error)
  }
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
import { Component, Input, inject, ViewChild, ElementRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule, ModalController } from '@ionic/angular';
import { ApiService } from 'src/app/utils/api.service';
import { ToastService } from 'src/app/utils/toast.service';
import { Constants } from 'src/app/utils/constants.service';
import { Utils } from 'src/app/utils/utils.service';
import { LSService } from 'src/app/utils/ls-service.service';

@Component({
 selector: 'app-friend-chat',
 templateUrl: './friend-chat.page.html',
 styleUrls: ['./friend-chat.page.scss'],
 standalone: true,
 imports: [IonicModule, CommonModule, FormsModule]
})
export class FriendChatPage {
 @Input() friendData: any = {}

 private readonly apiService = inject(ApiService)
 private readonly modalCtrl = inject(ModalController)
 private readonly toastService = inject(ToastService)

 userData: any = {}
 chatData: any[] = []
 msgValue: string = ""

 @ViewChild("chatContainer", { static: false }) chatContainer?: ElementRef

 async ngOnInit() {
  this.userData = await LSService.getItem(Constants.LS_USER_DATA_KEY)
  this.getChatDetails()
 }

 async getChatDetails(event: any = null) {
  const payload = { user_id: this.userData["user_id"], friend_id: this.friendData["user_id"] }
  const url = Constants.getApiUrl(Constants.GET_FRIENDS_MSGS_URL)

  try {
   const observable$ = await this.apiService.postApi(url, payload)
   observable$.subscribe({
    next: (res: any) => {
     this.chatData = res["data"] || []
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

 async sendMessage() {
  if (!this.msgValue.trim()) return
  const payload = { sender_id: this.userData["user_id"], receiver_id: this.friendData["user_id"], msg: this.msgValue.trim() }
  const url = Constants.getApiUrl(Constants.SEND_MSG_URL)

  try {
   const observable$ = await this.apiService.postApi(url, payload)
   observable$.subscribe({
    next: (res: any) => {
     if (res["status"]) {
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
  this.modalCtrl.dismiss()
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
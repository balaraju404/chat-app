import { Component, Input, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ApiService } from 'src/app/utils/api.service';
import { ToastService } from 'src/app/utils/toast.service';
import { Constants } from 'src/app/utils/constants.service';
import { Utils } from 'src/app/utils/utils.service';
import { LSService } from 'src/app/utils/ls-service.service';
import { GroupMembersPage } from './group-members/group-members.page';
import {
 IonHeader, IonAvatar, IonToolbar, IonButtons, IonButton, IonIcon, IonContent, IonRefresher, IonRefresherContent, IonFooter,
 IonItem, IonInput, ModalController
} from "@ionic/angular/standalone";

@Component({
 selector: 'app-group-chat',
 templateUrl: './group-chat.page.html',
 styleUrls: ['./group-chat.page.scss'],
 standalone: true,
 imports: [IonItem, IonFooter, IonRefresherContent, IonRefresher, IonContent, IonIcon, IonButton, IonButtons, IonToolbar, IonAvatar,
  IonInput, IonHeader, CommonModule, FormsModule]
})
export class GroupChatPage {
 @Input() groupData: any = {}

 private readonly apiService = inject(ApiService)
 private readonly modalCtrl = inject(ModalController)
 private readonly toastService = inject(ToastService)

 userData: any = {}
 chatData: any[] = []
 msgValue: string = ""
 isUpdate: boolean = false

 ionViewWillEnter() {
  this.loadUserAndDetails()
 }

 async loadUserAndDetails() {
  this.userData = await LSService.getItem(Constants.LS_USER_DATA_KEY)
  this.getChatDetails()
 }

 async getChatDetails(event: any = null) {
  const payload = { group_id: this.groupData["group_id"] }
  const url = Constants.getApiUrl(Constants.GROUP_CHAT_DETAILS_URL)

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
  const payload = { group_id: this.groupData["group_id"], msg: this.msgValue.trim() }
  const url = Constants.getApiUrl(Constants.GROUP_CHAT_SEND_URL)

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

 async openMembersModal() {
  const modal = await this.modalCtrl.create({
   component: GroupMembersPage,
   componentProps: { groupData: this.groupData }
  })

  modal.onWillDismiss().then(result => {
   if (result.data?.is_updated) {
    // this.fetchGroupList()
   }
  })

  await modal.present()
 }

 openGroupOptions() {
  // Open popover or action sheet with group actions
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
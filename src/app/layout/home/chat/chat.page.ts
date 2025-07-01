import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ApiService } from 'src/app/utils/api.service';
import { ToastService } from 'src/app/utils/toast.service';
import { LSService } from 'src/app/utils/ls-service.service';
import { Constants } from 'src/app/utils/constants.service';
import { Utils } from 'src/app/utils/utils.service';
import { FriendChatPage } from './friend-chat/friend-chat.page';
import {
 IonRefresher, IonRefresherContent, IonSearchbar, IonItem, IonContent, IonList, IonAvatar, IonIcon, IonLabel, IonBadge, IonNote,
 ModalController
} from "@ionic/angular/standalone";

@Component({
 selector: 'app-chat',
 templateUrl: './chat.page.html',
 styleUrls: ['./chat.page.scss'],
 standalone: true,
 imports: [IonNote, IonBadge, IonLabel, IonIcon, IonAvatar, IonList, IonContent, IonItem, IonSearchbar, IonRefresherContent,
  IonRefresher, CommonModule, FormsModule]
})
export class ChatPage {
 private readonly apiService = inject(ApiService)
 private readonly modalCtrl = inject(ModalController)
 private readonly toastService = inject(ToastService)

 userData: any = {}
 allChatData: any[] = []
 filterData: any[] = []

 ionViewWillEnter() {
  this.callOnLoad()
 }

 async callOnLoad() {
  this.userData = await LSService.getItem(Constants.LS_USER_DATA_KEY)
  this.getRecentChatDetails()
 }

 async getRecentChatDetails(event: any = null) {
  const payload = {}
  const url = Constants.getApiUrl(Constants.DASHBOARD_CHATS_URL)

  try {
   const observable$ = await this.apiService.postApi(url, payload)
   observable$.subscribe({
    next: (res: any) => {
     const data = res["data"] || []
     this.dataModifier(data)
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
   m["user_profile"] = Utils.getUserProfile(m)
   m["is_today"] = Utils.isToday(m["last_message"]["created_at"])
  })
  this.allChatData = Utils.cloneData(data)
  this.filterData = Utils.cloneData(data)
 }

 onSearch(event: any) {
  const search_text = event.target.value?.toLowerCase() || ""
  if (!search_text.trim()) {
   this.filterData = Utils.cloneData(this.allChatData)
   return
  }

  this.filterData = this.allChatData.filter((m: any) =>
   m["username"].toLowerCase().includes(search_text)
  )
 }

 async openChatModal(item: any) {
  const data = {
   user_id: item["friend_id"],
   username: item["username"],
   gender_id: item["gender_id"],
   user_profile: item["user_profile"]
  }

  const modal = await this.modalCtrl.create({
   component: FriendChatPage,
   componentProps: { friendData: data }
  })

  modal.onWillDismiss().then((result) => {
   if (result.data?.is_updated) {
    this.getRecentChatDetails()
   }
  })

  await modal.present()
 }

 refreshData(event: any) {
  this.getRecentChatDetails(event)
 }
}
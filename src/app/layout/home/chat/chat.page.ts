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
 IonFab, IonFabButton, ModalController
} from "@ionic/angular/standalone";
import { FriendsListPage } from '../friends-list/friends-list.page';
import { SocketService } from 'src/app/utils/socket.service';

@Component({
 selector: 'app-chat',
 templateUrl: './chat.page.html',
 styleUrls: ['./chat.page.scss'],
 standalone: true,
 imports: [IonNote, IonBadge, IonLabel, IonIcon, IonAvatar, IonList, IonContent, IonItem, IonSearchbar, IonRefresherContent,
  IonRefresher, IonFab, IonFabButton, CommonModule, FormsModule]
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
  SocketService.msgSubject.subscribe((data) => {
   this.getRecentChatDetails(null, data["sender_id"])
  })
  this.getRecentChatDetails()
 }

 getRecentChatDetails(event: any = null, friend_id: any = "") {
  const payload: any = {}
  if (friend_id) payload["friend_id"] = friend_id
  const url = Constants.getApiUrl(Constants.DASHBOARD_CHATS_URL)
  this.apiService.postApi(url, payload).subscribe({
   next: (res: any) => {
    const data = res["data"] || []
    const flag = friend_id != ""
    this.dataModifier(data, flag)
    if (event) event.target.complete()
   }, error: (err) => {
    const errMsg = Utils.getErrorMessage(err)
    this.toastService.showToastWithCloseButton(errMsg, "danger")
    if (event) event.target.complete()
   }
  })
 }

 dataModifier(data: any, flag: boolean = false) {
  if (!Array.isArray(data) || data.length === 0) return

  data.forEach((m: any) => {
   m["user_profile"] = Utils.getUserProfile(m)
   m["is_today"] = Utils.isToday(m?.last_message?.created_at)
  })

  if (flag) {
   const newObj = data[0]
   const index = this.allChatData.findIndex((m: any) => m["friend_id"] == newObj["friend_id"])
   if (index !== -1) this.allChatData.splice(index, 1)
   this.allChatData.unshift(newObj)
  } else this.allChatData = Utils.cloneData(data)
  this.filterData = Utils.cloneData(this.allChatData)
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

 async openFriendsListModal() {
  const modal = await this.modalCtrl.create({
   component: FriendsListPage
  })

  modal.onWillDismiss().then(result => {
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
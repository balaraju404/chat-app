import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ApiService } from 'src/app/utils/api.service';
import { Constants } from 'src/app/utils/constants.service';
import { LSService } from 'src/app/utils/ls-service.service';
import { Utils } from 'src/app/utils/utils.service';
import { ToastService } from 'src/app/utils/toast.service';
import { FriendChatPage } from '../chat/friend-chat/friend-chat.page';
import {
 IonSearchbar, IonHeader, IonToolbar, IonButton, IonTitle, IonButtons, IonIcon, IonContent, IonRefresher, IonRefresherContent,
 IonList, IonItem, IonAvatar, IonLabel, ModalController
} from "@ionic/angular/standalone";

@Component({
 selector: 'app-friends-list',
 templateUrl: './friends-list.page.html',
 styleUrls: ['./friends-list.page.scss'],
 standalone: true,
 imports: [IonLabel, IonAvatar, IonItem, IonList, IonRefresherContent, IonRefresher, IonContent, IonIcon, IonButtons, IonTitle,
  IonButton, IonToolbar, IonHeader, IonSearchbar, CommonModule, FormsModule]
})
export class FriendsListPage {
 private readonly apiService = inject(ApiService)
 private readonly modalCtrl = inject(ModalController)
 private readonly toastService = inject(ToastService)

 userData: any = {}
 friendsList: any = []
 searchText: string = ""

 async ngOnInit() {
  this.userData = await LSService.getItem(Constants.LS_USER_DATA_KEY)
  this.getFriendsList()
 }
 onSearch(event: any) {
  this.searchText = event.target.value
  this.getFriendsList()
 }
 async getFriendsList() {
  const payload: any = { search_text: this.searchText }
  const url = Constants.getApiUrl(Constants.USERS_FRIENDS_URL)

  try {
   const observable$ = await this.apiService.postApi(url, payload)
   observable$.subscribe({
    next: (res: any) => {
     const data = res["data"] || []
     this.dataModifier(data)
    }, error: (err) => {
     const errMsg = Utils.getErrorMessage(err)
     this.toastService.showToastWithCloseButton(errMsg, "danger")
    }
   })
  } catch (error) {
   console.error("Failed to call API:", error)
  }
 }
 dataModifier(data: any) {
  data.forEach((m: any) => {
   m["user_profile"] = Utils.getUserProfile(m)
  })
  this.friendsList = data
 }
 async openChatModal(item: any) {
  const modal = await this.modalCtrl.create({
   component: FriendChatPage,
   componentProps: { friendData: item }
  })
  await modal.present()
 }
 async deleteRequest(item: any) {
  const payload: any = { friend_id: item["user_id"] }
  const url = Constants.getApiUrl(Constants.INVITE_UNFRIEND_URL)

  try {
   const observable$ = await this.apiService.postApi(url, payload)
   observable$.subscribe({
    next: (res: any) => {
     if (res["status"]) {
      this.toastService.showToastWithCloseButton(res["msg"], "success")
      this.getFriendsList()
     } else {
      this.toastService.showToastWithCloseButton(res["msg"], "danger")
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
  this.getFriendsList()
  setTimeout(() => {
   event.target.complete()
  }, 2000)
 }
}
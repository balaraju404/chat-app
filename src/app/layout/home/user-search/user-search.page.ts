import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ApiService } from 'src/app/utils/api.service';
import { Constants } from 'src/app/utils/constants.service';
import { LSService } from 'src/app/utils/ls-service.service';
import { Utils } from 'src/app/utils/utils.service';
import { ToastService } from 'src/app/utils/toast.service';
import {
 IonHeader, IonToolbar, IonTitle, IonButtons, IonButton, IonIcon, IonContent, IonRefresher, IonRefresherContent, IonSearchbar,
 IonList, IonItem, IonAvatar, IonLabel, ModalController
} from "@ionic/angular/standalone";

@Component({
 selector: 'app-user-search',
 templateUrl: './user-search.page.html',
 styleUrls: ['./user-search.page.scss'],
 standalone: true,
 imports: [IonLabel, IonAvatar, IonItem, IonList, IonSearchbar, IonRefresherContent, IonRefresher, IonContent, IonIcon, IonButton,
  IonButtons, IonTitle, IonToolbar, IonHeader, CommonModule, FormsModule]
})
export class UserSearchPage {
 private readonly apiService = inject(ApiService)
 private readonly modalCtrl = inject(ModalController)
 private readonly toastService = inject(ToastService)

 userData: any = {}
 userList: any = []
 searchText: string = ""

 async ngOnInit() {
  this.userData = await LSService.getItem(Constants.LS_USER_DATA_KEY)
  this.searchUsersData()
 }
 onSearch(event: any) {
  this.searchText = event.target.value
  this.searchUsersData()
 }
 searchUsersData(event: any = null) {
  const payload: any = { search_text: this.searchText }
  const url = Constants.getApiUrl(Constants.USERS_OTHERS_URL)
  this.apiService.postApi(url, payload).subscribe({
   next: (res: any) => {
    if (event) event.target.complete()
    const data = res["data"] || []
    this.dataModifier(data)
   }, error: (err) => {
    if (event) event.target.complete()
    const errMsg = Utils.getErrorMessage(err)
    this.toastService.showToastWithCloseButton(errMsg, "danger")
   }
  })
 }
 dataModifier(data: any) {
  data.forEach((m: any) => {
   m["user_profile"] = Utils.getUserProfile(m)
  })
  this.userList = data
 }
 sentRequest(item: any) {
  const payload: any = { receiver_id: item.user_id }
  const url = Constants.getApiUrl(Constants.INVITE_URL)
  this.apiService.postApi(url, payload).subscribe({
   next: (res: any) => {
    if (res["status"]) {
     this.toastService.showToastWithCloseButton(res["msg"], "success")
     this.searchUsersData()
    } else {
     this.toastService.showToastWithCloseButton(res["msg"], "danger")
    }
   }, error: (err) => {
    const errMsg = Utils.getErrorMessage(err)
    this.toastService.showToastWithCloseButton(errMsg, "danger")
   }
  })
 }
 acceptRequest(item: any) {
  const payload: any = { _id: item["req_id"], username: this.userData["username"] }
  const url = Constants.getApiUrl(Constants.INVITE_ACCEPT_URL)
  this.apiService.postApi(url, payload).subscribe({
   next: (res: any) => {
    if (res["status"]) {
     this.toastService.showToastWithCloseButton(res["msg"], "success")
     this.searchUsersData()
    } else {
     this.toastService.showToastWithCloseButton(res["msg"], "danger")
    }
   }, error: (err) => {
    const errMsg = Utils.getErrorMessage(err)
    this.toastService.showToastWithCloseButton(errMsg, "danger")
   }
  })
 }
 rejectRequest(item: any, flag: boolean = false) {
  const payload: any = { _id: item["req_id"], friend_id: item["user_id"], username: this.userData["username"], flag: flag ? 0 : 1 }
  const url = Constants.getApiUrl(Constants.INVITE_DECLINE_URL)
  this.apiService.postApi(url, payload).subscribe({
   next: (res: any) => {
    if (res["status"]) {
     const msg = flag ? "Request withdrawn successfully" : "Request rejected successfully"
     this.toastService.showToastWithCloseButton(msg, "success")
     this.searchUsersData()
    } else {
     this.toastService.showToastWithCloseButton(res["msg"], "danger")
    }
   }, error: (err) => {
    const errMsg = Utils.getErrorMessage(err)
    this.toastService.showToastWithCloseButton(errMsg, "danger")
   }
  })
 }
 dismissModal() {
  this.modalCtrl.dismiss()
 }
 refreshData(event: any) {
  this.searchUsersData(event)
 }
}
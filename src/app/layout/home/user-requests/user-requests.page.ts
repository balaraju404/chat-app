import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ApiService } from 'src/app/utils/api.service';
import { ToastService } from 'src/app/utils/toast.service';
import { Constants } from 'src/app/utils/constants.service';
import { LSService } from 'src/app/utils/ls-service.service';
import { Utils } from 'src/app/utils/utils.service';
import {
 IonIcon, IonHeader, IonToolbar, IonButtons, IonButton, IonTitle, IonContent, IonRefresher, IonRefresherContent, IonSegment,
 IonSegmentButton, IonLabel, IonList, IonItem, IonAvatar, ModalController
} from "@ionic/angular/standalone";

@Component({
 selector: 'app-user-requests',
 templateUrl: './user-requests.page.html',
 styleUrls: ['./user-requests.page.scss'],
 standalone: true,
 imports: [IonAvatar, IonItem, IonList, IonLabel, IonSegment, IonSegmentButton, IonRefresherContent, IonRefresher, IonContent,
  IonTitle, IonButton, IonButtons, IonToolbar, IonHeader, IonIcon, CommonModule, FormsModule]
})
export class UserRequestsPage {
 private readonly apiService = inject(ApiService)
 private readonly modalCtrl = inject(ModalController)
 private readonly toastService = inject(ToastService)

 tabsList: any = [
  { id: 1, name: "Received", count: 0 },
  { id: 2, name: "Sent", count: 0 }
 ]
 selectedTab: any = 1
 userData: any = {}
 receivedRequests: any = []
 sentRequests: any = []

 ionViewDidEnter() {
  this.callAsyncFuns()
 }
 async callAsyncFuns() {
  await this.setUserData()
  this.getReceivedRequests()
  this.getSendedRequests()
 }
 async setUserData() {
  this.userData = await LSService.getItem(Constants.LS_USER_DATA_KEY)
 }
 getReceivedRequests() {
  const payload: any = {}
  const url = Constants.getApiUrl(Constants.INVITE_RECEIVED_URL)
  this.apiService.postApi(url, payload).subscribe({
   next: (res: any) => {
    if (res["status"]) {
     const data = res["data"] || []
     this.tabsList[0]["count"] = data.length
     data.forEach((m: any) => {
      m["user_profile"] = Utils.getUserProfile(m)
     })
     this.receivedRequests = data
    } else {
     this.toastService.showToastWithCloseButton(res["msg"], "danger")
    }
   }, error: (err) => {
    const errMsg = Utils.getErrorMessage(err)
    this.toastService.showToastWithCloseButton(errMsg, "danger")
   }
  })
 }
 getSendedRequests() {
  const payload: any = {}
  const url = Constants.getApiUrl(Constants.INVITE_SENDED_URL)
  this.apiService.postApi(url, payload).subscribe({
   next: (res: any) => {
    if (res["status"]) {
     const data = res["data"] || []
     this.tabsList[1]["count"] = data.length
     data.forEach((m: any) => {
      m["user_profile"] = Utils.getUserProfile(m)
     })
     this.sentRequests = data
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
  const payload: any = { _id: item._id }
  const url = Constants.getApiUrl(Constants.INVITE_ACCEPT_URL)
  this.apiService.postApi(url, payload).subscribe({
   next: (res: any) => {
    if (res["status"]) {
     this.toastService.showToastWithCloseButton(res["msg"], "success")
     this.getReceivedRequests()
    } else {
     this.toastService.showToastWithCloseButton(res["msg"], "danger")
    }
   }, error: (err) => {
    const errMsg = Utils.getErrorMessage(err)
    this.toastService.showToastWithCloseButton(errMsg, "danger")
   }
  })
 }
 rejectRequest(item: any, isWithdraw: number = 0) {
  const payload: any = { _id: item["_id"], friend_id: item["user_id"], isWithdraw: isWithdraw }
  const url = Constants.getApiUrl(Constants.INVITE_DECLINE_URL)
  this.apiService.postApi(url, payload).subscribe({
   next: (res: any) => {
    if (res["status"]) {
     const msg = res["msg"]
     this.toastService.showToastWithCloseButton(msg, "success")
     if (isWithdraw == 1) this.getSendedRequests()
     else this.getReceivedRequests()
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
  this.receivedRequests()
  this.sentRequests()
  setTimeout(() => {
   event.target.complete()
  }, 2000)
 }
}
import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule, ModalController } from '@ionic/angular';
import { ApiService } from 'src/app/utils/api.service';
import { Constants } from 'src/app/utils/constants.service';
import { LSService } from 'src/app/utils/ls-service.service';
import { Utils } from 'src/app/utils/utils.service';
import { ToastService } from 'src/app/utils/toast.service';

@Component({
 selector: 'app-user-search',
 templateUrl: './user-search.page.html',
 styleUrls: ['./user-search.page.scss'],
 standalone: true,
 imports: [IonicModule, CommonModule, FormsModule]
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
 async searchUsersData() {
  const payload: any = { user_id: this.userData["user_id"], search_text: this.searchText }
  const url = Constants.getApiUrl(Constants.USERS_OTHERS_URL)

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
  this.userList = data
 }
 async sentRequest(item: any) {
  const payload: any = { sender_id: this.userData["user_id"], receiver_id: item.user_id }
  const url = Constants.getApiUrl(Constants.INVITE_URL)

  try {
   const observable$ = await this.apiService.postApi(url, payload)
   observable$.subscribe({
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
  } catch (error) {
   console.error("Failed to call API:", error)
  }
 }
 async acceptRequest(item: any) {
  const payload: any = { _id: item["req_id"] }
  const url = Constants.getApiUrl(Constants.INVITE_ACCEPT_URL)

  try {
   const observable$ = await this.apiService.postApi(url, payload)
   observable$.subscribe({
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
  } catch (error) {
   console.error("Failed to call API:", error)
  }
 }
 async rejectRequest(item: any, flag: boolean = false) {
  const payload: any = { _id: item["req_id"] }
  const url = Constants.getApiUrl(Constants.INVITE_DECLINE_URL)

  try {
   const observable$ = await this.apiService.postApi(url, payload)
   observable$.subscribe({
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
  } catch (error) {
   console.error("Failed to call API:", error)
  }
 }
 dismissModal() {
  this.modalCtrl.dismiss()
 }
 refreshData(event: any) {
  this.searchUsersData()
  setTimeout(() => {
   event.target.complete()
  }, 2000)
 }
}
import { Component, Input, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ApiService } from 'src/app/utils/api.service';
import { ToastService } from 'src/app/utils/toast.service';
import { Constants } from 'src/app/utils/constants.service';
import { Utils } from 'src/app/utils/utils.service';
import {
 IonHeader, IonToolbar, IonTitle, IonButtons, IonButton, IonIcon, IonContent, IonList, IonItem, IonAvatar, IonLabel,
 ModalController
} from "@ionic/angular/standalone";

@Component({
 selector: 'app-add-members',
 templateUrl: './add-members.page.html',
 styleUrls: ['./add-members.page.scss'],
 standalone: true,
 imports: [IonLabel, IonAvatar, IonItem, IonList, IonContent, IonIcon, IonButton, IonButtons, IonTitle, IonToolbar, IonHeader,
  CommonModule, FormsModule]
})
export class AddMembersPage {
 @Input() groupData: any = {}

 private readonly apiService = inject(ApiService)
 private readonly modalCtrl = inject(ModalController)
 private readonly toastService = inject(ToastService)

 friendsList: any = []
 newMembersIds: any = []
 isUpdated: boolean = false

 ionViewWillEnter() {
  this.getFriends()
 }

 async getFriends() {
  const payload = { group_id: this.groupData["group_id"] }
  const url = Constants.getApiUrl(Constants.GROUPS_FRIENDS_URL)

  try {
   const observable$ = await this.apiService.postApi(url, payload)
   observable$.subscribe({
    next: (res: any) => {
     if (res["status"]) {
      const data = res["data"] || []
      data.forEach((m: any) => {
       m["user_profile"] = Utils.getUserProfile(m)
      })
      this.friendsList = data
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

 onSelectMember(friend: any) {
  if (friend.checked) {
   this.newMembersIds.push(friend._id)
  } else {
   this.newMembersIds = this.newMembersIds.filter((id: any) => id !== friend._id)
  }
 }

 async addGroupMembers() {
  const payload = { group_id: this.groupData["group_id"], members: this.newMembersIds }
  const url = Constants.getApiUrl(Constants.GROUPS_ADD_MEMBERS_URL)

  try {
   const observable$ = await this.apiService.postApi(url, payload)
   observable$.subscribe({
    next: (res: any) => {
     if (res["status"]) {
      this.isUpdated = true
      this.getFriends()
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
  this.modalCtrl.dismiss({ is_updated: this.isUpdated })
 }
}
import { Component, Input, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ApiService } from 'src/app/utils/api.service';
import { ToastService } from 'src/app/utils/toast.service';
import { Constants } from 'src/app/utils/constants.service';
import { Utils } from 'src/app/utils/utils.service';
import {
 IonHeader, IonToolbar, IonTitle, IonButtons, IonButton, IonIcon, IonContent, IonList, IonItem, IonAvatar, IonLabel, IonCheckbox,
 ModalController
} from "@ionic/angular/standalone";

@Component({
 selector: 'app-add-members',
 templateUrl: './add-members.page.html',
 styleUrls: ['./add-members.page.scss'],
 standalone: true,
 imports: [IonLabel, IonAvatar, IonItem, IonList, IonContent, IonIcon, IonButton, IonButtons, IonTitle, IonToolbar, IonHeader,
  IonCheckbox, CommonModule, FormsModule]
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

 getFriends() {
  const payload = { group_id: this.groupData["group_id"] }
  const url = Constants.getApiUrl(Constants.GROUPS_FRIENDS_URL)
  this.apiService.postApi(url, payload).subscribe({
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
 }

 onSelectMember(friend: any) {
  if (friend.checked) this.newMembersIds.push(friend._id)
  else this.newMembersIds = this.newMembersIds.filter((id: any) => id !== friend._id)
 }

 addGroupMembers() {
  const payload = { group_id: this.groupData["group_id"], groupname: this.groupData["groupname"], members: this.newMembersIds }
  const url = Constants.getApiUrl(Constants.GROUPS_ADD_MEMBERS_URL)
  this.apiService.postApi(url, payload).subscribe({
   next: (res: any) => {
    if (res["status"]) {
     this.isUpdated = true
     this.newMembersIds = []
     this.getFriends()
    }
   }, error: (err) => {
    const errMsg = Utils.getErrorMessage(err)
    this.toastService.showToastWithCloseButton(errMsg, "danger")
   }
  })
 }

 dismissModal() {
  this.modalCtrl.dismiss({ is_updated: this.isUpdated })
 }
}
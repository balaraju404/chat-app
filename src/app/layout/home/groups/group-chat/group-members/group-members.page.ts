import { Component, Input, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ModalController } from '@ionic/angular';
import { ApiService } from 'src/app/utils/api.service';
import { ToastService } from 'src/app/utils/toast.service';
import { Constants } from 'src/app/utils/constants.service';
import { Utils } from 'src/app/utils/utils.service';
import { LSService } from 'src/app/utils/ls-service.service';
import { AddMembersPage } from './add-members/add-members.page';
import { AlertService } from 'src/app/utils/alert.service';
import {
 IonHeader, IonToolbar, IonTitle, IonButtons, IonButton, IonIcon, IonContent, IonRefresher, IonRefresherContent,
 IonSearchbar, IonSegmentButton, IonLabel, IonList, IonRow, IonItem, IonAvatar
} from "@ionic/angular/standalone";

@Component({
 selector: 'app-group-members',
 templateUrl: './group-members.page.html',
 styleUrls: ['./group-members.page.scss'],
 standalone: true,
 imports: [IonAvatar, IonItem, IonRow, IonList, IonLabel, IonSegmentButton, IonSearchbar, IonRefresherContent, IonRefresher,
  IonContent, IonIcon, IonButton, IonButtons, IonTitle, IonToolbar, IonHeader, CommonModule, FormsModule]
})
export class GroupMembersPage {
 @Input() groupData: any = {}

 private readonly apiService = inject(ApiService)
 private readonly modalCtrl = inject(ModalController)
 private readonly toastService = inject(ToastService)

 userData: any = {}
 groupDetails: any = {}
 activeTab: string = "members"
 filteredMembers: any[] = []
 filteredAdmins: any[] = []

 tabs = [
  { key: "members", label: "Members" },
  { key: "admins", label: "Admins" }
 ]

 ionViewWillEnter() {
  this.loadUserAndDetails()
 }

 async loadUserAndDetails() {
  this.userData = await LSService.getItem(Constants.LS_USER_DATA_KEY)
  this.getGroupDetails()
 }

 async getGroupDetails(event: any = null) {
  const payload = { group_id: this.groupData["group_id"] }
  const url = Constants.getApiUrl(Constants.GROUPS_DETAILS_URL)

  try {
   const observable$ = await this.apiService.postApi(url, payload)
   observable$.subscribe({
    next: (res: any) => {
     const data = res["data"]?.[0] || {}
     const admins = data.admins || []
     data.members_info?.forEach((n: any) => {
      n.user_profile = Utils.getUserProfile(n)
      n["is_admin"] = admins.includes(n.user_id)
     })
     data.admins_info?.forEach((n: any) => {
      n.user_profile = Utils.getUserProfile(n)
     })
     data["is_admin"] = admins.includes(this.userData.user_id)
     this.groupDetails = data
     this.filteredMembers = [...(data.members_info || [])]
     this.filteredAdmins = [...(data.admins_info || [])]
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

 async removeMember(friend_id: any) {
  const confirmed = await AlertService.showConfirmAlert("Confirm", "Are you sure you want to remove this member?", "Remove")
  if (!confirmed) return

  const payload = { group_id: this.groupData["group_id"], friend_id: friend_id }
  const url = Constants.getApiUrl(Constants.GROUPS_REMOVE_MEMBER_URL)

  try {
   const observable$ = await this.apiService.postApi(url, payload)
   observable$.subscribe({
    next: (res: any) => {
     if (res["status"]) {
      this.toastService.showToastWithCloseButton(res["msg"], "success")
      this.getGroupDetails()
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

 async makeAdmin(friend_id: any) {
  const payload = { group_id: this.groupData["group_id"], friend_id: friend_id }
  const url = Constants.getApiUrl(Constants.GROUPS_ADD_ADMIN_URL)

  try {
   const observable$ = await this.apiService.postApi(url, payload)
   observable$.subscribe({
    next: (res: any) => {
     if (res["status"]) {
      this.toastService.showToastWithCloseButton(res["msg"], "success")
      this.getGroupDetails()
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

 async removeAdmin(friend_id: any) {
  const payload = { group_id: this.groupData["group_id"], friend_id: friend_id }
  const url = Constants.getApiUrl(Constants.GROUPS_REMOVE_ADMIN_URL)

  try {
   const observable$ = await this.apiService.postApi(url, payload)
   observable$.subscribe({
    next: (res: any) => {
     if (res["status"]) {
      this.toastService.showToastWithCloseButton(res["msg"], "success")
      this.getGroupDetails()
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

 onSearch(event: any) {
  const searchText = event.target.value?.toLowerCase().trim() || ""
  // if (this.activeTab === "members") {
  this.filteredMembers = this.groupDetails.members_info?.filter((m: any) =>
   m.username.toLowerCase().includes(searchText)
  ) || []
  // } else if (this.activeTab === "admins") {
  this.filteredAdmins = this.groupDetails.admins_info?.filter((a: any) =>
   a.username.toLowerCase().includes(searchText)
  ) || []
  // }
 }
 async openAddMemebrsModal() {
  const modal = await this.modalCtrl.create({
   component: AddMembersPage,
   componentProps: { groupData: this.groupData }
  })
  modal.onWillDismiss().then(result => {
   if (result.data?.is_updated) {
    this.getGroupDetails()
   }
  })
  await modal.present()
 }

 dismissModal() {
  this.modalCtrl.dismiss()
 }

 refreshData(event: any) {
  this.getGroupDetails(event)
 }
}
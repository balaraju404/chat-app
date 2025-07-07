import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ApiService } from 'src/app/utils/api.service';
import { ToastService } from 'src/app/utils/toast.service';
import { LSService } from 'src/app/utils/ls-service.service';
import { Constants } from 'src/app/utils/constants.service';
import { Utils } from 'src/app/utils/utils.service';
import { CreateGroupPage } from './create-group/create-group.page';
import { GroupChatPage } from './group-chat/group-chat.page';
import {
 IonContent, IonRefresher, IonRefresherContent, IonSearchbar, IonList, IonItem, IonAvatar, IonIcon, IonBadge, IonText, IonFab,
 IonFabButton, ModalController
} from "@ionic/angular/standalone";

@Component({
 selector: 'app-groups',
 templateUrl: './groups.page.html',
 styleUrls: ['./groups.page.scss'],
 standalone: true,
 imports: [IonFabButton, IonFab, IonText, IonBadge, IonIcon, IonAvatar, IonItem, IonList, IonSearchbar, IonRefresherContent,
  IonRefresher, IonContent, CommonModule, FormsModule]
})
export class GroupsPage {
 private readonly apiService = inject(ApiService)
 private readonly modalCtrl = inject(ModalController)
 private readonly toastService = inject(ToastService)

 userData: any = {}
 allGroupsData: any[] = []
 filteredGroupsData: any[] = []

 ionViewWillEnter() {
  this.loadUserAndGroups()
 }

 async loadUserAndGroups() {
  this.userData = await LSService.getItem(Constants.LS_USER_DATA_KEY)
  this.fetchGroupList()
 }

 fetchGroupList(event: any = null) {
  const payload = { user_id: this.userData["user_id"] }
  const url = Constants.getApiUrl(Constants.DASHBOARD_GROUPS_URL)
  this.apiService.postApi(url, payload).subscribe({
   next: (res: any) => {
    const data = res["data"] || []
    this.dataModifier(data)
    event?.target?.complete()
   },
   error: (err) => {
    const errorMsg = Utils.getErrorMessage(err)
    this.toastService.showToastWithCloseButton(errorMsg, "danger")
    event?.target?.complete()
   }
  })
 }

 dataModifier(data: any[]) {
  data.forEach(m => {
   m["group_profile"] = Utils.getGroupProfile(m)
   if (m["last_message"]) m["is_today"] = Utils.isToday(m["last_message"]["created_at"])
  })

  this.allGroupsData = Utils.cloneData(data)
  this.filteredGroupsData = Utils.cloneData(data)
 }

 onSearch(event: any) {
  const searchText = event.target.value?.toLowerCase().trim() || ""
  this.filteredGroupsData = searchText
   ? this.allGroupsData.filter(group =>
    group.groupname?.toLowerCase().includes(searchText)
   )
   : Utils.cloneData(this.allGroupsData)
 }

 async openCreateGroupModal() {
  const modal = await this.modalCtrl.create({
   component: CreateGroupPage
  })

  modal.onWillDismiss().then(result => {
   if (result.data?.is_updated) {
    this.fetchGroupList()
   }
  })

  await modal.present()
 }

 async openGroupModal(data: any) {
  const modal = await this.modalCtrl.create({
   component: GroupChatPage,
   componentProps: { groupData: data }
  })

  modal.onWillDismiss().then(result => {
   if (result.data?.is_updated) {
    this.fetchGroupList()
   }
  })

  await modal.present()
 }

 refreshData(event: any) {
  this.fetchGroupList(event)
 }
}
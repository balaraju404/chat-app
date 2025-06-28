import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule, ModalController } from '@ionic/angular';
import { ApiService } from 'src/app/utils/api.service';
import { ToastService } from 'src/app/utils/toast.service';
import { Constants } from 'src/app/utils/constants.service';
import { Utils } from 'src/app/utils/utils.service';

@Component({
 selector: 'app-create-group',
 templateUrl: './create-group.page.html',
 styleUrls: ['./create-group.page.scss'],
 standalone: true,
 imports: [IonicModule, CommonModule, FormsModule]
})
export class CreateGroupPage {
 private readonly apiService = inject(ApiService)
 private readonly modalCtrl = inject(ModalController)
 private readonly toastService = inject(ToastService)

 isUpdate: boolean = false
 groupName: string = ""

 checkValidations() {
  let msg = ""
  if (this.groupName.trim() == "") msg = "Please enter group name"
  else if (this.groupName.length < 4) msg = "Group name should be at least 4 characters long"
  if (msg != "") {
   this.toastService.showToastWithCloseButton(msg, "danger")
   return
  }
  this.createGroup()
 }
 async createGroup() {
  const payload = { groupname: this.groupName }
  const url = Constants.getApiUrl(Constants.GROUPS_CREATE_URL)

  try {
   const observable$ = await this.apiService.postApi(url, payload)
   observable$.subscribe({
    next: (res: any) => {
     if (res["status"]) {
      this.isUpdate = true
      this.groupName = ""
      this.toastService.showToastWithCloseButton(res["msg"], "success")
      this.dismissModal()
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
  this.modalCtrl.dismiss({ is_updated: this.isUpdate })
 }
}
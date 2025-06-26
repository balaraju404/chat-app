import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule, ModalController } from '@ionic/angular';
import { Router } from '@angular/router';
import { Utils } from 'src/app/utils/utils.service';
import { Constants } from 'src/app/utils/constants.service';
import { ApiService } from 'src/app/utils/api.service';
import { LSService } from 'src/app/utils/ls-service.service';
import { ToastService } from 'src/app/utils/toast.service';

@Component({
 selector: 'app-profile',
 templateUrl: './profile.page.html',
 styleUrls: ['./profile.page.scss'],
 standalone: true,
 imports: [CommonModule, FormsModule, IonicModule]
})
export class ProfilePage {
 private readonly apiService = inject(ApiService)
 private readonly toastService = inject(ToastService)
 private readonly router = inject(Router)
 private readonly modalCtrl = inject(ModalController)

 gendersData: any = Constants.GENDERS_LIST
 isEditing: boolean = false
 userdata: any = {}

 async ngOnInit() {
  this.userdata = await LSService.getItem(Constants.LS_USER_DATA_KEY)
 }
 toggleEdit() {
  if (!this.userdata || !this.userdata.username) return

  if (this.isEditing) {
   this.checkValidations()
  } else {
   this.isEditing = true
  }
 }

 checkValidations() {
  const username = (this.userdata.username || "").trim()
  const genderId = this.userdata.gender_id || 0
  const about = (this.userdata.about || "").trim()

  let msg = ""

  if (username.length < 6) msg = "Username must be at least 6 characters long"
  else if (!genderId) msg = "Please select a gender"
  // else if (about.length < 10) msg = "About must be at least 10 characters long"

  if (msg) {
   this.toastService.showToastWithCloseButton(msg, "danger")
   return
  }

  this.updateUserData()
 }
 getUpdatePayload() {
  const payload: any = {
   username: this.userdata.username,
   gender_id: this.userdata.gender_id,
   about: this.userdata.about
  }
  const selectedGender = this.gendersData.find((g: any) => g["id"] === this.userdata["gender_id"])
  if (selectedGender) payload["gender_name"] = selectedGender.name
  return payload
 }
 async updateUserData() {
  const payload: any = this.getUpdatePayload()
  const url = Constants.getApiUrl(Constants.USERS_UPDATE_URL)

  try {
   const observable$ = await this.apiService.putApi(url, payload)
   observable$.subscribe({
    next: (res: any) => {
     this.toastService.showToastWithCloseButton(res["msg"], "success")
     this.isEditing = false
     this.getUserData()
    }, error: (err) => {
     const errMsg = Utils.getErrorMessage(err)
     this.toastService.showToastWithCloseButton(errMsg, "danger")
    }
   })
  } catch (error) {
   console.error("Failed to call API:", error)
  }
 }
 async getUserData() {
  const payload: any = { user_id: this.userdata["user_id"] }
  const url = Constants.getApiUrl(Constants.USERS_DEATILS_URL)

  try {
   const observable$ = await this.apiService.postApi(url, payload)
   observable$.subscribe({
    next: async (res: any) => {
     const data = res["data"]?.[0] || {}
     await LSService.setItem(Constants.LS_USER_DATA_KEY, data)
     this.userdata = data
    }, error: (err) => {
     const errMsg = Utils.getErrorMessage(err)
     this.toastService.showToastWithCloseButton(errMsg, "danger")
    }
   })
  } catch (error) {
   console.error("Failed to call API:", error)
  }
 }
 async onLogout() {
  await Utils.clearLSonLogout()
  // this.router.navigate(["/login"])
  location.href = "/login"
 }
 dismissModal() {
  this.modalCtrl.dismiss()
 }
}
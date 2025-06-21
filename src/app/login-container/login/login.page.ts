import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import {
 IonContent, IonHeader, IonTitle, IonToolbar, IonRow, IonCol,
 IonIcon, IonButton, IonSpinner, IonInput, IonInputPasswordToggle, IonToast
} from '@ionic/angular/standalone';
import { ApiService } from 'src/app/utils/api.service';
import { Router } from '@angular/router';
import { LSService } from 'src/app/utils/ls-service.service';
import { Constants } from 'src/app/utils/constants.service';
import { ToastService } from 'src/app/utils/toast.service';
import { Utils } from 'src/app/utils/utils.service';

@Component({
 selector: 'app-login',
 templateUrl: './login.page.html',
 styleUrls: ['./login.page.scss'],
 standalone: true,
 imports: [
  CommonModule,
  FormsModule,
  ReactiveFormsModule,
  IonContent, IonHeader, IonTitle, IonToolbar,
  IonRow, IonCol, IonIcon, IonButton,
  IonSpinner, IonInput, IonInputPasswordToggle, IonToast
 ]
})
export class LoginPage {
 private readonly apiService = inject(ApiService)
 private readonly toastService = inject(ToastService)
 private readonly router = inject(Router)

 isLoading: boolean = false
 formPostdata: any = {
  email: "",
  password: ""
 }

 async ngOnInit() {
  this.checkUserData()
 }

 ionViewWillEnter() {
  this.clearForm()
 }
 async checkUserData() {
  const userData = await LSService.getItem(Constants.LS_USER_DATA_KEY)
  if (userData) this.navigateToPage("/layout/home")
 }
 doLogin() {
  let msg = ""
  const userMail = this.formPostdata["email"] || ""
  const userPwd = this.formPostdata["password"] || ""
  if (userMail.length == 0) {
   msg = "Please enter user email"
  } else if (!Utils.isValidEmail(userMail)) {
   msg = "Please enter valid email"
  } else if (userPwd.length < 5) {
   msg = "Password must be min 6 characters"
  }

  if (msg.length) {
   this.toastService.showToastWithCloseButton(msg, "danger")
   return
  }

  this.checkUser()
 }

 async checkUser() {
  this.isLoading = true
  const url = Constants.getApiUrl(Constants.LOGIN_URL);
  this.apiService.postApi(url, this.formPostdata).subscribe({
   next: async (res: any) => {
    this.isLoading = false
    if (res["status"]) {
     const data = JSON.parse(JSON.stringify(res["data"]))
     await LSService.setItem(data, Constants.LS_USER_DATA_KEY)
     await LSService.setItem(data.device_token_id, Constants.LS_DEVICE_TOKEN_ID)
     this.toastService.showToastWithCloseButton(res["msg"], "success")
     this.clearForm()
     this.router.navigate(["/layout/home"])
    } else {
     const msg = res["msg"] || JSON.stringify(res)
     this.toastService.showToastWithCloseButton(msg, "danger")
    }
   }, error: err => {
    this.isLoading = false
    const msg = err?.error?.msg || err?.message || JSON.stringify(err)
    this.toastService.showToastWithCloseButton(msg, "danger")
   }
  })
 }
 navigateToPage(path: string) {
  this.router.navigate([path])
 }
 clearForm() {
  this.formPostdata = {
   email: "",
   password: ""
  }
 }
}
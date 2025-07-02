import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import {
 IonHeader, IonToolbar, IonTitle, IonContent, IonRow, IonCol, IonInputPasswordToggle, IonButton, IonSpinner, IonInput, IonIcon
} from '@ionic/angular/standalone';
import { ApiService } from 'src/app/utils/api.service';
import { Router } from '@angular/router';
import { LSService } from 'src/app/utils/ls-service.service';
import { Constants } from 'src/app/utils/constants.service';
import { ToastService } from 'src/app/utils/toast.service';
import { Utils } from 'src/app/utils/utils.service';
import { SocketService } from 'src/app/utils/socket.service';

@Component({
 selector: 'app-login',
 templateUrl: './login.page.html',
 styleUrls: ['./login.page.scss'],
 standalone: true,
 imports: [CommonModule, FormsModule, ReactiveFormsModule, IonHeader, IonToolbar, IonTitle, IonContent, IonRow, IonCol,
  IonInputPasswordToggle, IonButton, IonSpinner, IonInput, IonIcon]
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

 ionViewWillEnter() {
  this.checkUserData()
  this.clearForm()
 }
 async checkUserData() {
  const userData = await LSService.getItem(Constants.LS_USER_DATA_KEY)
  if (Object.keys(userData || {}).length) this.navigateToPage("/layout/home")
 }
 doLogin() {
  let msg = ""
  const userMail = this.formPostdata["email"] || ""
  const userPwd = this.formPostdata["password"] || ""
  if (userMail.length == 0) {
   msg = "Please enter user email"
  } else if (!Utils.isValidEmail(userMail)) {
   msg = "Please enter valid email"
  }
  // else if (userPwd.length < 6) {
  //  msg = "Password must be min 6 characters"
  // }

  if (msg.length) {
   this.toastService.showToastWithCloseButton(msg, "danger")
   return
  }

  this.checkUser()
 }
 async checkUser() {
  this.isLoading = true;
  const url = Constants.getApiUrl(Constants.LOGIN_URL)

  try {
   const observable$ = await this.apiService.postApi(url, this.formPostdata);

   observable$.subscribe({
    next: async (res: any) => {
     this.isLoading = false
     if (res["status"]) {
      const data = JSON.parse(JSON.stringify(res["data"] || {}))
      const token = res["token"] || ""

      await LSService.setItem(Constants.LS_USER_DATA_KEY, data)
      await LSService.setItem(Constants.LS_TOKEN_KEY, token)
      // await LSService.setItem(data.device_token_id, Constants.LS_DEVICE_TOKEN_ID)

      this.toastService.showToastWithCloseButton(res["msg"], "success")
      this.clearForm()
      this.router.navigate(["/layout/home"])
     } else {
      const msg = res["msg"] || JSON.stringify(res)
      this.toastService.showToastWithCloseButton(msg, "danger")
     }
    }, error: (err) => {
     this.isLoading = false
     const msg = Utils.getErrorMessage(err)
     this.toastService.showToastWithCloseButton(msg, "danger")
    }
   })

  } catch (error) {
   this.isLoading = false
   this.toastService.showToastWithCloseButton("Something went wrong", "danger")
  }
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
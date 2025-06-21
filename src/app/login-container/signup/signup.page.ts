import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import {
 IonContent, IonHeader, IonTitle, IonToolbar, IonRow, IonCol,
 IonIcon, IonButton, IonSpinner, IonInput, IonInputPasswordToggle, IonToast
} from '@ionic/angular/standalone';
import { ApiService } from 'src/app/utils/api.service';
import { Router } from '@angular/router';
import { Constants } from 'src/app/utils/constants.service';
import { ToastService } from 'src/app/utils/toast.service';
import { Utils } from 'src/app/utils/utils.service';

@Component({
 selector: 'app-signup',
 templateUrl: './signup.page.html',
 styleUrls: ['./signup.page.scss'],
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
export class SignupPage {
 private readonly apiService = inject(ApiService)
 private readonly toastService = inject(ToastService)
 private readonly router = inject(Router)

 isLoading: boolean = false
 formPostdata: any = {
  username: "",
  email: "",
  password: ""
 }
 confirmPwd: string = ""

 ionViewWillEnter() {
  this.clearForm()
 }

 doCreateUser() {
  let msg = ""
  const username = this.formPostdata["username"] || ""
  const userMail = this.formPostdata["email"] || ""
  const userPwd = this.formPostdata["password"] || ""
  if (username.length < 6) {
   msg = "Username must be min 6 characters"
  } else if (userMail.length == 0) {
   msg = "Please enter user email"
  } else if (!Utils.isValidEmail(userMail)) {
   msg = "Please enter valid email"
  } else if (userPwd.length < 6) {
   msg = "Password must be min 6 characters"
  } else if (userPwd != this.confirmPwd) {
   msg = "Confirm Password must be same as password"
  }

  if (msg.length) {
   this.toastService.showToastWithCloseButton(msg, "danger")
   return
  }

  this.createUser()
 }

 async createUser() {
  this.isLoading = true
  const url = Constants.getApiUrl(Constants.SIGNUP_URL);
  this.apiService.postApi(url, this.formPostdata).subscribe({
   next: async (res: any) => {
    this.isLoading = false
    if (res["status"]) {
     this.toastService.showToastWithCloseButton(res["msg"], "success")
     this.clearForm()
     this.navigateToPage("login")
    } else {
     const msg = res["msg"] || JSON.stringify(res)
     this.toastService.showToastWithCloseButton(msg, "danger")
    }
   }, error: err => {
    this.isLoading = false
    const msg = Utils.getErrorMessage(err)
    this.toastService.showToastWithCloseButton(msg, "danger")
   }
  })
 }
 navigateToPage(path: string) {
  this.router.navigate([path])
 }
 clearForm() {
  this.formPostdata = {
   username: "",
   email: "",
   password: ""
  }
  this.confirmPwd = ""
 }
}
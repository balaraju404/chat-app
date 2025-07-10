import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import {
 IonHeader, IonToolbar, IonTitle, IonContent, IonRow, IonCol, IonInput, IonSelect, IonSelectOption, IonInputPasswordToggle,
 IonButton, IonIcon, IonSpinner
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
 imports: [CommonModule, FormsModule, ReactiveFormsModule, IonHeader, IonToolbar, IonTitle, IonContent, IonRow, IonCol,
  IonInput, IonSelect, IonSelectOption, IonInputPasswordToggle, IonButton, IonIcon, IonSpinner]
})
export class SignupPage {
 private readonly apiService = inject(ApiService)
 private readonly toastService = inject(ToastService)
 private readonly router = inject(Router)

 gendersData: any = Constants.GENDERS_LIST
 isLoading: boolean = false
 isSendingOtp: boolean = false
 isVerifyingOtp: boolean = false
 formPostdata: any = {
  username: "",
  email: "",
  gender_id: 1,
  gender_name: "",
  password: "",
  is_verified: 0
 }
 otpId: any = ""
 otpInput: any = ""
 confirmPwd: string = ""

 ionViewWillEnter() {
  this.clearForm()
 }

 doCreateUser() {
  let msg = "";
  const username = this.formPostdata["username"] || ""
  const userMail = this.formPostdata["email"] || ""
  const userPwd = this.formPostdata["password"] || ""
  const genderId = this.formPostdata["gender_id"] || ""
  const is_verified = this.formPostdata["is_verified"] || 0

  if (is_verified == 0) msg = "Please verify email first"
  else if (username.length < 6) msg = "Username must be min 6 characters"
  else if (userMail.length == 0) msg = "Please enter user email"
  else if (!Utils.isValidEmail(userMail)) msg = "Please enter valid email"
  else if (!genderId) msg = "Please select a gender"
  else if (userPwd.length < 6) msg = "Password must be min 6 characters"
  else if (userPwd != this.confirmPwd) msg = "Confirm Password must be same as password"

  if (msg.length) {
   this.toastService.showToastWithCloseButton(msg, "danger")
   return
  }

  const selectedGender = this.gendersData.find((g: any) => g.id === genderId)
  if (selectedGender) this.formPostdata["gender_name"] = selectedGender.name
  this.createUser()
 }

 createUser() {
  this.isLoading = true
  const url = Constants.getApiUrl(Constants.SIGNUP_URL)
  this.apiService.postApi(url, this.formPostdata).subscribe({
   next: (res: any) => {
    this.isLoading = false
    if (res["status"]) {
     this.toastService.showToastWithCloseButton(res["msg"], "success")
     this.clearForm()
     this.navigateToPage("login")
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
 }
 sendOtp() {
  this.isSendingOtp = true
  const url = Constants.getApiUrl(Constants.SEND_OTP_URL)
  const payload = { email: this.formPostdata["email"] }
  this.apiService.postApi(url, payload).subscribe({
   next: (res: any) => {
    this.isSendingOtp = false
    if (res["status"]) {
     this.toastService.showToastWithCloseButton(res["msg"], "success")
     this.otpId = res["otp_id"]
    } else {
     const msg = res["msg"] || JSON.stringify(res)
     this.toastService.showToastWithCloseButton(msg, "danger")
    }
   }, error: (err) => {
    this.isSendingOtp = false
    const msg = Utils.getErrorMessage(err)
    this.toastService.showToastWithCloseButton(msg, "danger")
   }
  })
 }
 verfiedOtp() {
  this.isVerifyingOtp = true
  const url = Constants.getApiUrl(Constants.VERIFY_OTP_URL)
  const payload = { otp_id: this.otpId, otp: this.otpInput }
  this.apiService.postApi(url, payload).subscribe({
   next: (res: any) => {
    this.isVerifyingOtp = false
    if (res["status"]) {
     this.toastService.showToastWithCloseButton(res["msg"], "success")
     this.formPostdata["is_verified"] = 1
    } else {
     const msg = res["msg"] || JSON.stringify(res)
     this.toastService.showToastWithCloseButton(msg, "danger")
    }
   }, error: (err) => {
    this.isVerifyingOtp = false
    const msg = Utils.getErrorMessage(err)
    this.toastService.showToastWithCloseButton(msg, "danger")
   }
  })
 }
 isValidEmail() {
  const email = this.formPostdata["email"] || ""
  return Utils.isValidEmail(email)
 }
 navigateToPage(path: string) {
  this.router.navigate([path])
 }
 clearForm() {
  this.formPostdata = {
   username: "",
   email: "",
   gender_id: "",
   gender_name: "",
   password: "",
   is_verified: 0
  }
  this.otpId = ""
  this.otpInput = ""
  this.confirmPwd = ""
 }
}
import { Component, inject } from "@angular/core"
import { CommonModule } from "@angular/common"
import { FormsModule, ReactiveFormsModule } from "@angular/forms"
import {
 IonContent, IonHeader, IonTitle, IonToolbar, IonRow, IonCol, IonInput, IonInputPasswordToggle, IonButton, IonIcon, IonSpinner
} from "@ionic/angular/standalone"
import { Router } from "@angular/router"
import { ApiService } from "src/app/utils/api.service"
import { Constants } from "src/app/utils/constants.service"
import { ToastService } from "src/app/utils/toast.service"
import { Utils } from "src/app/utils/utils.service"

@Component({
 selector: "app-forgot-password",
 templateUrl: "./forgot-password.page.html",
 styleUrls: ["./forgot-password.page.scss"],
 standalone: true,
 imports: [CommonModule, FormsModule, ReactiveFormsModule, IonHeader, IonToolbar, IonTitle, IonContent, IonRow, IonCol,
  IonInput, IonInputPasswordToggle, IonButton, IonIcon, IonSpinner]
})
export class ForgotPasswordPage {
 private readonly apiService = inject(ApiService)
 private readonly toastService = inject(ToastService)
 private readonly router = inject(Router)

 isLoading: boolean = false
 isSendingOtp: boolean = false
 isVerifyingOtp: boolean = false
 email: string = ""
 otpId: any = ""
 otpInput: any = ""
 isOtpVerfied: boolean = false
 password: string = ""
 confirmPwd: string = ""

 ionViewWillEnter() {
  this.clearForm()
 }

 checkValidations() {
  let msg = ""

  if (!this.isOtpVerfied) msg = "Please verify email first"
  else if (this.email.length == 0) msg = "Please enter user email"
  else if (!Utils.isValidEmail(this.email)) msg = "Please enter valid email"
  else if (this.password.length < 6) msg = "Password must be min 6 characters"
  else if (this.password != this.confirmPwd) msg = "Confirm Password must be same as password"

  if (msg.length) {
   this.toastService.showToastWithCloseButton(msg, "danger")
   return
  }

  this.resetPassword()
 }

 resetPassword() {
  this.isLoading = true
  const url = Constants.getApiUrl(Constants.RESET_PASSWORD_URL)
  const payload = { email: this.email, password: this.password }
  this.apiService.postApi(url, payload).subscribe({
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
  const payload = { email: this.email }
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
     this.isOtpVerfied = true
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
  const email = this.email || ""
  return Utils.isValidEmail(email)
 }
 navigateToPage(path: string) {
  this.router.navigate([path])
 }
 clearForm() {
  this.email = ""
  this.password = ""
  this.confirmPwd = ""
  this.otpId = ""
  this.otpInput = ""
  this.isOtpVerfied = false
 }
}
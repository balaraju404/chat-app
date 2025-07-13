import { Component, inject } from "@angular/core"
import { CommonModule } from "@angular/common"
import { FormsModule, ReactiveFormsModule } from "@angular/forms"
import {
 IonHeader, IonToolbar, IonTitle, IonContent, IonRow, IonCol, IonInputPasswordToggle, IonButton, IonSpinner, IonInput, IonIcon
} from "@ionic/angular/standalone"
import { ApiService } from "src/app/utils/api.service"
import { NavigationStart, Router } from "@angular/router"
import { LSService } from "src/app/utils/ls-service.service"
import { Constants } from "src/app/utils/constants.service"
import { ToastService } from "src/app/utils/toast.service"
import { Utils } from "src/app/utils/utils.service"

@Component({
 selector: "app-login",
 templateUrl: "./login.page.html",
 styleUrls: ["./login.page.scss"],
 standalone: true,
 imports: [
  CommonModule, FormsModule, ReactiveFormsModule, IonHeader, IonToolbar, IonTitle, IonContent, IonRow, IonCol, IonInputPasswordToggle, IonButton,
  IonSpinner, IonInput, IonIcon
 ]
})
export class LoginPage {
 private readonly apiService = inject(ApiService)
 private readonly toastService = inject(ToastService)
 private readonly router = inject(Router)

 isLoading: boolean = false
 showValidation: boolean = false

 formPostdata: any = {
  email: "",
  password: ""
 }

 constructor() {
  this.router.events.subscribe((event) => {
   if (event instanceof NavigationStart && event.restoredState) {
    this.checkUserData()
   }
  })
 }

 ionViewWillEnter() {
  this.checkUserData()
  this.clearForm()
 }

 async checkUserData() {
  const userData = await LSService.getItem(Constants.LS_USER_DATA_KEY)
  if (Object.keys(userData || {}).length)
   this.navigateToPage("/layout/home")
 }

 doLogin() {
  this.showValidation = true

  let msg = ""
  const userMail = this.formPostdata["email"]?.trim() || ""
  const userPwd = this.formPostdata["password"] || ""

  if (!userMail) {
   msg = "Please enter user email"
  } else if (!Utils.isValidEmail(userMail)) {
   msg = "Please enter valid email"
  } else if (!userPwd) {
   msg = "Please enter password"
  }
  // else if (userPwd.length < 6) {
  //   msg = "Password must be minimum 6 characters"
  // }

  if (msg) {
   this.toastService.showToastWithCloseButton(msg, "danger")
   return
  }

  this.checkUser()
 }

 async checkUser() {
  this.isLoading = true

  const url = Constants.getApiUrl(Constants.LOGIN_URL)
  const payload = { ...this.formPostdata }

  const deviceToken = await LSService.getItem(Constants.LS_DEVICE_TOKEN_ID)
  if (deviceToken) payload["device_token"] = deviceToken

  this.apiService.postApi(url, payload).subscribe({
   next: (res: any) => {
    this.isLoading = false
    if (res["status"]) {
     this.onSuccessLogin(res)
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

 async onSuccessLogin(res: any) {
  const data = JSON.parse(JSON.stringify(res["data"] || {}))
  const token = res["token"] || ""
  const device_id = res["device_id"] || ""
  await LSService.setItem(Constants.LS_USER_DATA_KEY, data)
  await LSService.setItem(Constants.LS_TOKEN_KEY, token)
  if (device_id) await LSService.setItem(Constants.LS_USER_DEVICE_ID, device_id)
  this.toastService.showToastWithCloseButton(res["msg"], "success")
  this.clearForm()
  this.navigateToPage("/layout/home")
 }

 navigateToPage(path: string) {
  this.router.navigate([path], { replaceUrl: true })
 }

 clearForm() {
  this.formPostdata = { email: "", password: "" }
  this.showValidation = false
 }
}
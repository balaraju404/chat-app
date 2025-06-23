import { Injectable } from "@angular/core";
import { LSService } from "./ls-service.service";
import { Subject } from "rxjs";
import { Constants } from "./constants.service";

@Injectable({
 providedIn: 'root',
})
export class Utils {
 static notificationCountSubject = new Subject()
 static cartCountSubject = new Subject()
 static resCartCountSubject = new Subject()

 static async clearLSonLogout() {
  await LSService.clear()
 }

 static getErrorMessage(err: any): string {
  return err?.error?.errors?.[0]?.msg || err?.error?.msg || err?.message || 'An unexpected error occurred'
 }

 static isValidEmail(email: string) {
  return Constants.EMAIL_REGEX.test(email)
 }
}
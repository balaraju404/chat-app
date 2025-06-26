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

 // re-usable functions
 static getUserProfile(userData: any) {
  const gender_id = userData.gender_id
  // if (gender_id === 1) return 'male-outline'
  // if (gender_id === 2) return 'female-outline'
  return 'person-circle-outline'
 }
 static async clearLSonLogout() {
  await LSService.clear()
 }

 // helper functions
 static cloneData(data: any | any[]) {
  return JSON.parse(JSON.stringify(data));
 }
 static getErrorMessage(err: any): string {
  return err?.error?.errors?.[0]?.msg || err?.error?.msg || err?.message || 'An unexpected error occurred'
 }
 static isValidEmail(email: string) {
  return Constants.EMAIL_REGEX.test(email)
 }

 // date helper functions
 static isToday(dateStr: string | Date): boolean {
  const inputDate = new Date(dateStr)
  const today = new Date()

  return (
   inputDate.getFullYear() === today.getFullYear() &&
   inputDate.getMonth() === today.getMonth() &&
   inputDate.getDate() === today.getDate()
  )
 }
}
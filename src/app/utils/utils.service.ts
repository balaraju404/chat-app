import { Injectable } from "@angular/core"
import { LSService } from "./ls-service.service"
import { Constants } from "./constants.service"

@Injectable({
 providedIn: "root",
})
export class Utils {

 // re-usable functions
 static getUserProfile(userData: any) {
  const gender_id = userData.gender_id
  // if (gender_id === 1) return "male-outline"
  // if (gender_id === 2) return "female-outline"
  return "person-circle-outline"
 }
 static getGroupProfile(groupData: any) {
  return "people-outline"
 }
 static async clearLSonLogout() {
  // await LSService.clear()
  await LSService.removeItem(Constants.LS_USER_DATA_KEY)
  await LSService.removeItem(Constants.LS_TOKEN_KEY)
 }

 // helper functions
 static cloneData(data: any | any[]) {
  return JSON.parse(JSON.stringify(data))
 }
 static getErrorMessage(err: any): string {
  return err?.error?.errors?.[0]?.msg || err?.error?.msg || err?.message || "An unexpected error occurred"
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
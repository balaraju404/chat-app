import { Injectable } from "@angular/core";
import { environment } from "../../environments/environment";

@Injectable({
 providedIn: 'root',
})
export class Constants {
 static readonly NODE_URL = environment.NODE_URL
 static readonly API_URL = Constants.NODE_URL

 static getApiUrl(path: string) {
  return Constants.API_URL + path
 }
 // api urls
 static readonly LOGIN_URL = "login"
 static readonly SIGNUP_URL = Constants.LOGIN_URL + "/sign-up"
 static readonly USERS_URL = "users/"
 static readonly USERS_UPDATE_URL = Constants.USERS_URL + "update"
 static readonly USERS_DEATILS_URL = Constants.USERS_URL + "details"
 static readonly USERS_OTHERS_URL = Constants.USERS_URL + "others"
 static readonly INVITE_URL = "invite/"
 static readonly INVITE_SENDED_URL = Constants.INVITE_URL + "sended"
 static readonly INVITE_RECEIVED_URL = Constants.INVITE_URL + "received"
 static readonly INVITE_ACCEPT_URL = Constants.INVITE_URL + "accept"
 static readonly INVITE_DECLINE_URL = Constants.INVITE_URL + "decline"

 static readonly LS_TOKEN_KEY = 'token'
 static readonly LS_USER_DATA_KEY = 'login_user_data'
 static readonly LS_FIREBASE_TOKEN_KEY = 'firebase_token_key'
 static readonly LS_DEVICE_TOKEN_ID = 'device_token_id'
 static FIREBASE_TOKEN = ''

 // assets
 static readonly APP_ICON = 'assets/images/app-icon.png'

 // 
 static readonly GENDERS_LIST = [
  { id: 1, name: "Male" },
  { id: 2, name: "Female" },
  { id: 3, name: "Other" }
 ]

 // regex values
 static readonly EMAIL_REGEX = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/
 static readonly MOBILE_REGEX = /^\d{10}$/
 static readonly PASSWORD_REGEX = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{6,12}$/
 static readonly ALPHANUMERIC_REGEX = /^[a-zA-Z0-9]+$/
 static readonly ALPHABET_REGEX = /^[a-zA-Z]+$/
 static readonly NUMBER_REGEX = /^\d+$/
 static readonly POSITIVE_NUMBER_REGEX = /^\d+$/
 static readonly POSITIVE_INT_REGEX = /^\d+$/
 static readonly DATE_REGEX = /^(0?[1-9]|1[012])[\/](0?[1-9]|[12][0-9]|3[01])[\/]\d{4}$/
 static readonly DATE_DMY_REGEX = /^(0[1-9]|[12][0-9]|3[01])\/(0[1-9]|1[0-2])\/\d{4}$/
 static readonly TIME_REGEX = /^(0?[1-9]|1[012])[\/](0?[1-9]|[12][0-9]|3[01])[\/]\d{4}(0?[0-9]|1[012]):(0?[0-9]|1[0-9]|2[0-3]):(0?[0-9]|1[0-9]|2[0-9])$/
 static readonly DATE_TIME_REGEX = /^(0?[1-9]|1[012])[\/](0?[1-9]|[12][0-9]|3[01])[\/]\d{4}(0?[0-9]|1[012]):(0?[0-9]|1[0-9]|2[0-3]):(0?[0-9]|1[0-9]|2[0-9])$/
 static readonly IP_REGEX = /^((25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.){3}(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)$/
}
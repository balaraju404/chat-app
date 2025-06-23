import { HttpClient, HttpHeaders } from "@angular/common/http";
import { inject, Injectable } from "@angular/core";
import { LSService } from "./ls-service.service";
import { Constants } from "./constants.service";

@Injectable({
 providedIn: 'root'
})
export class ApiService {
 private readonly http = inject(HttpClient)

 private async getHeaders(isFormData = false): Promise<HttpHeaders> {
  const token = await LSService.getItem(Constants.LS_TOKEN_KEY)
  let headers = new HttpHeaders()
  console.log(token)

  if (token) headers = headers.set('Authorization', `Bearer ${token}`)
  else headers = headers.set('Authorization', 'red_towel')

  if (!isFormData) headers = headers.set('Content-Type', 'application/json')
  return headers
 }

 async getApi(url: string) {
  const headers = await this.getHeaders()
  return this.http.get(url, { headers })
 }

 async postApi(url: string, data: any) {
  const headers = await this.getHeaders()
  return this.http.post(url, data, { headers })
 }

 async putApi(url: string, data: any) {
  const headers = await this.getHeaders()
  return this.http.put(url, data, { headers })
 }

 async deleteApi(url: string) {
  const headers = await this.getHeaders()
  return this.http.delete(url, { headers })
 }

 async patchApi(url: string, data: any) {
  const headers = await this.getHeaders()
  return this.http.patch(url, data, { headers })
 }

 async formPostApi(url: string, data: any) {
  const headers = await this.getHeaders(true)
  return this.http.post(url, data, { headers })
 }
}
import { HttpClient, HttpHeaders } from "@angular/common/http";
import { inject, Injectable } from "@angular/core";
import { LSService } from "./ls-service.service";
import { Constants } from "./constants.service";

@Injectable({
 providedIn: 'root'
})
export class ApiService {
 private readonly http = inject(HttpClient)

 private getHeaders(isFormData = false): HttpHeaders {
  const token = LSService.getItem(Constants.LS_TOKEN_KEY);
  let headers = new HttpHeaders();
  if (token) headers = headers.set('Authorization', `Bearer ${token}`);
  if (!isFormData) headers = headers.set('Content-Type', 'application/json');
  return headers;
 }

 getApi(url: string) {
  return this.http.get(url, { headers: this.getHeaders() });
 }

 postApi(url: string, data: any) {
  return this.http.post(url, data, { headers: this.getHeaders() });
 }

 putApi(url: string, data: any) {
  return this.http.put(url, data, { headers: this.getHeaders() });
 }

 deleteApi(url: string) {
  return this.http.delete(url, { headers: this.getHeaders() });
 }

 patchApi(url: string, data: any) {
  return this.http.patch(url, data, { headers: this.getHeaders() });
 }

 formPostApi(url: string, data: any) {
  return this.http.post(url, data, { headers: this.getHeaders(true) });
 }
}
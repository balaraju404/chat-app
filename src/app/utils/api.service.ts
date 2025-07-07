import { HttpClient } from "@angular/common/http";
import { inject, Injectable } from "@angular/core";

@Injectable({
 providedIn: 'root'
})
export class ApiService {
 private readonly http = inject(HttpClient)

 getApi(url: string) {
  return this.http.get(url)
 }

 postApi(url: string, data: any) {
  return this.http.post(url, data)
 }

 putApi(url: string, data: any) {
  return this.http.put(url, data)
 }

 deleteApi(url: string) {
  return this.http.delete(url)
 }

 patchApi(url: string, data: any) {
  return this.http.patch(url, data)
 }

 formPostApi(url: string, data: any) {
  return this.http.post(url, data)
 }
}
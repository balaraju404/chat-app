import { Injectable } from "@angular/core";
import { HttpEvent, HttpInterceptor, HttpHandler, HttpRequest } from "@angular/common/http";
import { Observable, from } from "rxjs";
import { switchMap } from "rxjs/operators";
import { LSService } from "../utils/ls-service.service";
import { Constants } from "../utils/constants.service";

@Injectable()
export class AuthInterceptor implements HttpInterceptor {

 intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
  return from(LSService.getItem(Constants.LS_TOKEN_KEY)).pipe(
   switchMap(token => {
    let headers = req.headers

    if (token) headers = headers.set("Authorization", `Bearer ${token}`)
    else headers = headers.set("Authorization", "red_towel")

    if (!req.headers.has("Content-Type") && !(req.body instanceof FormData)) {
     headers = headers.set("Content-Type", "application/json")
    }

    const authReq = req.clone({ headers })
    return next.handle(authReq)
   })
  )
 }
}

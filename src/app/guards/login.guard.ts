import { inject, Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { Constants } from '../utils/constants.service';
import { LSService } from '../utils/ls-service.service';

@Injectable({ providedIn: 'root' })
export class LoginGuard implements CanActivate {
 private readonly router = inject(Router)

 async canActivate(): Promise<boolean> {
  const user = await LSService.getItem(Constants.LS_USER_DATA_KEY)
  if (user && Object.keys(user).length) {
   this.router.navigate(["/layout/home"])
   return false
  }
  return true
 }
}
import { inject, Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { LSService } from '../utils/ls-service.service';
import { Constants } from '../utils/constants.service';

@Injectable({ providedIn: 'root' })
export class AuthGuard implements CanActivate {
 private router = inject(Router)

 async canActivate(): Promise<boolean> {
  const user = await LSService.getItem(Constants.LS_USER_DATA_KEY)
  const isLoggedIn = !!user && Object.keys(user).length > 0

  if (!isLoggedIn) {
   this.router.navigate(["/login"], { replaceUrl: true })
   return false
  }

  return true
 }
}
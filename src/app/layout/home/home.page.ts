import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonContent, IonHeader, IonTitle, IonToolbar } from '@ionic/angular/standalone';
import { LSService } from 'src/app/utils/ls-service.service';
import { Constants } from 'src/app/utils/constants.service';
import { Router } from '@angular/router';

@Component({
 selector: 'app-home',
 templateUrl: './home.page.html',
 styleUrls: ['./home.page.scss'],
 standalone: true,
 imports: [IonContent, IonHeader, IonTitle, IonToolbar, CommonModule, FormsModule]
})
export class HomePage {
 private readonly router = inject(Router)

 ngOnInit() {
  this.checkUserData()
 }
 ionViewWillEnter() {
 }
 async checkUserData() {
  const userData = await LSService.getItem(Constants.LS_USER_DATA_KEY)
  if (Object.keys(userData || {}).length == 0) this.navigateToPage("/login")
 }
 navigateToPage(path: string) {
  this.router.navigate([path])
 }
}

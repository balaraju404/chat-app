import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonContent, IonHeader, IonTitle, IonToolbar, IonRouterOutlet, IonTabBar, IonTabButton, IonIcon, IonLabel, IonFooter, IonButtons, IonMenuButton, IonButton } from '@ionic/angular/standalone';
import { LSService } from 'src/app/utils/ls-service.service';
import { Constants } from 'src/app/utils/constants.service';
import { Router } from '@angular/router';

@Component({
 selector: 'app-home',
 templateUrl: './home.page.html',
 styleUrls: ['./home.page.scss'],
 standalone: true,
 imports: [IonFooter, IonLabel, IonIcon, IonTabButton, IonTabBar, IonRouterOutlet, IonContent, IonButtons, IonMenuButton, IonButton, IonHeader, IonTitle, IonToolbar, CommonModule, FormsModule]
})
export class HomePage {
 private readonly router = inject(Router);

 ngOnInit() {
  this.checkUserData();
 }

 ionViewWillEnter() {
  // Optional lifecycle logic
 }

 async checkUserData() {
  const userData = await LSService.getItem(Constants.LS_USER_DATA_KEY);
  if (!userData || Object.keys(userData).length === 0) {
   this.navigateToPage('/login');
  }
 }

 navigateToPage(path: string) {
  this.router.navigate([path]);
 }
}

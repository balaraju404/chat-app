import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import {
 IonContent, IonHeader, IonTitle, IonToolbar, IonIcon, IonList, IonItem, IonLabel, IonButtons, IonButton, MenuController,
 ModalController
} from '@ionic/angular/standalone';
import { UserRequestsPage } from '../user-requests/user-requests.page';

@Component({
 selector: 'app-side-bar',
 templateUrl: './side-bar.page.html',
 styleUrls: ['./side-bar.page.scss'],
 standalone: true,
 imports: [
  IonLabel, IonItem, IonList, IonIcon, IonContent, IonHeader, IonTitle, IonToolbar, IonButtons, IonButton, CommonModule,
  FormsModule
 ]
})
export class SideBarPage {
 private menuCtrl = inject(MenuController)
 private modalCtrl = inject(ModalController)

 tabsList: any = [
  { id: 1, name: "Search User", icon: "search" },
  { id: 2, name: "User Requests", icon: "chatbubble-ellipses" },
  { id: 3, name: "Themes", icon: "color-wand" },
  { id: 4, name: "Settings", icon: "settings" }
 ];

 ngOnInit() { }

 async closeSidebar() {
  await this.menuCtrl.close("side-bar")
 }

 async onTabClick(tab: any) {
  await this.menuCtrl.close("side-bar")
  const id = tab["id"] || 0
  switch (id) {
   case 1:
    break
   case 2:
    this.showUserRequestsModal()
    break
   case 3:
    break
   case 4:
    break
  }
 }
 async showUserRequestsModal() {
  const modal = await this.modalCtrl.create({
   component: UserRequestsPage
  })
  await modal.present()
 }
}

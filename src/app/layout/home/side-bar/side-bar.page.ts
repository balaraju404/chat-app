import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonContent, IonHeader, IonTitle, IonToolbar, IonIcon, IonList, IonItem, IonLabel } from '@ionic/angular/standalone';

@Component({
 selector: 'app-side-bar',
 templateUrl: './side-bar.page.html',
 styleUrls: ['./side-bar.page.scss'],
 standalone: true,
 imports: [IonLabel, IonItem, IonList, IonIcon, IonContent, IonHeader, IonTitle, IonToolbar, CommonModule, FormsModule]
})
export class SideBarPage {

 tabsList: any = [
  { id: 1, name: "Seach User", icon: "search" },
  { id: 2, name: "User Requests", icon: "chatbubble-ellipses" },
  { id: 3, name: "Themes", icon: "color-wand" },
  { id: 4, name: "Settings", icon: "settings" }
 ]
 ngOnInit() {
 }
 onTabClick(tab: any) { }
}

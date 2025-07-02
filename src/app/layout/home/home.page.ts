import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import {
 IonContent, IonHeader, IonTitle, IonToolbar, IonRouterOutlet, IonTabBar, IonTabButton, IonIcon, IonLabel, IonFooter,
 IonButtons, IonMenuButton, IonButton, IonMenu, ModalController, MenuController
} from '@ionic/angular/standalone';
import { LSService } from 'src/app/utils/ls-service.service';
import { Constants } from 'src/app/utils/constants.service';
import { Router } from '@angular/router';
import { SideBarPage } from "./side-bar/side-bar.page";
import { ProfilePage } from './profile/profile.page';
import { SocketService } from 'src/app/utils/socket.service';

@Component({
 selector: 'app-home',
 templateUrl: './home.page.html',
 styleUrls: ['./home.page.scss'],
 standalone: true,
 imports: [IonFooter, IonLabel, IonIcon, IonTabButton, IonTabBar, IonRouterOutlet, IonContent, IonButtons, IonMenuButton,
  IonButton, IonHeader, IonTitle, IonToolbar, IonMenu, CommonModule, FormsModule, SideBarPage]
})
export class HomePage {
 private readonly router = inject(Router)
 private menuCtrl = inject(MenuController)
 private modalCtrl = inject(ModalController)
 private readonly socket = inject(SocketService)

 footerTabs = [
  { label: "Chat", icon: "chatbubbles-outline", tab: "chat", path: "/layout/home/chat" },
  { label: "Groups", icon: "people-outline", tab: "groups", path: "/layout/home/groups" },
  { label: "Posts", icon: "albums-outline", tab: "posts", path: "/layout/home/posts" }
 ]
 curPath: string = "chat"

 ionViewWillEnter() {
  const locArr = window.location.href.split('/')
  this.curPath = locArr[5]
  this.checkUserData()
 }

 async checkUserData() {
  const userData = await LSService.getItem(Constants.LS_USER_DATA_KEY)
  if (!userData || Object.keys(userData).length === 0) {
   this.navigateToPage("/login")
  }  else{
   this.socket.connected({ user_id: userData['user_id'] });
  }
 }

 openSidebar() {
  this.menuCtrl.open("side-bar")
 }

 async showProfileModal() {
  const modal = await this.modalCtrl.create({
   component: ProfilePage
  })
  await modal.present()
 }

 navigateToPage(path: string) {
  this.router.navigate([path])
 }
}
import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import {
 IonContent, IonHeader, IonTitle, IonToolbar, IonButton, IonIcon, IonButtons, ModalController,
 IonCard, IonChip, IonItem, IonTextarea, IonCol, IonRow, IonGrid
} from '@ionic/angular/standalone';
import { FriendSelectorModalComponent } from '../friend-selector-modal/friend-selector-modal.component';

@Component({
 selector: 'app-create-post',
 templateUrl: './create-post.page.html',
 styleUrls: ['./create-post.page.scss'],
 standalone: true,
 imports: [IonContent, IonHeader, IonTitle, IonToolbar, CommonModule, FormsModule, IonButton, IonIcon,
  IonButtons, IonCard, IonChip, IonItem, IonTextarea, IonCol, IonRow, IonGrid]
})
export class CreatePostPage {
 private readonly modalCtrl = inject(ModalController)
 isDismiss: boolean = false;
 postContent: string = "";
 taggedFriends: string[] = [];
 friends = [{ _id: 1, name: 'Balu' }, { _id: 2, name: 'Chandra' }, { _id: 3, name: 'Akhila' }, { _id: 4, name: 'Rajesh' }, { _id: 5, name: 'Veeru' }];
 ngOnInit() {
 }

 dismissModal() {
  this.modalCtrl.dismiss({ is_dismissed: this.isDismiss });
 }
 async openFriendModal() {
  const modal = await this.modalCtrl.create({
   component: FriendSelectorModalComponent,
   componentProps: {
    friends: this.friends,
   },
  });
  await modal.present();
  const { data } = await modal.onDidDismiss();
  if (data) {
   this.taggedFriends = data;
   console.log('Selected friends:', this.taggedFriends);
  }
 }
 savePost() {
  console.log('Post saved:', this.postContent);
  this.isDismiss = true;
  this.dismissModal();
 }
}

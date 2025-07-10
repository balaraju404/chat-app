import { Component, inject, Input } from '@angular/core';
import {
 ModalController, IonHeader, IonTitle, IonToolbar, IonButton, IonButtons, IonContent, 
 IonItem, IonList, IonLabel, IonCheckbox
} from '@ionic/angular/standalone';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
@Component({
 selector: 'app-friend-selector-modal',
 templateUrl: './friend-selector-modal.component.html',
 styleUrls: ['./friend-selector-modal.component.scss'],
 standalone: true,
 imports: [FormsModule, CommonModule, IonHeader, IonTitle, IonToolbar, IonButton, IonButtons,
  IonContent, IonItem, IonList, IonLabel, IonCheckbox],
})
export class FriendSelectorModalComponent {
 @Input() friends: any[] = [];
 selectedFriends: string[] = [];

 private readonly modalCtrl = inject(ModalController)

 toggleSelection(friendName: string) {
  if (this.selectedFriends.includes(friendName)) {
   this.selectedFriends = this.selectedFriends.filter(name => name !== friendName);
  } else {
   this.selectedFriends.push(friendName);
  }
 }
 closeModal() {
  this.modalCtrl.dismiss(this.selectedFriends);
 }
}
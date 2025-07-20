import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { FriendSelectorModalComponent } from '../friend-selector-modal/friend-selector-modal.component';
import { ApiService } from 'src/app/utils/api.service';
import { Constants } from 'src/app/utils/constants.service';
import { LSService } from 'src/app/utils/ls-service.service';
import { firstValueFrom } from 'rxjs';
import {
 IonContent, IonHeader, IonTitle, IonToolbar, IonButton, IonIcon, IonButtons, ModalController,
 IonCard, IonChip, IonItem, IonTextarea, IonCol, IonRow, IonGrid, IonLabel
} from '@ionic/angular/standalone';

@Component({
 selector: 'app-create-post',
 templateUrl: './create-post.page.html',
 styleUrls: ['./create-post.page.scss'],
 standalone: true,
 imports: [IonContent, IonHeader, IonTitle, IonToolbar, CommonModule, FormsModule, IonButton, IonIcon,
  IonButtons, IonCard, IonChip, IonItem, IonTextarea, IonCol, IonRow, IonGrid, IonLabel]
})
export class CreatePostPage {
 private readonly modalCtrl = inject(ModalController);
 private readonly apiService = inject(ApiService);
 isDismiss: boolean = false;
 postContent: string = "";
 taggedFriends: any[] = [];
 friends: any[] = [];
 userData: any = {};
 async ngOnInit() {
  this.userData = await LSService.getItem(Constants.LS_USER_DATA_KEY);
 }

 dismissModal() {
  this.modalCtrl.dismiss({ is_dismissed: this.isDismiss });
 }
 async openFriendModal() {
  await this.getFriends();
  const modal = await this.modalCtrl.create({
   component: FriendSelectorModalComponent,
   componentProps: {
    friends: this.friends
   }
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
  const ids = this.taggedFriends.map(friend => friend.user_id);
  const postParams = {created_by: this.userData.user_id, content: this.postContent, tag: ids};
  this.apiService.postApi(Constants.getApiUrl(Constants.POST_CREATE_URL), postParams).subscribe({
   next: (res: any) => {
    this.isDismiss = true;
    this.dismissModal();
   },
   error: (err) => {
    console.error('Error creating post:', err);
    this.isDismiss = false;
   }
  });
  this.postContent = "";
 }
 async getFriends() {
  const url = Constants.getApiUrl(Constants.USERS_FRIENDS_URL);
  const postParams = { user_id: this.userData.user_id };
  const res: any = await firstValueFrom(this.apiService.postApi(url, postParams));
  this.friends = res.data || [];
 }
 removeTaggedFriend(friend: string) {
  this.taggedFriends = this.taggedFriends.filter(f => f !== friend);
 }
 onEnterPostContent(event: any) {
  this.postContent = event.target.value;
 }
}
import { Component, inject, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule, ModalController } from '@ionic/angular';
import { ApiService } from 'src/app/utils/api.service';
import { ToastService } from 'src/app/utils/toast.service';

@Component({
 selector: 'app-friend-chat',
 templateUrl: './friend-chat.page.html',
 styleUrls: ['./friend-chat.page.scss'],
 standalone: true,
 imports: [IonicModule, CommonModule, FormsModule]
})
export class FriendChatPage {
 @Input() friendData: any = {}

 private readonly apiService = inject(ApiService)
 private readonly modalCtrl = inject(ModalController)
 private readonly toastService = inject(ToastService)

 ngOnInit() {
  console.log(this.friendData);

 }
 dismissModal() {
  this.modalCtrl.dismiss()
 }
}

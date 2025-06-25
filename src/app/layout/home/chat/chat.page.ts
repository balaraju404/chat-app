import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule, ModalController } from '@ionic/angular';
import { ApiService } from 'src/app/utils/api.service';
import { ToastService } from 'src/app/utils/toast.service';
import { LSService } from 'src/app/utils/ls-service.service';
import { Constants } from 'src/app/utils/constants.service';
import { Utils } from 'src/app/utils/utils.service';

@Component({
 selector: 'app-chat',
 templateUrl: './chat.page.html',
 styleUrls: ['./chat.page.scss'],
 standalone: true,
 imports: [IonicModule, CommonModule, FormsModule]
})
export class ChatPage {
 private readonly apiService = inject(ApiService)
 private readonly modalCtrl = inject(ModalController)
 private readonly toastService = inject(ToastService)

 userData: any = {}
 recentChatData: any = []

 async ngOnInit() {
  this.userData = await LSService.getItem(Constants.LS_USER_DATA_KEY)
  this.getRecentChatDetails()
 }
 async getRecentChatDetails(event: any = null) {
  const payload = { user_id: this.userData["user_id"] }
  const url = Constants.getApiUrl(Constants.GET_FRIENDS_MSGS_URL)

  try {
   const observable$ = await this.apiService.postApi(url, payload)
   observable$.subscribe({
    next: (res: any) => {
     this.recentChatData = res["data"] || []
     if (event) event.target.complete()
    }, error: (err) => {
     const errMsg = Utils.getErrorMessage(err)
     this.toastService.showToastWithCloseButton(errMsg, "danger")
     if (event) event.target.complete()
    }
   })
  } catch (error) {
   console.error("Failed to call API:", error)
   if (event) event.target.complete()
  }
 }
}
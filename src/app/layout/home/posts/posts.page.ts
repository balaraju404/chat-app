import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import {
 IonContent, ModalController, IonRefresher, IonRefresherContent, IonFab, IonFabButton, IonIcon
} from '@ionic/angular/standalone';
import { CreatePostPage } from './create-post/create-post.page';
import { ApiService } from 'src/app/utils/api.service';
import { ToastService } from 'src/app/utils/toast.service';

@Component({
 selector: 'app-posts',
 templateUrl: './posts.page.html',
 styleUrls: ['./posts.page.scss'],
 standalone: true,
 imports: [IonContent, CommonModule, FormsModule, IonRefresher, IonRefresherContent, IonFab, IonFabButton, IonIcon]
})
export class PostsPage {
 private readonly apiService = inject(ApiService)
 private readonly modalCtrl = inject(ModalController)
 private readonly toastService = inject(ToastService)

 userData: any = {}
 ngOnInit() {
 }

 async openCreatePostModal() {
  const modal = await this.modalCtrl.create({
   component: CreatePostPage
  })

  modal.onWillDismiss().then(result => {
   if (result.data?.is_updated) {
    // this.fetchGroupList()
   }
  })

  await modal.present()
 }
 refreshData(event: any) { }
}

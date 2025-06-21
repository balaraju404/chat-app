import { inject, Injectable } from '@angular/core';
import { LoadingController } from '@ionic/angular';

@Injectable({
 providedIn: 'root'
})
export class LoadingService {
 private readonly loadingController = inject(LoadingController)
 private loading: any;

 async showLoading(message: string = 'Loading...', spinner: any = 'circles') {
  this.loading = await this.loadingController.create({ message, spinner });
  await this.loading.present();
 }

 async hideLoading() {
  if (this.loading) {
   await this.loading.dismiss();
  }
 }
}
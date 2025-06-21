import { inject, Injectable } from '@angular/core';
import { ToastController } from '@ionic/angular';

@Injectable({
 providedIn: 'root',
})
export class ToastService {
 private readonly toastController = inject(ToastController);

 // Basic toast
 async showToast(
  message: string,
  color: string = 'dark',
  position: 'top' | 'middle' | 'bottom' = 'top',
  duration: number = 2000
 ) {
  try {
   const toast = await this.toastController.create({
    message,
    color,
    position,
    duration,
   });
   await toast.present();
  } catch (err) {
   console.error('Toast error:', err);
  }
 }

 // Toast with close button
 async showToastWithCloseButton(
  message: string,
  color: string = 'dark',
  position: 'top' | 'middle' | 'bottom' = 'top',
  duration: number = 2000
 ) {
  try {
   const toast = await this.toastController.create({
    message,
    color,
    position,
    duration,
    buttons: [
     {
      side: 'end',
      icon: 'close',
      role: 'cancel',
     }
    ]
   });
   await toast.present();
  } catch (err) {
   console.error('Toast error:', err);
  }
 }
}
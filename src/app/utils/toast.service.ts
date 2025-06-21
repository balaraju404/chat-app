import { inject, Injectable } from '@angular/core';
import { ToastController } from '@ionic/angular';

@Injectable({
 providedIn: 'root',
})
export class ToastService {
 private readonly toastController = inject(ToastController)

 // Standard toast
 async showToast(
  message: string,
  color: string = 'dark',
  position: 'top' | 'middle' | 'bottom' = 'top',
  duration: number = 2000
 ) {
  const toast = await this.toastController.create({
   message,
   color,
   position,
   duration,
  });
  toast.present();
 }

 // Toast with close button (cross icon)
 async showToastWithCloseButton(
  message: string,
  color: string = 'dark',
  position: 'top' | 'middle' | 'bottom' = 'top',
  duration: number = 2000
 ) {
  const toast = await this.toastController.create({
   message,
   color,
   position,
   buttons: [
    {
     side: 'end', // Align the button to the end
     icon: 'close', // Use the Ionic close icon
     role: 'cancel',
    },
   ],
   duration,
  });
  toast.present();
 }
}

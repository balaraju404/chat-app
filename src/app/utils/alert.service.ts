import { Injectable } from '@angular/core';
import { AlertController } from '@ionic/angular';

@Injectable({
 providedIn: 'root',
})
export class AlertService {
 static async showAlert(title: string, msg: string, btn_txt: string = "OK") {
  const alert = await new AlertController().create({
   header: title,
   message: msg,
   buttons: [btn_txt]
  });
  await alert.present();
 }

 static async showConfirmAlert(title: string, msg: string, btn_txt: string, cb: any) {
  const alert = await new AlertController().create({
   header: title,
   message: msg,
   buttons: [
    {
     text: 'Cancel',
     role: 'cancel',
     handler: () => {
      cb(0)
      alert.onDidDismiss();
     },
    },
    {
     text: btn_txt,
     role: 'confirm',
     handler: () => {
      cb(1)
      alert.onDidDismiss();
     },
    },
   ],
  });
  await alert.present();
 }
}
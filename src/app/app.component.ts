import { Component } from '@angular/core';
import { IonApp, IonRouterOutlet } from '@ionic/angular/standalone';
import { PushNotifications, Token, PushNotificationSchema, ActionPerformed } from '@capacitor/push-notifications';
import { AlertService } from './utils/alert.service';
import { Constants } from './utils/constants.service';
import { LSService } from './utils/ls-service.service';

@Component({
 selector: 'app-root',
 templateUrl: 'app.component.html',
 imports: [IonApp, IonRouterOutlet],
})
export class AppComponent {
 constructor() { }

 ngOnInit() {
  this.initializeApp()
 }

 initializeApp() {
  PushNotifications.requestPermissions().then(result => {
   if (result.receive === 'granted') {
    PushNotifications.register();
   } else {
    console.log('Push permission not granted');
    AlertService.showAlert("Error", "Push permission not granted")
   }
  });

  PushNotifications.addListener('registration', async (token: Token) => {
   console.log('Push registration success, token: ' + token.value);
   AlertService.showAlert("Success", "Push registration success, token: " + JSON.stringify(token))
   // Send this token to your server for later use
   if (token['value'] && token['value'].length > 0) {
    Constants.FIREBASE_TOKEN = token['value'];
    await LSService.setItem(token.value, Constants.LS_FIREBASE_TOKEN_KEY);
   }
  });

  PushNotifications.addListener('registrationError', (error: any) => {
   console.error('Push registration error: ', error);
   AlertService.showAlert("Error", "Push registration error: " + JSON.stringify(error))
  });

  PushNotifications.addListener('pushNotificationReceived', (notification: PushNotificationSchema) => {
   console.log('Notification received: ', notification);
   AlertService.showAlert("Notification", "Notification received: " + JSON.stringify(notification))
   // Show it in-app or store it
  });

  PushNotifications.addListener('pushNotificationActionPerformed', (notification: ActionPerformed) => {
   console.log('Notification action performed', notification);
   AlertService.showAlert("Notification action performed", "Notification action performed: " + JSON.stringify(notification))
   // Navigate to a page or handle based on notification data
  });
 }
}

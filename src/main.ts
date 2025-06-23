import { bootstrapApplication } from '@angular/platform-browser';
import { RouteReuseStrategy, provideRouter, withPreloading, PreloadAllModules } from '@angular/router';
import { IonicRouteStrategy, provideIonicAngular } from '@ionic/angular/standalone';
import { isDevMode } from '@angular/core';
import { provideServiceWorker } from '@angular/service-worker';
import { provideHttpClient } from '@angular/common/http';

import { AppComponent } from './app/app.component';
import { routes } from './app/app.routes';

import { addIcons } from 'ionicons';
import {
 person, logIn, close, chatbubblesOutline, peopleOutline,
 albumsOutline, menuOutline, personCircleOutline, search,
 settings, colorWand, chatbubbleEllipses, closeOutline,
 checkmarkOutline, returnDownBackOutline, manOutline, womanOutline,
 accessibilityOutline, checkmarkCircleOutline, closeCircleOutline,
 maleOutline, femaleOutline
} from 'ionicons/icons';

addIcons({
 'person': person,
 'log-in': logIn,
 'close': close,
 'chatbubbles-outline': chatbubblesOutline,
 'people-outline': peopleOutline,
 'albums-outline': albumsOutline,
 'menu-outline': menuOutline,
 'person-circle-outline': personCircleOutline,
 'search': search,
 'settings': settings,
 'color-wand': colorWand,
 'chatbubble-ellipses': chatbubbleEllipses,
 'close-outline': closeOutline,
 'checkmark-outline': checkmarkOutline,
 'return-down-back-outline': returnDownBackOutline,
 'man-outline': manOutline,
 'woman-outline': womanOutline,
 'accessibility-outline': accessibilityOutline,
 'checkmark-circle-outline': checkmarkCircleOutline,
 'close-circle-outline': closeCircleOutline,
 'male-outline': maleOutline,
 'female-outline': femaleOutline
});

bootstrapApplication(AppComponent, {
 providers: [
  { provide: RouteReuseStrategy, useClass: IonicRouteStrategy },
  provideIonicAngular(),
  provideRouter(routes, withPreloading(PreloadAllModules)),
  provideHttpClient(),
  provideServiceWorker('ngsw-worker.js', {
   enabled: !isDevMode(),
   registrationStrategy: 'registerWhenStable:30000'
  })
 ]
});
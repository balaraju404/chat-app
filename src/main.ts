import { bootstrapApplication } from '@angular/platform-browser';
import { RouteReuseStrategy, provideRouter, withPreloading, PreloadAllModules } from '@angular/router';
import { IonicRouteStrategy, provideIonicAngular } from '@ionic/angular/standalone';
import { isDevMode } from '@angular/core';
import { provideServiceWorker } from '@angular/service-worker';
import { provideHttpClient } from '@angular/common/http';

import { AppComponent } from './app/app.component';
import { routes } from './app/app.routes';

import { addIcons } from 'ionicons';
import { person, logIn, close } from 'ionicons/icons';

addIcons({
 'person': person,
 'log-in': logIn,
 'close': close
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

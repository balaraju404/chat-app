import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonRouterOutlet } from '@ionic/angular/standalone';

@Component({
 selector: 'app-login-container',
 templateUrl: './login-container.page.html',
 styleUrls: ['./login-container.page.scss'],
 standalone: true,
 imports: [IonRouterOutlet, CommonModule, FormsModule]
})
export class LoginContainerPage implements OnInit {

 constructor() { }

 ngOnInit() {
 }

}

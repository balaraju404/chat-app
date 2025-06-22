import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonContent } from '@ionic/angular/standalone';

@Component({
 selector: 'app-posts',
 templateUrl: './posts.page.html',
 styleUrls: ['./posts.page.scss'],
 standalone: true,
 imports: [IonContent, CommonModule, FormsModule]
})
export class PostsPage {

 ngOnInit() {
 }

}

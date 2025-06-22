import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonContent } from '@ionic/angular/standalone';

@Component({
 selector: 'app-groups',
 templateUrl: './groups.page.html',
 styleUrls: ['./groups.page.scss'],
 standalone: true,
 imports: [IonContent, CommonModule, FormsModule]
})
export class GroupsPage {

 ngOnInit() {
 }

}

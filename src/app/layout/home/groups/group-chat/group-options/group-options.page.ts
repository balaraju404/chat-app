import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonContent, IonHeader, IonTitle, IonToolbar } from '@ionic/angular/standalone';

@Component({
  selector: 'app-group-options',
  templateUrl: './group-options.page.html',
  styleUrls: ['./group-options.page.scss'],
  standalone: true,
  imports: [IonContent, IonHeader, IonTitle, IonToolbar, CommonModule, FormsModule]
})
export class GroupOptionsPage implements OnInit {

  constructor() { }

  ngOnInit() {
  }

}

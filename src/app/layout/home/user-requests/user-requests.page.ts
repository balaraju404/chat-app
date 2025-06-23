import { Component } from '@angular/core';
import { IonicModule } from '@ionic/angular';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
 selector: 'app-user-requests',
 templateUrl: './user-requests.page.html',
 styleUrls: ['./user-requests.page.scss'],
 standalone: true,
 imports: [IonicModule, CommonModule, FormsModule]
})
export class UserRequestsPage {
 selectedTab: string = 'received';

 receivedRequests = [
  { id: 1, username: 'John Doe', gender_id: 1 },
  { id: 2, username: 'Jane Smith', gender_id: 2 },
  { id: 3, username: 'Alex Other', gender_id: 3 }
 ];

 sentRequests = [
  { id: 4, username: 'Alice Brown', gender_id: 2 },
  { id: 5, username: 'Mike Jones', gender_id: 1 }
 ];

 getGenderIcon(gender_id: number): string {
  // if (gender_id === 1) return 'male-outline';
  // if (gender_id === 2) return 'female-outline';
  return 'person-circle-outline';
 }

 acceptRequest(req: any) {
  console.log('Accepted:', req);
  // API call here
 }

 rejectRequest(req: any) {
  console.log('Rejected:', req);
  // API call here
 }

 withdrawRequest(req: any) {
  console.log('Withdrawn:', req);
  // API call here
 }
}

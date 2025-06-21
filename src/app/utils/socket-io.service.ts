import { Injectable } from '@angular/core';
import { io, Socket } from 'socket.io-client';
import { BehaviorSubject } from 'rxjs';
import { Constants } from './constants.service';

const SOCKET_URL = Constants.NODE_URL
@Injectable({
 providedIn: 'root'
})
export class SocketService {
 private socket!: Socket;
 private orderSubject = new BehaviorSubject<any>(null);

 createConnection(user_id: any, role_id: any, res_id: any) {
  this.socket = io(SOCKET_URL, { auth: { user_id: user_id, role_id: role_id, res_id: res_id } });
 }

 sendOrderData(orderData: any) {
  this.socket.emit('orderData', orderData);
 }

 getOrderUpdates() {
  return this.orderSubject.asObservable();
 }
}
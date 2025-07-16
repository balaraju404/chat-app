import { Injectable } from '@angular/core';
import { Constants } from './constants.service';
import { io, Socket } from 'socket.io-client';
import { Subject } from 'rxjs';

@Injectable({
 providedIn: 'root'
})

export class SocketService {
 private socket: Socket;
 static msgSubject = new Subject<any>()
 static updateMsgStatusSubject = new Subject<any>()
 static grpMsgSubject = new Subject<any>()

 constructor() {
  this.socket = io(Constants.NODE_URL, {
   withCredentials: true, // Only if your server uses cookies/session
   transports: ['websocket'],
  })

  this.socket.on('connection', () => {
   console.log("connection")
  })

  this.socket.on('msg', (data) => {
   SocketService.msgSubject.next(data)
  })
  this.socket.on('update_msg_status', (data) => {
   SocketService.updateMsgStatusSubject.next(data)
  })

  this.socket.on('group_msg', (data) => {
   SocketService.grpMsgSubject.next(data)
  })
 }

 connected(payload: any) {
  this.socket.emit('register_user', payload)
 }
}

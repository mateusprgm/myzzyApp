import { Component } from '@angular/core';
import { SocketioServiceService } from '../providers/socketio-service/socketio-service.service'

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage {
  message: String = "";
  messages = [];
  currentUser: String = "";
  name: String;
  join: boolean = false;
  userWriting= [];
  userOn = [];

  constructor(private chatRoom: SocketioServiceService) {}

  joinRoom(name){
    this.join = this.chatRoom.joinRoom(name, this.userOn);
    
    this.chatRoom.showMessages(this.messages, this.userWriting);
    
  }

  sendMessage(message){
    this.message = this.chatRoom.sendMessage(message);
  }

  exitRoom(){
    this.join = this.chatRoom.exitRoom();
  }

  ionViewWillLeave(){
    this.chatRoom.ionViewWillLeave();
  }

  showWriting(){
    this.chatRoom.showWriting();
  }
  
}

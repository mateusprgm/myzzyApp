import { Component } from '@angular/core';
import { SocketioServiceService } from '../providers/socketio-service/socketio-service.service'
import { Router } from '@angular/router';
import { DataService } from '../providers/data/data.service';

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


  constructor(private chatRoom: SocketioServiceService, private dataService: DataService) {}

  joinPage(obj){
    this.dataService.setData("room-list",obj);
  }

  joinServer(name){
    // this.join = this.chatRoom.joinServer(name, this.userOn);
    
    // this.chatRoom.showMessages(this.messages, this.userWriting);
    
  }

  sendMessage(message){
    this.message = this.chatRoom.sendMessage(message);
  }

  exitServer(){
    this.join = this.chatRoom.exitServer();
  }

  ionViewWillLeave(){
    this.chatRoom.ionViewWillLeave();
  }

  showWriting(){
    this.chatRoom.showWriting();
  }

  
  
}

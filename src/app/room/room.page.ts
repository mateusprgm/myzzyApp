import { Component, OnInit } from '@angular/core';
import { DataService } from '../providers/data/data.service';
import { SocketioServiceService } from '../providers/socketio-service/socketio-service.service';


@Component({
  selector: 'app-room',
  templateUrl: './room.page.html',
  styleUrls: ['./room.page.scss'],
})
export class RoomPage implements OnInit {

  roomData:any;
  message: String = "";
  messages = [];
  currentUser: String = "";
  name: String;
  join: boolean = false;
  userWriting= [];
  userOn = [];
  
 
  
  

 
  
  
  constructor(private chatRoom: SocketioServiceService, private dataService: DataService) {}

  ngOnInit(){
    
    this.roomData = this.dataService.getData();
    this.join = this.chatRoom.joinServer(this.roomData.name, this.userOn);
    this.chatRoom.joinRoom(this.roomData.room);

    this.chatRoom.showMessages(this.messages, this.userOn);
    
  }

  sendMessageRoom(message){
    this.message = this.chatRoom.sendMessageRoom(this.roomData.room, message);

   
   
    this.messages.push({ 
      msg:message,
      user: this.roomData.name,
      createdAt: new Date()
    });
  }
    
  showWritingRoom(){
    this.chatRoom.showWriting();
  }

  showMessage(){
     this.chatRoom.showMessages(this.messages, this.userWriting);
    
  }

  exitRoom(){
    this.join = this.chatRoom.exitServer();
    this.dataService.setData("room-list",{});
    
  };

 

  ionViewWillLeave(){
    // this.chatRoom.ionViewWillLeave();
  }
}

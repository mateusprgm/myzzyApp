import { Component, ViewChild, OnInit } from '@angular/core';
import { DataService } from '../providers/data/data.service';
import { SocketioServiceService } from '../providers/socketio-service/socketio-service.service';
import { IonContent } from '@ionic/angular';
import { Observable } from 'rxjs';



@Component({
  selector: 'app-room',
  templateUrl: './room.page.html',
  styleUrls: ['./room.page.scss'],
})
export class RoomPage implements OnInit {

  @ViewChild(IonContent, {static: false}) content: IonContent;
  
  roomData:any;
  message: String = "";
  messages = [];
  currentUser: String = "";
  name: String;
  join: boolean = false;
  userWriting= [];
  userOn = [];
  aux: boolean = false;
  users = [];
  
  

 
  
  
  constructor(private chatRoom: SocketioServiceService, private dataService: DataService) {}

  ngOnInit(){
    this.roomData = this.dataService.getData();
    this.join = this.chatRoom.joinServer(this.roomData.name, this.userOn, this.users);
    this.chatRoom.joinRoom(this.roomData.room);
    this.chatRoom.joined = false;
    this.chatRoom.showMessages(this.messages, this.userWriting);
    console.log("oi");
    
 
  
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
    this.chatRoom.showWritingRoom(this.roomData.room);
  }

  scrollToBottom(){
    this.content.scrollToBottom(1500);
    console.log("asda");
  }

  exitRoom(){
    // this.join = this.chatRoom.exitServer();
    console.log(this.roomData.room);
    this.chatRoom.leaveRoom(this.roomData.room);
    this.dataService.setData("room-list",{});
  };

 

  ionViewWillLeave(){
    // this.chatRoom.ionViewWillLeave();
  }


}

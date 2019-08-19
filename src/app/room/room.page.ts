import { Component, ViewChild, OnInit } from '@angular/core';
import { DataService } from '../providers/data/data.service';
import { SocketioServiceService } from '../providers/socketio-service/socketio-service.service';
import { IonContent, IonTextarea } from '@ionic/angular';
import { IntervalObservable } from 'rxjs/observable/IntervalObservable';
import { FileChooser } from '@ionic-native/file-chooser/ngx';
import { FilePath } from '@ionic-native/file-path/ngx';
import { Base64 } from '@ionic-native/base64/ngx';

@Component({
  selector: 'app-room',
  templateUrl: './room.page.html',
  styleUrls: ['./room.page.scss'],
})
export class RoomPage implements OnInit {

  @ViewChild(IonContent, {static: false}) content: IonContent;
  @ViewChild(IonTextarea, {static:false}) messageArea: IonTextarea;
  
  roomData: any;
  message: String = "";
  messages = [];
  currentUser: String = "";
  name: String;
  join: Boolean = false;
  userWriting = [];
  userOn = [];
  aux: Boolean = false;
  users = [];
  powerScroll: Boolean = true;
  onUsersRoom = [];
  unicode = [];
  
  

 
  
  
  constructor(private chatRoom: SocketioServiceService, 
              private dataService: DataService,
              private base64: Base64,
              private filePath: FilePath,
              private fileChooser: FileChooser,) {}

  ngOnInit(){
    this.roomData = this.dataService.getData();
    if(this.join){
      this.chatRoom.unsubs(this.chatRoom.server);
    }else{
      this.join = this.chatRoom.joinServer(this.roomData.name, this.userOn, this.users, this.roomData.room, this.onUsersRoom);
    }
    
    
    this.chatRoom.joinRoom(this.roomData.room);
    this.chatRoom.joined = false;
    this.chatRoom.showMessages(this.messages, this.userWriting, this.powerScroll);

    this.timer().subscribe(()=>{
      if(this.powerScroll){
        this.scrollToBottom();
      }
    })
  
  }



  sendMessageRoom(message){
    this.message = this.chatRoom.sendMessageRoom(this.roomData.room, message, "txt");

    this.messages.push({ 
      msg:message,
      user: this.roomData.name,
      createdAt: new Date()
    });

    this.focusElement(this.messageArea);

    this.powerScroll = true;
  }
    
  showWritingRoom(){
    this.chatRoom.showWritingRoom(this.roomData.room);
  }

  scrollToBottom(){
    this.content.scrollToBottom(800);
  }

  exitRoom(){
    this.chatRoom.leaveRoom(this.roomData.room);
    // this.join = this.chatRoom.exitServer();
    this.dataService.setData("room-list",{});
  };

 

  ionViewWillLeave(){
    // this.chatRoom.ionViewWillLeave();
  }

  timer(){
    return IntervalObservable.create(200);
  }

  pauseScroll(){
    this.powerScroll = false;
  }

  focusElement(element){
    element.setFocus();
  }

  //anexo
  toBase64(){
    
    this.fileChooser.open().then((fileuri)=>{
      this.filePath.resolveNativePath(fileuri).then((nativepath)=>{
        this.base64.encodeFile(nativepath).then((base64string)=>{
          // alert(base64string);
          
          alert(base64string);
          this.chatRoom.sendMessageRoom(this.roomData.room, base64string, "img");
          
        })
      })
    })
    
  }

}

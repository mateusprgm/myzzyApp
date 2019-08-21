import { Component, ViewChild, OnInit } from '@angular/core';
import { DataService } from '../providers/data/data.service';
import { SocketioServiceService } from '../providers/socketio-service/socketio-service.service';
import { IonContent, IonTextarea } from '@ionic/angular';
import { IntervalObservable } from 'rxjs/observable/IntervalObservable';
import { FileChooser } from '@ionic-native/file-chooser/ngx';
import { FilePath } from '@ionic-native/file-path/ngx';
import { Base64 } from '@ionic-native/base64/ngx';
import { Observable } from 'rxjs';

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
  divImage: String = "sourceImage";
  
  

 
  
  
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
    
    
    
    
      
   
    this.renderImage64();
     

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
    console.log("1");
    
      this.fileChooser.open().then((fileuri)=>{
        this.filePath.resolveNativePath(fileuri).then((nativepath)=>{
          this.base64.encodeFile(nativepath).then((base64string)=>{
  
            this.chatRoom.sendMessageRoom(this.roomData.room, base64string, "img");
            this.messages.push({ 
              img:base64string,
              user: this.roomData.name,
              createdAt: new Date()
            });
            var at = new Date();
            var span = document.createElement("span");
            span.setAttribute("id", `${at}`);
            span.style.display = "none";
            let loaded: Boolean = false;


            let timer = this.timer().subscribe(()=>{
              if(loaded == false){
                if(document.getElementById(`source${at}`)){
                  console.log('loaded');
                  loaded = true;
    
                  document.body.appendChild(span);
                  var image = new Image();
                  image.src = base64string;
    
                  document.getElementById(`source${at}`).appendChild(image);
                  timer.unsubscribe();
                }
              }
              
              
            })

         
            
          })
        })
      })

  }

   renderImage64(){

    let count = 0;
    this.chatRoom.socket.fromEvent('message').subscribe(msg=>{
      
      var at = msg['createdAt'];

      if(msg['img']!=undefined){
        var span = document.createElement("span");
        span.setAttribute("id", `${at}`);
        span.style.display = "none";
        let loaded: Boolean = false;

        let timer = this.timer().subscribe(()=>{
          if(loaded == false){
            if(document.getElementById(`source${at}`)){
              console.log('loaded');
              loaded = true;

              document.body.appendChild(span);
              var image = new Image();
              image.src = msg['img'];

              document.getElementById(`source${at}`).appendChild(image);
              timer.unsubscribe();
            }
          }
          
          
        })
        
      }
      
  
    })   
  };
}
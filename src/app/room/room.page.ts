import { Component, ViewChild, OnInit } from '@angular/core';
import { DataService } from '../providers/data/data.service';
import { SocketioServiceService } from '../providers/socketio-service/socketio-service.service';
import { IonContent, IonTextarea } from '@ionic/angular';
import { IntervalObservable } from 'rxjs/observable/IntervalObservable';
import { FileChooser } from '@ionic-native/file-chooser/ngx';
import { FilePath } from '@ionic-native/file-path/ngx';
import { Base64 } from '@ionic-native/base64/ngx';


import { Camera, CameraOptions } from '@ionic-native/camera/ngx';
import { File } from '@ionic-native/file/ngx';
import { PhotoViewer } from '@ionic-native/photo-viewer/ngx';




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
  users = [];
  powerScroll: Boolean = true;
  onUsersRoom = [];
  unicode = [];
  divImage: String = "sourceImage";

  
  
  
  

 
  
  
  constructor(private chatRoom: SocketioServiceService, 
              private dataService: DataService,
              private base64: Base64,
              private filePath: FilePath,
              private fileChooser: FileChooser,
              private camera: Camera, 
              private file: File,
              private photoViewer: PhotoViewer,
              ) { }

  
  

  ngOnInit(){
    
    this.roomData = this.dataService.getData();
    if(this.join){
      this.chatRoom.unsubs(this.chatRoom.server);
      this.renderImage64();
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
    this.content.scrollToBottom(0);
  }

  exitRoom(){
    this.chatRoom.leaveRoom(this.roomData.room);
    // this.join = this.chatRoom.exitServer();
    this.dataService.setData("room-list",{});
  };

 

  ionViewWillLeave(){
    this.chatRoom.leaveRoom(this.roomData.room);
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

          this.chatRoom.sendMessageRoom(this.roomData.room, base64string, "img");
          this.messages.push({ 
            img:base64string,
            user: this.roomData.name,
            createdAt: new Date()
          });
          let at = new Date();
          let span = document.createElement("span");
          span.setAttribute("id", `${at}`);
          span.style.display = "none";
          let loaded: Boolean = false;


          let timer = this.timer().subscribe(()=>{
            if(loaded == false){
              if(document.getElementById(`source${at}`)){
                console.log('loaded');
                loaded = true;

                document.body.appendChild(span);
                let image = new Image();
                image.src = base64string;


                let view = this.photoViewer;
                image.addEventListener("click", () => {
                  view.show(base64string);
                }); 

                document.getElementById(`source${at}`).appendChild(image);
                timer.unsubscribe();
              }
            }
            
            
          })

        
          
        })
      })
    }, (err)=>{
      alert(err);
    })

    }

   renderImage64(){
    try {
      this.chatRoom.auxRender.unsubscribe();
    } catch (error) {
      console.log(error);
    }
    
    this.chatRoom.auxRender =  this.chatRoom.socket.fromEvent('message').subscribe(msg=>{
      
      let at = msg['createdAt'];

      if(msg['img']!=undefined){
        let span = document.createElement("span");
        span.setAttribute("id", `${at}`);
        span.style.display = "none";
        let loaded: Boolean = false;

        let timer = this.timer().subscribe(()=>{
          if(loaded == false){
            if(document.getElementById(`source${at}`)){
              console.log('loaded');
              loaded = true;

              document.body.appendChild(span);
              let image = new Image();
              image.src = msg['img'];

              let nameImg = at+'.png';
              let path = this.file.dataDirectory;
              
              // this.file.writeFile(path, nameImg, msg['img']).then(r=>{
                //this.sto
              // });

              // function storeImage(imageName){
              //   let saveObj = { img:imageName };
              //   this.store
              // }
              
              
              let view = this.photoViewer;
              image.addEventListener("click", () => {
                view.show(msg['img']);
              }); 


              
              document.getElementById(`source${at}`).appendChild(image);
              timer.unsubscribe();
            }
          }
        })
      }
    })   
  };

  goCamera(){
    this.dataService.setData("camera",{});
  }


  takePhoto(){
    const options: CameraOptions = {
      quality: 75,
      destinationType: this.camera.DestinationType.NATIVE_URI,
      encodingType: this.camera.EncodingType.JPEG,
      mediaType: this.camera.MediaType.PICTURE,
    }
    this.camera.getPicture(options).then((imageData) => {
      let filename = imageData.substring(imageData.lastIndexOf('/')+1);
      let path = imageData.substring(0, imageData.lastIndexOf('/')+1);
      this.file.readAsDataURL(path, filename).then((base64data)=>{
        
        this.chatRoom.sendMessageRoom(this.roomData.room, base64data, "img");
          this.messages.push({ 
            img:base64data,
            user: this.roomData.name,
            createdAt: new Date()
          });
          let at = new Date();
          let span = document.createElement("span");
          span.setAttribute("id", `${at}`);
          span.style.display = "none";
          let loaded: Boolean = false;


          let timer = this.timer().subscribe(()=>{
            console.log(loaded);
            if(loaded == false){
              if(document.getElementById(`source${at}`)){
                console.log('loaded');
                loaded = true;

                document.body.appendChild(span);
                let image = new Image();
                image.src = base64data;

                let view = this.photoViewer;

                /*data:image/*;charset=utf-8;base64,....Funciona 
                  data:image/jpeg;base64,....
                */

                image.addEventListener("click", () => {
                  view.show(base64data);
                }); 

                document.getElementById(`source${at}`).appendChild(image);
                timer.unsubscribe();
              }
            }
            
            
          })

        
        
      })
    }, (err)=>{
      alert(err);
    })
  }

  
  //https://upload.wikimedia.org/wikipedia/pt/0/06/Super-Mario-World.jpg



}
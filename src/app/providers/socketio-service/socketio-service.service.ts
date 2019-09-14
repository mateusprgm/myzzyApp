import { Injectable, OnInit } from '@angular/core';
import { NavController, ToastController } from '@ionic/angular';
import { Socket } from 'ng-socket-io';



@Injectable({
  providedIn: 'root'
})
export class SocketioServiceService implements OnInit{

  message: String= "";
  messages = [];
  currentUser: String = "";
 
  join: Boolean = false;
  joined: Boolean = false;
  leave: Boolean = false;
  user: Object = '';
  server;
  aux:any;
  auxRender:any;

  constructor(public navCtrl: NavController, public socket: Socket, private toastCtrl: ToastController){}
  
  ngOnInit() {
  
  }

  sendMessage(message){
    this.socket.emit('send-message', {text: message});
    return "";
  }

  ionViewWillLeave(){
    this.exitServer();
  }

  async showToast(msg){
    
    let toast = await this.toastCtrl.create({
      message:msg,
      position: 'top',
      duration: 1500
    })
    toast.dismiss();
    toast.present();
  }

  showWriting(){
    this.socket.emit('send-message-room', {text: ""});
  }

  joinServer(userName, userOn, users, room, usersOnRoom){
     
      this.socket.connect();

      let name = userName;
      this.currentUser = name;
  
      this.setName(name, room);
      
      this.server = this.socket.fromEvent('users-changed').subscribe(data =>{

        
        
        let user = data['user'];
        let us = data['us'];

        if(data['event'] == 'left'){
          if(data['user']){
            this.showToast(`User left: ${user.name}`);
            users.length = 0;
            userOn.length = 0;
            users.push(data['users']);
            userOn.push(data['count']);
            this.user = data['user'];
            
          }
          
            if(this.user['room'] == room){
              if(!data['exited']){
                usersOnRoom.length = 0;
                usersOnRoom.push(data['onUsersRoom']-1);
                this.showToast(`${us.name} left ${us.room}`);
              }else{
                let aux = []; 
                let count = usersOnRoom[0];
                aux.push(count);
                usersOnRoom.length = 0;
                usersOnRoom.push((aux[0]-1));
                console.log("aqui else");
              }
            }else{
              console.log("nada");
            }
        }else if(data['event'] == 'joined'){
          if(data['user']){
            this.showToast(`User joined: ${user.name}`);
            users.length = 0;
            userOn.length = 0;
            users.push(data['users']);
            userOn.push(data['count']);
            this.user = data['user'];
          }
          if(this.user['room'] == room){
            usersOnRoom.length = 0;
            usersOnRoom.push(data['onUsersRoom']);
          }
        }
      })

    return true;
  }

  unsubs(obs){
    obs.unsubscribe();
  }

  setName(name, room){
    this.socket.emit('set-name', ({name,room}));
  }

  showMessages(messages, nameuser, powerScroll){
    
    let txt:String;  

    if(this.aux != undefined){
      this.aux.unsubscribe();
    }
    
        
    this.aux = this.socket.fromEvent('message').subscribe(message=>{

      console.log('New: ', message);

      messages.push(message);
      powerScroll = true;
      if(message['msg'] != undefined){
        if(message['msg'] == '' && this.currentUser != message['user']){

          nameuser.length = 0;
          txt = message['user'].name+ " está digitando...";
          nameuser.push(txt);
          
        }else{
          nameuser.length = 0;
        }
      }
    })
  }

  

  exitServer(){
    this.socket.disconnect();
    return false;
  };

  

  //Functions for Room Group
  sendMessageRoom(room, message, type){
    this.socket.emit('send-message-room', ({room:room, message:message, type:type}));
    return "";
  }

  joinRoom(room){
    this.socket.emit('join-room', room);
  }

  leaveRoom(room){
    this.socket.emit('leave-room', room);
  }

  showWritingRoom(room){
    this.socket.emit('send-message-room', ({room:room, message:""}));
  }

  

}

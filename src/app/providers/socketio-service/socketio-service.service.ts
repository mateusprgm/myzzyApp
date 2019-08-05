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
      duration: 2000
    })
    toast.present();
  }

  showWriting(){
    this.socket.emit('send-message-room', {text: ""});
  }

  joinServer(userName, userOn){
      let count = 0;
      this.socket.connect();

      let name = userName;
      this.currentUser = name;
  
      this.socket.emit('set-name', name);
  
      this.socket.fromEvent('users-changed').subscribe(data =>{
        console.log(data);
        userOn.length = 0;
        let user = data['user'];
        if(data['event'] == 'left'){
          this.showToast(`User left: ${user}`);
          count--;
          userOn.push(count);
          
        }else{
          this.showToast(`User joined: ${user}`);
          count++;
          userOn.push(count);
        }
      })

    return true;
  }

  showMessages(messages, nameuser){
    let txt:String;
    console.log('11');
    if(!this.joined){
      this.socket.fromEvent('message').subscribe(message=>{
        console.log('New: ', message);
        messages.push(message);
        console.log(messages['user']);
        if(message['msg'] == '' && this.currentUser != message['user']){
          // let timeWriting = setTimeout(()=>{ 
            // alert("Hello"); 
            // clearTimeout(timeWriting);
          // }, 3000);
          
          txt = message['user']+ " está digitando...";
          nameuser.push(txt);
          
        }else{
          nameuser.length = 0;
          
        }console.log(nameuser);
      })
      this.joined = true;
    }
  }

  

  exitServer(){
    this.socket.disconnect();
    return false;
  };


  //Functions for Room Group
  sendMessageRoom(room, message){
    this.socket.emit('send-message-room', ({room:room, message:message}));
    return "";
  }

  joinRoom(room){
    this.socket.emit('join-room', room);
  }

  showWritingRoom(){
    this.socket.emit('send-message-room', ({room:"", message:""}));
  }
}

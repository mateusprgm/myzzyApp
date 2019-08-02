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
  
  ngOnInit() {}

  sendMessage(message){
    this.socket.emit('send-message', {text: message});
    return "";
  }

  ionViewWillLeave(){
    this.exitRoom();
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
    this.socket.emit('send-message', {text: ""});
  }

  joinRoom(userName, userOn){
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
    if(!this.joined){
      this.socket.fromEvent('message').subscribe(message=>{
        console.log('New: ', message);
        messages.push(message);
        // nameuser.push(txt);
        if(message['msg'] == '' && this.currentUser != message['user']){
          txt = message['user']+ " está digitando...";
          nameuser.push(txt);
          
        }else{
          nameuser.length = 0;
          
        }console.log(nameuser);
      })
      this.joined = true;
    }
  }

  exitRoom(){
    this.socket.disconnect();
    return false;
  };
}

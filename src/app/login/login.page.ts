import { Component, OnInit } from '@angular/core';
import { DataService } from '../providers/data/data.service';
import { ToastController } from '@ionic/angular';



@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
})

export class LoginPage implements OnInit {
  name: String;
  tipoXml: Number;
   
  constructor(private dataService: DataService, 
              private toastCtrl: ToastController) { }
              
  

  ngOnInit() {
    // let filePath: string = 'assets/icon/favicon.png';
    // this.base64.encodeFile(filePath).then((base64File: string) => {
    //   console.log(base64File);
    // }, (err) => {
    //   console.log(err);
    // });
 
  }
  

  joinPage(obj){
    if(this.name != '' && this.name != undefined){
      this.dataService.setData("room-list",obj);
      this.showToast("Welcome "+this.name+"!");
    }else{
      this.showToast("The fild is required ");
    }
    
  }
  async showToast(msg){
    let toast = await this.toastCtrl.create({
      message:msg,
      position: 'bottom',
      duration: 2000
    })
    toast.present();
  }
}

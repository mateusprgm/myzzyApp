import { Component, OnInit } from '@angular/core';
import { DataService } from '../providers/data/data.service';
import { Router } from '@angular/router';
import { ToastController } from '@ionic/angular';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
})
export class LoginPage implements OnInit {
  name: String;

  constructor(private dataService: DataService, 
              private router: Router, 
              private toastCtrl: ToastController) { }

  ngOnInit() {
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

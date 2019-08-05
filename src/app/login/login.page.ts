import { Component, OnInit } from '@angular/core';
import { DataService } from '../providers/data/data.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
})
export class LoginPage implements OnInit {
  name: String;
  obj = [
    {
      nome:"mateus",
      idade:"22"
    }
  ] ;
  constructor(private dataService: DataService, private router: Router) { }

  ngOnInit() {
  }

  joinPage(obj){
    this.dataService.setData("room-list",obj);
  }
}

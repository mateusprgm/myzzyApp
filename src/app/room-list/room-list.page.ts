import { Component, OnInit } from '@angular/core';
import { DataService } from '../providers/data/data.service';
import { SocketioServiceService } from '../providers/socketio-service/socketio-service.service';

@Component({
  selector: 'app-room-list',
  templateUrl: './room-list.page.html',
  styleUrls: ['./room-list.page.scss'],
})
export class RoomListPage implements OnInit {

  rooms = [
    {
      name:"sala1"
    }, 
    {
      name:"sala2"
    }, 
    {
      name:"sala3"
    }, 
    {
      name:"sala4"
    }
  ];

  name:String;

  constructor(private dataService: DataService, private chatRoom: SocketioServiceService) { }

  ngOnInit() {
    this.name = this.dataService.getData().toString();
  }

  joinPage(obj){
    let objs: Object = 
      {
        room:obj,
        name:this.name
      };
    
    this.dataService.setData("room",objs);
  }

}

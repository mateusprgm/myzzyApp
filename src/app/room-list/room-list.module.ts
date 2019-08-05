import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';

import { IonicModule } from '@ionic/angular';

import { RoomListPage } from './room-list.page';

import { SocketioServiceService } from '../providers/socketio-service/socketio-service.service';

// https://socket-io-node-myzzy.herokuapp.com/
import { SocketIoModule, SocketIoConfig } from 'ng-socket-io';
const config: SocketIoConfig = { url: 'http://localhost:3001/', options: {} };
const routes: Routes = [
  {
    path: '',
    component: RoomListPage
  }
];

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    SocketIoModule.forRoot(config),
    RouterModule.forChild(routes)
  ],
  declarations: [RoomListPage],
  providers:[SocketioServiceService]
})
export class RoomListPageModule {}

import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';

import { IonicModule } from '@ionic/angular';

import { RoomPage } from './room.page';

import { SocketioServiceService } from '../providers/socketio-service/socketio-service.service';
// https://socket-io-node-myzzy.herokuapp.com/
import { SocketIoModule, SocketIoConfig } from 'ng-socket-io';

import { Base64 } from '@ionic-native/base64/ngx';
import { FilePath } from '@ionic-native/file-path/ngx';
import { FileChooser } from '@ionic-native/file-chooser/ngx';





const config: SocketIoConfig = { url: 'https://socket-io-node-myzzy.herokuapp.com/', options: {} };
const routes: Routes = [
  {
    path: '',
    component: RoomPage
  }
];

import { Camera } from '@ionic-native/camera/ngx';
import { File } from '@ionic-native/file/ngx';
import { PhotoViewer } from '@ionic-native/photo-viewer/ngx';


@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    SocketIoModule.forRoot(config),
    RouterModule.forChild(routes),
  ],
  declarations: [RoomPage],
  providers:[
    File,
    Camera,
    SocketioServiceService,
    Base64,
    FilePath,
    FileChooser,
    PhotoViewer
  ]
})
export class RoomPageModule {}

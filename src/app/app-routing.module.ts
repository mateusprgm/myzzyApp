import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';


const routes: Routes = [
  { path: '', redirectTo: 'login', pathMatch: 'full' },
  { path: 'login', loadChildren: () => import('./login/login.module').then( m => m.LoginPageModule)},
  { path: 'home', loadChildren: './home/home.module#HomePageModule'},
  { path: 'room-list', loadChildren: './room-list/room-list.module#RoomListPageModule' },
  { path: 'room', loadChildren: './room/room.module#RoomPageModule' },
 


  

];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules })
  ],
  exports: [RouterModule]
})
export class AppRoutingModule { }

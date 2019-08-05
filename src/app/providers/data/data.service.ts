import { Injectable } from '@angular/core';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class DataService {

  private data: Array<Object> = [];
 
  constructor(private router: Router) { }
 
  setData(uri,data) {
    this.data[0] = data;
    this.router.navigateByUrl(uri);
  }
 
  getData() {
    return this.data[0];
  }
}

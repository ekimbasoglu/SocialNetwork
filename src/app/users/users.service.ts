import { Injectable } from "@angular/core";
import { HttpClient } from '@angular/common/http';
import { Subject } from 'rxjs';
import { map } from 'rxjs/operators';

@Injectable({providedIn: 'root'})
export class UsersService {

  public users: any = [];
  public currentUser: any=null;

  constructor(private http: HttpClient) {}

  getUsers(){
    this.http.get(
      'http://localhost:3000/user/'
      )
      .subscribe(data => {
        console.log(data);
        this.users = data;
      }, error => {
        console.log(error);
        // this.users();
      });
   }

   getUserInfo(id: string){ // item.id
     this.http.get('http://localhost:3000/user/' + id)
      .subscribe(data => {
        this.currentUser = data;
      }, error => {
        console.log(error);
      });
   }


}

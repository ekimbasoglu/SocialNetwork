import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Subject } from 'rxjs';
import { map } from 'rxjs/operators';
import { Observable } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class UsersService {
  public users: any = [];
  public currentUser: any = null;

  constructor(private http: HttpClient) {}

  getUsers(): Observable<any> {
    return this.http.get('https://nodejs-socialnetwork.herokuapp.com/user/');
    // this.http.get('https://nodejs-socialnetwork.herokuapp.com/user/').subscribe(
    //   (data) => {
    //     console.log(data);
    //     this.users = data;
    //   },
    //   (error) => {
    //     console.log(error);
    //     // this.users();
    //   }
    // );
  }

  getUserInfo(id: string) {
    // item.id
    this.http
      .get('https://nodejs-socialnetwork.herokuapp.com/user/' + id)
      .subscribe(
        (data) => {
          this.currentUser = data;
        },
        (error) => {
          console.log(error);
        }
      );
  }
}

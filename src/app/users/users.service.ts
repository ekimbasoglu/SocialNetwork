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
  }

  getUserInfo(id: string) {
    return this.http.get(
      'https://nodejs-socialnetwork.herokuapp.com/user/' + id
    );
  }
}

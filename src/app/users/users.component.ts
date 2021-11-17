import { Component, OnInit } from '@angular/core';
import { UsersService } from './users.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-users',
  templateUrl: './users.component.html',
  styleUrls: ['./users.component.css'],
})
export class UsersComponent implements OnInit {
  allUsers: any = [];
  constructor(private usersService: UsersService) {}

  ngOnInit(): void {
    // this.usersService.getUsers();

    this.usersService.getUsers().subscribe(
      (res) => {
        this.allUsers = res.results.map((users: any) => {
          return users;
        });
      },
      (err) => console.log(err)
    );
  }

  getUserInfo(userId: string) {
    //(item.id)
    // this.usersService.getUserInfo(userId);
  }
}

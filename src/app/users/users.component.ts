import { Component, OnInit } from '@angular/core';
import { UsersService } from './users.service';
import { Subscription } from "rxjs";

@Component({
  selector: 'app-users',
  templateUrl: './users.component.html',
  styleUrls: ['./users.component.css',
  ]
})
export class UsersComponent implements OnInit {

  constructor(public us:UsersService){
   }


  ngOnInit(): void {
   this.us.getUsers();
  }

  getUserInfo(userId: string){ //(item.id)
    this.us.getUserInfo(userId);
  }

}


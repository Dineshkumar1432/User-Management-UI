import { NgFor } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { UserService } from '../../services/user';

@Component({
  standalone: true,
  selector: 'app-users',
  imports: [NgFor],
  templateUrl: './users.html',
  styleUrls: ['./users.css'],
})
export class Users implements OnInit {
  users: any[] = [];

  constructor(private service: UserService) {}

  ngOnInit() {
    this.service.getUsers().subscribe((res: any) => {
      this.users = res;
    });
  }
}


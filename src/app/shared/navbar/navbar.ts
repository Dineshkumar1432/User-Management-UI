import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { NgIf } from '@angular/common';

@Component({
  standalone: true,
  selector: 'app-navbar',
  imports: [RouterLink, NgIf],
  templateUrl: './navbar.html',
  styleUrls: ['./navbar.css'],
})
export class NavbarComponent {
  getRole() {
    if (typeof window !== 'undefined') {
      return localStorage.getItem('role');
    }
    return null;
  }

  getUserId() {
    if (typeof window !== 'undefined') {
      return Number(localStorage.getItem('userId'));
    }
    return null;
  }

  logout() {
    if (typeof window !== 'undefined') {
      localStorage.clear();
      window.location.href = '/';
    }
  }
}

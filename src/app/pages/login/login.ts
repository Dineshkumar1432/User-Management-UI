import { Component } from '@angular/core';
import { NgIf } from '@angular/common';
import { Router, RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';

import { AuthService } from '../../services/auth';


import { CardModule } from 'primeng/card';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { MessageModule } from 'primeng/message';

@Component({
  standalone: true,
  selector: 'app-login',
  imports: [
    NgIf,
    RouterLink,
    FormsModule,

    // ✅ PrimeNG modules
    CardModule,
    ButtonModule,
    InputTextModule,
    MessageModule
  ],
  templateUrl: './login.html',
  styleUrls: ['./login.css'],
})
export class Login {

  loginData = {
    usernameOrEmail: '',
    password: ''
  };

  loading = false;
  errorMessage: string | null = null;

  constructor(private auth: AuthService, private router: Router) {}

  login() {
    this.errorMessage = null;
    this.loading = true;

    const username = this.loginData.usernameOrEmail.trim();
    const password = this.loginData.password;

    if (!username || !password) {
      this.errorMessage = 'Please enter your username and password.';
      this.loading = false;
      return;
    }

    const payload = { username, password };

    this.auth.login(payload).subscribe({
      next: (res: any) => {

        if (!res?.token || !res?.role || !res?.userId) {
          this.errorMessage = 'Incomplete user data received.';
          return;
        }

        localStorage.setItem('token', res.token);
        localStorage.setItem('role', res.role);
        localStorage.setItem('userId', res.userId);

        this.router.navigate(['/dashboard']);
      },
      error: (err) => {
        const serverMessage = err.error?.message;

        if (serverMessage?.includes('Bad credentials')) {
          this.errorMessage = 'Invalid username or password.';
        } else {
          this.errorMessage = serverMessage || 'Login failed';
        }
      },
      complete: () => {
        this.loading = false;
      }
    });
  }
}
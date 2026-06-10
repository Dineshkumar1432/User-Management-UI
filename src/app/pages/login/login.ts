import { Component } from '@angular/core';
import { NgIf } from '@angular/common';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../services/auth';

@Component({
  standalone: true,
  selector: 'app-login',
  imports: [NgIf, RouterLink],
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

    const payload = {
      username,
      password
    };

    this.auth.login(payload).subscribe({
      next: (res: any) => {
        console.log(res);

        if (!res?.token || !res?.role || !res?.userId) {
          this.errorMessage = 'Login succeeded but the server returned incomplete user data.';
          return;
        }

        localStorage.setItem('token', res.token);
        localStorage.setItem('role', res.role);
        localStorage.setItem('userId', res.userId);

        this.router.navigate(['/dashboard']);
      },
      error: (err) => {
        console.error(err);
        const serverMessage = err.error?.message;
        const statusText = err.statusText ? ` (${err.status} ${err.statusText})` : '';

        if (serverMessage?.includes('Bad credentials')) {
          this.errorMessage = 'Invalid username/email or password.';
        } else if (serverMessage?.includes('toUpperCase') || serverMessage?.includes('getRole()')) {
          this.errorMessage = 'Login failed because your account has no role assigned. Please register again or contact the administrator.';
        } else {
          this.errorMessage = serverMessage
            ? `${serverMessage}${statusText}`
            : err.message || 'Login failed';
        }
      },
      complete: () => {
        this.loading = false;
      }
    });
  }
}

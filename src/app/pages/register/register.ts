import { Component } from '@angular/core';
import { NgIf } from '@angular/common';
import { RouterLink } from '@angular/router';
import { AuthService } from '../../services/auth';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';

@Component({
  standalone: true,
  selector: 'app-register',
  imports: [NgIf, RouterLink, FormsModule],
  templateUrl: './register.html',
  styleUrls: ['./register.css'],
})
export class Register {
  registerData = {
    name: '',
    username: '',
    email: '',
    password: '',
    role: 'USER'
  };

  loading = false;
  successMessage: string | null = null;
  errorMessage: string | null = null;

  constructor(private auth: AuthService, private router: Router) {}

  register() {
    this.errorMessage = null;
    this.successMessage = null;
    this.loading = true;
    this.registerData.role = 'USER';

    this.auth.register(this.registerData).subscribe({
    next: () => {
  this.successMessage = 'Registration successful. Redirecting to login...';

  setTimeout(() => {
    this.router.navigate(['/login']);   //  FIXED
  }, 3000);
},
      error: (err) => {
        console.error(err);
        const serverMessage = err.error?.message;
        const statusText = err.statusText ? ` (${err.status} ${err.statusText})` : '';
        this.errorMessage = serverMessage
          ? `${serverMessage}${statusText}`
          : err.message || 'Registration failed';
      },
      complete: () => {
        this.loading = false;
      }
    });
  }
}

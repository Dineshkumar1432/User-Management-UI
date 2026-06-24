import { Component } from '@angular/core';
import { NgIf } from '@angular/common';
import { RouterLink, Router } from '@angular/router';
import { FormsModule } from '@angular/forms';

import { AuthService } from '../../services/auth';


import { CardModule } from 'primeng/card';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { MessageModule } from 'primeng/message';

@Component({
  standalone: true,
  selector: 'app-register',
  imports: [
    NgIf,
    RouterLink,
    FormsModule,

    CardModule,
    ButtonModule,
    InputTextModule,
    MessageModule
  ],
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
          this.router.navigate(['/login']);
        }, 2000);
      },
      error: (err) => {
        const serverMessage = err.error?.message;
        this.errorMessage = serverMessage || 'Registration failed';
      },
      complete: () => {
        this.loading = false;
      }
    });
  }
}
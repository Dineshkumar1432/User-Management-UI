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

  // NEW: for file upload
  selectedFile!: File;
  previewUrl: any;

  loading = false;
  successMessage: string | null = null;
  errorMessage: string | null = null;

  constructor(private auth: AuthService, private router: Router) {}

  
  onFileSelected(event: any) {
    const file = event.target.files[0];

    if (file) {
      this.selectedFile = file;

      // preview image
      const reader = new FileReader();
      reader.onload = () => {
        this.previewUrl = reader.result;
      };
      reader.readAsDataURL(file);
    }
  }

  //  UPDATED: send FormData instead of JSON
  register() {
    this.errorMessage = null;
    this.successMessage = null;
    this.loading = true;

    const formData = new FormData();

    formData.append('name', this.registerData.name);
    formData.append('username', this.registerData.username);
    formData.append('email', this.registerData.email);
    formData.append('password', this.registerData.password);
    formData.append('role', 'USER');

    if (this.selectedFile) {
      formData.append('file', this.selectedFile);
    }

    this.auth.register(formData).subscribe({
      next: () => {
        this.successMessage = 'Registration successful. Redirecting to login...';

        setTimeout(() => {
          this.router.navigate(['/login']);
        }, 2000);
      },
      error: (err) => {
        const serverMessage = err.error?.message;
        this.errorMessage = serverMessage || 'Registration failed';
        this.loading = false;
      },
      complete: () => {
        this.loading = false;
      }
    });
  }
}
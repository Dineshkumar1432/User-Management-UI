import { CommonModule, isPlatformBrowser } from '@angular/common';
import { Component, OnInit, inject, PLATFORM_ID } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { ChangeDetectorRef } from '@angular/core';

//  PrimeNG Modules
import { CardModule } from 'primeng/card';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { TableModule } from 'primeng/table';
import { TagModule } from 'primeng/tag';
import { DialogModule } from 'primeng/dialog';

import { UserService } from '../../services/user';
import { OrderService } from '../../services/order';

@Component({
  standalone: true,
  selector: 'app-dashboard',
  imports: [
    CommonModule,
    FormsModule,

    CardModule,
    ButtonModule,
    InputTextModule,
    TableModule,
    TagModule,
    DialogModule
  ],
  templateUrl: './dashboard.html',
  styleUrls: ['./dashboard.css'],
})
export class Dashboard implements OnInit {

  platformId = inject(PLATFORM_ID);

  role: string = '';
  userId: number = 0;

  user: any = null;
  users: any[] = [];
  orders: any[] = [];

  selectedUser: any = null;
  selectedOrders: any[] = [];

 
  editingUser: any = {};
  showEditForm = false;

 
  showAdminOrders = false;

  showAddOrderForm = false;
  isAddingOrder = false;

  newOrder = {
    product: '',
    price: 0
  };

  constructor(
    private userService: UserService,
    private orderService: OrderService,
    private router: Router,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit() {

    if (!isPlatformBrowser(this.platformId)) return;

    const token = localStorage.getItem('token');

    if (!token) {
      this.router.navigate(['/login']);
      return;
    }

    this.role = (localStorage.getItem('role') || '').toUpperCase().trim();
    const storedUserId = localStorage.getItem('userId');

    this.userId = storedUserId ? parseInt(storedUserId, 10) : -1;

    if (this.role === 'USER') {
      this.loadUserDetails();
      this.loadUserOrders();
    }

    if (this.role.includes('ADMIN')) {
      this.loadUsers();
    }
  }

  // USER DETAILS
  loadUserDetails() {
    this.userService.getUserById(this.userId).subscribe({
      next: (res) => {
        this.user = { ...res };
        this.cdr.detectChanges();
      }
    });
  }

  //  USER ORDERS
  loadUserOrders() {
    this.orderService.getOrdersByUser(this.userId).subscribe({
      next: (res: any) => {
        this.orders = Array.isArray(res) ? [...res] : [];
        this.cdr.detectChanges();
      }
    });
  }

  // ADMIN USERS
  loadUsers() {
    this.userService.getUsers().subscribe({
      next: (res: any) => {
        this.users = Array.isArray(res) ? [...res] : [];
        this.cdr.detectChanges();
      }
    });
  }

  
  viewOrders(user: any) {
    this.selectedUser = user;
    this.showAdminOrders = true;

    this.orderService.getOrdersByUser(user.id).subscribe({
      next: (res: any) => {
        this.selectedOrders = Array.isArray(res) ? [...res] : [];
      }
    });
  }

  clearOrders() {
    this.selectedUser = null;
    this.selectedOrders = [];
    this.showAdminOrders = false;
  }

  deleteOrderForAdmin(orderId: number) {
    if (!this.selectedUser) return;

    this.orderService.deleteOrder(this.selectedUser.id, orderId).subscribe({
      next: () => this.viewOrders(this.selectedUser)
    });
  }

  //  EDIT PROFILE
  startEditUser() {
    this.editingUser = { ...this.user }; 
    this.showEditForm = true;
  }

  updateUserDetails() {
    this.userService.updateUser(this.userId, this.editingUser).subscribe({
      next: () => {
        this.user = { ...this.editingUser };
        this.showEditForm = false;
      }
    });
  }

  //  ADD ORDER
  startAddOrder() {
    this.showAddOrderForm = true;
    this.newOrder = { product: '', price: 0 };
  }

  addOrder() {
    this.orderService.createOrder(this.userId, this.newOrder).subscribe({
      next: (res) => {
        this.orders = [...this.orders, res];
        this.showAddOrderForm = false;
      }
    });
  }

  // DELETE USER ORDER
  deleteOrder(orderId: number) {
    this.orderService.deleteOrder(this.userId, orderId).subscribe({
      next: () => {
        this.orders = this.orders.filter(o => o.id !== orderId);
      }
    });
  }

  // DELETE USER
  deleteUser(userId: number) {
    this.userService.deleteUser(userId).subscribe({
      next: () => {
        this.users = this.users.filter(u => u.id !== userId);
      }
    });
  }

  //  LOGOUT
  logout() {
    localStorage.clear();
    this.router.navigate(['/login']);
  }
}
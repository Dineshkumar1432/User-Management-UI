import { CommonModule, isPlatformBrowser } from '@angular/common';
import { Component, OnInit, inject, PLATFORM_ID } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';

import { UserService } from '../../services/user';
import { OrderService } from '../../services/order';

@Component({
  standalone: true,
  selector: 'app-dashboard',
  imports: [CommonModule, FormsModule],
  templateUrl: './dashboard.html',
  styleUrls: ['./dashboard.css'],
})
export class Dashboard implements OnInit {

  platformId = inject(PLATFORM_ID);

  role: string = '';
  userId: number = 0;

  user: any = null;              // start as null (prevents NG0100)
  users: any[] = [];
  orders: any[] = [];

  selectedUser: any = null;
  selectedOrders: any[] = [];

  editingUser: any = null;
  showEditForm = false;

  showAddOrderForm = false;
  isAddingOrder = false;

  newOrder = {
    product: '',
    price: 0
  };

  constructor(
    private userService: UserService,
    private orderService: OrderService,
    private router: Router
  ) {}

  // INIT
  ngOnInit() {

    if (!isPlatformBrowser(this.platformId)) return;

    const token = localStorage.getItem('token');

    if (!token) {
      this.router.navigate(['/login']);
      return;
    }

    this.role = (localStorage.getItem('role') || '').toUpperCase().trim();
    this.userId = Number(localStorage.getItem('userId'));

    console.log("ROLE:", this.role);

    if (this.role === 'USER') {
      this.loadUserDetails();
      this.loadUserOrders();
    }

    if (this.role.includes('ADMIN')) {
      this.loadUsers();
    }
  }

  //  USER PROFILE
  loadUserDetails() {
    this.userService.getUserById(this.userId).subscribe({
      next: (res) => {
        this.user = { ...res };   // new reference (important)
      },
      error: (err) => console.error(err)
    });
  }

  //  USER ORDERS
  loadUserOrders() {
    this.orderService.getOrdersByUser(this.userId).subscribe({
      next: (res: any) => {
        this.orders = Array.isArray(res) ? [...res] : [];  //  safe copy
      },
      error: (err) => console.error(err)
    });
  }

  // ADMIN USERS
  loadUsers() {
    this.userService.getUsers().subscribe({
      next: (res: any) => {
        console.log("USERS:", res);
        this.users = Array.isArray(res) ? [...res] : [];
      },
      error: (err) => console.error(err)
    });
  }

  // VIEW USER ORDERS (ADMIN)
  viewOrders(user: any) {
    this.selectedUser = user;

    this.orderService.getOrdersByUser(user.id).subscribe({
      next: (res: any) => {
        this.selectedOrders = Array.isArray(res) ? [...res] : [];
      },
      error: (err) => console.error(err)
    });
  }

  clearOrders() {
    this.selectedUser = null;
    this.selectedOrders = [];
  }

  // DELETE ORDER (ADMIN)
  deleteOrderForAdmin(orderId: number) {
    if (!this.selectedUser) return;

    this.orderService.deleteOrder(this.selectedUser.id, orderId).subscribe({
      next: () => this.viewOrders(this.selectedUser),
      error: (err) => console.error(err)
    });
  }

  //  EDIT PROFILE
  startEditUser() {
    this.editingUser = { ...this.user };
    this.showEditForm = true;
  }

  cancelEditUser() {
    this.editingUser = null;
    this.showEditForm = false;
  }

  updateUserDetails() {
    if (!this.editingUser) return;

    this.userService.updateUser(this.userId, this.editingUser).subscribe({
      next: () => {
        //  instant UI update (no reload issue)
        this.user = { ...this.editingUser };

        this.editingUser = null;
        this.showEditForm = false;

        alert("Profile updated");
      },
      error: (err) => console.error(err)
    });
  }

  // ADD ORDER
  startAddOrder() {
    this.showAddOrderForm = true;
    this.newOrder = { product: '', price: 0 };
  }

  cancelAddOrder() {
    this.showAddOrderForm = false;
  }

  addOrder() {

    if (!this.newOrder.product || this.newOrder.price <= 0) {
      alert("Enter valid details");
      return;
    }

    if (this.isAddingOrder) return;
    this.isAddingOrder = true;

    this.orderService.createOrder(this.userId, this.newOrder).subscribe({
      next: (res: any) => {

        //  instant UI update
        this.orders.push(res);

        this.newOrder = { product: '', price: 0 };
        this.showAddOrderForm = false;

        alert("Order added ");
      },
      error: (err) => console.error(err),
      complete: () => this.isAddingOrder = false
    });
  }

  // DELETE ORDER
  deleteOrder(orderId: number) {
    if (!confirm("Delete this order?")) return;

    this.orderService.deleteOrder(this.userId, orderId).subscribe({
      next: () => {
        this.orders = this.orders.filter(o => o.id !== orderId);
      },
      error: (err) => console.error(err)
    });
  }

  // DELETE USER
  deleteUser(userId: number) {
    this.userService.deleteUser(userId).subscribe({
      next: () => {
        this.users = this.users.filter(u => u.id !== userId);
      },
      error: (err) => console.error(err)
    });
  }

  // LOGOUT
  logout() {
    localStorage.clear();
    this.router.navigate(['/login']);
  }
}
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { Component, OnInit, inject, PLATFORM_ID } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { ChangeDetectorRef } from '@angular/core';

// PrimeNG
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

  isDeletingOrder = false; // NEW FIX

  userImage: any = 'https://cdn-icons-png.flaticon.com/512/149/149071.png';

  newOrder = { product: '', price: 0 };

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
      this.loadUserImage();
    }

    if (this.role.includes('ADMIN')) {
      this.loadUsers();
    }
  }

  // USER DETAILS
  loadUserDetails() {
    this.userService.getUserById(this.userId).subscribe(res => {
      this.user = res;
      this.cdr.detectChanges();
    });
  }

  loadUserImage() {
    this.userService.getUserImage(this.userId).subscribe({
      next: (blob) => {
        if (!blob || blob.size === 0) return;

        const reader = new FileReader();
        reader.onload = () => {
          this.userImage = reader.result;
          this.cdr.detectChanges();
        };
        reader.readAsDataURL(blob);
      }
    });
  }

  // USER ORDERS
  loadUserOrders() {
    this.orderService.getOrdersByUser(this.userId).subscribe(res => {
      this.orders = Array.isArray(res) ? res : [];
      this.cdr.detectChanges();
    });
  }

  // ADMIN USERS
 loadUsers() {
  this.userService.getUsers().subscribe(res => {
    this.users = Array.isArray(res) ? res : [];

   
    this.users.forEach(user => {
      this.userService.getUserImage(user.id).subscribe({
        next: (blob) => {
          if (blob && blob.size > 0) {
            const reader = new FileReader(); //its converts blob to url format
            reader.onload = () => {
              user.imageUrl = reader.result;
              this.cdr.detectChanges();
            };
            reader.readAsDataURL(blob); //
          }
        },
        error: () => {
          user.imageUrl = 'https://cdn-icons-png.flaticon.com/512/149/149071.png';
        }
      });
    });

    this.cdr.detectChanges();
  });
}

  // ADMIN VIEW ORDERS
  viewOrders(user: any) {
    this.selectedUser = user;
    this.showAdminOrders = true;

    this.orderService.getOrdersByUser(user.id).subscribe(res => {
      this.selectedOrders = Array.isArray(res) ? res : [];
      this.cdr.detectChanges();
    });
  }

  deleteOrderForAdmin(orderId: number) {
    if (!this.selectedUser) return;

    this.orderService.deleteOrder(this.selectedUser.id, orderId).subscribe(() => {
      this.selectedOrders = this.selectedOrders.filter(o => o.id !== orderId);
    });
  }

  // EDIT PROFILE
  startEditUser() {
    this.editingUser = { ...this.user };
    this.showEditForm = true;
  }

  updateUserDetails() {
    this.userService.updateUser(this.userId, this.editingUser).subscribe(() => {
      this.user = { ...this.editingUser };
      this.showEditForm = false;
      this.cdr.detectChanges();
    });
  }

  // ADD ORDER
  startAddOrder() {
    this.showAddOrderForm = true;
    this.newOrder = { product: '', price: 0 };
    this.isAddingOrder = false;
  }

addOrder() {
  if (this.isAddingOrder) return;

  this.isAddingOrder = true;

  this.orderService.createOrder(this.userId, this.newOrder).subscribe({
    next: () => {
      this.loadUserOrders();   //  always safe
      this.resetAddDialog();
    },
    error: (err) => {
      console.error(err);
      this.resetAddDialog();
    }
  });
}
get isAddDisabled(): boolean {
  return this.isAddingOrder || !this.newOrder.product || !this.newOrder.price;
}
  // DELETE ORDER (FIXED)
  deleteOrder(orderId: number) {
    if (this.isDeletingOrder) return;

    this.isDeletingOrder = true;

    this.orderService.deleteOrder(this.userId, orderId).subscribe(() => {
      this.orders = this.orders.filter(o => o.id !== orderId);
      this.isDeletingOrder = false;
      this.cdr.detectChanges();
    });
  }

  // DELETE USER
  deleteUser(userId: number) {
    this.userService.deleteUser(userId).subscribe(() => {
      this.users = this.users.filter(u => u.id !== userId);
    });
  }

  onImageError(event: any) {
    event.target.src = 'assets/default-user.png';
  }

resetAddDialog() {
  setTimeout(() => {
    this.showAddOrderForm = false;
    this.isAddingOrder = false;
    this.newOrder = { product: '', price: 0 };
  }, 0);
}

  logout() {
    localStorage.clear();
    this.router.navigate(['/login']);
  }
}
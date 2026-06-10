import { Component, OnInit } from '@angular/core';
import { NgFor } from '@angular/common';
import { Router } from '@angular/router';
import { OrderService } from '../../services/order';

@Component({
  standalone: true,
  selector: 'app-orders',
  imports: [NgFor],
  templateUrl: './orders.html',
  styleUrls: ['./orders.css'],
})
export class Orders implements OnInit {
  orders: any[] = [];

  constructor(private service: OrderService, private router: Router) {}

  ngOnInit(): void {
    this.service.getAllOrders().subscribe((res: any) => {
      this.orders = res;
    });
  }

  addOrder(): void {
    const nextId = this.orders.length ? Math.max(...this.orders.map((o) => o.id || 0)) + 1 : 1;
    this.orders.push({ id: nextId, product: 'New product', price: 0 });
  }

  deleteOrder(orderId: number): void {
    this.orders = this.orders.filter((order) => order.id !== orderId);
  }
}

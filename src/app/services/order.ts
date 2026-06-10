import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../../environment';

@Injectable({ providedIn: 'root' })
export class OrderService {

  constructor(private http: HttpClient) {}
  getAllOrders() {
  return this.http.get(`${environment.apiUrl}/api/orders`);
}

  // GET ORDERS
  getOrdersByUser(userId: number) {
    return this.http.get(`${environment.apiUrl}/api/users/${userId}/orders`);
  }

  // CREATE ORDER
  createOrder(userId: number, order: any) {
    return this.http.post(
      `${environment.apiUrl}/api/users/${userId}/orders`,
      order
    );
  }

  // DELETE ORDER (FIXED )
  deleteOrder(userId: number, orderId: number) {
    return this.http.delete(
      `${environment.apiUrl}/api/users/${userId}/orders/${orderId}`
    );
  }
}
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, BehaviorSubject } from 'rxjs';
import { Order } from '../model/order.model';

@Injectable({
  providedIn: 'root'
})

export class OrderService {

  private baseUrl = 'https://kitchen-system-86e77-default-rtdb.firebaseio.com';
  private ordersSubject = new BehaviorSubject<Order[]>([]);
  public orders$ = this.ordersSubject.asObservable();

  constructor(private http: HttpClient) {}

  loadOrders(): void {
    this.http.get<{ [key: string]: Order }>(`${this.baseUrl}/order.json`).subscribe({
      next: (orders) => {
        const orderList = Object.keys(orders).map(key => ({ id: key, ...orders[key] }));
        this.ordersSubject.next(orderList);
      },
      error: (error) => {
        console.error('Failed to load orders:', error);
      }
    });
  }


  addOrder(order: Order): Observable<any> {
    return this.http.post<any>(`${this.baseUrl}/order.json`, order);
  }


  updateOrder(order:Order,orderId:any):Observable<any>{
    return this.http.put<any>(`${this.baseUrl}/order/${orderId}.json`, order);
  }


  addNewOrder(order: Order): void {
    const currentOrders = this.ordersSubject.value;
    const orderExists = currentOrders.some(existingOrder => existingOrder.id === order.id);
    if (!orderExists) {
      this.ordersSubject.next([...currentOrders, order]);
    }
  }

  updateExistingOrder(updatedOrder: Order): void {
    const currentOrders = this.ordersSubject.value;
    const updatedOrders = currentOrders.map(order =>
      order.id === updatedOrder.id ? updatedOrder : order
    );
    this.ordersSubject.next(updatedOrders);
  }
  
}

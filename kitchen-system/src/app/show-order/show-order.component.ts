import { Component, OnInit, OnDestroy } from '@angular/core';
import { OrderService } from '../services/order.service';
import { UpdateListenerService } from '../services/update-listener-service.service';
import { Subscription } from 'rxjs';
import { Order } from '../model/order.model';
import { CommonModule } from '@angular/common';
import * as CryptoJS from 'crypto-js';
import { Router } from '@angular/router';
import { environment } from '../../environment';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { faClose } from '@fortawesome/free-solid-svg-icons';

@Component({
  selector: 'app-show-order',
  standalone: true,
  imports: [CommonModule,FontAwesomeModule],
  templateUrl: './show-order.component.html',
  styleUrls: ['./show-order.component.css']
})

export class ShowOrderComponent implements OnInit, OnDestroy {

  orders: Order[] = [];
  userId: string | null = null;
  isSidebarVisible = true;
  faClose = faClose;

  private subscriptions: Subscription = new Subscription();

  constructor(
    private orderService: OrderService,
    private updateListenerService: UpdateListenerService,
    private router: Router
  ) {}


  ngOnInit(): void {
    const encryptedUserId = sessionStorage.getItem('userId');
    const SECRET_KEY = environment.SECRET_KEY;

    if (!encryptedUserId) {
      this.router.navigateByUrl('login');
      return;
    }

    this.userId = CryptoJS.AES.decrypt(encryptedUserId, SECRET_KEY).toString(CryptoJS.enc.Utf8);

    if (this.userId) {

      this.orderService.loadOrders();

      this.subscriptions.add(
        this.orderService.orders$.subscribe((orders) => {
          this.orders = this.filterOrders(orders, this.userId);
        })
      );

      this.updateListenerService.listenForOrderUpdates();
    } else {
      this.router.navigateByUrl('login');
    }
  }


  filterOrders(orders: Order[], userId: string | null): Order[] {
    const currentTime = new Date();
    const oneDayAgo = new Date(currentTime.getTime() - 24 * 60 * 60 * 1000);

    return orders
      .filter(order => order.userId === userId) 
      .map(order => {
        const filteredItems = order.orderItems.filter(item => {
          const confirmationTime = new Date(item.confirmationTime);
          return confirmationTime >= oneDayAgo;
        });

        return {
          ...order,
          orderItems: filteredItems
        };
      })
      .filter(order => order.orderItems.length > 0); 
  }



  toggleSidebar() {
    this.isSidebarVisible = !this.isSidebarVisible; 
  }


  ngOnDestroy(): void {
    this.subscriptions.unsubscribe();
  }

}

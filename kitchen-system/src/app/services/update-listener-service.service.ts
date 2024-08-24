import { Injectable } from '@angular/core';
import { OrderService } from './order.service';
import { getDatabase, ref, onChildAdded ,onChildChanged} from 'firebase/database';
import { initializeApp } from 'firebase/app';
import { Order } from '../model/order.model';

@Injectable({
  providedIn: 'root'
})

export class UpdateListenerService {

  private database = getDatabase(initializeApp({
    apiKey: "AIzaSyAp9kDvaRZyZhUWXCrc9orm12rROp8jc30",
    authDomain: "kitchen-system-86e77.firebaseapp.com",
    databaseURL: "https://kitchen-system-86e77-default-rtdb.firebaseio.com",
    projectId: "kitchen-system-86e77",
    storageBucket: "kitchen-system-86e77.appspot.com",
    messagingSenderId: "978394508868",
    appId: "1:978394508868:web:74f1ace2e1202931a65611"
  }));

  constructor(private orderService: OrderService) {}

  listenForOrderUpdates(): void {
    const ordersRef = ref(this.database, 'order');

    onChildAdded(ordersRef, (snapshot) => {
      const newOrder: Order = { id: snapshot.key!, ...snapshot.val() };
      this.orderService.addNewOrder(newOrder);
      console.log('New order added:', newOrder);
    });

    onChildChanged(ordersRef, (snapshot) => {
      const updatedOrder: Order = { id: snapshot.key!, ...snapshot.val() };
      this.orderService.updateExistingOrder(updatedOrder);
      console.log('Order updated:', updatedOrder);
    });
    
  }
}

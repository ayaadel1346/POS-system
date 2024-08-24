import { ChangeDetectorRef, Component, OnDestroy, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { UpdateListenerService } from '../../services/update-listener-service.service';
import { Order } from '../../model/order.model';
import { OrderService } from '../../services/order.service';
import { NavbarComponent } from "../../layouts/navbar/navbar.component";
import { CommonModule } from '@angular/common';
import Swal from 'sweetalert2';
import { LoaderComponent } from "../../layouts/loader/loader.component";


@Component({
  selector: 'app-dashboard-orders',
  standalone: true,
  imports: [NavbarComponent, CommonModule, LoaderComponent],
  templateUrl: './dashboard-orders.component.html',
  styleUrls: ['./dashboard-orders.component.css']
})

export class DashboardOrdersComponent implements OnInit, OnDestroy {

  orders: Order[] = [];
 
  private subscriptions: Subscription = new Subscription();

  constructor(
    private orderService: OrderService,
    private updateListenerService: UpdateListenerService,
    private cdr: ChangeDetectorRef
  ) {}


  ngOnInit(): void {

    this.orderService.loadOrders();

    this.subscriptions.add(
      this.orderService.orders$.subscribe((orders) => {
        this.orders = orders;
        console.log('Orders updated:', this.orders);
        this.cdr.detectChanges(); 
      })
    );

    this.updateListenerService.listenForOrderUpdates();
  }



  formatConfirmationTime(confirmationTime: string): string {
    const date = new Date(confirmationTime);
    return date.toLocaleString(); 
  }


  onStatusChange(event: Event, order: Order, item: any): void {
    const selectElement = event.target as HTMLSelectElement;  
    const newStatus = selectElement.value;

    Swal.fire({
        title: 'Are you sure?',
        text: `Do you want to update the status to ${newStatus}?`,
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
        confirmButtonText: 'Yes, update it!'
    }).then((result) => {
        if (result.isConfirmed) {
          
            const itemToUpdate = order.orderItems.find(itemInOrder => itemInOrder === item);

            if (itemToUpdate) {
                itemToUpdate.status = newStatus;
            }

            const orderId = order.id;

            const orderWithoutId = { ...order };

            delete orderWithoutId.id;


            this.orderService.updateOrder(orderWithoutId,orderId).subscribe({
                next: () => {
                    console.log('Order updated successfully');
                },
                error: (error) => {
                    console.error('Failed to update order:', error);
                }
            });
        }
    });
}


shouldDisplayCard(order: Order): boolean {
  return order.orderItems && order.orderItems.length > 0 && order.orderItems.some(item => item.status !== 'completed');
}

  


  ngOnDestroy(): void {
    this.subscriptions.unsubscribe();
  }
}
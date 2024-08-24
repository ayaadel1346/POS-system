import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms'; 
import { Product } from '../model/product.model';
import { ProductService } from '../services/product.service';
import { Subscription } from 'rxjs';
import { CommonModule } from '@angular/common';
import { TopNavComponent } from "../layouts/top-nav/top-nav.component";
import { SentDataService } from '../services/sent-data.service';
import { OrderService } from '../services/order.service';
import * as CryptoJS from 'crypto-js';
import Swal from 'sweetalert2';
import { FooterComponent } from "../layouts/footer/footer.component";
import { LoaderComponent } from "../layouts/loader/loader.component";
import { Router } from '@angular/router';
import { environment } from '../../environment';

@Component({
  selector: 'app-pos-component',
  standalone: true,
  imports: [CommonModule, FormsModule, TopNavComponent, FooterComponent, LoaderComponent],
  templateUrl: './pos-component.component.html',
  styleUrls: ['./pos-component.component.css']
})
export class POSComponentComponent implements OnInit, OnDestroy {

  private userId: string = '';
  private subscription: Subscription = new Subscription();

  products: Product[] = [];
  filteredProducts: Product[] = []; 
  totalPrice:number=0;
  isLoading: boolean = true; 
  data: string = 'food';
  oldData: string = ''; 
  quantities: { [key: string]: number } = {};
  currentPage: number = 1; 
  productsPerPage: number = 6; 
  totalPages: number = 0; 
  orders: { 
    product: Product, 
    quantity: number, 
    status: string, 
    note?: string,
    confirmationTime?: Date
  }[] = [];


  constructor(
    private productService: ProductService, 
    private dataService: SentDataService, 
    private orderService: OrderService,
    private router:Router,
 
  ) {}


  ngOnInit(): void {
    this.dataService.dataEmitter.subscribe({
      next: (data) => {
        if (this.oldData !== data) {
          this.oldData = data;
          this.currentPage = 1; 
          this.data = data;
          this.filterProducts();
        }
      }
    });

    this.fetchProducts();
  }


  fetchProducts() {
    this.isLoading = true; 
    this.subscription.add(
      this.productService.getProducts().subscribe({
        next: (data) => {
          this.products = Object.keys(data).map(key => ({
            ...data[key], id: key
          }));
          this.filterProducts();
          this.isLoading = false;
        },
        error: (error) => {
          console.error('An error occurred while retrieving data', error);
          this.isLoading = false;
        }
      })
    );
  }



  filterProducts() {
    const filtered = this.products.filter(product => product.category === this.data);
    this.totalPages = Math.ceil(filtered.length / this.productsPerPage);
    this.updatePaginatedProducts(filtered);
  }



  updatePaginatedProducts(products: Product[]) {
    this.filteredProducts = products.slice(
      (this.currentPage - 1) * this.productsPerPage,
      this.currentPage * this.productsPerPage
    );
    this.filteredProducts.forEach(product => {
      if (product.id) {
        this.quantities[product.id] = 1;
      }
    });
  }



  nextPage() {
    if (this.currentPage < this.totalPages) {
      this.currentPage++;
      this.filterProducts(); 
    }
  }


  previousPage() {
    if (this.currentPage > 1) {
      this.currentPage--;
      this.filterProducts(); 
    }
  }


  increaseQuantity(productId: string) {
    if (productId) {
      this.quantities[productId]++;
    }
  }


  decreaseQuantity(productId: string | undefined) {
    if (productId && this.quantities[productId] > 1) {
      this.quantities[productId]--;
    }
  }


  orderNow(productId: string | undefined) {
    if (productId) {
      const product = this.filteredProducts.find(p => p.id === productId);
      if (product) {
        const existingOrder = this.orders.find(o => o.product.id === productId);
        if (existingOrder) {
          existingOrder.quantity += this.quantities[productId];
        } else {
          this.orders.push({
            product: product,
            quantity: this.quantities[productId],
            status: 'pending',
          });
        }
      }
    }
  }



  removeOrder(productId: string | undefined) {
    if (productId) {
      this.orders = this.orders.filter(order => order.product.id !== productId);
    }
  }


  confirmOrder() {
    const SECRET_KEY = environment.SECRET_KEY;
    const encryptedUserId = sessionStorage.getItem('userId');

    if (!encryptedUserId) {
     this.router.navigateByUrl('login');
     return
    }else{
      this.userId = CryptoJS.AES.decrypt(encryptedUserId, SECRET_KEY).toString(CryptoJS.enc.Utf8);
    }

    const orderToSend = {
      userId: this.userId,
      orderItems: this.orders.map(order => ({
          productId: order.product.id,
          productName: order.product.name,
          note: order.note || 'No Available Notes',
          quantity: order.quantity,
          status: 'pending',
          confirmationTime: new Date().toISOString()
      })),
      totalPrice:this.totalPrice
  };

  
    this.orderService.addOrder(orderToSend).subscribe({
      next: () => {
        Swal.fire({
          icon: 'success',
          title: 'Order confirmed',
          text: 'Order under confirmation now'
        });
        this.orders = [];
      },
      error: (error) => {
        Swal.fire({
          icon: 'error',
          title: 'Oops...',
          text: 'An error occurred. Try again later.'
        });
      }
    });
  }




  calculateTotalPrice(): number {
    this.totalPrice= this.orders.reduce((total, order) => total + (order.product.price * order.quantity), 0);
    return this.totalPrice;
  }



  ngOnDestroy(): void {
    if (this.subscription) {
      this.subscription.unsubscribe();
    }
  }

  
}

import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Product } from '../model/product.model';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})

export class ProductService {

 private baseUrl='https://kitchen-system-86e77-default-rtdb.firebaseio.com';
 
  constructor(private http:HttpClient) { }

  getProducts():Observable<Record<string, Product>>{
    return this.http.get<Record<string, Product>>(`${this.baseUrl}/products.json`)
  }


  addProduct(product:Product):Observable<void>{
    return this.http.post<void>(`${this.baseUrl}/products.json`,product)
  }

  

}

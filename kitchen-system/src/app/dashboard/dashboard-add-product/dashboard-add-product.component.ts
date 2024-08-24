import { Component, OnInit } from '@angular/core';
import Swal from 'sweetalert2';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Product } from '../../model/product.model';
import { ProductService } from '../../services/product.service';
import { NavbarComponent } from '../../layouts/navbar/navbar.component';

@Component({
  selector: 'app-dashboard-add-product',
  standalone: true,
  imports: [ReactiveFormsModule, NavbarComponent],
  templateUrl: './dashboard-add-product.component.html',
  styleUrl: './dashboard-add-product.component.css'
})

export class DashboardAddProductComponent implements OnInit {

  dashboardForm!:FormGroup;
 
  constructor(private productService:ProductService){}
  
  
  
  ngOnInit(): void {
    this.dashboardForm=new FormGroup({
      img:new FormControl('',Validators.required),
      name:new FormControl('',Validators.required),
      description: new FormControl('',Validators.required),
      price:new FormControl(0,Validators.required),
      category:new FormControl('',Validators.required)
    })
  }
  
  
  
  onSubmit(): void{
     const formValues=this.dashboardForm.value;

     const product:Product={
      img:formValues.img,
      name:formValues.name,
      description:formValues.description,
      price:formValues.price,
      category:formValues.category
      }
  
    this.productService.addProduct(product).subscribe({

      next:(res)=>{
        localStorage.setItem('update', Date.now().toString());
       Swal.fire({
        icon: 'success',
        title: 'Product Added',
        text: 'The product has been added successfully!',
  
       });
  
       this.dashboardForm.reset();
      },
  
      error:(error)=>{
        Swal.fire({
          icon: 'error',
          title: 'Oops...',
          text: 'Something went wrong while adding the product!',
        });
      }
  
  
    });
     
  }
  
  }
  

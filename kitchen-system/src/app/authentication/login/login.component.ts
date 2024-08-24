import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { AuthenticationService } from '../../services/authentication.service';
import { CommonModule } from '@angular/common';
import { Router, RouterLink } from '@angular/router';
import * as CryptoJS from 'crypto-js';
import Swal from 'sweetalert2';
import { environment } from '../../../environment';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [ReactiveFormsModule,CommonModule ,RouterLink],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})


export class LoginComponent implements OnInit {

  loginForm!:FormGroup;

  constructor(private authService:AuthenticationService ,private router:Router){}

  
  ngOnInit(): void {
    this.loginForm=new FormGroup({
      password:new FormControl('',Validators.required),
      email:new FormControl('',[Validators.required,Validators.email]),
    })
  }
  
  
  onSubmit(): void {
    const formValues = this.loginForm.value;
    const SECRET_KEY = environment.SECRET_KEY;
    const person: any = {
      email: formValues.email,
      password: formValues.password
    }
  
    this.authService.login(person).subscribe({
      next: (res) => {
        this.loginForm.reset();
        const encryptedToken = CryptoJS.AES.encrypt(res.token, SECRET_KEY).toString();
        const encryptedUserId = CryptoJS.AES.encrypt(res.user.id.toString(), SECRET_KEY).toString();
        const encryptedRole = CryptoJS.AES.encrypt(res.user.role.toString(), SECRET_KEY).toString();

        sessionStorage.setItem('token', encryptedToken);
        sessionStorage.setItem('userId', encryptedUserId);
        sessionStorage.setItem('role', encryptedRole);
  
        this.router.navigateByUrl('home');
      },
      error: (error) => {
        console.error('Login error:', error);
        Swal.fire({
          icon: 'error',
          title: 'Oops..',
          text: 'Login failed',
        });
      }
    });
  }
  
  
}

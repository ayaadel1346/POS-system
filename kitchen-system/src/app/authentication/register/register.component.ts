import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Person } from '../../model/person.model';
import { AuthenticationService } from '../../services/authentication.service';
import Swal from 'sweetalert2';
import { CommonModule } from '@angular/common';
import { Router, RouterLink } from '@angular/router';


@Component({
  selector: 'app-register',
  standalone: true,
  imports: [ReactiveFormsModule,CommonModule ,RouterLink],
  templateUrl: './register.component.html',
  styleUrl: './register.component.css'
})

export class RegisterComponent implements OnInit {

registerForm!:FormGroup;

constructor(private authService:AuthenticationService,private router:Router){}

ngOnInit(): void {
  this.registerForm=new FormGroup({
    firstName:new FormControl('',Validators.required),
    lastName:new FormControl('',Validators.required),
    phoneNumber:new FormControl('',Validators.required),
    password:new FormControl('',Validators.required),
    email:new FormControl('',[Validators.required,Validators.email]),
  })
}


onSubmit(): void{
const formValues=this.registerForm.value;

const person:Person={
  firstName:formValues.firstName,
  lastName:formValues.lastName,
  phoneNumber:formValues.phoneNumber,
  email:formValues.email,
  password:formValues.password
}

this.authService.registeration(person).subscribe({
  next:(res)=>{
    
    this.registerForm.reset();

    this.router.navigateByUrl('login');
  },
 error:(error)=>{
  Swal.fire({
    icon: 'error',
    title: 'Oops..',
    text: 'registeration failed',

  });
 }

})

}

}

import { Component } from '@angular/core';
import { NavbarComponent } from "../../layouts/navbar/navbar.component";
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-dashboard-home',
  standalone: true,
  imports: [NavbarComponent,RouterLink],
  templateUrl: './dashboard-home.component.html',
  styleUrl: './dashboard-home.component.css'
})
export class DashboardHomeComponent {

}

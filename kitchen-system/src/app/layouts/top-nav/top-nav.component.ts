import { Component, Output } from '@angular/core';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { SentDataService } from '../../services/sent-data.service';
import { RouterLink } from '@angular/router';
import { environment } from '../../../environment';
import * as CryptoJS from 'crypto-js';

@Component({
  selector: 'app-top-nav',
  standalone: true,
  imports: [NgbModule,RouterLink],
  templateUrl: './top-nav.component.html',
  styleUrl: './top-nav.component.css'
})
export class TopNavComponent {
  
  private SECRET_KEY = environment.SECRET_KEY;
  private encryptedRole = sessionStorage.getItem('role');
  public decryptedRole: string | null = null;

  isCollapsed = true;
  data:string='';
  

  constructor(private emitterService:SentDataService){
    if (this.encryptedRole) {
      this.decryptedRole = CryptoJS.AES.decrypt(this.encryptedRole, this.SECRET_KEY).toString(CryptoJS.enc.Utf8);
    } else {
      this.decryptedRole = null; 
    }
  }
  


  sentDataTo(data:string){
  this.data=data;
  this.emitterService.raiseData(this.data);
  }

  

}

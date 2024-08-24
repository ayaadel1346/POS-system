import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Person } from '../model/person.model';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})

export class AuthenticationService {

private baseUrl='http://localhost:3000'

  constructor(private http:HttpClient) { }


  registeration(data:Person):Observable<void>{
    return this.http.post<void>(`${this.baseUrl}/register`,data);
  }


  login(data:any):Observable<any> {
    return this.http.post<any>(`${this.baseUrl}/login` , data);
  }
  
}

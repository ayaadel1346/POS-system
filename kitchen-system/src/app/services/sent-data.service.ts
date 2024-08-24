import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class SentDataService {

dataEmitter=new Subject<string>;

  constructor() { }

  raiseData(data:string){
    this.dataEmitter.next(data);
  }
}

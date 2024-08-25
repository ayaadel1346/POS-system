import { CommonModule } from '@angular/common';
import { Component, OnDestroy } from '@angular/core';
import { Event, NavigationEnd, Router, RouterOutlet } from '@angular/router';
import { filter, Subscription } from 'rxjs';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, CommonModule],
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})

export class AppComponent implements OnDestroy {
  addClass: boolean = true;
  private routerSubscription: Subscription;

  constructor(private router: Router) {
    this.routerSubscription = this.router.events
      .pipe(
        filter(event => event instanceof NavigationEnd)
      )
      .subscribe((event: Event) => {
        const navEndEvent = event as NavigationEnd;
        this.addClass = !(navEndEvent.urlAfterRedirects.includes('/login') || navEndEvent.urlAfterRedirects.includes('/register'));
      });
  }

  ngOnDestroy() {
    if (this.routerSubscription) {
      this.routerSubscription.unsubscribe();
    }
  }

  
}

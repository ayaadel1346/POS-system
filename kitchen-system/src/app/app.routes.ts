import { Routes } from '@angular/router';
import { RegisterComponent } from './authentication/register/register.component';
import { LoginComponent } from './authentication/login/login.component';
import { POSComponentComponent } from './pos-component/pos-component.component';
import { authGuard } from './auth.guard';


export const routes: Routes = [

    {
        path:'',
        redirectTo:'home',
        pathMatch:'full'
    },

    {
        path:'home',
        component:POSComponentComponent
    },

    {
        path: 'dashboard',
        loadChildren: () =>
          import('../app/dashboard/dashboardRoutes.route').then((m) => m.dashboardRoutes),
        canActivate: [authGuard],
      },

    {
        path:'register',
        component:RegisterComponent
    },
    {
        path:'login',
        component:LoginComponent
    }
    
];

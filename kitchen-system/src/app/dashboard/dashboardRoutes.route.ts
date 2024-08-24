import { Routes } from '@angular/router';
import { DashboardComponent } from './dashboard.component';
import { DashboardAddProductComponent } from './dashboard-add-product/dashboard-add-product.component';
import { DashboardOrdersComponent } from './dashboard-orders/dashboard-orders.component';
import { DashboardHomeComponent } from './dashboard-home/dashboard-home.component';

export const dashboardRoutes: Routes = [
    {
        path: '',
        component: DashboardComponent,
        children: [
            {
                path: '',
                redirectTo: 'dashboardHome',
                pathMatch: 'full'
            },
            {
                path: 'dashboardHome',
                component: DashboardHomeComponent
            },
            {
                path: 'addProduct',
                component: DashboardAddProductComponent
            },
            {
                path: 'showOrders',
                component: DashboardOrdersComponent
            }
        ]
    }
];

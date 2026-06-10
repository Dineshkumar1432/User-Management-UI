import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { Login } from './pages/login/login';
import { Register } from './pages/register/register';
import { Dashboard } from './pages/dashboard/dashboard';
import { Users } from './pages/users/users';
import { Orders } from './pages/orders/orders';
// import { UserOrders } from './pages/user-orders/user-orders';

export const routes: Routes = [
  { path: '', redirectTo: 'login', pathMatch: 'full' },
  
{ path: 'login', component: Login },
  { path: 'register', component: Register },

  { path: 'dashboard', component: Dashboard },

  { path: '**', redirectTo: 'login' },

  { path: 'users', component: Users },
  { path: 'orders', component: Orders },
  // { path: 'user-orders/:id', component: UserOrders }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule {}
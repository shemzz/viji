import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomeComponent } from './pages/home/home.component';
import { ProfileComponent } from './pages/user/profile/profile.component';

const routes: Routes = [
  { path: '', redirectTo: '/home', pathMatch: 'full' },
  { path: 'home', component: HomeComponent },
  { path: 'profile', loadComponent: () => import('./pages/user/profile/profile.component').then(m => m.ProfileComponent) },
  { path: 'create', loadComponent: () => import('./pages/user/create/create.component').then(m => m.CreateComponent) },
  {path: 'transactions', loadComponent: ()=> import('./pages/user/transactions/transactions.component').then(m=>m.TransactionsComponent)},
  { path: 'transaction/:id', loadComponent: () => import('./pages/user/view-transaction/view-transaction.component').then(m => m.ViewTransactionComponent) },
  { path: 'auth/login', loadComponent: () => import('./pages/auth/login/login.component').then(m => m.LoginComponent) },
  {path: 'auth/register', loadComponent: ()=> import('./pages/auth/register/register.component').then(m=>m.RegisterComponent)}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }

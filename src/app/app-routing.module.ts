import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomeComponent } from './pages/home/home.component';

const routes: Routes = [
  { path: '', redirectTo: '/home', pathMatch: 'full' },
  { path: 'home', component: HomeComponent },
  { path: 'profile', loadComponent: () => import('./pages/user/profile/profile.component').then(m => m.ProfileComponent) },
  { path: 'create', loadComponent: () => import('./pages/user/create/create.component').then(m => m.CreateComponent) },
  {path: 'transactions', loadComponent: ()=> import('./pages/user/transactions/transactions.component').then(m=>m.TransactionsComponent)},
  { path: 'transaction/:id', loadComponent: () => import('./pages/user/view-transaction/view-transaction.component').then(m => m.ViewTransactionComponent) },
  { path: 'seller-transaction/:id', loadComponent: () => import('./pages/user/seller-view-transaction/seller-view-transaction.component').then(m => m.SellerViewTransactionComponent) },
  { path: 'transaction/:id/payment/validate', loadComponent: () => import('./pages/validate-payment/validate-payment.component').then(m => m.ValidatePaymentComponent) },
  { path: 'auth/login', loadComponent: () => import('./pages/auth/login/login.component').then(m => m.LoginComponent) },
  { path: 'auth/register', loadComponent: () => import('./pages/auth/register/register.component').then(m => m.RegisterComponent) },
  {path: '**', loadComponent: ()=> import('./pages/not-found/not-found.component').then(m=>m.NotFoundComponent)},
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }

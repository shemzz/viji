import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomeComponent } from './pages/home/home.component';
import { authGuard } from './guards/auth.guard';
import { userTypeGuard } from './guards/usertype.guard';

const routes: Routes = [
  { path: '', redirectTo: '/home', pathMatch: 'full' },
  { path: 'home', component: HomeComponent },
  { path: 'profile', loadComponent: () => import('./pages/user/profile/profile.component').then(m => m.ProfileComponent), canActivate: [authGuard] },
  { path: 'create', loadComponent: () => import('./pages/user/create/create.component').then(m => m.CreateComponent) },
  {path: 'transactions', loadComponent: ()=> import('./pages/user/transactions/transactions.component').then(m=>m.TransactionsComponent), canActivate: [authGuard]},
  { path: 'transaction/:id', loadComponent: () => import('./pages/user/view-transaction/view-transaction.component').then(m => m.ViewTransactionComponent), canActivate: [authGuard, userTypeGuard] },
  { path: 'seller-transaction/:id', loadComponent: () => import('./pages/user/seller-view-transaction/seller-view-transaction.component').then(m => m.SellerViewTransactionComponent), canActivate: [authGuard] },
  { path: 'transaction/:id/payment/validate', loadComponent: () => import('./pages/validate-payment/validate-payment.component').then(m => m.ValidatePaymentComponent), canActivate: [authGuard] },
  { path: 'disputes', loadComponent: () => import('./pages/disputes/disputes.component').then(m => m.DisputesComponent), canActivate: [authGuard] },
  { path: 'dispute/:id', loadComponent: () => import('./pages/dispute-detail/dispute-detail.component').then(m => m.DisputeDetailComponent), canActivate: [authGuard] },
  { path: 'auth/forgot-password', loadComponent: () => import('./pages/auth/forgot-password/forgot-password.component').then(m => m.ForgotPasswordComponent) },
  { path: 'auth/reset-password', loadComponent: () => import('./pages/auth/reset-password/reset-password.component').then(m => m.ResetPasswordComponent) },
  { path: 'auth/login', loadComponent: () => import('./pages/auth/login/login.component').then(m => m.LoginComponent) },
  { path: 'auth/register', loadComponent: () => import('./pages/auth/register/register.component').then(m => m.RegisterComponent) },
  { path: 'auth/verify-email', loadComponent: () => import('./pages/auth/verify-email/verify-email.component').then(m => m.VerifyEmailComponent) },
  { path: 'auth/email-confirmation', loadComponent: () => import('./pages/auth/email-verified/email-verified.component').then(m => m.EmailVerifiedComponent) },
  {path: '**', loadComponent: ()=> import('./pages/not-found/not-found.component').then(m=>m.NotFoundComponent)},
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }

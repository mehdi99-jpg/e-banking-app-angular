import { Routes } from '@angular/router';
import { CustomerListComponent } from './pages/customers/customer-list/customer-list';
import { CustomerFormComponent } from './pages/customers/customer-form/customer-form';
import { AccountListComponent } from './pages/accounts/account-list/account-list';
import { AccountDetailComponent } from './pages/accounts/account-detail/account-detail';
import { DebitCreditComponent } from './pages/transactions/debit-credit/debit-credit';
import { TransferComponent } from './pages/transactions/transfer/transfer';
import { DashboardComponent } from './pages/dashboard/dashboard';
import { LoginComponent } from './pages/login/login';
import { authGuard } from './guards/auth.guard';
import { UnauthorizedComponent } from './pages/unauthorized/unauthorized';

export const routes: Routes = [
  { path: '', redirectTo: 'dashboard', pathMatch: 'full' },
  { path: 'login', component: LoginComponent },
  { path: 'unauthorized', component: UnauthorizedComponent, canActivate: [authGuard] },
  { path: 'dashboard', component: DashboardComponent, canActivate: [authGuard] },
  { path: 'customers', component: CustomerListComponent, canActivate: [authGuard] },
  { path: 'customers/new', component: CustomerFormComponent, canActivate: [authGuard] },
  { path: 'customers/edit/:id', component: CustomerFormComponent, canActivate: [authGuard] },
  { path: 'accounts', component: AccountListComponent, canActivate: [authGuard] },
  { path: 'accounts/:id', component: AccountDetailComponent, canActivate: [authGuard] },
  { path: 'transactions/debit-credit', component: DebitCreditComponent, canActivate: [authGuard] },
  { path: 'transactions/transfer', component: TransferComponent, canActivate: [authGuard] },
  { path: '**', redirectTo: 'dashboard' }
];





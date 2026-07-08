import { Routes } from '@angular/router';
import { CustomerListComponent } from './pages/customers/customer-list/customer-list';
import { CustomerFormComponent } from './pages/customers/customer-form/customer-form';
import { AccountListComponent } from './pages/accounts/account-list/account-list';
import { AccountDetailComponent } from './pages/accounts/account-detail/account-detail';
import { DebitCreditComponent } from './pages/transactions/debit-credit/debit-credit';
import { TransferComponent } from './pages/transactions/transfer/transfer';
import { DashboardComponent } from './pages/dashboard/dashboard';

export const routes: Routes = [
  { path: '', redirectTo: 'dashboard', pathMatch: 'full' },
  { path: 'dashboard', component: DashboardComponent },
  { path: 'customers', component: CustomerListComponent },
  { path: 'customers/new', component: CustomerFormComponent },
  { path: 'customers/edit/:id', component: CustomerFormComponent },
  { path: 'accounts', component: AccountListComponent },
  { path: 'accounts/:id', component: AccountDetailComponent },
  { path: 'transactions/debit-credit', component: DebitCreditComponent },
  { path: 'transactions/transfer', component: TransferComponent },
  { path: '**', redirectTo: 'dashboard' }
];





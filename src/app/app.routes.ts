import { Routes } from '@angular/router';
import { CustomerListComponent } from './pages/customers/customer-list/customer-list';
import { CustomerFormComponent } from './pages/customers/customer-form/customer-form';

export const routes: Routes = [
  { path: '', redirectTo: 'customers', pathMatch: 'full' },
  { path: 'customers', component: CustomerListComponent },
  { path: 'customers/new', component: CustomerFormComponent },
  { path: 'customers/edit/:id', component: CustomerFormComponent }
];


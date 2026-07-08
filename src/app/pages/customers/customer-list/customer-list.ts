import { Component, OnInit, signal, computed } from '@angular/core';
import { RouterLink } from '@angular/router';
import { Customer } from '../../../models/customer.model';
import { CustomerService } from '../../../services/customer.service';
import { ToastService } from '../../../services/toast.service';
import { LoadingSpinner } from '../../../components/loading-spinner/loading-spinner';
import { ConfirmDialog } from '../../../components/confirm-dialog/confirm-dialog';

@Component({
  selector: 'app-customer-list',
  imports: [RouterLink, LoadingSpinner, ConfirmDialog],
  templateUrl: './customer-list.html',
  styleUrl: './customer-list.css'
})
export class CustomerListComponent implements OnInit {
  customers = signal<Customer[]>([]);
  searchQuery = signal<string>('');
  isLoading = signal<boolean>(false);
  
  // Modal state
  isDialogOpen = signal<boolean>(false);
  selectedCustomerId: number | null = null;

  // Computed signal for clientside filtering
  filteredCustomers = computed(() => {
    const query = this.searchQuery().toLowerCase().trim();
    if (!query) return this.customers();
    return this.customers().filter(c => 
      c.name.toLowerCase().includes(query) || 
      c.email.toLowerCase().includes(query)
    );
  });

  constructor(
    private customerService: CustomerService,
    private toastService: ToastService
  ) {}

  ngOnInit(): void {
    this.loadCustomers();
  }

  loadCustomers(): void {
    this.isLoading.set(true);
    this.customerService.getCustomers().subscribe({
      next: (data) => {
        this.customers.set(data);
        this.isLoading.set(false);
      },
      error: (err) => {
        this.toastService.showError('Failed to load customers from backend.');
        this.isLoading.set(false);
      }
    });
  }

  onSearch(event: Event): void {
    const element = event.target as HTMLInputElement;
    this.searchQuery.set(element.value);
  }

  openDeleteDialog(id: number): void {
    this.selectedCustomerId = id;
    this.isDialogOpen.set(true);
  }

  confirmDelete(): void {
    if (this.selectedCustomerId !== null) {
      this.isLoading.set(true);
      this.customerService.deleteCustomer(this.selectedCustomerId).subscribe({
        next: () => {
          this.toastService.showSuccess('Customer deleted successfully!');
          this.loadCustomers();
          this.closeDeleteDialog();
        },
        error: (err) => {
          this.toastService.showError('Failed to delete customer.');
          this.isLoading.set(false);
        }
      });
    }
  }

  closeDeleteDialog(): void {
    this.isDialogOpen.set(false);
    this.selectedCustomerId = null;
  }
}

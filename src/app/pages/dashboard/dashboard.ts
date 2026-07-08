import { Component, OnInit, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { CurrencyPipe, DatePipe } from '@angular/common';
import { forkJoin } from 'rxjs';
import { CustomerService } from '../../services/customer.service';
import { AccountService } from '../../services/account.service';
import { ToastService } from '../../services/toast.service';
import { LoadingSpinner } from '../../components/loading-spinner/loading-spinner';
import { AccountOperation } from '../../models/account-operation.model';
import { BankAccount } from '../../models/bank-account.model';

@Component({
  selector: 'app-dashboard',
  imports: [RouterLink, CurrencyPipe, DatePipe, LoadingSpinner],
  templateUrl: './dashboard.html',
  styleUrl: './dashboard.css'
})
export class DashboardComponent implements OnInit {
  totalCustomers = signal<number>(0);
  totalAccounts = signal<number>(0);
  totalBalance = signal<number>(0);
  recentOperations = signal<AccountOperation[]>([]);
  isLoading = signal<boolean>(false);

  constructor(
    private customerService: CustomerService,
    private accountService: AccountService,
    private toastService: ToastService
  ) {}

  ngOnInit(): void {
    this.loadDashboardData();
  }

  loadDashboardData(): void {
    this.isLoading.set(true);
    
    // Call GET /customers and GET /accounts in parallel
    forkJoin({
      customers: this.customerService.getCustomers(),
      accounts: this.accountService.getAccounts()
    }).subscribe({
      next: (res) => {
        this.totalCustomers.set(res.customers.length);
        this.totalAccounts.set(res.accounts.length);
        
        // Sum all balances across all accounts
        const sum = res.accounts.reduce((accumulator: number, acc: BankAccount) => 
          accumulator + ((acc as any).balance || 0), 0
        );
        this.totalBalance.set(sum);

        // Fetch recent operations for the first 3 accounts to display on dashboard
        const firstAccounts = res.accounts.slice(0, 3);
        if (firstAccounts.length > 0) {
          const opsRequests = firstAccounts.map((acc: BankAccount) => 
            this.accountService.getAccountOperations((acc as any).id)
          );
          
          forkJoin(opsRequests).subscribe({
            next: (opsLists: AccountOperation[][]) => {
              const allOps = opsLists.flat();
              // Sort by date descending
              allOps.sort((a: AccountOperation, b: AccountOperation) => 
                new Date(b.operationDate).getTime() - new Date(a.operationDate).getTime()
              );
              // Take the last 5 operations
              this.recentOperations.set(allOps.slice(0, 5));
              this.isLoading.set(false);
            },
            error: () => {
              // Fail silently for operations list and just stop spinner
              this.isLoading.set(false);
            }
          });
        } else {
          this.isLoading.set(false);
        }
      },
      error: (err) => {
        this.toastService.showError('Failed to load dashboard metrics.');
        this.isLoading.set(false);
      }
    });
  }
}

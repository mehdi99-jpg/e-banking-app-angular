import { Component, OnInit, signal } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { CurrencyPipe, DatePipe } from '@angular/common';
import { BankAccount, CurrentBankAccount, SavingBankAccount } from '../../../models/bank-account.model';
import { AccountHistory } from '../../../models/account-history.model';
import { AccountService } from '../../../services/account.service';
import { ToastService } from '../../../services/toast.service';
import { LoadingSpinner } from '../../../components/loading-spinner/loading-spinner';
import { AuthService } from '../../../services/auth.service';

@Component({
  selector: 'app-account-detail',
  imports: [RouterLink, CurrencyPipe, DatePipe, LoadingSpinner],
  templateUrl: './account-detail.html',
  styleUrl: './account-detail.css'
})
export class AccountDetailComponent implements OnInit {
  account = signal<BankAccount | null>(null);
  history = signal<AccountHistory | null>(null);
  isLoading = signal<boolean>(false);
  accountId: string | null = null;
  
  // Pagination variables
  currentPage = signal<number>(0);
  pageSize = signal<number>(5);

  constructor(
    private route: ActivatedRoute,
    private accountService: AccountService,
    private toastService: ToastService,
    public authService: AuthService
  ) {}

  ngOnInit(): void {
    this.accountId = this.route.snapshot.paramMap.get('id');
    if (this.accountId) {
      this.loadAccountDetails(this.accountId);
      this.loadHistory();
    }
  }

  loadAccountDetails(id: string): void {
    this.isLoading.set(true);
    this.accountService.getAccount(id).subscribe({
      next: (data) => {
        this.account.set(data);
        this.isLoading.set(false);
      },
      error: (err) => {
        this.toastService.showError('Failed to load bank account details.');
        this.isLoading.set(false);
      }
    });
  }

  loadHistory(): void {
    if (!this.accountId) return;
    
    this.isLoading.set(true);
    this.accountService.getAccountHistory(this.accountId, this.currentPage(), this.pageSize()).subscribe({
      next: (data) => {
        this.history.set(data);
        this.isLoading.set(false);
      },
      error: (err) => {
        this.toastService.showError('Failed to load transaction history.');
        this.isLoading.set(false);
      }
    });
  }

  onPageChange(page: number): void {
    if (page < 0 || (this.history() && page >= this.history()!.totalPages)) return;
    this.currentPage.set(page);
    this.loadHistory();
  }

  onPageSizeChange(event: Event): void {
    const element = event.target as HTMLSelectElement;
    this.pageSize.set(Number(element.value));
    this.currentPage.set(0); // Reset to first page
    this.loadHistory();
  }

  // Type guards helpers for polymorphic view templates
  asCurrent(account: BankAccount): CurrentBankAccount {
    return account as CurrentBankAccount;
  }

  asSaving(account: BankAccount): SavingBankAccount {
    return account as SavingBankAccount;
  }
}

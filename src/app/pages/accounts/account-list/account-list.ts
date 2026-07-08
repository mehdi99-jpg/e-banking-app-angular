import { Component, OnInit, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { CurrencyPipe } from '@angular/common';
import { BankAccount, CurrentBankAccount, SavingBankAccount } from '../../../models/bank-account.model';
import { AccountService } from '../../../services/account.service';
import { ToastService } from '../../../services/toast.service';
import { LoadingSpinner } from '../../../components/loading-spinner/loading-spinner';

@Component({
  selector: 'app-account-list',
  imports: [RouterLink, CurrencyPipe, LoadingSpinner],
  templateUrl: './account-list.html',
  styleUrl: './account-list.css'
})
export class AccountListComponent implements OnInit {
  accounts = signal<BankAccount[]>([]);
  isLoading = signal<boolean>(false);

  constructor(
    private accountService: AccountService,
    private toastService: ToastService
  ) {}

  ngOnInit(): void {
    this.loadAccounts();
  }

  loadAccounts(): void {
    this.isLoading.set(true);
    this.accountService.getAccounts().subscribe({
      next: (data) => {
        this.accounts.set(data);
        this.isLoading.set(false);
      },
      error: (err) => {
        this.toastService.showError('Failed to load bank accounts from backend.');
        this.isLoading.set(false);
      }
    });
  }

  // Type-casting helper methods for polymorphic views
  asCurrent(account: BankAccount): CurrentBankAccount {
    return account as CurrentBankAccount;
  }

  asSaving(account: BankAccount): SavingBankAccount {
    return account as SavingBankAccount;
  }
}

import { Component, OnInit, signal } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { CurrencyPipe, DatePipe } from '@angular/common';
import { BankAccount, CurrentBankAccount, SavingBankAccount } from '../../../models/bank-account.model';
import { AccountService } from '../../../services/account.service';
import { ToastService } from '../../../services/toast.service';
import { LoadingSpinner } from '../../../components/loading-spinner/loading-spinner';

@Component({
  selector: 'app-account-detail',
  imports: [RouterLink, CurrencyPipe, DatePipe, LoadingSpinner],
  templateUrl: './account-detail.html',
  styleUrl: './account-detail.css'
})
export class AccountDetailComponent implements OnInit {
  account = signal<BankAccount | null>(null);
  isLoading = signal<boolean>(false);
  accountId: string | null = null;

  constructor(
    private route: ActivatedRoute,
    private accountService: AccountService,
    private toastService: ToastService
  ) {}

  ngOnInit(): void {
    this.accountId = this.route.snapshot.paramMap.get('id');
    if (this.accountId) {
      this.loadAccountDetails(this.accountId);
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

  // Type guards helpers for polymorphic view templates
  asCurrent(account: BankAccount): CurrentBankAccount {
    return account as CurrentBankAccount;
  }

  asSaving(account: BankAccount): SavingBankAccount {
    return account as SavingBankAccount;
  }
}

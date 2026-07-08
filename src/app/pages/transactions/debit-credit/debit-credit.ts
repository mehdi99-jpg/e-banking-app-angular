import { Component, OnInit, signal } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { BankAccount, CurrentBankAccount } from '../../../models/bank-account.model';
import { AccountService } from '../../../services/account.service';
import { ToastService } from '../../../services/toast.service';
import { LoadingSpinner } from '../../../components/loading-spinner/loading-spinner';
import { DebitRequest, CreditRequest } from '../../../models/transaction.model';

@Component({
  selector: 'app-debit-credit',
  imports: [ReactiveFormsModule, RouterLink, LoadingSpinner],
  templateUrl: './debit-credit.html',
  styleUrl: './debit-credit.css'
})
export class DebitCreditComponent implements OnInit {
  transactionForm!: FormGroup;
  accounts = signal<BankAccount[]>([]);
  isLoading = signal<boolean>(false);
  errorMessage = signal<string | null>(null);
  
  // Tab selector state: 'DEBIT' | 'CREDIT'
  operationType = signal<'DEBIT' | 'CREDIT'>('DEBIT');

  constructor(
    private fb: FormBuilder,
    private accountService: AccountService,
    private toastService: ToastService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.initForm();
    this.loadAccounts();
  }

  private initForm(): void {
    this.transactionForm = this.fb.group({
      accountId: ['', [Validators.required]],
      amount: ['', [Validators.required, Validators.min(1)]],
      description: ['', [Validators.required, Validators.minLength(3)]]
    });
  }

  private loadAccounts(): void {
    this.isLoading.set(true);
    this.accountService.getAccounts().subscribe({
      next: (data) => {
        this.accounts.set(data);
        this.isLoading.set(false);
      },
      error: (err) => {
        this.toastService.showError('Failed to load accounts for dropdown.');
        this.isLoading.set(false);
      }
    });
  }

  setOperationType(type: 'DEBIT' | 'CREDIT'): void {
    this.operationType.set(type);
    this.errorMessage.set(null);
  }

  onSubmit(): void {
    if (this.transactionForm.invalid) {
      this.transactionForm.markAllAsTouched();
      return;
    }

    this.isLoading.set(true);
    this.errorMessage.set(null);
    const formValue = this.transactionForm.value;

    if (this.operationType() === 'DEBIT') {
      const request: DebitRequest = { ...formValue };
      this.accountService.debit(request).subscribe({
        next: () => {
          this.toastService.showSuccess('Account debited successfully!');
          this.router.navigate(['/accounts', request.accountId]);
        },
        error: (err) => {
          const msg = err.error?.message || err.error || 'Debit operation failed. Please check the balance.';
          this.errorMessage.set(msg);
          this.toastService.showError('Debit transaction failed.');
          this.isLoading.set(false);
        }
      });
    } else {
      const request: CreditRequest = { ...formValue };
      this.accountService.credit(request).subscribe({
        next: () => {
          this.toastService.showSuccess('Account credited successfully!');
          this.router.navigate(['/accounts', request.accountId]);
        },
        error: (err) => {
          const msg = err.error?.message || err.error || 'Credit operation failed.';
          this.errorMessage.set(msg);
          this.toastService.showError('Credit transaction failed.');
          this.isLoading.set(false);
        }
      });
    }
  }

  // Type cast helper for HTML template
  asCurrent(account: BankAccount): CurrentBankAccount {
    return account as CurrentBankAccount;
  }

  // Helpers for validation errors
  get accountIdControl() { return this.transactionForm.get('accountId'); }
  get amountControl() { return this.transactionForm.get('amount'); }
  get descriptionControl() { return this.transactionForm.get('description'); }
}

import { Component, OnInit, signal } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { BankAccount, CurrentBankAccount } from '../../../models/bank-account.model';
import { AccountService } from '../../../services/account.service';
import { ToastService } from '../../../services/toast.service';
import { LoadingSpinner } from '../../../components/loading-spinner/loading-spinner';
import { TransferRequest } from '../../../models/transaction.model';

@Component({
  selector: 'app-transfer',
  imports: [ReactiveFormsModule, RouterLink, LoadingSpinner],
  templateUrl: './transfer.html',
  styleUrl: './transfer.css'
})
export class TransferComponent implements OnInit {
  transferForm!: FormGroup;
  accounts = signal<BankAccount[]>([]);
  isLoading = signal<boolean>(false);
  errorMessage = signal<string | null>(null);

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
    this.transferForm = this.fb.group({
      accountSource: ['', [Validators.required]],
      accountDestination: ['', [Validators.required]],
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
        this.toastService.showError('Failed to load accounts for transfer.');
        this.isLoading.set(false);
      }
    });
  }

  onSubmit(): void {
    if (this.transferForm.invalid) {
      this.transferForm.markAllAsTouched();
      return;
    }

    this.errorMessage.set(null);
    const formValue = this.transferForm.value;

    if (formValue.accountSource === formValue.accountDestination) {
      this.errorMessage.set('Source and destination accounts must be different.');
      this.toastService.showError('Invalid accounts selection.');
      return;
    }

    this.isLoading.set(true);
    const request: TransferRequest = { ...formValue };

    this.accountService.transfer(request).subscribe({
      next: () => {
        this.toastService.showSuccess('Money transferred successfully!');
        this.router.navigate(['/accounts', request.accountSource]);
      },
      error: (err) => {
        const msg = err.error?.message || err.error || 'Transfer failed. Check if source account has enough balance.';
        this.errorMessage.set(msg);
        this.toastService.showError('Transfer transaction failed.');
        this.isLoading.set(false);
      }
    });
  }

  // Type cast helper for HTML template
  asCurrent(account: BankAccount): CurrentBankAccount {
    return account as CurrentBankAccount;
  }

  // Helpers for validation errors
  get sourceControl() { return this.transferForm.get('accountSource'); }
  get destinationControl() { return this.transferForm.get('accountDestination'); }
  get amountControl() { return this.transferForm.get('amount'); }
  get descriptionControl() { return this.transferForm.get('description'); }
}

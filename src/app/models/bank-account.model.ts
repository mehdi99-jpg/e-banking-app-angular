import { AccountStatus } from './account-status.enum';
import { Customer } from './customer.model';

export interface BankAccount {
  type: string;
}

export interface CurrentBankAccount extends BankAccount {
  id: string;
  balance: number;
  createdAt: Date;
  status: AccountStatus;
  customerDTO: Customer;
  overDraft: number;
}

export interface SavingBankAccount extends BankAccount {
  id: string;
  balance: number;
  createdAt: Date;
  status: AccountStatus;
  customerDTO: Customer;
  interestRate: number;
}

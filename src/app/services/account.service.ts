import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import { BankAccount } from '../models/bank-account.model';
import { AccountOperation } from '../models/account-operation.model';
import { AccountHistory } from '../models/account-history.model';
import { DebitRequest, CreditRequest, TransferRequest } from '../models/transaction.model';

@Injectable({
  providedIn: 'root'
})
export class AccountService {
  private readonly baseUrl = `${environment.apiBaseUrl}/accounts`;

  constructor(private http: HttpClient) {}

  getAccounts(): Observable<BankAccount[]> {
    return this.http.get<BankAccount[]>(this.baseUrl);
  }

  getAccount(id: string): Observable<BankAccount> {
    return this.http.get<BankAccount>(`${this.baseUrl}/${id}`);
  }

  getAccountOperations(id: string): Observable<AccountOperation[]> {
    return this.http.get<AccountOperation[]>(`${this.baseUrl}/${id}/operations`);
  }

  getAccountHistory(id: string, page: number, size: number): Observable<AccountHistory> {
    return this.http.get<AccountHistory>(`${this.baseUrl}/${id}/operation-pages?page=${page}&size=${size}`);
  }

  debit(debitRequest: DebitRequest): Observable<DebitRequest> {
    return this.http.post<DebitRequest>(`${this.baseUrl}/debit`, debitRequest);
  }

  credit(creditRequest: CreditRequest): Observable<CreditRequest> {
    return this.http.post<CreditRequest>(`${this.baseUrl}/credit`, creditRequest);
  }

  transfer(transferRequest: TransferRequest): Observable<void> {
    return this.http.post<void>(`${this.baseUrl}/transfer`, transferRequest);
  }
}

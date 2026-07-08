export interface DebitRequest {
  accountId: string;
  amount: number;
  description: string;
}

export interface CreditRequest {
  accountId: string;
  amount: number;
  description: string;
}

export interface TransferRequest {
  accountSource: string;
  accountDestination: string;
  amount: number;
  description: string;
}

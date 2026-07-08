import { AccountOperation } from './account-operation.model';

export interface AccountHistory {
  accountId: string;
  balance: number;
  currentPage: number;
  totalPages: number;
  pageSize: number;
  accountOperationDTOList: AccountOperation[];
}

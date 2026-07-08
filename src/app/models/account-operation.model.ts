import { OperationType } from './operation-type.enum';

export interface AccountOperation {
  id: number;
  operationDate: Date;
  amount: number;
  type: OperationType;
  description: string;
}

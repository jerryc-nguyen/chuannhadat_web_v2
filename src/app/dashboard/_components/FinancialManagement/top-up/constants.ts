import {
  BANK_ACCOUNT_NAME,
  BANK_ACCOUNT_NUMBER,
  BANK_CODE,
} from '@common/constants';
import { BankTransferData } from './types';

export const getTableData = (bankTransferNote: string): BankTransferData[] => [
  {
    bank_code: BANK_CODE,
    account_owner: BANK_ACCOUNT_NAME,
    account_number: BANK_ACCOUNT_NUMBER,
    branch: 'CN HỒ CHÍ MINH',
    content: bankTransferNote,
  },
];

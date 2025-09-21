export interface BankTransferData {
  bank_code: string;
  account_owner: string;
  account_number: string;
  branch: string;
  content: string;
}

export interface TopUpTableColumn {
  title: string;
  dataIndex: string;
  key: string;
  render?: (value: string) => React.ReactNode;
}

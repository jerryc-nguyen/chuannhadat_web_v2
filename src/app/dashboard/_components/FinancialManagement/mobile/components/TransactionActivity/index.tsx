import React from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@components/ui/card';
import { ITransactionResponse } from '../../types';
import { format, isToday, parseISO, isYesterday } from 'date-fns';
import { vi } from 'date-fns/locale';

const TransactionActivity: React.FC<{
  title: string;
  transactionsData: ITransactionResponse[];
  emptyText: string;
}> = ({ title, transactionsData, emptyText }) => {
  const [transactions, setTransactions] = React.useState<ITransactionResponse[]>([]);

  React.useEffect(() => {
    setTransactions(transactionsData);
  }, [transactionsData]);

  const formatDateLabel = (date: string) => {
    const parsedDate = parseISO(date);
    if (isToday(parsedDate)) {
      return 'Hôm nay';
    } else if (isYesterday(parsedDate)) {
      return 'Hôm qua';
    } else {
      return format(parsedDate, 'dd MMM yyyy', { locale: vi });
    }
  };

  const groupByDate = (transactions: ITransactionResponse[]) => {
    const grouped: { [key: string]: ITransactionResponse[] } = {};

    transactions.forEach((transaction) => {
      const label = formatDateLabel(transaction.created_at);
      if (!grouped[label]) {
        grouped[label] = [];
      }
      grouped[label].push(transaction);
    });

    return grouped;
  };

  const groupedTransactions = groupByDate(transactions);

  // Note descriptions
  const noteDescriptions: string[] = [
    '1 Xu tương đương 1 VNĐ.',
    'Tài khoản chính là số tiền bạn có thể dùng để thanh toán bất kỳ dịch vụ nào.',
    'Tài khoản khuyến mại là số tiền bạn được khuyến mại thêm vào khi nộp tiền, giới thiệu bạn bè hoặc quà tặng. Số tiền này có thể được sử dụng để thanh toán đăng tin, up tin.',
    'Khi thanh toán các dịch vụ, hệ thống sẽ trừ trong tài khoản khuyến mãi trước sau đó đến tài khoản chính.',
    'Số dư cuối cùng = Tài khoản chính + Tài khoản khuyến mãi.',
  ];

  return (
    <div className="mx-auto max-w-md pt-4">
      <Card className="mb-4">
        <CardHeader>
          <CardTitle>{title}</CardTitle>
        </CardHeader>
        <CardContent>
          {/* Transactions Section */}
          {transactions.length === 0 ? (
            <p className="text-center text-gray-500">{emptyText}</p>
          ) : (
            Object.entries(groupedTransactions).map(([dateLabel, transactions], index) => (
              <div key={index}>
                <div className="mb-2 text-gray-500">{dateLabel}</div>
                {transactions.map((transaction, index) => (
                  <div
                    key={index}
                    className="flex items-center justify-between border-b py-3 last:border-none"
                  >
                    <div className="flex items-center">
                      <div className="mr-3 flex-shrink-0">
                        <div className="flex h-8 w-8 items-center justify-center rounded-full bg-gray-200">
                          <span
                            className={`${transaction.code === 1019 ? 'text-green-500' : 'text-blue-500'
                              } text-lg`}
                          >
                            {transaction.formatted_amount[0] !== '+' ? '🚀' : '➕'}
                          </span>
                        </div>
                      </div>
                      <div>
                        <p className="font-semibold text-gray-800">{transaction.account_type}</p>
                        <p className="text-sm text-gray-600">{transaction.description}</p>
                        <p className="text-sm text-gray-500">
                          {format(parseISO(transaction.created_at), 'dd MMM yyyy', { locale: vi })}
                        </p>
                      </div>
                    </div>
                    <p
                      className={`font-semibold ${transaction.formatted_amount[0] === '+' ? 'text-[#28a745]' : 'text-red'}`}
                    >
                      {transaction.formatted_amount}
                    </p>
                  </div>
                ))}
              </div>
            ))
          )}
          {/* Note Section */}
          <div className="mt-6 rounded-lg bg-blue-50 p-4">
            <div className="mb-2 text-lg font-semibold text-blue-900">Ghi chú</div>
            <ul className="list-disc pl-5">
              {noteDescriptions.map((note, index) => (
                <li key={index} className="mb-2 text-sm text-gray-800">
                  {note}
                </li>
              ))}
            </ul>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default React.memo(TransactionActivity);

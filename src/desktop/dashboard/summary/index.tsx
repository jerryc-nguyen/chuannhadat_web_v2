'use client';
import { get } from 'lodash-es';
import { useAccountSummary } from './hooks/useAccountSummary';
import { Card, CardContent, CardHeader, CardTitle } from '@components/ui/card';
import { twMerge } from 'tailwind-merge';

type SummaryDashboardProps = object;

export const SummaryDashboard: React.FC<SummaryDashboardProps> = () => {
  const { data, isLoading } = useAccountSummary();

  return (
    <section>
      <h1 className="mb-4 text-lg font-semibold md:text-xl">Xin chào </h1>
      {!isLoading && (
        <div className="flex flex-col gap-4">
          <div className="flex flex-col gap-4">
            <div className={styles.titleH2}>
              <h2>Tài chính</h2>
            </div>
            <div className={styles.wrapCard}>
              <FigureCard title="Tài khoản chính" content={get(data, 'balances.tk_chinh')} />
              <FigureCard
                title="Tài khoản khuyến mãi"
                content={get(data, 'balances.tk_km')}
                contentClassName="text-yellow-500"
              />
              <FigureCard
                title="Tổng"
                contentClassName="text-green-500"
                content={get(data, 'balances.total')}
              />
            </div>
          </div>
          <div className="flex flex-col gap-4">
            <div className={styles.titleH2}>
              <h2>Tin đăng</h2>
            </div>
            <div className={styles.wrapCard}>
              <FigureCard title="Tin bán" content={get(data, 'posts.sell_count')} />
              <FigureCard
                title="Tin cho thuê"
                content={get(data, 'posts.rent_count')}
                contentClassName="text-green-500"
              />
            </div>
          </div>
          <div className="flex flex-col gap-4">
            <div className={styles.titleH2}>
              <h2>Yêu cầu</h2>
            </div>
            <div className={styles.wrapCard}>
              <FigureCard
                title="Yêu cầu liên hệ lại"
                content={get(data, 'requests.callbacks_count')}
              />
            </div>
          </div>
        </div>
      )}
    </section>
  );
};

const styles = {
  titleH2: 'text-base font-semibold md:text-xl',
  wrapCard: 'flex gap-4 flex-col lg:flex-row',
} as const;

interface FigureCardProps {
  title: React.ReactNode;
  content: React.ReactNode;
  contentClassName?: string;
}

function FigureCard({ title, content, contentClassName }: FigureCardProps) {
  return (
    <Card className="flex-1">
      <CardHeader className="mt-4 p-4 pb-0">
        <CardTitle className="uppercase text-slate-400">{title}</CardTitle>
      </CardHeader>
      <CardContent
        className={twMerge('p-4 text-xl font-bold text-[#007bff]', contentClassName)}
      >
        {content}
      </CardContent>
    </Card>
  );
}

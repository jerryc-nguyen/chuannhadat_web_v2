'use client';
import { get } from 'lodash-es';
import { useAccountSummary } from './hooks/useAccountSummary';
import FigureCard, { CardIcons } from '../components/FigureCard';
import { useAuth } from '@common/auth/AuthContext';
import { CND_TEXT_COLORS } from '@common/constants';

type SummaryDashboardProps = object;

export const SummaryDashboard: React.FC<SummaryDashboardProps> = () => {
  const { data, isLoading } = useAccountSummary();
  const { currentUser } = useAuth();

  return (
    <section className='mx-4'>
      <h1 className="mb-4 text-lg font-semibold md:text-xl">Xin chào {currentUser?.full_name}</h1>
      {!isLoading && (
        <div className="flex flex-col gap-4">
          <div className="flex flex-col gap-4">
            <div className={styles.titleH2}>
              <h2>Tài chính</h2>
            </div>
            <div className={styles.wrapCard}>
              <FigureCard
                title="Số dư"
                contentClassName={CND_TEXT_COLORS.Success}
                content={get(data, 'balances.total')}
                icon={CardIcons.Money}
              />
              <FigureCard
                title="Tài khoản chính"
                content={get(data, 'balances.tk_chinh')}
                icon={CardIcons.Money}
              />

              <FigureCard
                title="Tài khoản khuyến mãi"
                content={get(data, 'balances.tk_km')}
                icon={CardIcons.Money}
              />
            </div>
          </div>
          <div className="flex flex-col gap-4">
            <div className={styles.titleH2}>
              <h2>Tin đăng</h2>
            </div>
            <div className={styles.wrapCard}>
              <FigureCard
                title="Tin bán"
                content={get(data, 'posts.sell_count')}
                icon={CardIcons.Document}
              />
              <FigureCard
                title="Tin cho thuê"
                content={get(data, 'posts.rent_count')}
                icon={CardIcons.Document}
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
                icon={CardIcons.PhoneOutgoing}
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
  wrapCard: 'grid gap-4 md:grid-cols-2 md:gap-8 lg:grid-cols-4 mb-4',
} as const;

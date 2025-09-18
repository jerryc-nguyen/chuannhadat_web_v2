import AutoRefresh from '@dashboard/PostManagement/auto-refresh';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Cập nhật tin tức',
  description: 'Quản lý cập nhật tin tức',
};

const AutoRefeshPage: React.FC = () => {
  return (
    <div className="c-mobileApp mx-4">
      <AutoRefresh />
    </div>
  );
};

export default AutoRefeshPage;

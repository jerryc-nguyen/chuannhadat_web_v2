import { SMS_SUPPORT_NUMBER } from '@common/constants';
import { formatPhoneNumber } from '@common/stringHelpers';

interface TopUpNotesProps {
  bankTransferNote: string;
}

export const TopUpNotes: React.FC<TopUpNotesProps> = ({ bankTransferNote }) => {
  return (
    <div className="note-transfer-bank">
      <label>Lưu ý:</label>
      <ul style={{ listStyleType: 'none', padding: 0 }}>
        <li style={{ margin: '8px 0' }}>
          {' '}
          Nội dung chuyển khoản:{' '}
          <strong style={{ color: 'red' }}>{bankTransferNote}</strong>
        </li>
        <li>Vui lòng ghi đúng nội dung chuyển khoản để hệ thống tự động cập nhật số dư</li>
        <li style={{ margin: '8px 0' }}>
          <p className="my-2">
            Nếu có vấn đề trong khi thanh toán - thường là không nhập đúng nội dung CK, bạn gọi hỗ trợ{' '}
            <b className="text-primary_color">{formatPhoneNumber(SMS_SUPPORT_NUMBER)}</b>
          </p>
        </li>
        <li>
          Vui lòng gọi hỗ trợ để cập nhật thêm tiền nếu quá 5 phút mà chưa thấy thay đổi số dư tài khoản
        </li>
      </ul>
    </div>
  );
};

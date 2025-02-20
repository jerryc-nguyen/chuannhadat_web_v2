import React from 'react';
import DialogReport from '@components/dialog-report';
type NotePostProps = object;

const NotePost: React.FC<NotePostProps> = () => {
  return (
    <div className="important-note">
      <h2 className="pb-2 text-lg font-semibold">Lưu ý : </h2>
      <p className="mb-2 text-xs text-secondary">
        Quý vị đang xem nội dung tin rao{' '}
        <strong>
          &quot;Bán căn nhà đường Võ Oanh, Hẻm xe hơi 5x15,1 Trệt 2 lầu/ 1 tum, nhà kiên cố ở liền, Giá 15ty &quot; - Mã
          tin 250809
        </strong>
        . Mọi thông tin, nội dung liên quan tới tin rao này là do người đăng tin đăng tải và chịu trách nhiệm.
        Chuannhadat.com luôn cố gắng để các thông tin được hữu ích nhất cho quý vị tuy nhiên Chuannhadat.com không đảm
        bảo và không chịu trách nhiệm về bất kỳ thông tin, nội dung nào liên quan tới tin rao này. Trường hợp phát hiện
        nội dung tin đăng không chính xác. Quý vị hãy cung cấp thông tin cho Chuannhadat.com bằng cách gửi{' '}
        <strong>&quot; Phản ánh / Báo xấu &quot; </strong>
        để Ban quản trị kiểm tra lại thông tin bài đăng nhanh và kịp thời nhất.
      </p>
      <DialogReport />
    </div>
  );
};

export default NotePost;

import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@components/ui/tooltip';
import React from 'react';
import { LuAlertTriangle } from 'react-icons/lu';

type NotePostProps = object;

const NotePost: React.FC<NotePostProps> = () => {
  return (
    <div className="important-note">
      <h2 className="pb-2 text-lg font-semibold">Lưu ý : </h2>
      <p className="mb-2 text-xs text-slate-500">
        Quý vị đang xem nội dung tin rao{' '}
        <strong>
          &quot;Bán căn nhà đường Võ Oanh, Hẻm xe hơi 5x15,1 Trệt 2 lầu/ 1 tum, nhà kiên cố ở liền,
          Giá 15ty &quot; - Mã tin 250809
        </strong>
        . Mọi thông tin, nội dung liên quan tới tin rao này là do người đăng tin đăng tải và chịu
        trách nhiệm. Chuannhadat.com luôn cố gắng để các thông tin được hữu ích nhất cho quý vị tuy
        nhiên Chuannhadat.com không đảm bảo và không chịu trách nhiệm về bất kỳ thông tin, nội dung
        nào liên quan tới tin rao này. Trường hợp phát hiện nội dung tin đăng không chính xác. Quý
        vị hãy cung cấp thông tin cho Chuannhadat.com bằng cách gửi{' '}
        <strong>&quot; Phản ánh / Báo xấu &quot; </strong>
        để Ban quản trị kiểm tra lại thông tin bài đăng nhanh và kịp thời nhất.
      </p>
      <TooltipProvider delayDuration={0}>
        <Tooltip>
          <TooltipTrigger className="inline-flex h-9 items-center justify-center whitespace-nowrap rounded-md border border-input bg-background px-4 py-2 text-sm font-medium shadow-sm transition-colors hover:bg-accent hover:text-accent-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50">
            <LuAlertTriangle className="mr-2" />
            Phản ánh/Báo xấu
          </TooltipTrigger>
          <TooltipContent>
            <p className="text-center">
              Báo cáo tin rao có nội
              <br /> dung không đúng
            </p>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
    </div>
  );
};

export default NotePost;

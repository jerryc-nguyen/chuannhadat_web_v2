import { cn } from '@common/utils';
import { Be_Vietnam_Pro } from 'next/font/google';
import React from 'react';
const vietnam = Be_Vietnam_Pro({
  subsets: ['vietnamese'],
  weight: ['400', '700', '600', '500'],
});
const PostingRegulations: React.FC = () => {
  return (
    <section className={cn(vietnam.className, 'py-10 text-lg')}>
      <h1 className="mb-10 text-5xl font-bold">Quy định đăng tin tại website</h1>
      <p>
        Để đảm bảo nội dung tin đăng chuyên nghiệp, dễ đọc và phù hợp với tiêu chí của nền tảng,
        người đăng cần tuân thủ các quy định về cách viết. Các tin đăng phải được trình bày rõ ràng,
        chính xác, tránh gây hiểu nhầm và tuân theo quy chuẩn ngôn ngữ chung.
      </p>
      <p>Dưới đây là các quy định cụ thể:</p>
      <section>
        <h2 className="mb-2 mt-4 text-2xl font-bold">1. Quy định về cách viết tin đăng</h2>
        <ul className="flex flex-col gap-y-2">
          <li>
            - Tin đăng bằng tiếng Việt, có dấu, chữ thường, chỉ viết hoa đầu câu và danh từ riêng,
            đúng chính tả, câu văn mạch lạc, rõ ràng, không chèn các ký tự đặc biệt, không dùng dấu
            gạch dưới ( _ ) để ngắt câu hay đặt ở đầu câu.
          </li>
          <li>
            - Giữa các đoạn văn cách nhau không quá 1 hàng ký tự, không để khoảng trống, không dùng
            dấu chấm dấu phẩy các ký tự đặc biệt liên tiếp tạo thành dòng, không để từ khóa bên dưới
            nội dung mô tả của tin đăng.
          </li>
          <li>
            - Tin đăng không chứa các từ ngữ dung tục, nhạy cảm không phù hợp thuần phong mỹ tục,
            không đăng thông tin hoặc đề cập đến các chính trị gia, người nổi tiếng.
          </li>
        </ul>
      </section>
      <section>
        <h2 className="mb-2 mt-4 text-2xl font-bold">2. Quy định về nội dung tin đăng</h2>
        <ul className="flex flex-col gap-y-2">
          <li>
            - Chỉ được phép đăng tin với mục đích đăng bán/cho thuê bất động sản (BĐS). Không được
            đăng các tin chỉ với mục đích quảng cáo, tiếp thị đơn thuần (nghĩa là không cung cấp bất
            kỳ BĐS cụ thể nào, không thể hiện nhu cầu giao dịch BĐS).
          </li>
          <li>
            - Tin đăng phải đúng phân loại, phân mục và địa chỉ BĐS đăng bán/cho thuê. Mỗi tin đăng
            chỉ được đăng tin bán hoặc tin cho thuê, không đăng đồng thời cả bán và cho thuê.
          </li>
          <li>
            - Tin đăng bán/cho thuê BĐS phải điền đầy đủ các thông tin tại các trường thông tin ở
            giao diện đăng tin theo nội dung tin đăng.
          </li>
          <li>
            <p>Nếu tin đăng thuộc dự án, cần ghi rõ tên dự án BĐS đăng bán/cho thuê.</p>
          </li>
        </ul>
      </section>
      <section>
        <h2 className="mb-2 mt-4 text-2xl font-bold">3. Tin đăng bị trùng</h2>
        <ul className="flex flex-col gap-y-2">
          <li>
            - Một tài sản bất động sản cùng giá, cùng diện tích, đăng lặp lại dù nội dung có khác
            nhau ={'>'} Hạ tin.
          </li>
          <li>
            - Một tài sản bất động sản khác giá, khác diện tích, khác địa chỉ mà đăng trùng nội dung
            ={'>'} Hạ tin.
          </li>
          <li>- Các tài sản bất động sản khác nhau nhưng đăng cùng một hình ảnh ={'>'} Hạ tin.</li>
          <li>- Hình ảnh sai thực tế, để hình người, chân dung... ={'>'} Hạ tin.</li>
        </ul>
      </section>
      <section>
        <h2 className="mb-2 mt-4 text-2xl font-bold">4. Bảo mật thông tin tin đăng</h2>
        <p>
          Quý khách tuyệt đối không sao chép nội dung quảng cáo từ các nhà quảng cáo khác. Trong
          trường hợp ChuanNhaDat.Com nhận được khiếu nại của khách hàng và xác định được tin đăng
          của Quý khách là tin sao chép nội dung, tin đăng của Quý khách có thể bị xóa hoặc chỉnh
          sửa lại nội dung mà không cần thông báo trước.
        </p>
      </section>
    </section>
  );
};

export default PostingRegulations;

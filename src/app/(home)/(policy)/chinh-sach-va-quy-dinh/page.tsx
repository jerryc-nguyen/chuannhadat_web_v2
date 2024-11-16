import { cn } from '@common/utils';
import { Be_Vietnam_Pro } from 'next/font/google';
import React from 'react';
const vietnam = Be_Vietnam_Pro({
  subsets: ['vietnamese'],
  weight: ['400', '700', '600', '500'],
});

const PolicyRegulation: React.FC = () => {
  return (
    <section className={cn(vietnam.className, 'py-10 text-lg')}>
      <h1 className="mb-10 text-5xl font-bold">Chính sách và quy định</h1>
      <p>
        Để đảm bảo nội dung tin đăng chuyên nghiệp, dễ đọc và phù hợp với tiêu chí của nền tảng,
        người đăng cần tuân thủ các quy định về cách viết. Các tin đăng phải được trình bày rõ ràng,
        chính xác, tránh gây hiểu nhầm và tuân theo quy chuẩn ngôn ngữ chung.
      </p>
      <p>Dưới đây là các quy định cụ thể:</p>
      <section className="privary-1">
        <h2 className="mb-2 mt-4 text-2xl font-bold">1. Quy định về việc đăng tin</h2>
        <p>
          Để thuận lợi cho việc duyệt tin của ChuanNhaDat.Com, cũng như để giúp tin đăng của người
          sử dụng được hiển thị trên web trong thời gian sớm nhất, Khách hàng khi đăng tin xin lưu ý
          những điểm sau:
        </p>
        <ul className="flex flex-col gap-y-2">
          <li>
            <p>
              - <strong>Không</strong> đăng một lúc nhiều tin với cùng nội dung giống nhau.
            </p>
          </li>
          <li>
            <p>
              - <strong>Không</strong> đăng tin có nội dung giống tin đang còn hiệu lực trên
              website.
            </p>
          </li>
          <li>
            <p>
              - <strong>Không</strong> bỏ trống phần mô tả. Những tin có phần mô tả bị bỏ trống sẽ
              Không được hiển thị lên website.
            </p>
          </li>
          <li>
            <p>
              - Nhập thông tin chính xác bằng chữ tiếng Việt có dấu, chuẩn Unicode. Những tin không
              dấu sẽ <strong>không</strong> được hiển thị lên website
            </p>
          </li>
          <li>
            <p>- Nên đăng cả ảnh chụp bất động sản lên trang web</p>
          </li>
          <li>
            <p>
              - Điền thông tin càng đầy đủ càng tốt (những tin đăng đầy đủ sẽ được người xem dễ tìm
              kiếm hơn)
            </p>
          </li>
          <li>
            <p>
              - Chúng tôi có toàn quyền không đăng những tin không hợp quy định của pháp luật Việt
              Nam, những tin có dấu hiệu thiếu trung thực làm ảnh hưởng đến uy tín của công ty và
              quyền lợi của Khách hàng mà không cần thông báo trước
            </p>
          </li>
        </ul>
      </section>
      <section className="privary-2">
        <h2 className="mb-2 mt-4 text-2xl font-bold">2. Các hành vi nghiêm cấm</h2>
        <p>
          Dưới đây là một phần danh sách các hành vi bị nghiêm cấm trên và trong quá trình sử dụng
          website ChuanNhaDat.Com:
        </p>
        <ul className="flex flex-col gap-y-2">
          <li>
            - Tham gia vào các hoạt động hoặc gửi lên các Thông tin có thể xâm hại đến những cá
            nhân.
          </li>
          <li>
            - Tham gia vào các hoạt động hoặc gửi lên các Thông tin quấy rối hoặc có hành vi quấy
            phá người khác.
          </li>
          <li>
            - Tham gia vào các hoạt động hoặc gửi lên các Thông tin để lộ mật khẩu, danh tánh hoặc
            thông tin vì những mục đích không có lợi cho người khác.
          </li>
          <li>
            - Tham gia vào các hoạt động liên quan đến việc phát tán “thư rác” hoặc gửi một số lượng
            lớn thư điện tử không được yêu cầu hoặc “spam” các thành viên và người sử dụng khác.
          </li>
          <li>
            - Tham gia vào các hoạt động, gửi lên các Thông tin hay phát tán những tin tức gian lận,
            sai trái, gây hiểu nhầm, hoặc tuyên truyền, tổ chức các hoạt động lăng mạ, đe dọa, khiêu
            dâm, phỉ bảng hoặc bôi nhọ các thành viên khác.
          </li>
          <li>
            - Gửi lên những Thông tin được hiểu là gây kích động cộng đồng trực tuyến, như là các
            nội dung phân biệt chủng tộc, mù quáng, hận thù hoặc bất kì xâm hại hữu hình nào đối với
            bất kì cá nhân hay nhóm nào.
          </li>
          <li>
            - Gửi lên các Thông tin có nội dung khiêu dâm hoặc trực tiếp đề cập đến các vấn đề tình
            dục.
          </li>
          <li>
            - Gửi lên các thông tin cung cấp các tài liệu hướng dẫn về các hành vi bất hợp pháp như
            là mua hay bán các loại thuốc cấm, xâm phạm quyền riêng tư của người khác hoặc cung cấp
            và phát tán virus máy tính.
          </li>
          <li>
            - Sử dụng các mẫu form trên website và (hoặc) các số điện thoại miễn phí để quảng cáo
            hoặc quảng bá các sản phẩm hay dịch vụ đến những người quảng cáo trên ChuanNhaDat.Com
            hoặc gạ gẫm những người quảng cáo trên ChuanNhaDat.Com dưới bất kì hình thức nào.
          </li>
          <li>
            - Sử dụng các loại robot, nhện máy hoặc bất kì thiết bị tự động nào, hoặc tự tay theo
            dõi và thu thập thông tin và các trang hiển thị trên website cho bất kì mục đích tái sử
            dụng mà không được sự cho phép bằng văn bản của chúng tôi.
          </li>
          <li>
            - Sử dụng bất kì thiết bị, phần mềm hay tiến trình nào nhằm xâm phạm hoặc cố ý xâm phạm
            đến hoạt động của website.
          </li>
          <li>
            - Dịch mã ngược, tái cấu trúc, tách rời hoặc bất kì động cơ nào nhằm mục đích chiếm đoạt
            mã nguồn Phần Mềm.
          </li>
          <li>
            - Thực hiện bất kì hành vi nào có biểu hiện không rõ ràng hoặc ít nhiều ảnh hưởng đến cơ
            sở hạ tầng phần mềm cũng như phần cứng của ChuanNhaDat.Com.
          </li>
          <li>
            - Tham gia vào hoạt động thương mại hoặc kinh doanh mà không có sự ưng thuận của chúng
            tôi, như là các cuộc thi, cá cược, đổi chác, quảng cáo hoặc kinh doanh đa cấp.
          </li>
        </ul>
      </section>
      <section className="privary-3">
        <h2 className="mb-2 mt-4 text-2xl font-bold">3. Quyền hạn của ChuanNhaDat</h2>
        <ul className="flex flex-col gap-y-2">
          <li>
            - ChuanNhaDat.Comcó toàn quyền thay đổi một hay nhiều điều khoản có trong quy định này
            mà không cần giải thích lý do và cũng không cần phải thông báo trước..
          </li>
          <li>- ChuanNhaDat.Com không hỗ trợ việc quy đổi từ xu thành tiền (vnđ).</li>
          <li>
            - ChuanNhaDat.Com giữ quyền quyết định về việc lưu giữ hay loại bỏ tin đã đăng trên
            trang web này mà không cần báo trước.
          </li>
          <li>
            - ChuanNhaDat.Com sẽ toàn quyền loại bỏ các tin đăng rao vặt của khách hàng nếu như tin
            đăng rao vặt vi phạm quy chế đăng tin.
          </li>
          <li>
            - Các tin đăng không phù hợp với chuyên mục quy định sẽ bị xóa hoặc ChuanNhaDat.Com
            chuyển sang chuyên mục khác cho là hợp lý.
          </li>
          <li>
            - ChuanNhaDat.Com không giải quyết các tranh chấp giữa khách hàng , cũng như không giải
            quyết bất cứ khiếu nại nào của khách hàng về tin đăng.
          </li>
        </ul>
      </section>
      <section className="privary-4">
        <h2 className="mb-2 mt-4 text-2xl font-bold">
          4. Đối với ứng dụng di động của ChuanNhaDat trên điện thoại cần những quyền sau
        </h2>
        <ul className="flex flex-col gap-y-2">
          <li>
            - Quyền truy cập CAMERA để giúp khách hàng có thể chụp ảnh bất động sản đăng lên nhanh
            chóng dễ dàng hơn.
          </li>
          <li>
            - Quyền truy cập thông báo NOTIFICATION để thông báo cho khách hàng có nhu cầu về bất
            động sản liên quan.
          </li>
          <li>- Quyền truy cập vị trí LOCATION để giúp khách hàng tìm kiếm bất động sản ở gần.</li>
        </ul>
      </section>
      <section className="privary-5">
        <h2 className="mb-2 mt-4 text-2xl font-bold">
          4. Cung cấp thông tin của bạn cho bên thứ ba
        </h2>
        <ul className="flex flex-col gap-y-2">
          <li>
            - Khi được khách hàng đồng ý, ChuanNhaDat có thể cung cấp số điện thoại, email của khách
            hàng cho bên thứ ba.
          </li>
          <li>
            - ChuanNhaDat cam kết chỉ sử dụng thông tin vào mục đích giúp người mua, người bán tìm
            kiếm bất động sản phù hợp.
          </li>
          <li>
            - ChuanNhaDat sẽ không giải quyết khiếu nại khi khách hàng đã đồng ý với chính sách của
            ChuanNhaDat.
          </li>
        </ul>
      </section>
      <section className="privary-6">
        <h2 className="mb-2 mt-4 text-2xl font-bold">
          4. Cung cấp thông tin của bạn cho bên thứ ba
        </h2>
        <ul className="flex flex-col gap-y-2">
          <li>
            - Chúng tôi khẳng định, việc đăng tải nội dung, chia sẻ các thông tin trên ChuanNhaDat
            hoàn toàn xuất phát từ ý chí và quan điểm cá nhân của người sử dụng.
          </li>
          <li>
            - Chuẩn Nhà Đất không đăng bất kì tin BĐS nào vì thế không chịu trách nhiệm với bất cứ
            thông tin không đúng hoặc không chính xác nào trong các tin BĐS được đăng.
          </li>
          <li>
            - Chúng tôi tạo môi trường cho Người sử dụng giao lưu, chia sẻ thông tin mà không tham
            gia vào quá trình đăng tải thông tin của Người sử dụng cũng như không chịu trách nhiệm
            với bất cứ thông tin không đúng hoặc không chính xác nào trong các nội dung được đăng
            tải bởi Người sử dụng.
          </li>
          <li>
            - Chúng tôi cố gắng tạo ra một cơ chế chia sẻ thân thiện và hữu ích cho tất cả cộng
            đồng.Vì thế, hãy chắc chắn rằng Người sử dụng đã đọc, hiểu, đồng ý, chấp nhận các quy
            định của chúng tôi trước khi sử dụng bất kỳ dịch vụ nào trên ChuanNhaDat.
          </li>
        </ul>
      </section>
    </section>
  );
};

export default PolicyRegulation;

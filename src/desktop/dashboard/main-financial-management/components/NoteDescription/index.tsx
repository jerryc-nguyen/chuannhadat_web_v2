import React from "react";

const noteDescriptions: string[] = [
  '1 Xu tương đương 1 VNĐ.',
  'Tài khoản chính là số tiền bạn có thể dùng để thanh toán bất kỳ dịch vụ nào.',
  'Tài khoản khuyến mại là số tiền bạn được khuyến mại thêm vào khi nộp tiền, giới thiệu bạn bè hoặc quà tặng. Số tiền này có thể được sử dụng để thanh toán đăng tin, up tin.',
  'Khi thanh toán các dịch vụ, hệ thống sẽ trừ trong tài khoản khuyến mãi trước sau đó đến tài khoản chính.',
  'Số dư cuối cùng = Tài khoản chính + Tài khoản khuyến mãi.',
];

const NoteDescriptions = () => (
  <div className="c-note__description">
    <label>Ghi chú:</label>
    <ul className="list-disc list-inside ml-6">
      {noteDescriptions.map((note, index) => (
        <li key={index}>{note}</li>
      ))}
    </ul>
  </div>
);

export default NoteDescriptions;

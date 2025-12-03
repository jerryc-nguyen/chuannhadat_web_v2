// Centralized policy constants for chip visibility and conditional logic

// Category types that should hide the Project chip
export const categoryTypesWithoutProjects = [
  'nha_rieng',           // Nhà riêng
  'nha_mat_pho',         // Nhà mặt phố
  'trang_trai_khu_nghi_duong', // Trang trại/ Khu nghỉ dưỡng
  'nha_tro_phong_tro',   // Nhà trọ/ Phòng trọ
  'van_phong',           // Văn phòng
  'cua_hang_kiot',       // Cửa hàng/ Ki-ốt
  'bat_dong_san_khac',   // Bất động sản khác
];

// Category types that should hide the Rooms chip
export const categoryTypesWithoutRooms = [
  'dat', // Đất
];

import cities from "src/configs/locations/cities.json";
import citiesDistricts from "src/configs/locations/cities_districts.json";
import districtsStreets from "src/configs/locations/districts_streets.json";
import districtsWards from "src/configs/locations/districts_wards.json";
import districtsProjects from "src/configs/locations/districts_projects.json";

export const defaultMapCenter = {
  lat: 35.8799866,
  lng: 76.5048004
}

export const defaultMapZoom = 18

export const defaultMapOptions = {
  zoomControl: true,
  tilt: 0,
  gestureHandling: "auto",
  mapTypeId: "satellite",
};

export const businessTypeOptions = [
  { value: "sell", text: "Bán" },
  { value: "rent", text: "Cho thuê" },
]

export const categoryTypeOptions = [
  { value: "can_ho_chung_cu", text: "Căn hộ chung cư" },
  { value: "nha_rieng", text: "Nhà riêng" },
  { value: "biet_thu_lien_ke", text: "Biệt thự liền kề" },
  { value: "nha_mat_pho", text: "Nhà mặt phố" },
  { value: "dat_nen_du_an", text: "Đất nền dự án" },
  { value: "dat", text: "Đất" },
  { value: "trang_trai_khu_nghi_duong", text: "Trang trại/ Khu nghỉ dưỡng" },
  { value: "kho_nha_xuong", text: "Kho/ Nhà xưởng" },
  { value: "nha_tro_phong_tro", text: "Nhà trọ/ Phòng trọ" },
  { value: "van_phong", text: "Văn phòng" },
  { value: "cua_hang_kiot", text: "Cửa hàng/ Ki-ốt" },
  { value: "bat_dong_san_khac", text: "Bất động sản khác" },
]

export const phapLyTypeOptions = [
  { value: "sohong_sodo", text: "Sổ hồng/ Sổ đỏ" },
  { value: "hop_dong_mua_ban", text: "Hợp đồng mua bán" },
  { value: "giay_to_chung_minh_nguon_goc", text: "Giấy tờ chứng minh nguồn gốc" },
  { value: "giay_viet_tay", text: "Giấy viết tay" },
]

export const directionOptions = [
  { value: "west", text: "Hướng Tây" },
  { value: "west_south", text: "Hướng Tây Nam" },
  { value: "west_north", text: "Hướng Tây Bắc" },
  { value: "east", text: "Hướng Đông" },
  { value: "east_south", text: "Hướng Đông Nam" },
  { value: "east_north", text: "Hướng Đông Bắc" },
  { value: "south", text: "Hướng Nam" },
  { value: "north", text: "Hướng Bắc" }
]

export const furnitureTypeOptions = [
  { value: "full_furniture", text: "Nội thất đầy đủ" },
  { value: "basic_furniture", text: "Hoàn thiện cơ bản" },
  { value: "unfinished_furniture", text: "Bàn giao thô" }
]

type LocationData = {
  value: number;
  text: string;
};

type Cities = LocationData[];

type CitiesDistricts = {
  [key: string]: LocationData[];
};

type DistrictsStreets = {
  [key: string]: {
    id?: number;
    value?: number;
    text: string;
  }[];
};

type DistrictsWards = {
  [key: string]: {
    id?: number;
    value?: number;
    text: string;
  }[];
};

type DistrictsProjects = {
  [key: string]: LocationData[];
};

export const citiesData = cities as Cities;
export const cityDistrictsData = citiesDistricts as CitiesDistricts;
export const districtsStreetsData = districtsStreets as DistrictsStreets;
export const districtsWardsData = districtsWards as DistrictsWards;
export const districtsProjectsData = districtsProjects as DistrictsProjects;

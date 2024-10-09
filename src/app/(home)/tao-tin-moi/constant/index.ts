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
    {value: "sell", label: "Bán"},
    {value: "rent", label: "Cho thuê"},
]

export const categoryTypeOptions = [
    {value: "can_ho_chung_cu", label: "Căn hộ chung cư"},
    {value: "nha_rieng", label: "Nhà riêng"},
    {value: "biet_thu_lien_ke", label: "Biệt thự liền kề"},
    {value: "nha_mat_pho", label: "Nhà mặt phố"},
    {value: "dat_nen_du_an", label: "Đất nền dự án"},
    {value: "dat", label: "Đất"},
    {value: "trang_trai_khu_nghi_duong", label: "Trang trại/ Khu nghỉ dưỡng"},
    {value: "kho_nha_xuong", label: "Kho/ Nhà xưởng"},
    {value: "nha_tro_phong_tro", label: "Nhà trọ/ Phòng trọ"},
    {value: "van_phong", label: "Văn phòng"},
    {value: "cua_hang_kiot", label: "Cửa hàng/ Ki-ốt"},
    {value: "bat_dong_san_khac", label: "Bất động sản khác"},
]

export const phapLyTypeOptions = [
    {value: "sohong_sodo", label: "Sổ hồng/ Sổ đỏ"},
    {value: "hop_dong_mua_ban", label: "Hợp đồng mua bán"},
    {value: "giay_to_chung_minh_nguon_goc", label: "Giấy tờ chứng minh nguồn gốc"},
    {value: "giay_viet_tay", label: "Giấy viết tay"},
]

export const viewDirectionTypeOptions = [
    {value: "west", label: "Hướng Tây"},
    {value: "west_south", label: "Hướng Tây Nam"},
    {value: "west_north", label: "Hướng Tây Bắc"},
    {value: "east", label: "Hướng Đông"},
    {value: "east_south", label: "Hướng Đông Nam"},
    {value: "east_north", label: "Hướng Đông Bắc"},
    {value: "south", label: "Hướng Nam"},
    {value: "north", label: "Hướng Bắc"}
]

export const furnitureTypeOptions = [
    {value: "full_furniture", label: "Nội thất đầy đủ"},
    {value: "basic_furniture", label: "Hoàn thiện cơ bản"},
    {value: "unfinished_furniture", label: "Bàn giao thô"}
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
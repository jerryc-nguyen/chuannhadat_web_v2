'use client';
import DynamicMap from './components/DynamicMap';
import MapControlsDesktop from './components/MapControls/MapControlsDesktop';
import ProfessionalMarker from './components/ProfessionalMarker';
import ProfessionalInfoPanel from './components/ProfessionalInfoPanel';
import { useMapDesktopHook } from './hooks/useMapDesktopHook';
import { Professional } from './types';

// Sample professional data
const sampleProfessionals: Professional[] = [
  {
    id: '1',
    name: 'Nguyễn Văn Minh',
    type: 'broker',
    location: { lat: 10.8231, lng: 106.6297 },
    company: 'Savills Việt Nam',
    specialty: ['Căn hộ cao cấp', 'BĐS thương mại'],
    experience: 8,
    rating: 4.8,
    reviewCount: 127,
    phone: '+84 912 345 678',
    email: 'minh.nguyen@savills.vn',
    address: 'Quận 1, TP.HCM',
    description: 'Chuyên viên môi giới với 8 năm kinh nghiệm trong lĩnh vực BĐS cao cấp. Chuyên tư vấn mua bán căn hộ và văn phòng cho thuê.',
    services: ['Tư vấn mua bán', 'Định giá BĐS', 'Hỗ trợ pháp lý'],
    languages: ['Tiếng Việt', 'Tiếng Anh'],
    certifications: ['Chứng chỉ môi giới BĐS', 'CFA Level 1'],
    verified: true,
  },
  {
    id: '2',
    name: 'Trần Thị Lan',
    type: 'broker',
    location: { lat: 10.8331, lng: 106.6397 },
    company: 'CBRE Việt Nam',
    specialty: ['Nhà phố', 'Đất nền'],
    experience: 6,
    rating: 4.6,
    reviewCount: 89,
    phone: '+84 988 765 432',
    email: 'lan.tran@cbre.vn',
    address: 'Quận 3, TP.HCM',
    description: 'Môi giới chuyên nghiệp với focus vào phân khúc nhà phố và đất nền. Đã tư vấn thành công hàng trăm giao dịch.',
    services: ['Tư vấn đầu tư', 'Mua bán nhà đất', 'Cho thuê'],
    languages: ['Tiếng Việt'],
    verified: true,
  },
  {
    id: '3',
    name: 'Công ty BĐS Hoàng Gia',
    type: 'company',
    location: { lat: 10.8131, lng: 106.6197 },
    specialty: ['Biệt thự', 'Căn hộ hạng A', 'BĐS nghỉ dưỡng'],
    experience: 12,
    rating: 4.9,
    reviewCount: 245,
    phone: '+84 1900 1234',
    email: 'info@hoanggia.vn',
    address: 'Quận 7, TP.HCM',
    description: 'Công ty BĐS hàng đầu với hơn 12 năm kinh nghiệm. Chuyên phát triển và kinh doanh các dự án BĐS cao cấp.',
    services: ['Phát triển dự án', 'Kinh doanh BĐS', 'Quản lý tài sản', 'Tư vấn đầu tư'],
    languages: ['Tiếng Việt', 'Tiếng Anh', 'Tiếng Trung'],
    certifications: ['ISO 9001:2015', 'Giấy phép kinh doanh BĐS'],
    verified: true,
  },
  {
    id: '4',
    name: 'Lê Minh Tuấn',
    type: 'bank_assistant',
    location: { lat: 10.8031, lng: 106.6097 },
    company: 'Ngân hàng Vietcombank',
    specialty: ['Vay mua nhà', 'Vay kinh doanh'],
    experience: 5,
    rating: 4.7,
    reviewCount: 156,
    phone: '+84 955 678 901',
    email: 'tuan.le@vietcombank.vn',
    address: 'Quận Bình Thạnh, TP.HCM',
    description: 'Chuyên viên tín dụng với 5 năm kinh nghiệm. Hỗ trợ khách hàng vay mua nhà với lãi suất ưu đãi.',
    services: ['Tư vấn vay mua nhà', 'Hồ sơ vay vốn', 'Thẩm định tài sản'],
    languages: ['Tiếng Việt', 'Tiếng Anh'],
    certifications: ['Chứng chỉ ngân hàng', 'Chứng chỉ thẩm định BĐS'],
    verified: true,
  },
  {
    id: '5',
    name: 'Phạm Thị Mai',
    type: 'bank_assistant',
    location: { lat: 10.8431, lng: 106.6497 },
    company: 'Ngân hàng BIDV',
    specialty: ['Vay mua nhà', 'Vay xây dựng'],
    experience: 7,
    rating: 4.5,
    reviewCount: 98,
    phone: '+84 966 543 210',
    email: 'mai.pham@bidv.vn',
    address: 'Quận Tân Bình, TP.HCM',
    description: 'Chuyên viên ngân hàng với kinh nghiệm lâu năm trong lĩnh vực tín dụng BĐS. Hỗ trợ vay với thủ tục đơn giản.',
    services: ['Vay mua nhà đất', 'Vay xây dựng', 'Tư vấn tài chính'],
    languages: ['Tiếng Việt'],
    verified: false,
  },
];

const MapDesktop: React.FC = () => {
  const {
    // State
    map,
    selectedProfessional,
    searchQuery,

    // Handlers
    setSearchQuery,
    setSelectedProfessional,
    handleMapReady,
    handleSearch,
    handleLocationClick,
    handleLayersClick,
    handleNavigationClick,
    handleHomeClick,
    handleProfessionalClick,
  } = useMapDesktopHook();

  return (
    <div className="relative h-screen w-screen overflow-hidden">
      {/* Full-screen map */}
      <DynamicMap
        center={{ lat: 10.8231, lng: 106.6297 }}
        zoom={16}
        className="h-full w-full"
        onMapReady={handleMapReady}
      />

      {/* Desktop Map Controls */}
      <MapControlsDesktop
        onSearch={handleSearch}
        onLocationClick={handleLocationClick}
        onLayersClick={handleLayersClick}
        onNavigationClick={handleNavigationClick}
        onHomeClick={handleHomeClick}
        searchQuery={searchQuery}
        onSearchQueryChange={setSearchQuery}
      />

      {/* Professional Markers */}
      {map && sampleProfessionals.map((professional) => (
        <ProfessionalMarker
          key={`marker-${professional.id}`}
          professional={professional}
          map={map}
          onClick={handleProfessionalClick}
        />
      ))}

      {/* Professional Info Panel (if professional selected) */}
      {selectedProfessional && (
        <ProfessionalInfoPanel
          professional={selectedProfessional}
          onClose={() => setSelectedProfessional(null)}
        />
      )}
    </div>
  );
};

export default MapDesktop;

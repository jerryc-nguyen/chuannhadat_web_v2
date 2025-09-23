'use client';
import { Professional } from '../types';
import { Phone, Mail, MapPin, Award, Languages, CheckCircle, X } from 'lucide-react';

import { SEARCH_BOX_WIDTH_WITH_PADDING } from '../constants';


interface ProfessionalInfoPanelProps {
  professional: Professional;
  onClose: () => void;
}

const ProfessionalInfoPanel: React.FC<ProfessionalInfoPanelProps> = ({
  professional,
  onClose,
}) => {
  const renderStars = (rating: number) => {
    return '★'.repeat(Math.floor(rating)) + '☆'.repeat(5 - Math.floor(rating));
  };

  const getTypeLabel = (type: Professional['type']) => {
    switch (type) {
      case 'broker':
        return 'Môi giới';
      case 'company':
        return 'Công ty BĐS';
      case 'bank_assistant':
        return 'Chuyên viên ngân hàng';
      default:
        return type;
    }
  };

  const getTypeColor = (type: Professional['type']) => {
    switch (type) {
      case 'broker':
        return 'text-green-600';
      case 'company':
        return 'text-amber-600';
      case 'bank_assistant':
        return 'text-purple-600';
      default:
        return 'text-blue-600';
    }
  };

  return (
    <div className="absolute top-0 left-0 bg-white rounded-lg shadow-lg flex flex-col" style={{ width: SEARCH_BOX_WIDTH_WITH_PADDING, height: '100vh', zIndex: 1000 }}>
      {/* Header - Fixed */}
      <div className="flex items-start justify-between p-6 pb-4 border-b border-gray-100 flex-shrink-0">
        <div className="flex items-start gap-4 flex-1">
          {/* Avatar */}
          <div className="relative">
            {professional.avatar ? (
              <img
                src={professional.avatar}
                alt={professional.name}
                className="w-16 h-16 rounded-full object-cover border-2 border-gray-200"
              />
            ) : (
              <div className="w-16 h-16 rounded-full bg-gray-200 flex items-center justify-center text-2xl">
                👤
              </div>
            )}
            {professional.verified && (
              <CheckCircle className="absolute -top-1 -right-1 w-6 h-6 text-green-500 bg-white rounded-full" />
            )}
          </div>

          {/* Basic Info */}
          <div className="flex-1">
            <h3 className="text-xl font-bold text-gray-900 mb-1">
              {professional.name}
            </h3>
            <p className={`text-sm font-medium mb-2 ${getTypeColor(professional.type)}`}>
              {getTypeLabel(professional.type)}
            </p>

            {professional.company && (
              <p className="text-sm text-gray-600 mb-2">{professional.company}</p>
            )}

            {professional.rating && (
              <div className="flex items-center gap-2 mb-2">
                <div className="flex text-yellow-400 text-sm">
                  {renderStars(professional.rating)}
                </div>
                <span className="text-sm text-gray-600">
                  ({professional.reviewCount || 0} đánh giá)
                </span>
              </div>
            )}

            {professional.experience && (
              <p className="text-sm text-gray-600">
                Kinh nghiệm: {professional.experience} năm
              </p>
            )}
          </div>
        </div>

        <button
          onClick={onClose}
          className="text-gray-400 hover:text-gray-600 p-1"
        >
          <X className="w-6 h-6" />
        </button>
      </div>

      {/* Scrollable Content */}
      <div className="flex-1 overflow-y-auto px-6 py-4">
        {/* Specialty */}
        {professional.specialty && professional.specialty.length > 0 && (
          <div className="mb-4">
            <h4 className="text-sm font-semibold text-gray-900 mb-2">Chuyên môn</h4>
            <div className="flex flex-wrap gap-2">
              {professional.specialty.map((spec, index) => (
                <span
                  key={index}
                  className="px-3 py-1 bg-blue-50 text-blue-700 text-xs rounded-full"
                >
                  {spec}
                </span>
              ))}
            </div>
          </div>
        )}

        {/* Services */}
        {professional.services && professional.services.length > 0 && (
          <div className="mb-4">
            <h4 className="text-sm font-semibold text-gray-900 mb-2">Dịch vụ</h4>
            <div className="flex flex-wrap gap-2">
              {professional.services.map((service, index) => (
                <span
                  key={index}
                  className="px-3 py-1 bg-green-50 text-green-700 text-xs rounded-full"
                >
                  {service}
                </span>
              ))}
            </div>
          </div>
        )}

        {/* Languages */}
        {professional.languages && professional.languages.length > 0 && (
          <div className="mb-4">
            <h4 className="text-sm font-semibold text-gray-900 mb-2 flex items-center gap-2">
              <Languages className="w-4 h-4" />
              Ngôn ngữ
            </h4>
            <p className="text-sm text-gray-600">
              {professional.languages.join(', ')}
            </p>
          </div>
        )}

        {/* Certifications */}
        {professional.certifications && professional.certifications.length > 0 && (
          <div className="mb-4">
            <h4 className="text-sm font-semibold text-gray-900 mb-2 flex items-center gap-2">
              <Award className="w-4 h-4" />
              Chứng chỉ
            </h4>
            <div className="space-y-1">
              {professional.certifications.map((cert, index) => (
                <p key={index} className="text-sm text-gray-600">• {cert}</p>
              ))}
            </div>
          </div>
        )}

        {/* Description */}
        {professional.description && (
          <div className="mb-4">
            <h4 className="text-sm font-semibold text-gray-900 mb-2">Giới thiệu</h4>
            <p className="text-sm text-gray-600 leading-relaxed">
              {professional.description}
            </p>
          </div>
        )}

        {/* Contact Info */}
        <div className="border-t pt-4">
          <h4 className="text-sm font-semibold text-gray-900 mb-3">Liên hệ</h4>
          <div className="space-y-3">
            {professional.phone && (
              <div className="flex items-center gap-3">
                <Phone className="w-4 h-4 text-gray-400" />
                <span className="text-sm text-gray-600">{professional.phone}</span>
              </div>
            )}

            {professional.email && (
              <div className="flex items-center gap-3">
                <Mail className="w-4 h-4 text-gray-400" />
                <span className="text-sm text-gray-600">{professional.email}</span>
              </div>
            )}

            {professional.address && (
              <div className="flex items-center gap-3">
                <MapPin className="w-4 h-4 text-gray-400" />
                <span className="text-sm text-gray-600">{professional.address}</span>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Action Buttons - Fixed at bottom */}
      <div className="flex gap-3 mt-6 p-6 pt-4 border-t border-gray-100 flex-shrink-0">
        {professional.phone && (
          <a
            href={`tel:${professional.phone}`}
            className="flex-1 bg-green-600 text-white py-3 px-4 rounded-lg hover:bg-green-700 transition-colors text-center text-sm font-medium"
          >
            📞 Gọi ngay
          </a>
        )}

        {professional.email && (
          <a
            href={`mailto:${professional.email}`}
            className="flex-1 border border-blue-600 text-blue-600 py-3 px-4 rounded-lg hover:bg-blue-50 transition-colors text-center text-sm font-medium"
          >
            ✉️ Email
          </a>
        )}
      </div>
    </div>
  );
};

export default ProfessionalInfoPanel;

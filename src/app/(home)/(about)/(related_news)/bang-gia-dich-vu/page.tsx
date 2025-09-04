import { Button } from '@components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@components/ui/card';
import { Check, Crown, Star, Zap } from 'lucide-react';
import React from 'react';

type ServicePriceProps = object;

const ServicePrice: React.FC<ServicePriceProps> = () => {
  const pricingPlans = [
    {
      id: 'regular',
      name: 'Tin thường',
      price: '2K',
      unit: 'Xu',
      period: '1 lần đăng tin',
      description: 'Tin được hiển thị mãi mãi',
      icon: <Zap className="h-6 w-6" />,
      features: [
        'Hiển thị tin đăng vĩnh viễn',
        'Đăng tin cơ bản',
        'Hỗ trợ khách hàng',
      ],
      popular: false,
      color: 'from-blue-500 to-blue-600',
    },
    {
      id: 'vip',
      name: 'VIP',
      price: '2.5K',
      unit: 'Xu',
      period: '1 ngày',
      description: 'Tin được ưu tiên hiển thị',
      icon: <Star className="h-6 w-6" />,
      features: [
        'Ưu tiên hiển thị',
        'Nổi bật trong danh sách',
        'Tăng lượt xem',
        'Hỗ trợ ưu tiên',
      ],
      popular: true,
      color: 'from-purple-500 to-purple-600',
    },
    {
      id: 'super-vip',
      name: 'Siêu VIP',
      price: '5K',
      unit: 'Xu',
      period: '1 ngày',
      description: 'Hiển thị top đầu, thu hút tối đa',
      icon: <Crown className="h-6 w-6" />,
      features: [
        'Hiển thị top đầu',
        'Nổi bật đặc biệt',
        'Tối đa lượt xem',
        'Hỗ trợ VIP 24/7',
        'Badge đặc biệt',
      ],
      popular: false,
      color: 'from-amber-500 to-orange-500',
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 py-12">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Header Section */}
        <div className="text-center">
          <h1 className="text-4xl font-bold tracking-tight text-gray-900 sm:text-5xl lg:text-6xl">
            Bảng giá dịch vụ
          </h1>
          <p className="mx-auto mt-4 max-w-2xl text-xl text-gray-600">
            Chọn loại tin đăng phù hợp để được nhiều người xem nhất
          </p>
        </div>

        {/* Pricing Cards */}
        <div className="mt-16 grid grid-cols-1 gap-8 lg:grid-cols-3">
          {pricingPlans.map((plan) => (
            <Card
              key={plan.id}
              className={`relative overflow-hidden transition-all duration-300 hover:scale-105 hover:shadow-2xl ${plan.popular
                ? 'border-2 border-purple-500 shadow-xl'
                : 'border border-gray-200 hover:border-gray-300'
                }`}
            >
              {plan.popular && (
                <div className="absolute -right-12 top-6 rotate-45 bg-purple-500 px-12 py-1 text-xs font-semibold text-white">
                  Phổ biến
                </div>
              )}

              <CardHeader className="text-center">
                <div className={`mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-gradient-to-r ${plan.color} text-white`}>
                  {plan.icon}
                </div>
                <CardTitle className="text-2xl font-bold">{plan.name}</CardTitle>
                <CardDescription className="text-gray-600">
                  {plan.description}
                </CardDescription>
              </CardHeader>

              <CardContent className="text-center">
                <div className="mb-6">
                  <div className="flex items-baseline justify-center">
                    <span className="text-5xl font-bold text-gray-900">{plan.price}</span>
                    <span className="ml-2 text-xl text-gray-600">{plan.unit}</span>
                  </div>
                  <p className="mt-1 text-sm text-gray-500">/ {plan.period}</p>
                </div>

                <ul className="space-y-3">
                  {plan.features.map((feature, index) => (
                    <li key={index} className="flex items-center">
                      <Check className="mr-3 h-5 w-5 text-green-500" />
                      <span className="text-gray-700">{feature}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>

            </Card>
          ))}
        </div>

        <p className="mt-4 max-w-2xl text-xl text-gray-600">
          ** 1 xu tương đương 1 VNĐ
        </p>

        {/* Additional Info */}
        <div className="mt-16 text-center">
          <div className="mx-auto rounded-2xl bg-white p-8 shadow-lg">
            <h3 className="text-2xl font-bold text-gray-900 mb-4">
              Tại sao chọn dịch vụ của chúng tôi?
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8">
              <div className="text-center">
                <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-blue-100">
                  <Zap className="h-6 w-6 text-blue-600" />
                </div>
                <h4 className="font-semibold text-gray-900">Hiệu quả cao</h4>
                <p className="text-sm text-gray-600 mt-2">
                  Tăng lượt xem và tương tác với tin đăng của bạn
                </p>
              </div>
              <div className="text-center">
                <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-purple-100">
                  <Star className="h-6 w-6 text-purple-600" />
                </div>
                <h4 className="font-semibold text-gray-900">Uy tín</h4>
                <p className="text-sm text-gray-600 mt-2">
                  Được hàng nghìn khách hàng tin tưởng sử dụng
                </p>
              </div>
              <div className="text-center">
                <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-amber-100">
                  <Crown className="h-6 w-6 text-amber-600" />
                </div>
                <h4 className="font-semibold text-gray-900">Hỗ trợ 24/7</h4>
                <p className="text-sm text-gray-600 mt-2">
                  Đội ngũ hỗ trợ chuyên nghiệp luôn sẵn sàng giúp đỡ
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ServicePrice;

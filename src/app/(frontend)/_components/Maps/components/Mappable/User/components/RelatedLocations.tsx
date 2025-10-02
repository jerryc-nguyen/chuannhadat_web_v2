'use client';

import Image from 'next/image';
import { useQuery } from '@tanstack/react-query';
import { getRelatedLocations, RelatedLocation } from '@maps/api';
import { Marker } from '@maps/types';

interface RelatedLocationsProps {
  markerUid: string;
}

export default function RelatedLocations({ markerUid }: RelatedLocationsProps) {
  const { data, isLoading } = useQuery({
    queryKey: ['related-locations', markerUid],
    queryFn: () => getRelatedLocations(markerUid),
    enabled: !!markerUid,
  });

  if (isLoading) {
    return (
      <div className="animate-pulse">
        <div className="flex gap-4 overflow-x-auto pb-4">
          {[1, 2, 3].map((i) => (
            <div
              key={i}
              className="min-w-[200px] overflow-hidden rounded-lg bg-white shadow-sm"
            >
              <div className="relative h-32 w-full">
                <div className="h-full w-full bg-gray-200" />
                {/* Overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/30 via-50% to-transparent" />
                {/* Text overlay skeleton */}
                <div className="absolute bottom-0 left-0 right-0 p-4">
                  <div className="h-4 bg-white/20 rounded mb-2" />
                  <div className="h-3 bg-white/20 rounded w-3/4" />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }


  const { district_name, wards } = data?.data || {};

  if (!district_name || Array.isArray(wards) && wards.length === 0) {
    return null;
  }
  return (
    <div className="space-y-3">
      <h2 className="text-g font-semibold text-gray-900 mb-4">
        Các địa điểm khác tại {district_name}
      </h2>

      <div className="flex gap-4 overflow-x-auto pb-4 scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-transparent">
        {wards && wards.map((ward: RelatedLocation) => (
          <div
            key={ward.ward_name}
            className="min-w-[200px] overflow-hidden rounded-lg bg-white shadow-sm transition-transform hover:scale-[1.02]"
          >
            <div className="relative h-32 w-full">
              <Image
                src={ward.featured_image_url}
                alt={ward.ward_name}
                fill
                className="object-cover"
                sizes="200px"
              />
              {/* Overlay */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/30 via-50% to-transparent" />
              {/* Text overlay */}
              <div className="absolute bottom-0 left-0 right-0 p-4">
                <h4 className="font-medium text-white">{ward.ward_name}</h4>
                <p className="mt-1 text-sm text-white/90">
                  {ward.total_posts} tin đăng
                </p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

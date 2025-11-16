import React from 'react';
import Skeleton from '@/components/shared/Skeleton';

const UMKMDetailPageLoading = () => {
  return (
    <div className="min-h-screen bg-[var(--background)] pt-32">
      {/* Header Placeholder - assuming it's static or handled differently */}
      
      {/* Main Content */}
      <div className="container mx-auto px-4 py-8">
        {/* Top Card */}
        <div className="bg-white rounded-xl shadow-md p-6 border border-[var(--border)] mb-8">
          <div className="flex items-center gap-2 text-[var(--primary)] mb-6">
            <div className="w-5 h-5 bg-gray-200 rounded animate-pulse"></div>
            <div className="h-4 w-40 bg-gray-200 rounded animate-pulse"></div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Image Section */}
            <div className="md:col-span-1">
              <Skeleton className="w-full h-64 rounded-lg" />
              
              {/* Thumbnail Slider */}
              <div className="mt-3 flex gap-2">
                {[...Array(3)].map((_, i) => (
                  <Skeleton key={i} className="flex-shrink-0 w-16 h-16 rounded-lg" />
                ))}
              </div>
            </div>

            {/* Info Section */}
            <div className="md:col-span-2 flex flex-col justify-between">
              <div>
                <Skeleton className="w-24 h-6 rounded-full mb-4" />
                <Skeleton className="w-3/4 h-8 mb-3 rounded" />
                <Skeleton className="w-full h-4 mb-2 rounded" />
                <Skeleton className="w-5/6 h-4 mb-2 rounded" />
                <Skeleton className="w-4/6 h-4 rounded" />
              </div>

              {/* Contact & Links */}
              <div>
                <Skeleton className="w-32 h-5 mb-3 rounded" />
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                  {[...Array(3)].map((_, i) => (
                    <Skeleton key={i} className="h-16 rounded-lg" />
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Gallery Section */}
        <div className="bg-white rounded-xl shadow-md p-6 border border-[var(--border)] mb-8">
          <Skeleton className="w-32 h-5 mb-6 rounded" />
          <div className="space-y-6">
            <div>
              <Skeleton className="w-24 h-4 mb-3 rounded" />
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
                {[...Array(4)].map((_, i) => (
                  <Skeleton key={i} className="aspect-square rounded-lg" />
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Cards */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Location Map */}
          <div className="lg:col-span-2 bg-white rounded-xl shadow-md overflow-hidden border border-[var(--border)]">
            <div className="p-4 bg-white border-b border-[var(--border)]">
              <Skeleton className="w-32 h-5 rounded" />
            </div>
            <Skeleton className="h-96 w-full" />
          </div>

          {/* Stats Card */}
          <div className="lg:col-span-1 bg-white rounded-xl shadow-md p-6 border border-[var(--border)]">
            <Skeleton className="w-24 h-5 mb-4 rounded" />
            <div className="space-y-4">
              {[...Array(3)].map((_, i) => (
                <Skeleton key={i} className="h-12 rounded-lg" />
              ))}
            </div>
            <div className="mt-6">
              <Skeleton className="h-12 w-full rounded-lg" />
            </div>
          </div>
        </div>
      </div>

      {/* Footer Placeholder */}
    </div>
  );
};

export default UMKMDetailPageLoading;
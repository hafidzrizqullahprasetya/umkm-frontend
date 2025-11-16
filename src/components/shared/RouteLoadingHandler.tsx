'use client';

import { useEffect, useRef } from 'react';
import { usePathname, useSearchParams } from 'next/navigation';
import { useLoading } from '@/components/shared/LoadingProvider';

export default function RouteLoadingHandler() {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const { showLoading } = useLoading();
  const prevPathnameRef = useRef<string | null>(null);

  useEffect(() => {
    // Show loading when pathname changes
    if (prevPathnameRef.current !== null && prevPathnameRef.current !== pathname) {
      showLoading(true);
      
      // Hide loading after a short delay
      const timer = setTimeout(() => {
        showLoading(false);
      }, 500);

      return () => clearTimeout(timer);
    }
    
    // Update previous pathname
    prevPathnameRef.current = pathname;
  }, [pathname, searchParams, showLoading]);

  return null;
}
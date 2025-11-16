'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useLoading } from '@/components/shared/LoadingProvider';

export default function RouteLoadingHandler() {
  const router = useRouter();
  const { showLoading } = useLoading();

  useEffect(() => {
    const handleStart = () => {
      showLoading(true);
    };

    const handleComplete = () => {
      showLoading(false);
    };

    router.events.on('routeChangeStart', handleStart);
    router.events.on('routeChangeComplete', handleComplete);
    router.events.on('routeChangeError', handleComplete);

    return () => {
      router.events.off('routeChangeStart', handleStart);
      router.events.off('routeChangeComplete', handleComplete);
      router.events.off('routeChangeError', handleComplete);
    };
  }, [router, showLoading]);

  return null;
}
'use client';

import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

export default function Home() {
  const router = useRouter();

  useEffect(() => {
    // Redirect ke halaman UMKM default
    router.push('/umkm/kopi-senja');
  }, [router]);

  return (
    <div className="min-h-screen flex items-center justify-center">
      <p className="text-lg">Redirecting...</p>
    </div>
  );
}
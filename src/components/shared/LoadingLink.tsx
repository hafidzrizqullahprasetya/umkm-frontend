'use client';

import Link from 'next/link';
import { useLoading } from '@/components/shared/LoadingProvider';
import { useEffect, useState } from 'react';

interface LoadingLinkProps {
  href: string;
  children: React.ReactNode;
  className?: string;
  onClick?: () => void;
}

export default function LoadingLink({ href, children, className, onClick }: LoadingLinkProps) {
  const { showLoading } = useLoading();
  const [isPending, setIsPending] = useState(false);

  const handleClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
    if (onClick) onClick();
    
    // Show loading indicator
    showLoading(true);
    setIsPending(true);
    
    // Reset loading after a short delay to ensure smooth transition
    setTimeout(() => {
      setIsPending(false);
      showLoading(false);
    }, 1000); // Adjust this delay as needed
  };

  return (
    <Link 
      href={href} 
      className={className}
      onClick={handleClick}
    >
      {children}
    </Link>
  );
}
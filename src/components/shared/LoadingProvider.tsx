'use client';

import { createContext, useContext, useState, ReactNode } from 'react';
import LoadingSpinner from './LoadingSpinner';

interface LoadingContextType {
  showLoading: (show: boolean) => void;
}

const LoadingContext = createContext<LoadingContextType | undefined>(undefined);

export const useLoading = () => {
  const context = useContext(LoadingContext);
  if (!context) {
    throw new Error('useLoading must be used within a LoadingProvider');
  }
  return context;
};

interface LoadingProviderProps {
  children: ReactNode;
}

export default function LoadingProvider({ children }: LoadingProviderProps) {
  const [isLoading, setIsLoading] = useState(false);

  const showLoading = (show: boolean) => {
    setIsLoading(show);
  };

  return (
    <LoadingContext.Provider value={{ showLoading }}>
      {children}
      {isLoading && <LoadingSpinner />}
    </LoadingContext.Provider>
  );
}
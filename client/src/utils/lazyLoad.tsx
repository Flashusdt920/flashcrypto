import React, { Suspense } from 'react';

// Loading component with spinner
export const PageLoader = () => (
  <div className="min-h-[400px] flex items-center justify-center">
    <div className="w-8 h-8 border-3 border-accent border-t-transparent rounded-full animate-spin"></div>
  </div>
);

// Lazy load wrapper with suspense
export function lazyLoad<T extends React.ComponentType<any>>(
  importFunc: () => Promise<{ default: T }>
) {
  const LazyComponent = React.lazy(importFunc);
  
  return (props: React.ComponentProps<T>) => (
    <Suspense fallback={<PageLoader />}>
      <LazyComponent {...props} />
    </Suspense>
  );
}
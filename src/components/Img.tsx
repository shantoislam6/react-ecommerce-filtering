'use client';
import { cn } from '@/lib/utils';
import { Loader } from 'lucide-react';
/* eslint-disable @next/next/no-img-element */

import React, { useEffect } from 'react';
type TImg = {
  src: string;
  alt: string;
  className: string;
};
export default function Img({ src, alt, className }: TImg) {
  const [loading, setLoading] = React.useState(true);

  useEffect(() => {
    const img = new Image();
    img.src = src;
    img.onload = function () {
      setLoading(false);
    };
  }, [src]);
  return (
    <div className="h-full">
      {!loading ? (
        <img
          src={src}
          alt={alt}
          className={className}
        />
      ) : (
        <div className={cn(className, 'flex items-center justify-center')}>
          <Loader className="an h-10 w-10 animate-spin  text-foreground/40" />
        </div>
      )}
    </div>
  );
}


import React, { useState, useEffect } from 'react';

const OptimizedImage = ({ 
  src, 
  webpSrc, 
  alt, 
  className, 
  placeholder = 'blur',
  ...props 
}) => {
  const [imageLoaded, setImageLoaded] = useState(false);
  const [imageError, setImageError] = useState(false);
  const [currentSrc, setCurrentSrc] = useState('');

  useEffect(() => {
    // Check WebP support
    const checkWebPSupport = () => {
      const canvas = document.createElement('canvas');
      canvas.width = 1;
      canvas.height = 1;
      return canvas.toDataURL('image/webp').indexOf('data:image/webp') === 0;
    };

    const supportsWebP = checkWebPSupport();
    setCurrentSrc(supportsWebP && webpSrc ? webpSrc : src);
  }, [src, webpSrc]);

  const handleLoad = () => {
    setImageLoaded(true);
    setImageError(false);
  };

  const handleError = () => {
    setImageError(true);
    setImageLoaded(false);
    // Fallback to original format if WebP fails
    if (currentSrc === webpSrc && src) {
      setCurrentSrc(src);
    }
  };

  return (
    <div className={`relative overflow-hidden ${className}`}>
      {/* Placeholder */}
      {!imageLoaded && !imageError && (
        <div className={`absolute inset-0 ${
          placeholder === 'blur' 
            ? 'bg-gradient-to-br from-slate-200 to-slate-300 dark:from-slate-700 dark:to-slate-800' 
            : 'bg-slate-200 dark:bg-slate-700'
        } animate-pulse flex items-center justify-center`}>
          <div className="w-8 h-8 border-2 border-slate-400 border-t-transparent rounded-full animate-spin"></div>
        </div>
      )}

      {/* Error State */}
      {imageError && (
        <div className="absolute inset-0 bg-slate-200 dark:bg-slate-700 flex items-center justify-center">
          <div className="text-slate-500 text-center">
            <svg className="w-12 h-12 mx-auto mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
            <p className="text-sm">Failed to load image</p>
          </div>
        </div>
      )}

      {/* Actual Image */}
      {currentSrc && (
        <img
          src={currentSrc}
          alt={alt}
          onLoad={handleLoad}
          onError={handleError}
          className={`w-full h-full object-cover transition-opacity duration-300 ${
            imageLoaded ? 'opacity-100' : 'opacity-0'
          }`}
          loading="lazy"
          {...props}
        />
      )}
    </div>
  );
};

export default OptimizedImage;
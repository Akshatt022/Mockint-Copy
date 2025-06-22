// utils/imageOptimization.js
import { useState, useEffect } from 'react';

export const generateImageSrcSet = (basePath, sizes = [400, 800, 1200, 1600]) => {
  return sizes.map(size => `${basePath}?w=${size} ${size}w`).join(', ');
};

export const generateWebPSrc = (src) => {
  if (!src) return '';
  const extension = src.split('.').pop();
  return src.replace(`.${extension}`, '.webp');
};

export const preloadImage = (src) => {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => resolve(img);
    img.onerror = reject;
    img.src = src;
  });
};

// Intersection Observer hook for lazy loading
export const useIntersectionObserver = (ref, options = {}) => {
  const [isIntersecting, setIsIntersecting] = useState(false);

  useEffect(() => {
    if (!ref.current) return;

    const observer = new IntersectionObserver(([entry]) => {
      setIsIntersecting(entry.isIntersecting);
    }, {
      threshold: 0.1,
      ...options
    });

    observer.observe(ref.current);

    return () => observer.disconnect();
  }, [ref, options]);

  return isIntersecting;
};
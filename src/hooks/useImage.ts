
import { useState, useEffect } from 'react';

const useImage = (url: string): [HTMLImageElement | undefined, 'loading' | 'loaded' | 'failed'] => {
  const [image, setImage] = useState<HTMLImageElement>();
  const [status, setStatus] = useState<'loading' | 'loaded' | 'failed'>('loading');

  useEffect(() => {
    if (!url) return;
    
    const img = new Image();
    
    img.onload = () => {
      setImage(img);
      setStatus('loaded');
    };
    
    img.onerror = () => {
      setStatus('failed');
    };
    
    img.crossOrigin = 'anonymous';
    img.src = url;
    
    return () => {
      img.onload = null;
      img.onerror = null;
    };
  }, [url]);

  return [image, status];
};

export default useImage;

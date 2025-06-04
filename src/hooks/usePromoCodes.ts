
import { useState, useEffect } from 'react';
import { apiService } from '../services/api';
import { ApiPromoCode } from '../types/api';

export function usePromoCodes() {
  const [promoCodes, setPromoCodes] = useState<ApiPromoCode[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchPromoCodes = async () => {
      try {
        setLoading(true);
        const apiPromoCodes: ApiPromoCode[] = await apiService.promoCodes.getAll();
        setPromoCodes(apiPromoCodes);
        setError(null);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to fetch promo codes');
        console.error('Error fetching promo codes:', err);
        setPromoCodes([]);
      } finally {
        setLoading(false);
      }
    };

    fetchPromoCodes();
  }, []);

  return { promoCodes, loading, error };
}

// Helper function to validate and apply promo code
export function validatePromoCode(promoCode: string, promoCodes: ApiPromoCode[]) {
  const code = promoCodes.find(
    pc => pc.name.toLowerCase() === promoCode.toLowerCase() && 
          pc.Active === '1' &&
          new Date(pc.startdate) <= new Date() &&
          new Date(pc.enddate) >= new Date()
  );
  
  if (!code) {
    return { valid: false, error: 'Invalid or expired promo code' };
  }
  
  return {
    valid: true,
    code,
    discount: parseFloat(code.discount),
    isFreeShip: code.IsFreeShip === '1'
  };
}

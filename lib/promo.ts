// ====================================================================
// CVPINTAR PROMO CODE VALIDATION & PRICING ENGINE
// ====================================================================

export interface PromoCodeDetails {
  code: string;
  discountPercentage: number;
  fixedPrice?: number;
  label: string;
  description: string;
}

export const VALID_PROMO_CODES: Record<string, PromoCodeDetails> = {
  // Special Owner & Testing Promo (Rp 1.000 & Rp 10.000 for Bank/DOKU limits)
  IQBAL1K: {
    code: 'IQBAL1K',
    discountPercentage: 96,
    fixedPrice: 1000,
    label: 'VIP Owner Test (Rp1.000)',
    description: 'Harga spesial khusus owner Rp 1.000 (QRIS/E-Wallet).',
  },
  IQBAL10K: {
    code: 'IQBAL10K',
    discountPercentage: 60,
    fixedPrice: 10000,
    label: 'VIP Owner Test (Rp10.000)',
    description: 'Harga spesial khusus owner Rp 10.000 (Semua Bank & VA).',
  },
  TEST1K: {
    code: 'TEST1K',
    discountPercentage: 96,
    fixedPrice: 1000,
    label: 'Testing QRIS (Rp1.000)',
    description: 'Harga spesial testing Rp 1.000.',
  },
  TEST10K: {
    code: 'TEST10K',
    discountPercentage: 60,
    fixedPrice: 10000,
    label: 'Testing Bank VA (Rp10.000)',
    description: 'Harga spesial testing Rp 10.000.',
  },
  IQBAL100: {
    code: 'IQBAL100',
    discountPercentage: 99.6,
    fixedPrice: 100,
    label: 'VIP Owner Special (Rp100)',
    description: 'Harga spesial khusus owner hanya Rp 100.',
  },
  OWNER100: {
    code: 'OWNER100',
    discountPercentage: 99.6,
    fixedPrice: 100,
    label: 'VIP Owner Special (Rp100)',
    description: 'Harga spesial khusus owner hanya Rp 100.',
  },
  BAYAR100: {
    code: 'BAYAR100',
    discountPercentage: 99.6,
    fixedPrice: 100,
    label: 'Promo Khusus (Rp100)',
    description: 'Harga spesial bayar hanya Rp 100.',
  },

  // Public Launching Promo (50% Off)
  CVPINTAR50: {
    code: 'CVPINTAR50',
    discountPercentage: 50,
    label: 'Diskon 50% Spesial Launching',
    description: 'Potongan harga 50% untuk langganan CVPintar Pro 1 bulan.',
  },
  PINTAR50: {
    code: 'PINTAR50',
    discountPercentage: 50,
    label: 'Diskon 50% Promo Terbatas',
    description: 'Potongan harga 50% untuk paket CVPintar Pro.',
  },
  KERJAHEMAT50: {
    code: 'KERJAHEMAT50',
    discountPercentage: 50,
    label: 'Diskon 50% Spesial Launching',
    description: 'Potongan harga 50% untuk langganan CVPintar Pro 1 bulan.',
  },
  DISKON50: {
    code: 'DISKON50',
    discountPercentage: 50,
    label: 'Diskon 50% Promo Terbatas',
    description: 'Potongan harga 50% untuk paket CVPintar Pro.',
  },
  PROMOAI: {
    code: 'PROMOAI',
    discountPercentage: 30,
    label: 'Diskon 30% Promo Spesial AI',
    description: 'Potongan harga 30% untuk seluruh fitur AI & Template.',
  },
  KERJABIKINPRO: {
    code: 'KERJABIKINPRO',
    discountPercentage: 40,
    label: 'Diskon 40% Komunitas Karir',
    description: 'Potongan harga 40% spesial member komunitas.',
  },
};

/**
 * Validates promo code string (case-insensitive)
 */
export function validatePromoCode(rawCode: string): PromoCodeDetails | null {
  if (!rawCode) return null;
  const cleanCode = rawCode.trim().toUpperCase();
  return VALID_PROMO_CODES[cleanCode] || null;
}

/**
 * Calculates discount amount and final price
 */
export function calculateDiscountedPrice(
  originalPrice: number,
  promo: PromoCodeDetails | null
): {
  originalPrice: number;
  discountAmount: number;
  finalPrice: number;
  discountPercentage: number;
} {
  if (!promo) {
    return {
      originalPrice,
      discountAmount: 0,
      finalPrice: originalPrice,
      discountPercentage: 0,
    };
  }

  // Handle special fixed price promo (e.g. Rp 100)
  if (promo.fixedPrice !== undefined) {
    const targetPrice = promo.fixedPrice;
    const finalPrice = originalPrice <= 1 ? 1 : targetPrice;
    const discountAmount = Math.max(0, originalPrice - finalPrice);
    const discountPercentage =
      originalPrice > 0 ? Math.round(((originalPrice - finalPrice) / originalPrice) * 100) : 0;

    return {
      originalPrice,
      discountAmount,
      finalPrice,
      discountPercentage,
    };
  }

  // Handle sandbox minimum payment of 1 IDR
  if (originalPrice <= 1) {
    return {
      originalPrice: 1,
      discountAmount: 0,
      finalPrice: 1,
      discountPercentage: promo.discountPercentage,
    };
  }

  const discountAmount = Math.round((originalPrice * promo.discountPercentage) / 100);
  const finalPrice = Math.max(1, originalPrice - discountAmount);

  return {
    originalPrice,
    discountAmount,
    finalPrice,
    discountPercentage: promo.discountPercentage,
  };
}

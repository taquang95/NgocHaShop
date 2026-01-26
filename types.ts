
export enum Retailer {
  SHOPEE = 'Shopee',
  LAZADA = 'Lazada',
  TIKI = 'Tiki',
  TIKTOK = 'TikTok',
  AMAZON = 'Amazon'
}

export interface Category {
  id: string;
  name: string;
  slug: string;
  icon?: string;
  parentId?: string;
}

export interface Product {
  id: string;
  title: string;
  slug: string;
  categoryId: string;
  brand: string;
  imageUrl: string;
  imageUrls?: string[];
  priceRegular: number;
  priceDeal?: number;
  discountPercent: number;
  rating: number;
  ratingCount: number;
  soldCount?: number;
  retailer: Retailer;
  affiliateUrl: string;
  isHot: boolean;
  isDeal: boolean;
  dealEndAt?: string;
  tags: string[];
  specs: Record<string, string>;
  couponCode?: string;
  description?: string;
  shortDescription?: string;
}

export interface Voucher {
  id: string;
  retailer: Retailer;
  type: string; // e.g., "Xử Lý Bởi Shopee", "Shopee Siêu Rẻ"
  discountAmount: string; // e.g., "20%"
  minSpend: string; // e.g., "100.000đ"
  note?: string;
  expiryDate?: string; // e.g., "29/01"
  affiliateUrl: string;
  code: string;
  isAppOnly?: boolean;
  label?: string; // e.g., "Hiệu lực: 00:00 22/01"
}

export interface Post {
  id: string;
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  imageUrl: string;
  createdAt: string;
  relatedProductIds: string[];
}

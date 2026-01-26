
import { Product, Category, Retailer, Post, Voucher } from './types';

// Updated Categories based on SEO structure
export const CATEGORIES: Category[] = [
  { id: 'c1', name: 'Thời trang', slug: 'fashion', icon: 'shirt' },
  { id: 'c2', name: 'Giày dép', slug: 'footwear', icon: 'footprints' },
  { id: 'c3', name: 'Phụ kiện & Trang sức', slug: 'accessories', icon: 'watch' },
  { id: 'c4', name: 'Mỹ phẩm & Làm đẹp', slug: 'beauty', icon: 'sparkles' },
  { id: 'c5', name: 'Mẹ & Bé / Đồ chơi', slug: 'mom-baby-toys', icon: 'baby' },
  { id: 'c6', name: 'Sức khỏe', slug: 'health', icon: 'heart-pulse' },
  { id: 'c7', name: 'Giặt Giũ & Nhà Cửa', slug: 'home-care', icon: 'home' },
];

const generateProducts = (count: number): Product[] => {
  const products: Product[] = [];
  const brands = ['Shopee Mall', 'Loreal', 'Adidas', 'Pampers', 'Unilever', 'Samsung', 'Coolmate', 'Anker'];
  
  for (let i = 0; i < count; i++) {
    const isDeal = i % 5 === 0;
    const category = CATEGORIES[i % CATEGORIES.length];
    const priceRegular = Math.floor(Math.random() * 2000000) + 50000;
    const discount = isDeal ? Math.floor(Math.random() * 40) + 10 : Math.floor(Math.random() * 10);
    const priceDeal = Math.floor(priceRegular * (1 - discount / 100));
    
    products.push({
      id: `p${i}`,
      title: `Sản phẩm ${category.name} mẫu mới ${2024 + i} - Chính hãng`,
      slug: `product-${i}-${category.slug}`,
      categoryId: category.slug, // Use slug for easier linking
      brand: brands[i % brands.length],
      imageUrl: `https://picsum.photos/400/400?random=${i}`,
      priceRegular,
      priceDeal,
      discountPercent: discount,
      rating: 4.5 + Math.random() * 0.5,
      ratingCount: 100 + Math.floor(Math.random() * 5000),
      soldCount: 50 + Math.floor(Math.random() * 10000),
      retailer: Retailer.SHOPEE,
      affiliateUrl: 'https://shopee.vn',
      isHot: i % 10 === 0,
      isDeal: isDeal,
      tags: ['Freeship', 'Hoàn xu'],
      specs: { "Xuất xứ": "Việt Nam", "Tình trạng": "Mới 100%" }
    });
  }
  return products;
};

export const MOCK_PRODUCTS = generateProducts(60);

const AFF_URL = 'https://s.shopee.vn/4LDGS0WTR5';

export const MOCK_VOUCHERS: Voucher[] = [
  {
    id: 'v1',
    retailer: Retailer.SHOPEE,
    type: 'Xử Lý Bởi Shopee',
    discountAmount: 'Giảm 20%',
    minSpend: '100.000đ',
    note: 'Voucher áp dụng cho một số sản phẩm tham gia chương trình Shopee Video.',
    expiryDate: '29/01',
    code: 'SHOPEE20',
    affiliateUrl: AFF_URL
  },
  {
    id: 'v2',
    retailer: Retailer.SHOPEE,
    type: 'Shopee Siêu Rẻ',
    discountAmount: 'Giảm 30%',
    minSpend: '10.000đ',
    note: 'Áp dụng cho các sản phẩm thuộc ngành hàng Shopee Siêu Rẻ.',
    expiryDate: '31/01',
    code: 'SIEURE30',
    affiliateUrl: AFF_URL
  },
  {
    id: 'v3',
    retailer: Retailer.SHOPEE,
    type: 'Shopee Siêu Rẻ',
    discountAmount: 'Giảm 30%',
    minSpend: '10.000đ',
    note: 'Ưu đãi dành riêng cho sản phẩm được trợ giá tại mục Siêu Rẻ.',
    expiryDate: '31/01',
    code: 'SIEURE30_2',
    affiliateUrl: AFF_URL
  },
  {
    id: 'v4',
    retailer: Retailer.SHOPEE,
    type: 'Shop Nổi Bật',
    discountAmount: 'Giảm 20%',
    minSpend: '100.000đ',
    note: 'Voucher áp dụng cho các sản phẩm từ Top Shop được yêu thích.',
    expiryDate: '30/01',
    code: 'SHOPNOIBAT20',
    affiliateUrl: AFF_URL
  },
  {
    id: 'v5',
    retailer: Retailer.SHOPEE,
    type: 'Shop Nổi Bật',
    discountAmount: 'Giảm 20%',
    minSpend: '200.000đ',
    note: 'Áp dụng cho đơn hàng được thanh toán qua ví ShopeePay.',
    expiryDate: '30/01',
    code: 'SHOPNOIBAT20_2',
    affiliateUrl: AFF_URL
  },
  {
    id: 'v6',
    retailer: Retailer.SHOPEE,
    type: 'Xử Lý Bởi Shopee',
    discountAmount: 'Giảm 20%',
    minSpend: '150.000đ',
    note: 'Chỉ áp dụng trên App cho một số sản phẩm được xử lý bởi hệ thống.',
    expiryDate: '31/01',
    code: 'XULY20',
    affiliateUrl: AFF_URL,
    isAppOnly: true
  },
  {
    id: 'v7',
    retailer: Retailer.SHOPEE,
    type: 'Xử Lý Bởi Shopee',
    discountAmount: 'Giảm 20%',
    minSpend: '150.000đ',
    note: 'Mã giảm giá có hạn, ưu tiên sử dụng cho các đơn hàng hoàn tất sớm.',
    expiryDate: '31/01',
    code: 'XULY20_2',
    affiliateUrl: AFF_URL,
    isAppOnly: true
  },
  {
    id: 'v8',
    retailer: Retailer.SHOPEE,
    type: 'Voucher Xtra',
    discountAmount: 'Giảm 15%',
    minSpend: '50.000đ',
    note: 'Mã giảm giá Xtra áp dụng toàn sàn cho sản phẩm có logo Voucher Xtra.',
    label: 'Hiệu lực: 00:00 22/01',
    code: 'XTRA15',
    affiliateUrl: AFF_URL,
    isAppOnly: true
  },
  {
    id: 'v9',
    retailer: Retailer.SHOPEE,
    type: 'Voucher Xtra',
    discountAmount: 'Giảm 18%',
    minSpend: '700.000đ',
    note: 'Mã giảm giá lớn dành cho các đơn hàng giá trị cao từ 700k.',
    expiryDate: '20/01',
    code: 'XTRA18',
    affiliateUrl: AFF_URL,
    isAppOnly: true
  },
  {
    id: 'v10',
    retailer: Retailer.SHOPEE,
    type: 'Voucher Xtra',
    discountAmount: 'Giảm 16%',
    minSpend: '500.000đ',
    note: 'Chỉ áp dụng trên App cho các sản phẩm tham gia chương trình Hoàn Xu.',
    expiryDate: '20/01',
    code: 'XTRA16',
    affiliateUrl: AFF_URL,
    isAppOnly: true
  },
  {
    id: 'v11',
    retailer: Retailer.SHOPEE,
    type: 'Voucher Xtra',
    discountAmount: 'Giảm 20%',
    minSpend: '900.000đ',
    note: 'Giảm giá sâu cho các thiết bị điện tử và gia dụng chính hãng.',
    expiryDate: '20/01',
    code: 'XTRA20',
    affiliateUrl: AFF_URL,
    isAppOnly: true
  },
  {
    id: 'v12',
    retailer: Retailer.SHOPEE,
    type: 'Voucher Xtra',
    discountAmount: 'Giảm 14%',
    minSpend: '500.000đ',
    note: 'Áp dụng cho danh mục Thời trang và Mỹ phẩm chính hãng.',
    expiryDate: '31/01',
    code: 'XTRA14',
    affiliateUrl: AFF_URL,
    isAppOnly: true
  }
];

export const MOCK_POSTS: Post[] = [
  {
    id: 'post1',
    title: 'Top 5 Tai nghe chống ồn dưới 1 triệu đáng mua nhất 2024',
    slug: 'top-5-tai-nghe-chong-on',
    excerpt: 'Đánh giá chi tiết các mẫu tai nghe giá rẻ nhưng chất lượng âm thanh cực đỉnh.',
    content: 'Chi tiết bài viết về tai nghe...',
    imageUrl: 'https://picsum.photos/800/400?random=post1',
    createdAt: new Date().toISOString(),
    relatedProductIds: ['p1', 'p2']
  },
  {
    id: 'post2',
    title: 'Kinh nghiệm săn sale ngày đôi không thể bỏ lỡ',
    slug: 'kinh-nghiem-san-sale',
    excerpt: 'Bí kíp lấy mã giảm giá và freeship hiệu quả trên các sàn TMĐT.',
    content: 'Chi tiết bài viết về săn sale...',
    imageUrl: 'https://picsum.photos/800/400?random=post2',
    createdAt: new Date().toISOString(),
    relatedProductIds: ['p10']
  }
];

export const MOCK_STATS = {
  totalClicks: 12540,
  ctr: 4.8,
  topProducts: [
    { title: 'Tai nghe Sony WH-1000XM5', clicks: 1200 },
    { title: 'iPhone 15 Pro Max', clicks: 950 },
    { title: 'Bàn phím cơ Keychron K2', clicks: 800 },
  ],
  clicksByRetailer: {
    [Retailer.SHOPEE]: 8500,
    [Retailer.LAZADA]: 2500,
    [Retailer.TIKI]: 1000,
    [Retailer.TIKTOK]: 540,
  }
};

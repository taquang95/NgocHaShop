
import React, { useEffect, useState, useMemo } from 'react';
import { useParams, useSearchParams, Link } from 'react-router-dom';
import { ProductCard } from '../components/ProductCard';
import { VoucherCard } from '../components/VoucherCard';
import { Product, Retailer, Voucher } from '../types';
import { useProducts } from '../context/ProductContext';
import { Star, Filter, X, ChevronDown, ChevronUp, BookOpen, Tag } from 'lucide-react';
import { CATEGORIES, MOCK_VOUCHERS } from '../constants';

// --- SUB-CATEGORY SEO TITLES CONFIGURATION ---
const SUB_CATEGORY_TITLES: Record<string, string> = {
  // Fashion
  'women-tops': 'Áo Kiểu & Sơ Mi Nữ Thời Trang',
  'dresses': 'Đầm & Chân Váy Nữ Đẹp',
  'women-pants': 'Quần Jean & Quần Kaki Nữ',
  'homewear': 'Đồ Bộ Mặc Nhà & Đồ Ngủ Nữ',
  'men-tops': 'Áo Thun, Polo & Sơ Mi Nam',
  'men-pants': 'Quần Tây, Jean & Kaki Nam',
  'jackets': 'Áo Khoác Nam Nữ & Hoodie',
  'sportswear': 'Đồ Thể Thao, Gym & Yoga',
  // Accessories
  'bags': 'Túi Xách, Ví & Balo Thời Trang',
  // Beauty
  'cleanser': 'Sữa Rửa Mặt & Tẩy Trang Chính Hãng',
  'toner': 'Nước Hoa Hồng & Toner Cân Bằng Da',
  'serum': 'Serum, Tinh Chất & Đặc Trị',
  'sunscreen': 'Kem Chống Nắng Bảo Vệ Da',
  'lipstick': 'Son Môi Cao Cấp & Bình Dân',
  'makeup-face': 'Phấn Nền, Cushion & Che Khuyết Điểm',
  'makeup-eye': 'Trang Điểm Mắt, Kẻ Mắt & Mascara',
  'body': 'Sữa Tắm, Dưỡng Thể & Tẩy Tế Bào Chết',
  'hair': 'Dầu Gội, Dầu Xả & Chăm Sóc Tóc',
  'perfume': 'Nước Hoa Nam Nữ Chính Hãng',
  // Mom & Baby
  'diapers': 'Tã & Bỉm Cho Bé Khô Thoáng',
  'milk': 'Sữa Công Thức & Dinh Dưỡng Cho Bé',
  'feeding': 'Bình Sữa & Dụng Cụ Ăn Dặm',
  'clothes': 'Quần Áo Sơ Sinh & Trẻ Em',
  'toys-edu': 'Đồ Chơi Giáo Dục & Trí Tuệ',
  'toys-active': 'Đồ Chơi Vận Động & Ngoài Trời',
  // Home Care
  'laundry': 'Nước Giặt & Nước Xả Vải Thơm Lâu',
  'kitchen': 'Nước Rửa Chén & Vệ Sinh Nhà Bếp',
  'air': 'Xịt Phòng & Sáp Thơm Khử Mùi',
  'tools': 'Dụng Cụ Nhà Bếp & Tiện Ích',
  'organize': 'Hộp Đựng & Sắp Xếp Nhà Cửa',
  // Health
  'supplements': 'Thực Phẩm Chức Năng Bảo Vệ Sức Khỏe',
  'vitamins': 'Vitamin & Khoáng Chất Thiết Yếu',
  'devices': 'Thiết Bị Y Tế Gia Đình (Máy Đo HA, Nhiệt Kế)',
  // Deals
  'voucher': 'Tổng Hợp Mã Giảm Giá & Voucher Độc Quyền'
};

// Default SEO Content
const CATEGORY_SEO_DATA: Record<string, { title: string; content: string }> = {
  'fashion': {
    title: 'Thời Trang Nam Nữ & Trẻ Em: Mặc Đẹp Mỗi Ngày',
    content: `
      <p class="mb-4">Chào mừng bạn đến với thiên đường <strong>thời trang</strong> tại Ngọc Hà Shop. Chúng tôi mang đến những bộ sưu tập đa dạng, giúp bạn "chọn đúng - mặc đẹp" cho mọi hoàn cảnh.</p>
      <h3 class="text-lg font-bold text-gray-900 mt-6 mb-3">Xu hướng thời trang mới nhất</h3>
      <p>Cập nhật liên tục các mẫu áo thun, sơ mi, váy đầm và quần jean hot trend. Chất liệu thoáng mát, form dáng chuẩn phù hợp với người Việt.</p>
    `
  },
  'beauty': {
    title: 'Mỹ Phẩm & Làm Đẹp Chính Hãng',
    content: `
      <p class="mb-4">Chăm sóc bản thân toàn diện với các sản phẩm <strong>làm đẹp</strong> chính hãng, an toàn và hiệu quả.</p>
      <h3 class="text-lg font-bold text-gray-900 mt-6 mb-3">Quy trình Skincare chuẩn</h3>
      <p>Đầy đủ các bước từ Sữa rửa mặt, Toner, Serum đặc trị đến Kem dưỡng ẩm và Kem chống nắng bảo vệ da.</p>
    `
  },
  'mom-baby-toys': {
    title: 'Mẹ & Bé - Đồ Chơi Trẻ Em An Toàn',
    content: `
      <p class="mb-4">Ngọc Hà Shop đồng hành cùng ba mẹ trên hành trình khôn lớn của bé với các sản phẩm an toàn, chất lượng từ các thương hiệu uy tín.</p>
    `
  },
  'home-care': {
    title: 'Giặt Giũ & Chăm Sóc Nhà Cửa',
    content: `
      <p class="mb-4">Giải phóng sức lao động và giữ cho ngôi nhà luôn sạch sẽ, thơm mát với các giải pháp giặt giũ và vệ sinh hiệu quả.</p>
    `
  },
  'health': {
    title: 'Sức Khỏe & Thiết Bị Y Tế Gia Đình',
    content: `
      <p class="mb-4">Chăm sóc sức khỏe chủ động cho cả gia đình với các sản phẩm thực phẩm chức năng và thiết bị y tế chính hãng.</p>
    `
  },
  'deals': {
    title: 'Săn Deal Hot & Mã Giảm Giá Hôm Nay',
    content: `
      <p class="mb-4">Tổng hợp các deal giảm giá sâu nhất từ Shopee, Lazada, Tiki. Cập nhật liên tục mỗi giờ.</p>
    `
  },
  'default': {
    title: 'Ngọc Hà Shop - Mua Sắm Thông Minh, Tiết Kiệm',
    content: `
      <p class="mb-4">Ngọc Hà Shop giúp bạn "chọn đúng - mua dễ" với hàng ngàn sản phẩm được tuyển chọn kỹ lưỡng. Cam kết thông tin minh bạch và giá cả hợp lý.</p>
    `
  }
};

export const CategoryPage: React.FC = () => {
  const { slug } = useParams<{ slug: string }>();
  const [searchParams] = useSearchParams();
  const searchQuery = searchParams.get('q');
  const typeParam = searchParams.get('type'); // Sub-category
  const retailerParam = searchParams.get('retailer');
  const catParam = searchParams.get('cat'); // Broad category group
  
  const { products: allProducts, loading: globalLoading } = useProducts();
  const [filteredProducts, setFilteredProducts] = useState<Product[]>([]);
  const [filteredVouchers, setFilteredVouchers] = useState<Voucher[]>([]);
  const [loading, setLoading] = useState(true);
  const [isSeoExpanded, setIsSeoExpanded] = useState(false);
  const [isMobileFiltersOpen, setIsMobileFiltersOpen] = useState(false);

  // Filter States
  const [selectedBrands, setSelectedBrands] = useState<string[]>([]);
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [minPrice, setMinPrice] = useState<string>('');
  const [maxPrice, setMaxPrice] = useState<string>('');
  const [minRating, setMinRating] = useState<number | null>(null);

  // Helper to match keywords for heuristic filtering
  const match = (p: Product, keywords: string[]) => {
      const text = (p.title + ' ' + (p.specs ? JSON.stringify(p.specs) : '')).toLowerCase();
      return keywords.some(k => text.includes(k));
  };

  useEffect(() => {
    setLoading(true);
    setIsSeoExpanded(false);
    setIsMobileFiltersOpen(false);

    const timeout = setTimeout(() => {
      // 1. Handle Vouchers Special Case
      if (typeParam === 'voucher') {
         setFilteredVouchers(MOCK_VOUCHERS); // In real app, filter mock vouchers if needed
         setFilteredProducts([]);
         setLoading(false);
         return; 
      } else {
         setFilteredVouchers([]);
      }

      // 2. Filter Products
      let filtered = allProducts;

      // Base Category Slug Filtering
      if (slug && slug !== 'all' && slug !== 'search') {
        if (slug === 'deals') {
           filtered = filtered.filter(p => p.isDeal);
        } else if (slug === 'top') {
           filtered = filtered.filter(p => p.rating >= 4.8);
        } else {
           filtered = filtered.filter(p => p.categoryId === slug);
        }
      }

      // Query Params Filtering
      if (retailerParam) {
         filtered = filtered.filter(p => p.retailer.toLowerCase() === retailerParam.toLowerCase());
      }

      if (catParam) {
          if (catParam === 'tech') filtered = filtered.filter(p => ['accessories', 'smartphone'].includes(p.categoryId) || match(p, ['điện thoại', 'tai nghe', 'sạc', 'cáp']));
          if (catParam === 'beauty') filtered = filtered.filter(p => p.categoryId === 'beauty');
          if (catParam === 'fashion') filtered = filtered.filter(p => p.categoryId === 'fashion' || p.categoryId === 'footwear');
      }

      if (typeParam) {
        switch(typeParam) {
          // Fashion
          case 'women-tops': filtered = filtered.filter(p => match(p, ['áo', 'sơ mi', 'kiểu']) && match(p, ['nữ'])); break;
          case 'women-pants': filtered = filtered.filter(p => match(p, ['quần']) && match(p, ['nữ'])); break;
          case 'dresses': filtered = filtered.filter(p => match(p, ['đầm', 'váy', 'maxi'])); break;
          case 'homewear': filtered = filtered.filter(p => match(p, ['bộ', 'nhà', 'ngủ', 'pijama'])); break;
          case 'men-tops': filtered = filtered.filter(p => match(p, ['áo']) && match(p, ['nam'])); break;
          case 'men-pants': filtered = filtered.filter(p => match(p, ['quần']) && match(p, ['nam'])); break;
          case 'jackets': filtered = filtered.filter(p => match(p, ['khoác', 'hoodie', 'bomber'])); break;
          case 'sportswear': filtered = filtered.filter(p => match(p, ['thể thao', 'gym', 'yoga', 'legging'])); break;
          // Accessories
          case 'bags': filtered = filtered.filter(p => match(p, ['túi', 'ví', 'balo'])); break;
          // Beauty
          case 'cleanser': filtered = filtered.filter(p => match(p, ['rửa mặt', 'tẩy trang'])); break;
          case 'toner': filtered = filtered.filter(p => match(p, ['toner', 'hoa hồng', 'cân bằng'])); break;
          case 'serum': filtered = filtered.filter(p => match(p, ['serum', 'tinh chất', 'ampoule'])); break;
          case 'sunscreen': filtered = filtered.filter(p => match(p, ['chống nắng'])); break;
          case 'lipstick': filtered = filtered.filter(p => match(p, ['son'])); break;
          case 'makeup-face': filtered = filtered.filter(p => match(p, ['phấn', 'nền', 'cushion', 'che khuyết'])); break;
          case 'makeup-eye': filtered = filtered.filter(p => match(p, ['mắt', 'mascara', 'kẻ', 'brow'])); break;
          case 'body': filtered = filtered.filter(p => match(p, ['tắm', 'thể', 'body', 'lotion'])); break;
          case 'hair': filtered = filtered.filter(p => match(p, ['gội', 'xả', 'tóc', 'ủ'])); break;
          case 'perfume': filtered = filtered.filter(p => match(p, ['nước hoa', 'thơm', 'bodymist'])); break;
          // Mom & Baby
          case 'diapers': filtered = filtered.filter(p => match(p, ['bỉm', 'tã'])); break;
          case 'milk': filtered = filtered.filter(p => match(p, ['sữa', 'nan', 'grow'])); break;
          case 'feeding': filtered = filtered.filter(p => match(p, ['bình', 'núm', 'ăn dặm', 'thìa'])); break;
          case 'clothes': filtered = filtered.filter(p => match(p, ['áo', 'quần', 'bodysuit', 'sơ sinh'])); break;
          case 'toys-edu': filtered = filtered.filter(p => match(p, ['học', 'xếp', 'trí tuệ', 'chữ'])); break;
          case 'toys-active': filtered = filtered.filter(p => match(p, ['xe', 'bóng', 'vận động', 'trượt'])); break;
          // Home Care
          case 'laundry': filtered = filtered.filter(p => match(p, ['giặt', 'xả', 'omo', 'ariel'])); break;
          case 'kitchen': filtered = filtered.filter(p => match(p, ['rửa chén', 'bếp', 'lau', 'cọ'])); break;
          case 'air': filtered = filtered.filter(p => match(p, ['xịt', 'sáp', 'thơm', 'tinh dầu'])); break;
          case 'tools': filtered = filtered.filter(p => match(p, ['dụng cụ', 'kệ', 'hộp', 'thớt', 'dao'])); break;
          case 'organize': filtered = filtered.filter(p => match(p, ['tủ', 'móc', 'giỏ', 'treo'])); break;
          // Health
          case 'supplements': filtered = filtered.filter(p => match(p, ['thực phẩm', 'viên', 'bổ', 'collagen'])); break;
          case 'vitamins': filtered = filtered.filter(p => match(p, ['vitamin', 'khoáng', 'kẽm', 'canxi'])); break;
          case 'devices': filtered = filtered.filter(p => match(p, ['máy', 'đo', 'kế', 'huyết áp'])); break;
        }
      }

      // Search Query
      if (searchQuery) {
        const q = searchQuery.toLowerCase();
        filtered = filtered.filter(p => p.title.toLowerCase().includes(q) || p.brand.toLowerCase().includes(q));
      }

      // Sidebar Filters
      if (selectedBrands.length > 0) {
        filtered = filtered.filter(p => selectedBrands.includes(p.brand));
      }
      if (selectedCategories.length > 0) {
        filtered = filtered.filter(p => selectedCategories.includes(p.categoryId));
      }
      if (minPrice) {
        filtered = filtered.filter(p => (p.priceDeal || p.priceRegular) >= parseInt(minPrice));
      }
      if (maxPrice) {
        filtered = filtered.filter(p => (p.priceDeal || p.priceRegular) <= parseInt(maxPrice));
      }
      if (minRating !== null) {
        filtered = filtered.filter(p => p.rating >= minRating);
      }
      
      setFilteredProducts(filtered);
      setLoading(false);
    }, 300);

    return () => clearTimeout(timeout);
  }, [slug, searchQuery, typeParam, retailerParam, catParam, allProducts, selectedBrands, selectedCategories, minPrice, maxPrice, minRating]);

  // --- DERIVED DATA ---
  const availableBrands = useMemo(() => Array.from(new Set(allProducts.map(p => p.brand))).filter(Boolean).sort(), [allProducts]);
  const availableCategories = useMemo(() => Array.from(new Set(allProducts.map(p => p.categoryId))).filter(Boolean).sort(), [allProducts]);
  const getCategoryName = (slug: string) => {
    const cat = CATEGORIES.find(c => c.slug === slug);
    return cat ? cat.name : slug;
  };

  const clearFilters = () => {
    setSelectedBrands([]);
    setSelectedCategories([]);
    setMinPrice('');
    setMaxPrice('');
    setMinRating(null);
  };

  // --- SEO DATA GENERATION ---
  const seoInfo = useMemo(() => {
    if (searchQuery) return { title: `Kết quả tìm kiếm cho: "${searchQuery}"`, content: '' };
    
    let title = '';
    let content = '';

    // Priority 1: Sub-category from URL param
    if (typeParam && SUB_CATEGORY_TITLES[typeParam]) {
       title = SUB_CATEGORY_TITLES[typeParam];
       // Inherit content from main category but could be customized further
       const base = CATEGORY_SEO_DATA[slug || ''] || CATEGORY_SEO_DATA['default'];
       content = base.content;
    } 
    // Priority 2: Main Category
    else if (slug && CATEGORY_SEO_DATA[slug]) {
       title = CATEGORY_SEO_DATA[slug].title;
       content = CATEGORY_SEO_DATA[slug].content;
    } 
    // Fallback
    else {
       const base = CATEGORY_SEO_DATA['default'];
       title = base.title;
       content = base.content;
    }

    // Append Brand name to title if only 1 brand selected
    if (selectedBrands.length === 1) {
       title = `${selectedBrands[0]} - ${title}`;
    }

    return { title, content };
  }, [slug, typeParam, searchQuery, selectedBrands]);

  // --- SCHEMA INJECTION ---
  useEffect(() => {
    if (!seoInfo.title) return;

    // Breadcrumb Schema
    const itemListElement = [
        {
          "@type": "ListItem",
          "position": 1,
          "name": "Home",
          "item": "https://ngochashop.com"
        }
    ];

    if (slug && slug !== 'all') {
        itemListElement.push({
           "@type": "ListItem",
           "position": 2,
           "name": getCategoryName(slug),
           "item": `https://ngochashop.com/#/category/${slug}`
        });
    }

    if (typeParam && SUB_CATEGORY_TITLES[typeParam]) {
        itemListElement.push({
           "@type": "ListItem",
           "position": 3,
           "name": SUB_CATEGORY_TITLES[typeParam],
           "item": window.location.href
        });
    }

    const collectionSchema = {
      "@context": "https://schema.org",
      "@type": "CollectionPage",
      "name": seoInfo.title,
      "description": seoInfo.content.replace(/<[^>]*>?/gm, '').slice(0, 160) + '...',
      "url": window.location.href,
      "breadcrumb": {
        "@type": "BreadcrumbList",
        "itemListElement": itemListElement
      }
    };

    const script = document.createElement('script');
    script.type = 'application/ld+json';
    script.text = JSON.stringify(collectionSchema);
    document.head.appendChild(script);
    document.title = `${seoInfo.title} - NgocHaShop.com`;

    return () => {
      if (document.head.contains(script)) {
        document.head.removeChild(script);
      }
    };
  }, [seoInfo, slug, typeParam]);

  if (globalLoading) {
     return <div className="max-w-7xl mx-auto px-4 py-12 text-center text-gray-500 font-medium">Đang tải dữ liệu sản phẩm...</div>;
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <div className="flex flex-col md:flex-row gap-8">
        
        {/* Sidebar Filter (Hidden for Vouchers) */}
        {typeParam !== 'voucher' && (
        <aside className="w-full md:w-64 flex-shrink-0">
          <div className="bg-white rounded-xl border border-gray-200 sticky top-24 md:max-h-[calc(100vh-120px)] md:overflow-y-auto scrollbar-hide shadow-sm transition-all duration-300">
            {/* Filter Header */}
            <div 
              className="p-4 md:p-5 flex items-center justify-between cursor-pointer md:cursor-default"
              onClick={() => setIsMobileFiltersOpen(!isMobileFiltersOpen)}
            >
              <h3 className="font-bold flex items-center gap-2 text-gray-900">
                <Filter size={18} className="text-primary" />
                Bộ Lọc
              </h3>
              
              <div className="flex items-center gap-3">
                 {(selectedBrands.length > 0 || selectedCategories.length > 0 || minPrice || maxPrice || minRating) && (
                    <button 
                      onClick={(e) => { e.stopPropagation(); clearFilters(); }} 
                      className="text-xs text-red-500 hover:underline flex items-center gap-0.5 font-medium"
                    >
                      <X size={12} /> Xóa hết
                    </button>
                  )}
                  <div className="md:hidden text-gray-400">
                    {isMobileFiltersOpen ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
                  </div>
              </div>
            </div>
            
            {/* Filter Content */}
            <div className={`p-4 md:p-5 pt-0 md:pt-0 space-y-6 ${isMobileFiltersOpen ? 'block border-t border-gray-100 md:border-0 pt-4' : 'hidden md:block'}`}>
              <div>
                <label className="text-sm font-semibold mb-2 block text-gray-700">Khoảng giá</label>
                <div className="flex gap-2">
                   <input type="number" placeholder="Từ" value={minPrice} onChange={(e) => setMinPrice(e.target.value)} className="w-full px-2 py-2 text-sm border border-gray-200 rounded-lg bg-gray-50 focus:outline-none focus:ring-1 focus:ring-primary" />
                   <input type="number" placeholder="Đến" value={maxPrice} onChange={(e) => setMaxPrice(e.target.value)} className="w-full px-2 py-2 text-sm border border-gray-200 rounded-lg bg-gray-50 focus:outline-none focus:ring-1 focus:ring-primary" />
                </div>
              </div>

              <div>
                <label className="text-sm font-semibold mb-2 block text-gray-700">Thương hiệu</label>
                <div className="space-y-2 max-h-40 overflow-y-auto pr-2 scrollbar-hide">
                  {availableBrands.map(brand => (
                    <label key={brand} className="flex items-center gap-2 text-sm text-gray-600 cursor-pointer">
                      <input type="checkbox" checked={selectedBrands.includes(brand)} onChange={() => {
                        setSelectedBrands(prev => prev.includes(brand) ? prev.filter(b => b !== brand) : [...prev, brand]);
                      }} className="rounded text-primary focus:ring-primary" /> 
                      <span className={selectedBrands.includes(brand) ? 'text-primary font-medium' : ''}>{brand}</span>
                    </label>
                  ))}
                </div>
              </div>

              <div>
                <label className="text-sm font-semibold mb-2 block text-gray-700">Danh mục</label>
                <div className="space-y-2 max-h-40 overflow-y-auto pr-2 scrollbar-hide">
                  {availableCategories.map(cat => (
                    <label key={cat} className="flex items-center gap-2 text-sm text-gray-600 cursor-pointer">
                      <input type="checkbox" checked={selectedCategories.includes(cat)} onChange={() => {
                         setSelectedCategories(prev => prev.includes(cat) ? prev.filter(c => c !== cat) : [...prev, cat]);
                      }} className="rounded text-primary focus:ring-primary" /> 
                      <span className={selectedCategories.includes(cat) ? 'text-primary font-medium' : ''}>{getCategoryName(cat)}</span>
                    </label>
                  ))}
                </div>
              </div>

              <div>
                <label className="text-sm font-semibold mb-2 block text-gray-700">Xếp hạng</label>
                <div className="space-y-2">
                  {[4.9, 4, 3].map(r => (
                    <label key={r} className="flex items-center gap-2 text-sm text-gray-600 cursor-pointer">
                      <input type="radio" name="rating" checked={minRating === r} onChange={() => setMinRating(r)} className="text-primary focus:ring-primary" /> 
                      <span className="flex items-center gap-1">
                        {r.toString().replace('.', ',')} sao trở lên <Star size={12} fill="currentColor" className="text-yellow-500" />
                      </span>
                    </label>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </aside>
        )}

        {/* Main Grid */}
        <div className="flex-grow">
          {typeParam === 'voucher' ? (
             /* --- VOUCHER DISPLAY MODE --- */
             <div>
                <h1 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-2">
                   <Tag className="text-[#26aa99]" /> {seoInfo.title}
                </h1>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                   {filteredVouchers.map(v => (
                      <VoucherCard key={v.id} voucher={v} />
                   ))}
                </div>
                {filteredVouchers.length === 0 && <div className="text-center py-20 text-gray-500">Chưa có mã giảm giá nào.</div>}
             </div>
          ) : (
             /* --- PRODUCT DISPLAY MODE --- */
             <>
               <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
                <div>
                  <h1 className="text-2xl font-bold text-gray-900 capitalize leading-tight">
                    {seoInfo.title}
                  </h1>
                  <p className="text-sm text-gray-500 mt-1">Tìm thấy {filteredProducts.length} sản phẩm phù hợp</p>
                </div>
                
                <div className="flex items-center gap-2 w-full md:w-auto">
                  <span className="text-sm text-gray-500 hidden sm:block">Sắp xếp:</span>
                  <select className="bg-white border border-gray-200 text-sm rounded-lg px-3 py-2 outline-none focus:ring-1 focus:ring-primary w-full md:w-auto shadow-sm">
                     <option>Phổ biến nhất</option>
                     <option>Giá thấp đến cao</option>
                     <option>Giá cao đến thấp</option>
                     <option>Mới nhất</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
                 {loading ? (
                    Array(8).fill(0).map((_, i) => <ProductCard key={i} product={{} as any} isLoading />)
                 ) : (
                    filteredProducts.length > 0 ? (
                      filteredProducts.map(p => <ProductCard key={p.id} product={p} />)
                    ) : (
                      <div className="col-span-full py-20 text-center bg-white rounded-2xl border border-dashed border-gray-300">
                        <div className="bg-gray-50 inline-block p-6 rounded-full mb-4">
                           <Filter className="w-12 h-12 text-gray-300" />
                        </div>
                        <p className="text-gray-500 font-medium text-lg">Không tìm thấy sản phẩm phù hợp.</p>
                        <button onClick={clearFilters} className="mt-4 text-primary font-bold hover:underline">
                          Xóa bộ lọc
                        </button>
                      </div>
                    )
                 )}
              </div>
             </>
          )}

          {/* SEO Content Section (Bottom) */}
          {seoInfo.content && !loading && (filteredProducts.length > 0 || typeParam === 'voucher') && (
            <div className="mt-16 pt-8 border-t border-gray-200">
              <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
                 <div className="p-6 md:p-8">
                    <div className="flex items-center gap-3 mb-6">
                       <BookOpen className="text-primary w-6 h-6" />
                       <h2 className="text-xl font-bold text-gray-900">Thông tin hữu ích</h2>
                    </div>
                    <div className={`prose prose-sm max-w-none text-gray-600 leading-relaxed relative ${!isSeoExpanded ? 'max-h-[160px] overflow-hidden' : ''}`}>
                       <div dangerouslySetInnerHTML={{ __html: seoInfo.content }} />
                       {!isSeoExpanded && (
                          <div className="absolute bottom-0 left-0 right-0 h-24 bg-gradient-to-t from-white to-transparent pointer-events-none" />
                       )}
                    </div>
                    
                    <div className="mt-6 flex justify-center">
                       <button onClick={() => setIsSeoExpanded(!isSeoExpanded)} className="flex items-center gap-2 px-6 py-2.5 bg-gray-50 hover:bg-gray-100 text-gray-700 font-bold rounded-full transition-all border border-gray-200 text-sm">
                          {isSeoExpanded ? <><span className="text-xs">THU GỌN</span> <ChevronUp size={16} /></> : <><span className="text-xs">XEM THÊM</span> <ChevronDown size={16} /></>}
                       </button>
                    </div>
                 </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};


import React, { useEffect, useState, useMemo } from 'react';
import { useParams, Link } from 'react-router-dom';
import { 
  Star, ExternalLink, Shield, 
  ChevronRight, ChevronDown, HelpCircle,
  Truck, RotateCcw, ShieldCheck, Zap, ChevronUp
} from 'lucide-react';
import { Product } from '../types';
import { Button } from '../components/ui/Button';
import { ProductCard } from '../components/ProductCard';
import { trackClick } from '../services/analytics';
import { useProducts } from '../context/ProductContext';
import { CATEGORIES } from '../constants';

const getRichContent = (product: Product) => ({
  shortDescription: `${product.shortDescription || product.title + ' ghi điểm với người dùng nhờ thiết kế sang trọng, hiệu năng mạnh mẽ trong tầm giá.'}`,
  description: product.description || `Sản phẩm **${product.title}** từ thương hiệu **${product.brand}** đang là lựa chọn hàng đầu.`,
  faqs: [
    { q: 'Hàng có sẵn không?', a: 'Toàn bộ sản phẩm trên website đều là hàng có sẵn.' },
    { q: 'Sản phẩm có giống hình không?', a: 'Chúng tôi cam kết hình ảnh 100% là ảnh thật.' },
    { q: 'Có được kiểm tra hàng không?', a: 'Có, bạn được kiểm tra hàng trước khi thanh toán.' }
  ]
});

export const ProductDetail: React.FC = () => {
  const { slug } = useParams<{ slug: string }>();
  const { products, loading: globalLoading } = useProducts();
  
  const [product, setProduct] = useState<Product | null>(null);
  const [relatedProducts, setRelatedProducts] = useState<Product[]>([]);
  const [activeImage, setActiveImage] = useState<string>('');
  const [openFaqIndex, setOpenFaqIndex] = useState<number | null>(0);
  const [isDescriptionExpanded, setIsDescriptionExpanded] = useState(false);

  // Tìm sản phẩm ngay lập tức khi danh sách sản phẩm thay đổi (nhận dữ liệu từ cache nhanh hơn network)
  useEffect(() => {
    if (products.length > 0 && slug) {
      const found = products.find(p => p.slug === slug) || products.find(p => p.id === slug);
      if (found) {
        setProduct(found);
        setActiveImage(found.imageUrl);
        setRelatedProducts(products.filter(p => p.categoryId === found.categoryId && p.id !== found.id).slice(0, 4));
      }
    }
  }, [slug, products]);

  // EFFECT: Inject SEO Meta & JSON-LD vào Head (Tách riêng để chạy ngay khi có 'product')
  useEffect(() => {
    if (!product) return;

    // 1. Cập nhật Meta Tags cơ bản
    const title = `${product.title} - Giảm ${product.discountPercent}% | Ngọc Hà Shop`;
    const description = `Mua ngay ${product.title} chính hãng tại ${product.retailer}. Giá ưu đãi chỉ ${product.priceDeal?.toLocaleString()}đ.`;
    
    document.title = title;
    
    const metaDesc = document.querySelector('meta[name="description"]');
    if (metaDesc) metaDesc.setAttribute('content', description);

    // 2. Tạo Schema JSON-LD
    const productSchema = {
      "@context": "https://schema.org",
      "@type": "Product",
      "name": product.title,
      "image": product.imageUrls && product.imageUrls.length > 0 ? product.imageUrls : [product.imageUrl],
      "description": description,
      "sku": product.id,
      "mpn": product.id,
      "brand": { "@type": "Brand", "name": product.brand || "Ngọc Hà Shop" },
      "offers": {
        "@type": "Offer",
        "url": window.location.href,
        "priceCurrency": "VND",
        "price": product.priceDeal || product.priceRegular,
        "priceValidUntil": "2026-12-31",
        "itemCondition": "https://schema.org/NewCondition",
        "availability": "https://schema.org/InStock",
        "seller": { "@type": "Organization", "name": "Ngọc Hà Shop" }
      },
      "aggregateRating": {
        "@type": "AggregateRating",
        "ratingValue": product.rating || 5,
        "reviewCount": product.ratingCount || 100,
        "bestRating": "5",
        "worstRating": "1"
      }
    };

    const breadcrumbSchema = {
      "@context": "https://schema.org",
      "@type": "BreadcrumbList",
      "itemListElement": [
        { "@type": "ListItem", "position": 1, "name": "Trang chủ", "item": "https://ngochashop.com/" },
        { "@type": "ListItem", "position": 2, "name": getCategoryName(product.categoryId), "item": `https://ngochashop.com/category/${product.categoryId}` },
        { "@type": "ListItem", "position": 3, "name": product.title }
      ]
    };

    const scriptId = 'product-schema-jsonld';
    let scriptTag = document.getElementById(scriptId) as HTMLScriptElement;
    if (!scriptTag) {
      scriptTag = document.createElement('script');
      scriptTag.id = scriptId;
      scriptTag.type = 'application/ld+json';
      document.head.appendChild(scriptTag);
    }
    scriptTag.text = JSON.stringify([productSchema, breadcrumbSchema]);

    return () => {
      const existingScript = document.getElementById(scriptId);
      if (existingScript) existingScript.remove();
    };
  }, [product]);

  const handleBuy = () => {
    if (!product) return;
    trackClick(product.id, product.retailer, 'product_detail');
    window.open(product.affiliateUrl, '_blank');
  };

  const formatSold = (num: number) => num >= 1000 ? (num / 1000).toFixed(0) + 'k' : num.toString();

  function getCategoryName(slug: string) {
    const cat = CATEGORIES.find(c => c.slug === (slug || '').trim());
    return cat ? cat.name : (slug === 'others' ? 'Sản phẩm khác' : slug);
  }

  // Chú ý: Không dùng 'return Loader' nếu globalLoading = false và đã có data từ cache
  if (!product && globalLoading) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-8 animate-pulse">
        <div className="grid md:grid-cols-2 gap-8">
          <div className="bg-gray-200 h-96 rounded-xl"></div>
          <div className="space-y-4">
             <div className="bg-gray-200 h-8 w-3/4 rounded"></div>
             <div className="bg-gray-200 h-20 w-full rounded"></div>
          </div>
        </div>
      </div>
    );
  }

  if (!product) {
    return <div className="py-20 text-center">Không tìm thấy sản phẩm.</div>;
  }

  const richContent = getRichContent(product);
  const descriptionText = product.description || richContent.description;
  const isDescriptionLong = descriptionText.length > 250;
  const displayDescription = !isDescriptionExpanded && isDescriptionLong ? descriptionText.slice(0, 250) + '...' : descriptionText;

  return (
    <div className="bg-[#f8f9fa] min-h-screen pb-24 md:pb-12 font-sans text-gray-800">
      <div className="max-w-7xl mx-auto px-4 py-4">
        {/* Breadcrumb */}
        <nav className="text-sm text-gray-500 mb-6 flex items-center gap-1 overflow-x-auto whitespace-nowrap">
          <Link to="/" className="hover:text-primary">Trang chủ</Link> 
          <ChevronRight size={14} />
          <Link to={`/category/${product.categoryId}`} className="hover:text-primary">{getCategoryName(product.categoryId)}</Link>
          <ChevronRight size={14} />
          <span className="text-gray-900 font-medium truncate">{product.title}</span>
        </nav>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          <div className="lg:col-span-5">
            <div className="sticky top-24 space-y-4">
              <div className="bg-white rounded-2xl overflow-hidden border border-gray-200 shadow-sm relative">
                <div className="aspect-square flex items-center justify-center p-4">
                   <img src={activeImage || product.imageUrl} alt={product.title} className="max-w-full max-h-full object-contain" />
                   {product.discountPercent > 0 && (
                     <span className="absolute top-4 left-4 bg-red-600 text-white text-sm font-bold px-3 py-1 rounded shadow-md z-10">-{product.discountPercent}%</span>
                   )}
                </div>
              </div>
            </div>
          </div>

          <div className="lg:col-span-7 space-y-6">
            <div>
               <h1 className="text-2xl md:text-3xl font-bold text-gray-900 mb-3">{product.title}</h1>
               <div className="flex items-center flex-wrap gap-4 mb-4 text-sm text-gray-500">
                 <div className="flex items-center text-yellow-500 bg-yellow-50 px-2 py-1 rounded-md border border-yellow-100">
                   <span className="font-bold text-base mr-1">{product.rating.toFixed(1)}</span>
                   <Star size={14} fill="currentColor" />
                 </div>
                 <span>Đã bán: {product.soldCount ? formatSold(product.soldCount) : '0'}</span>
                 <span>Thương hiệu: <span className="text-primary font-medium">{product.brand}</span></span>
               </div>

               <div className="bg-white p-5 rounded-xl border border-gray-200 shadow-sm">
                 <div className="bg-red-50 p-4 rounded-xl border border-red-100 mb-4">
                   <p className="text-sm font-semibold text-red-600 mb-2 flex items-center gap-1"><Zap size={16} /> Giá ưu đãi hôm nay</p>
                   <div className="flex items-baseline gap-2">
                     <span className="text-4xl md:text-5xl font-extrabold text-[#d32f2f]">{product.priceDeal?.toLocaleString()}₫</span>
                     {product.discountPercent > 0 && <span className="text-lg text-gray-400 line-through">{product.priceRegular.toLocaleString()}₫</span>}
                   </div>
                 </div>
                 <Button onClick={handleBuy} fullWidth size="lg" className="text-lg h-14 bg-[#ee4d2d] hover:bg-[#d73211] shadow-xl">Mua Ngay <ExternalLink size={20} className="ml-2" /></Button>
               </div>
            </div>

            <section>
              <h2 className="text-xl font-bold mb-3">Mô tả sản phẩm</h2>
              <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
                <div className="whitespace-pre-line text-gray-600 leading-relaxed">{displayDescription}</div>
                {isDescriptionLong && (
                  <button onClick={() => setIsDescriptionExpanded(!isDescriptionExpanded)} className="text-primary font-bold hover:underline mt-4">
                    {isDescriptionExpanded ? 'Thu gọn' : 'Xem chi tiết'}
                  </button>
                )}
              </div>
            </section>
          </div>
        </div>
      </div>
    </div>
  );
};

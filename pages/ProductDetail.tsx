
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
  shortDescription: `${product.title} ghi điểm với người dùng nhờ thiết kế sang trọng, hiệu năng mạnh mẽ trong tầm giá cùng hệ sinh thái đa dạng. Đây là lựa chọn tối ưu cho những ai đang tìm kiếm sự cân bằng giữa chi phí và trải nghiệm.`,
  description: product.description || `Sản phẩm **${product.title}** từ thương hiệu **${product.brand}** đang là lựa chọn hàng đầu trong phân khúc. Với thiết kế hiện đại, sản phẩm này không chỉ đáp ứng nhu cầu cơ bản mà còn mang lại trải nghiệm vượt trội nhờ các công nghệ tiên tiến.`,
  faqs: [
    { q: 'Hàng có sẵn không và bao lâu thì tôi nhận được hàng?', a: 'Toàn bộ sản phẩm trên website đều là hàng có sẵn. Đơn hàng sẽ được đóng gói và giao cho đơn vị vận chuyển trong vòng 24h. Thời gian nhận hàng dự kiến từ 1-3 ngày.' },
    { q: 'Sản phẩm thực tế có giống như hình ảnh quảng cáo không?', a: 'Chúng tôi cam kết hình ảnh 100% là ảnh thật. Bạn có thể yêu cầu gửi thêm video quay cận cảnh qua khung chat trước khi quyết định mua.' },
    { q: 'Tôi có được kiểm tra hàng trước khi thanh toán không?', a: 'Có. Chúng tôi khuyến khích khách hàng đồng kiểm cùng bưu tá. Nếu sản phẩm không đúng mẫu, bạn có quyền từ chối nhận hàng.' }
  ]
});

export const ProductDetail: React.FC = () => {
  const { slug } = useParams<{ slug: string }>();
  const { products, loading: globalLoading } = useProducts();
  
  const [product, setProduct] = useState<Product | null>(null);
  const [relatedProducts, setRelatedProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeImage, setActiveImage] = useState<string>('');
  const [openFaqIndex, setOpenFaqIndex] = useState<number | null>(0);
  const [isDescriptionExpanded, setIsDescriptionExpanded] = useState(false);

  useEffect(() => {
    if (globalLoading && products.length === 0) return;

    setLoading(true);
    // Giảm delay để bot nhanh chóng thấy dữ liệu
    const found = products.find(p => p.slug === slug) || products.find(p => p.id === slug);
    
    if (found) {
      setProduct(found);
      setActiveImage(found.imageUrl);
      setRelatedProducts(products.filter(p => p.categoryId === found.categoryId && p.id !== found.id).slice(0, 4));
    }
    setLoading(false);
  }, [slug, products, globalLoading]);

  // EFFECT: Inject SEO Meta & JSON-LD vào Head
  useEffect(() => {
    if (!product) return;

    // 1. Cập nhật Meta Tags cơ bản
    const title = `${product.title} - Giảm ${product.discountPercent}% | Ngọc Hà Shop`;
    const description = `Mua ngay ${product.title} chính hãng tại ${product.retailer}. Giá ưu đãi chỉ ${product.priceDeal?.toLocaleString()}đ. Cam kết chất lượng, bảo hành uy tín.`;
    
    document.title = title;
    
    const metaDesc = document.querySelector('meta[name="description"]');
    if (metaDesc) metaDesc.setAttribute('content', description);

    const ogTitle = document.querySelector('meta[property="og:title"]');
    if (ogTitle) ogTitle.setAttribute('content', title);

    const ogImg = document.querySelector('meta[property="og:image"]');
    if (ogImg) ogImg.setAttribute('content', product.imageUrl);

    // 2. Tạo Product Schema JSON-LD
    const productSchema = {
      "@context": "https://schema.org",
      "@type": "Product",
      "name": product.title,
      "image": product.imageUrls && product.imageUrls.length > 0 ? product.imageUrls : [product.imageUrl],
      "description": description,
      "sku": product.id,
      "mpn": product.id,
      "brand": {
        "@type": "Brand",
        "name": product.brand || "Ngọc Hà Shop"
      },
      "offers": {
        "@type": "Offer",
        "url": window.location.href,
        "priceCurrency": "VND",
        "price": product.priceDeal || product.priceRegular,
        "priceValidUntil": "2026-12-31",
        "itemCondition": "https://schema.org/NewCondition",
        "availability": "https://schema.org/InStock",
        "seller": {
          "@type": "Organization",
          "name": "Ngọc Hà Shop"
        }
      },
      "aggregateRating": {
        "@type": "AggregateRating",
        "ratingValue": product.rating || 5,
        "reviewCount": product.ratingCount || 100,
        "bestRating": "5",
        "worstRating": "1"
      }
    };

    // 3. Tạo Breadcrumb Schema
    const breadcrumbSchema = {
      "@context": "https://schema.org",
      "@type": "BreadcrumbList",
      "itemListElement": [
        { "@type": "ListItem", "position": 1, "name": "Trang chủ", "item": "https://ngochashop.com/" },
        { "@type": "ListItem", "position": 2, "name": getCategoryName(product.categoryId), "item": `https://ngochashop.com/category/${product.categoryId}` },
        { "@type": "ListItem", "position": 3, "name": product.title }
      ]
    };

    // 4. Inject Scripts vào Head
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
      // Dọn dẹp script khi rời trang
      const existingScript = document.getElementById(scriptId);
      if (existingScript) existingScript.remove();
    };
  }, [product]);

  const handleBuy = () => {
    if (!product) return;
    trackClick(product.id, product.retailer, 'product_detail');
    window.open(product.affiliateUrl, '_blank');
  };

  const toggleFaq = (index: number) => setOpenFaqIndex(openFaqIndex === index ? null : index);

  const formatSold = (num: number) => num >= 1000 ? (num / 1000).toFixed(0) + 'k' : num.toString();

  function getCategoryName(slug: string) {
    const cat = CATEGORIES.find(c => c.slug === (slug || '').trim());
    return cat ? cat.name : (slug === 'others' ? 'Sản phẩm khác' : slug);
  }

  if (loading || !product) {
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
          {/* Left: Images */}
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
              {product.imageUrls && product.imageUrls.length > 1 && (
                <div className="flex gap-2 justify-center overflow-x-auto pb-2">
                  {product.imageUrls.map((url, idx) => (
                    <button key={idx} onClick={() => setActiveImage(url)} className={`w-16 h-16 sm:w-20 sm:h-20 rounded-lg border-2 overflow-hidden ${activeImage === url ? 'border-primary' : 'border-gray-200'}`}>
                      <img src={url} alt={`${product.title} ${idx}`} className="w-full h-full object-cover" />
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Right: Info */}
          <div className="lg:col-span-7 space-y-6">
            <div>
               <h1 className="text-2xl md:text-3xl font-bold text-gray-900 leading-snug mb-3">{product.title}</h1>
               <div className="flex items-center flex-wrap gap-4 mb-4 text-sm">
                 <div className="flex items-center text-yellow-500 bg-yellow-50 px-2 py-1 rounded-md border border-yellow-100">
                   <span className="font-bold text-base mr-1">{product.rating.toFixed(1)}</span>
                   <div className="flex">
                      {[...Array(5)].map((_, i) => <Star key={i} size={14} fill={i < Math.floor(product.rating) ? "currentColor" : "none"} className={i < Math.floor(product.rating) ? "" : "text-gray-300"} />)}
                   </div>
                 </div>
                 <span className="text-gray-500">Đã bán: {product.soldCount ? formatSold(product.soldCount) : '0'}</span>
                 <span className="text-gray-300">|</span>
                 <span className="text-gray-500">Thương hiệu: <span className="text-primary font-medium">{product.brand}</span></span>
               </div>

               <div className="bg-white p-5 rounded-xl border border-gray-200 shadow-sm">
                 <div className="bg-red-50 p-4 rounded-xl border border-red-100 mb-4">
                   <p className="text-sm font-semibold text-red-600 mb-2 flex items-center gap-1"><Zap size={16} /> Giá ưu đãi hôm nay</p>
                   <div className="flex items-baseline gap-2">
                     <span className="text-4xl md:text-5xl font-extrabold text-[#d32f2f]">{product.priceDeal?.toLocaleString()}₫</span>
                     {product.discountPercent > 0 && <span className="text-lg text-gray-400 line-through">{product.priceRegular.toLocaleString()}₫</span>}
                   </div>
                 </div>
                 <div className="mb-6 p-4 bg-blue-50 rounded-xl border border-blue-100 text-[15px]">{product.shortDescription || richContent.shortDescription}</div>
                 <Button onClick={handleBuy} fullWidth size="lg" className="text-lg h-14 bg-[#ee4d2d] hover:bg-[#d73211] shadow-xl">Mua Ngay <ExternalLink size={20} className="ml-2" /></Button>
               </div>
            </div>

            <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
               <div className="bg-gray-50 px-5 py-3 border-b border-gray-200 font-bold flex items-center gap-2"><ShieldCheck size={18} className="text-primary" /> An tâm mua sắm</div>
               <div className="p-5 grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                  <div className="flex items-center gap-3"><Truck className="text-primary" /> Miễn phí vận chuyển</div>
                  <div className="flex items-center gap-3"><RotateCcw className="text-primary" /> Trả hàng 7 ngày</div>
                  <div className="flex items-center gap-3"><ShieldCheck className="text-primary" /> Chính hãng 100%</div>
               </div>
            </div>

            <section>
              <h2 className="text-xl font-bold mb-3">Mô tả sản phẩm</h2>
              <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm relative">
                <div className={`overflow-hidden transition-all ${!isDescriptionExpanded && isDescriptionLong ? 'max-h-[250px]' : ''}`}>
                  <div className="whitespace-pre-line text-gray-600 leading-relaxed">{displayDescription}</div>
                </div>
                {isDescriptionLong && (
                  <div className={`text-center pt-4 ${!isDescriptionExpanded ? 'absolute bottom-0 left-0 right-0 h-24 bg-gradient-to-t from-white flex items-end justify-center pb-4' : ''}`}>
                    <button onClick={() => setIsDescriptionExpanded(!isDescriptionExpanded)} className="text-primary font-bold hover:underline">
                      {isDescriptionExpanded ? 'Thu gọn' : 'Xem chi tiết'}
                    </button>
                  </div>
                )}
              </div>
            </section>
          </div>
        </div>
      </div>
    </div>
  );
};

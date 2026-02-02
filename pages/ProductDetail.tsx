
import React, { useEffect, useState, useMemo } from 'react';
import { useParams, Link } from 'react-router-dom';
import { 
  Star, ExternalLink, Shield, 
  ChevronRight, ChevronDown, HelpCircle,
  Truck, RotateCcw, ShieldCheck, Zap, ChevronUp
} from 'lucide-react';
import { Product } from '../types';
import { Button } from '../components/ui/Button';
import { trackClick } from '../services/analytics';
import { useProducts } from '../context/ProductContext';
import { CATEGORIES } from '../constants';

export const ProductDetail: React.FC = () => {
  const { slug } = useParams<{ slug: string }>();
  const { products, loading: globalLoading } = useProducts();
  
  const [product, setProduct] = useState<Product | null>(null);
  const [activeImage, setActiveImage] = useState<string>('');
  const [isDescriptionExpanded, setIsDescriptionExpanded] = useState(false);

  // Tìm sản phẩm
  useEffect(() => {
    if (products.length > 0 && slug) {
      const found = products.find(p => p.slug === slug) || products.find(p => p.id === slug);
      if (found) {
        setProduct(found);
        setActiveImage(found.imageUrl);
      }
    }
    window.scrollTo(0, 0);
  }, [slug, products]);

  // Cập nhật Meta Title/Description nhanh nhất có thể
  useEffect(() => {
    if (product) {
      const title = `${product.title} - Giá tốt nhất tại Ngọc Hà Shop`;
      const desc = `Mua ${product.title} chính hãng từ ${product.brand}. ${product.shortDescription || product.description?.slice(0, 150)}`;
      document.title = title;
      const metaDesc = document.querySelector('meta[name="description"]');
      if (metaDesc) metaDesc.setAttribute('content', desc);
    }
  }, [product]);

  // Logic lấy tên danh mục
  const getCategoryName = (catId: string) => {
    const cat = CATEGORIES.find(c => c.slug === catId);
    return cat ? cat.name : catId;
  };

  // Tạo Schema Object - Cấu trúc chuẩn 2024
  const jsonLd = useMemo(() => {
    if (!product) return null;

    const currentUrl = window.location.href;
    const price = product.priceDeal || product.priceRegular;

    return {
      "@context": "https://schema.org",
      "@type": "Product",
      "name": product.title,
      "image": product.imageUrls && product.imageUrls.length > 0 ? product.imageUrls : [product.imageUrl],
      "description": product.shortDescription || product.description?.slice(0, 200),
      "sku": product.id,
      "mpn": product.id,
      "brand": {
        "@type": "Brand",
        "name": product.brand || "Ngọc Hà Shop"
      },
      "review": {
        "@type": "Review",
        "reviewRating": {
          "@type": "Rating",
          "ratingValue": product.rating || 5,
          "bestRating": "5"
        },
        "author": {
          "@type": "Person",
          "name": "Khách hàng Ngọc Hà Shop"
        }
      },
      "aggregateRating": {
        "@type": "AggregateRating",
        "ratingValue": product.rating || 5,
        "reviewCount": product.ratingCount || 100
      },
      "offers": {
        "@type": "Offer",
        "url": currentUrl,
        "priceCurrency": "VND",
        "price": price.toString(),
        "priceValidUntil": "2026-12-31",
        "itemCondition": "https://schema.org/NewCondition",
        "availability": "https://schema.org/InStock",
        "seller": {
          "@type": "Organization",
          "name": "Ngọc Hà Shop"
        },
        "hasMerchantReturnPolicy": {
          "@type": "MerchantReturnPolicy",
          "applicableCountry": "VN",
          "returnPolicyCategory": "https://schema.org/MerchantReturnFiniteReturnWindow",
          "merchantReturnDays": 7,
          "returnMethod": "https://schema.org/ReturnByMail",
          "returnFees": "https://schema.org/FreeReturn"
        },
        "shippingDetails": {
          "@type": "OfferShippingDetails",
          "shippingRate": {
            "@type": "MonetaryAmount",
            "value": 0,
            "currency": "VND"
          },
          "shippingDestination": {
            "@type": "DefinedRegion",
            "addressCountry": "VN"
          },
          "deliveryTime": {
            "@type": "ShippingDeliveryTime",
            "handlingTime": {
              "@type": "QuantitativeValue",
              "minValue": 0,
              "maxValue": 1,
              "unitCode": "d"
            },
            "transitTime": {
              "@type": "QuantitativeValue",
              "minValue": 1,
              "maxValue": 4,
              "unitCode": "d"
            }
          }
        }
      }
    };
  }, [product]);

  const handleBuy = () => {
    if (!product) return;
    trackClick(product.id, product.retailer, 'product_detail');
    window.open(product.affiliateUrl, '_blank');
  };

  if (!product && globalLoading) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-12 flex flex-col items-center justify-center min-h-[50vh]">
        <div className="loader mb-4"></div>
        <p className="text-gray-500 animate-pulse">Đang tải thông tin sản phẩm...</p>
      </div>
    );
  }

  if (!product) {
    return <div className="py-20 text-center text-gray-500">Sản phẩm không tồn tại hoặc đã bị gỡ bỏ.</div>;
  }

  return (
    <div className="bg-[#f8f9fa] min-h-screen pb-12 font-sans text-gray-800">
      {/* 🚀 SCHEMA JSON-LD RENDER TRỰC TIẾP TRONG BODY ĐỂ BOT THẤY NGAY 🚀 */}
      {jsonLd && (
        <script type="application/ld+json">
          {JSON.stringify(jsonLd)}
        </script>
      )}

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
            </div>
          </div>

          {/* Right: Info */}
          <div className="lg:col-span-7 space-y-6">
            <div>
               <h1 className="text-2xl md:text-3xl font-bold text-gray-900 leading-snug mb-3">{product.title}</h1>
               <div className="flex items-center flex-wrap gap-4 mb-4 text-sm">
                 <div className="flex items-center text-yellow-500 bg-yellow-50 px-2 py-1 rounded-md border border-yellow-100">
                   <span className="font-bold text-base mr-1">{product.rating.toFixed(1)}</span>
                   <Star size={14} fill="currentColor" />
                 </div>
                 <span className="text-gray-500">Đã bán: {product.soldCount?.toLocaleString()}</span>
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
                 <Button onClick={handleBuy} fullWidth size="lg" className="text-lg h-14 bg-[#ee4d2d] hover:bg-[#d73211] shadow-xl">Mua Ngay Tại {product.retailer} <ExternalLink size={20} className="ml-2" /></Button>
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
              <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
                <div className={`whitespace-pre-line text-gray-600 leading-relaxed ${!isDescriptionExpanded ? 'line-clamp-[10]' : ''}`}>
                  {product.description || "Đang cập nhật nội dung chi tiết cho sản phẩm này..."}
                </div>
                {product.description && product.description.length > 500 && (
                  <button onClick={() => setIsDescriptionExpanded(!isDescriptionExpanded)} className="text-primary font-bold hover:underline mt-4">
                    {isDescriptionExpanded ? 'Thu gọn' : 'Xem thêm chi tiết'}
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

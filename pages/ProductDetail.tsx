
import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { 
  Star, ExternalLink, Shield, 
  ChevronRight, ChevronDown, HelpCircle,
  Truck, RotateCcw, ShieldCheck, Zap, TrendingUp, ChevronUp
} from 'lucide-react';
import { Product } from '../types';
import { Button } from '../components/ui/Button';
import { ProductCard } from '../components/ProductCard';
import { trackClick } from '../services/analytics';
import { useProducts } from '../context/ProductContext';
import { CATEGORIES } from '../constants';

// Helper to generate static rich content with updated FAQ data
const getRichContent = (product: Product) => ({
  shortDescription: `${product.title} ghi điểm với người dùng nhờ thiết kế sang trọng, hiệu năng mạnh mẽ trong tầm giá cùng hệ sinh thái đa dạng. Đây là lựa chọn tối ưu cho những ai đang tìm kiếm sự cân bằng giữa chi phí và trải nghiệm.`,
  description: `Sản phẩm **${product.title}** đang là lựa chọn hàng đầu trong phân khúc ${product.priceDeal ? 'giá rẻ' : 'cao cấp'} hiện nay. Với thiết kế hiện đại từ thương hiệu **${product.brand}**, sản phẩm này không chỉ đáp ứng nhu cầu cơ bản mà còn mang lại trải nghiệm vượt trội nhờ các công nghệ tiên tiến.`,
  faqs: [
    {
      q: 'Hàng có sẵn không và bao lâu thì tôi nhận được hàng?',
      a: 'Toàn bộ sản phẩm trên website đều là hàng có sẵn. Đơn hàng sẽ được đóng gói và giao cho đơn vị vận chuyển trong vòng 24h. Thời gian nhận hàng dự kiến từ 1-3 ngày tùy khu vực.'
    },
    {
      q: 'Sản phẩm thực tế có giống như hình ảnh quảng cáo không?',
      a: 'Chúng tôi cam kết hình ảnh 100% là ảnh thật tự chụp hoặc từ nhà sản xuất. Bạn có thể yêu cầu nhân viên gửi thêm video quay cận cảnh sản phẩm qua khung chat trước khi quyết định mua.'
    },
    {
      q: 'Tôi có được kiểm tra hàng trước khi thanh toán không?',
      a: 'Có. Chúng tôi khuyến khích khách hàng đồng kiểm cùng bưu tá khi nhận. Nếu sản phẩm không đúng mẫu hoặc bị hư hỏng, bạn có quyền từ chối nhận hàng mà không mất bất kỳ chi phí nào.'
    },
    {
      q: 'Tại sao giá khi thanh toán lại khác với giá hiển thị?',
      a: 'Giá hiển thị trên website là giá tham khảo tốt nhất. Giá thanh toán thực tế sẽ tùy thuộc vào các mã khuyến mại (voucher) mà bạn áp dụng ở bước thanh toán cuối cùng.'
    },
    {
      q: 'Chính sách đổi trả và bảo hành như thế nào?',
      a: 'Hỗ trợ đổi trả trong 7 ngày nếu có lỗi từ nhà sản xuất hoặc giao sai mẫu. Sản phẩm điện tử/kỹ thuật sẽ được bảo hành theo tiêu chuẩn từ 6-12 tháng (tùy dòng máy).'
    },
    {
      q: 'Làm sao để tôi được hưởng mức giá ưu đãi nhất?',
      a: 'Bạn hãy nhấn "Theo dõi" shop và kiểm tra mục "Mã giảm giá" tại trang chủ website. Các chương trình Flash Sale và Voucher độc quyền thường xuyên được cập nhật hàng tuần.'
    }
  ]
});

export const ProductDetail: React.FC = () => {
  const { slug } = useParams<{ slug: string }>();
  const { products, loading: globalLoading } = useProducts();
  
  const [product, setProduct] = useState<Product | null>(null);
  const [relatedProducts, setRelatedProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeImage, setActiveImage] = useState<string>('');
  const [openFaqIndex, setOpenFaqIndex] = useState<number | null>(0); // Default open first one
  const [isDescriptionExpanded, setIsDescriptionExpanded] = useState(false);

  useEffect(() => {
    if (globalLoading && products.length === 0) return;

    setLoading(true);
    
    // Tìm kiếm sản phẩm bằng slug (vì URL hiện tại là /san-pham/:slug)
    // Nếu không tìm thấy bằng slug chính xác, thử tìm gần đúng hoặc fallback
    setTimeout(() => {
      let found = products.find(p => p.slug === slug);
      
      // Fallback: Nếu không tìm thấy, có thể URL cũ dùng ID, thử tìm theo ID nếu slug khớp pattern ID
      if (!found && slug) {
         found = products.find(p => p.id === slug);
      }
      
      if (!found && products.length > 0) {
         // Fallback cuối cùng nếu không tìm thấy gì (tránh crash)
         found = products[0];
      }

      setProduct(found || null);
      if (found) {
        setActiveImage(found.imageUrl);
        setIsDescriptionExpanded(false); // Reset expansion on product change
        
        const related = products
          .filter(p => p.categoryId === found.categoryId && p.id !== found.id)
          .slice(0, 4);
        setRelatedProducts(related);
      }
      
      setLoading(false);
    }, 300);
  }, [slug, products, globalLoading]);

  // SEO & META TAGS
  useEffect(() => {
    if (!product) return;
    document.title = `${product.title} - Giảm giá ${product.discountPercent}% | Ngọc Hà Shop`;
    
    const metaDesc = document.querySelector('meta[name="description"]');
    const descContent = `Mua ngay ${product.title} chính hãng tại ${product.retailer}. Giá chỉ ${product.priceDeal?.toLocaleString()}đ.`;
    if (metaDesc) {
      metaDesc.setAttribute('content', descContent);
    }
  }, [product]);

  const handleBuy = () => {
    if (!product) return;
    trackClick(product.id, product.retailer, 'product_detail');
    window.open(product.affiliateUrl, '_blank');
  };

  const toggleFaq = (index: number) => {
    setOpenFaqIndex(openFaqIndex === index ? null : index);
  };

  const formatSold = (num: number) => {
    if (num >= 1000) {
      return (num / 1000).toFixed(0) + 'k';
    }
    return num.toString();
  };

  const getCategoryName = (slug: string) => {
    const safeSlug = slug ? slug.trim() : '';
    const cat = CATEGORIES.find(c => c.slug === safeSlug);
    return cat ? cat.name : (safeSlug === 'others' ? 'Sản phẩm khác' : safeSlug);
  };

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

  // Helper to process markdown-like bolding from description text
  const formatDescription = (text: string) => {
    if (!text) return null;
    const parts = text.split(/(\*\*.*?\*\*)/g);
    return parts.map((part, i) => {
      if (part.startsWith('**') && part.endsWith('**')) {
        return <strong key={i} className="text-gray-900">{part.slice(2, -2)}</strong>;
      }
      return part;
    });
  };

  const descriptionText = product.description || richContent.description;
  const isDescriptionLong = descriptionText.length > 250;
  const displayDescription = !isDescriptionExpanded && isDescriptionLong 
    ? descriptionText.slice(0, 250) + '...'
    : descriptionText;

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
          
          {/* LEFT COLUMN - IMAGE GALLERY */}
          <div className="lg:col-span-5">
            <div className="sticky top-24 space-y-4">
              {/* Main Display Image */}
              <div className="bg-white rounded-2xl overflow-hidden border border-gray-200 shadow-sm">
                <div className="relative aspect-square flex items-center justify-center p-4">
                   <img 
                      src={activeImage || product.imageUrl} 
                      alt={product.title}
                      className="max-w-full max-h-full object-contain transition-opacity duration-300" 
                   />
                   {product.discountPercent > 0 && (
                     <span className="absolute top-4 left-4 bg-red-600 text-white text-sm font-bold px-3 py-1 rounded shadow-md z-10">
                       -{product.discountPercent}%
                     </span>
                   )}
                </div>
              </div>

              {/* Thumbnail List */}
              {product.imageUrls && product.imageUrls.length > 1 && (
                <div className="flex gap-2 justify-center overflow-x-auto pb-2 scrollbar-hide">
                  {product.imageUrls.map((url, idx) => (
                    <button 
                      key={idx}
                      onClick={() => setActiveImage(url)}
                      className={`
                        flex-shrink-0 w-16 h-16 sm:w-20 sm:h-20 rounded-lg border-2 overflow-hidden transition-all
                        ${activeImage === url ? 'border-primary shadow-md' : 'border-gray-300 hover:border-gray-400'}
                      `}
                    >
                      <img src={url} alt={`${product.title} - ${idx + 1}`} className="w-full h-full object-cover" />
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* RIGHT COLUMN */}
          <div className="lg:col-span-7 space-y-6">
            
            <div>
               <h1 className="text-2xl md:text-3xl font-bold text-gray-900 leading-snug mb-3">
                 {product.title}
               </h1>
               
               <div className="flex items-center flex-wrap gap-4 mb-4 text-sm">
                 <div className="flex items-center text-yellow-500 bg-yellow-50 px-2 py-1 rounded-md border border-yellow-100">
                   <span className="font-bold text-base mr-1">{product.rating.toFixed(1)}</span>
                   <div className="flex">
                      {[...Array(5)].map((_, i) => (
                        <Star key={i} size={14} fill={i < Math.floor(product.rating) ? "currentColor" : "none"} className={i < Math.floor(product.rating) ? "" : "text-gray-300"} />
                      ))}
                   </div>
                 </div>
                 <a href={product.affiliateUrl} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">{product.ratingCount} đánh giá</a>
                 <span className="text-gray-300">|</span>
                 <a href={product.affiliateUrl} target="_blank" rel="noopener noreferrer" className="text-blue-600 font-medium hover:underline">Đã bán: {product.soldCount ? formatSold(product.soldCount) : '0'}</a>
                 <span className="text-gray-300">|</span>
                 <span className="text-gray-500">Thương hiệu: <Link to={`/category/search?q=${encodeURIComponent(product.brand)}`} className="text-primary font-medium hover:underline">{product.brand}</Link></span>
               </div>

               {/* Price Box */}
               <div className="bg-white p-5 rounded-xl border border-gray-200 shadow-sm relative overflow-hidden">
                 <div className="bg-gradient-to-r from-red-50 to-white p-4 -mx-5 md:mx-0 md:rounded-xl border border-red-100 mb-4 relative overflow-hidden">
                   <div className="absolute top-0 right-0 p-2 opacity-10">
                      <Zap className="w-24 h-24 text-red-600" />
                   </div>
                   
                   <p className="text-sm font-semibold text-red-600 mb-1 flex items-center gap-1">
                     <Zap size={16} /> Giá ưu đãi đặc biệt
                   </p>
                   
                   <div className="flex flex-wrap items-baseline gap-2 relative z-10 mt-2">
                     {product.discountPercent > 0 ? (
                       <>
                         <span className="text-lg text-gray-400 line-through font-medium decoration-gray-400 mr-1">
                            {product.priceRegular.toLocaleString('vi-VN')}₫
                         </span>
                         <span className="text-4xl md:text-5xl font-extrabold text-[#d32f2f] tracking-tight">
                            {product.priceDeal?.toLocaleString('vi-VN')}₫
                         </span>
                         <span className="bg-red-600 text-white text-xs font-bold px-2 py-1 rounded-md shadow-sm self-center ml-1">
                           -{product.discountPercent}%
                         </span>
                       </>
                     ) : (
                         <span className="text-4xl md:text-5xl font-extrabold text-gray-900 tracking-tight">
                            {product.priceRegular.toLocaleString('vi-VN')}₫
                         </span>
                     )}
                   </div>
                 </div>

                 {/* Short Description Highlighted */}
                 <div className="mb-4 mt-2">
                   <div className="relative bg-[#f0f9ff] p-4 rounded-xl border border-blue-100 text-gray-700 text-[15px] leading-relaxed shadow-sm">
                      <span className="font-medium text-gray-800">
                        {product.shortDescription || richContent.shortDescription}
                      </span>
                   </div>
                 </div>
                 
                 {/* CTA */}
                 <div className="pt-4 border-t border-dashed border-gray-200">
                    <Button onClick={handleBuy} fullWidth size="lg" className="text-lg h-14 shadow-xl shadow-primary/20 bg-[#ee4d2d] hover:bg-[#d73211]">
                        Mua Ngay <ExternalLink size={20} className="ml-2" />
                    </Button>
                 </div>
               </div>
            </div>

            {/* An tâm mua sắm */}
            <div className="bg-white rounded-xl border border-gray-200 overflow-hidden shadow-sm">
               <div className="bg-gray-50 px-5 py-3 border-b border-gray-200">
                  <h3 className="font-bold text-gray-900 flex items-center gap-2">
                     <ShieldCheck size={18} className="text-primary" /> 
                     An tâm mua sắm
                  </h3>
               </div>
               <div className="p-5">
                 <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="flex items-start gap-3">
                       <Truck className="text-[#ee4d2d] w-6 h-6 flex-shrink-0" />
                       <div>
                          <p className="text-sm font-bold text-gray-900">Miễn phí vận chuyển</p>
                          <p className="text-xs text-gray-500 mt-0.5">Áp dụng cho đơn hàng từ 150k</p>
                       </div>
                    </div>
                    <div className="flex items-start gap-3">
                       <RotateCcw className="text-[#ee4d2d] w-6 h-6 flex-shrink-0" />
                       <div>
                          <p className="text-sm font-bold text-gray-900">Trả hàng miễn phí 15 ngày</p>
                          <p className="text-xs text-gray-500 mt-0.5">Trả hàng dễ dàng, hoàn tiền nhanh</p>
                       </div>
                    </div>
                    <div className="flex items-start gap-3">
                       <ShieldCheck className="text-[#ee4d2d] w-6 h-6 flex-shrink-0" />
                       <div>
                          <p className="text-sm font-bold text-gray-900">Hàng chính hãng 100%</p>
                          <p className="text-xs text-gray-500 mt-0.5">Hoàn tiền nếu phát hiện hàng giả</p>
                       </div>
                    </div>
                    <div className="flex items-start gap-3">
                       <Shield className="text-[#ee4d2d] w-6 h-6 flex-shrink-0" />
                       <div>
                          <p className="text-sm font-bold text-gray-900">Bảo hiểm thiết bị</p>
                          <p className="text-xs text-gray-500 mt-0.5">Bảo vệ quyền lợi người tiêu dùng</p>
                       </div>
                    </div>
                 </div>
               </div>
            </div>

            {/* Detailed Content */}
            <div className="space-y-8">
              {/* Mô tả sản phẩm */}
              <section id="description" className="scroll-mt-20">
                <h2 className="text-xl font-bold text-gray-900 mb-3">Mô tả sản phẩm</h2>
                <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm leading-relaxed text-gray-600 text-[15px] relative">
                  <div className={`overflow-hidden transition-all duration-500 ${!isDescriptionExpanded && isDescriptionLong ? 'max-h-[250px]' : 'max-h-full'}`}>
                    <div className="whitespace-pre-line">
                      {formatDescription(displayDescription)}
                    </div>
                  </div>
                  
                  {isDescriptionLong && (
                    <div className={`pt-6 text-center ${!isDescriptionExpanded ? 'absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-white via-white/80 to-transparent flex items-end justify-center pb-6' : 'mt-4'}`}>
                      <button 
                        onClick={() => setIsDescriptionExpanded(!isDescriptionExpanded)}
                        className="flex items-center gap-2 text-primary font-bold hover:underline bg-white px-6 py-2 rounded-full border border-primary/20 shadow-sm hover:shadow-md transition-all"
                      >
                        {isDescriptionExpanded ? (
                          <>Thu gọn <ChevronUp size={18} /></>
                        ) : (
                          <>Xem chi tiết <ChevronDown size={18} /></>
                        )}
                      </button>
                    </div>
                  )}
                </div>
              </section>

              {/* FAQ Accordion */}
              <section id="faqs" className="scroll-mt-20">
                <h2 className="text-xl font-bold text-gray-900 mb-3 flex items-center justify-between">
                  Câu hỏi thường gặp
                </h2>
                <div className="space-y-3">
                  {richContent.faqs.map((faq, idx) => (
                    <div 
                      key={idx} 
                      className={`
                        bg-white border rounded-xl overflow-hidden transition-all duration-200
                        ${openFaqIndex === idx ? 'border-primary ring-1 ring-primary/20' : 'border-gray-200 hover:border-gray-300'}
                      `}
                    >
                      <button 
                        onClick={() => toggleFaq(idx)}
                        className="w-full text-left px-5 py-4 flex items-center justify-between gap-4 group"
                      >
                        <span className="font-semibold text-gray-900 flex items-start gap-3">
                          <HelpCircle 
                            size={20} 
                            className={`mt-0.5 flex-shrink-0 transition-colors ${openFaqIndex === idx ? 'text-primary' : 'text-gray-400 group-hover:text-primary'}`} 
                          />
                          {faq.q}
                        </span>
                        <ChevronDown 
                          size={20} 
                          className={`flex-shrink-0 text-gray-400 transition-transform duration-300 ${openFaqIndex === idx ? 'rotate-180 text-primary' : ''}`} 
                        />
                      </button>
                      
                      <div 
                        className={`
                          overflow-hidden transition-all duration-300 ease-in-out
                          ${openFaqIndex === idx ? 'max-h-[300px] opacity-100' : 'max-h-0 opacity-0'}
                        `}
                      >
                        <div className="px-5 pb-5 pt-0 ml-8 pr-10">
                          <p className="text-[15px] leading-relaxed text-gray-600 border-l-2 border-primary/20 pl-4">
                            {faq.a}
                          </p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </section>
            </div>
          </div>
        </div>
        
        {/* Related Products */}
        <section className="mt-16 pt-8 border-t border-gray-200">
           <h2 className="text-2xl font-bold text-gray-900 mb-6">Sản phẩm tương tự</h2>
           <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
             {relatedProducts.map(p => (
               <ProductCard key={p.id} product={p} />
             ))}
           </div>
        </section>

      </div>

      {/* Mobile Sticky Footer */}
      <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 p-3 md:hidden z-40 shadow-[0_-4px_10px_rgba(0,0,0,0.1)] pb-safe">
        <div className="flex items-center gap-3">
           <div className="flex-1">
             <span className="block text-xs text-gray-500 line-through">{product.priceRegular.toLocaleString()}₫</span>
             <span className="block font-bold text-primary text-lg">{product.priceDeal?.toLocaleString()}₫</span>
           </div>
           <Button onClick={handleBuy} className="flex-[2] shadow-lg h-12 text-base font-bold bg-[#ee4d2d]">
             Mua Ngay <ExternalLink size={16} className="ml-1" />
           </Button>
        </div>
      </div>
    </div>
  );
};

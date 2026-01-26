
import { Calendar, ChevronRight, Facebook, MessageCircle, Share2, User } from 'lucide-react';
import React, { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { ProductCard } from '../components/ProductCard';
import { MOCK_POSTS } from '../constants';
import { useProducts } from '../context/ProductContext';
import { Post, Product } from '../types';

export const BlogPost: React.FC = () => {
  const { slug } = useParams<{ slug: string }>();
  const [post, setPost] = useState<Post | null>(null);
  const { products } = useProducts();
  const [relatedProducts, setRelatedProducts] = useState<Product[]>([]);

  useEffect(() => {
    const found = MOCK_POSTS.find(p => p.slug === slug);
    if (found) {
      setPost(found);
      // Map related product IDs to actual products
      const related = products.filter(p => found.relatedProductIds.includes(p.id)).slice(0, 4);
      setRelatedProducts(related);
    }
    window.scrollTo(0, 0);
  }, [slug, products]);

  const handleShareFacebook = () => {
    const url = window.location.href;
    window.open(`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`, '_blank', 'width=600,height=400');
  };

  const handleShareMessenger = () => {
    const url = window.location.href;
    // On mobile, this deep link often works. On desktop, it's limited without the SDK.
    // As a robust alternative, we use the standard share if available or copy to clipboard.
    if (navigator.share) {
        navigator.share({
            title: post?.title,
            text: post?.excerpt,
            url: url,
        }).catch(console.error);
    } else {
        navigator.clipboard.writeText(url);
        alert('Đã sao chép liên kết bài viết!');
    }
  };

  const handleGeneralShare = async () => {
    const url = window.location.href;
    if (navigator.share) {
      try {
        await navigator.share({
          title: post?.title,
          text: post?.excerpt,
          url: url,
        });
      } catch (err) {
        console.error('Error sharing:', err);
      }
    } else {
      navigator.clipboard.writeText(url);
      alert('Đã sao chép liên kết vào bộ nhớ tạm!');
    }
  };

  if (!post) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-20 text-center">
        <h2 className="text-2xl font-bold text-gray-900">Không tìm thấy bài viết</h2>
        <Link to="/blog" className="text-primary mt-4 inline-block font-bold">Quay lại Tin tức</Link>
      </div>
    );
  }

  return (
    <div className="bg-white min-h-screen pb-16">
      <div className="max-w-4xl mx-auto px-4 py-6">
        {/* Breadcrumb */}
        <nav className="text-sm text-gray-500 mb-8 flex items-center gap-1 overflow-x-auto whitespace-nowrap">
          <Link to="/" className="hover:text-primary">Trang chủ</Link> 
          <ChevronRight size={14} />
          <Link to="/blog" className="hover:text-primary">Tin tức</Link>
          <ChevronRight size={14} />
          <span className="text-gray-900 font-medium truncate">{post.title}</span>
        </nav>

        {/* Article Header */}
        <header className="mb-8">
          <div className="flex items-center gap-4 text-xs text-gray-400 mb-4 font-bold uppercase tracking-widest">
            <span className="text-primary">Kinh nghiệm mua sắm</span>
            <span className="w-1.5 h-1.5 bg-gray-200 rounded-full"></span>
            <div className="flex items-center gap-1">
              <Calendar size={14} />
              <span>{new Date(post.createdAt).toLocaleDateString('vi-VN')}</span>
            </div>
            <span className="w-1.5 h-1.5 bg-gray-200 rounded-full"></span>
            <div className="flex items-center gap-1">
              <User size={14} />
              <span>Admin Ngọc Hà Shop</span>
            </div>
          </div>
          <h1 className="text-3xl md:text-5xl font-extrabold text-gray-900 leading-tight mb-6">
            {post.title}
          </h1>
          <p className="text-xl text-gray-500 font-medium leading-relaxed italic border-l-4 border-primary pl-6 py-1">
            {post.excerpt}
          </p>
        </header>

        {/* Featured Image */}
        <div className="mb-10 rounded-3xl overflow-hidden shadow-xl">
          <img src={post.imageUrl} alt={post.title} className="w-full h-auto object-cover max-h-[500px]" />
        </div>

        {/* Article Content */}
        <article className="prose prose-lg max-w-none text-gray-700 leading-loose space-y-6">
          <p>
            Chào mừng bạn đến với Ngọc Hà Shop! Trong bài viết này, chúng tôi sẽ cùng bạn khám phá chi tiết những lựa chọn tốt nhất hiện nay. 
            Việc mua sắm thông minh không chỉ là chọn sản phẩm rẻ nhất, mà là chọn sản phẩm mang lại giá trị sử dụng cao nhất cho số tiền bạn bỏ ra.
          </p>
          
          <h3 className="text-2xl font-bold text-gray-900 pt-4">Tại sao sản phẩm này lại thu hút người dùng?</h3>
          <p>
            Dựa trên hàng ngàn đánh giá từ người dùng thực tế tại các sàn TMĐT lớn như Shopee và Lazada, các tiêu chí về độ bền, thiết kế và dịch vụ hậu mãi 
            luôn là những yếu tố hàng đầu. Chúng tôi đã tiến hành thử nghiệm và so sánh trực tiếp để đưa ra những nhận định khách quan nhất.
          </p>
          
          <div className="bg-gray-50 p-8 rounded-2xl border-l-4 border-primary my-8">
            <h4 className="text-xl font-bold text-primary mb-2">💡 Tips nhỏ từ Ban biên tập:</h4>
            <p className="text-gray-600 mb-0">
              Bạn đừng quên kiểm tra các mã giảm giá tại trang chủ website của chúng tôi trước khi quyết định thanh toán để nhận được mức chiết khấu tốt nhất lên đến 50%.
            </p>
          </div>

          <p>
            Hy vọng qua bài viết này, bạn đã có cái nhìn tổng quan và đưa ra quyết định mua sắm chính xác cho bản thân và gia đình. Đừng quên theo dõi 
            Ngọc Hà Shop để không bỏ lỡ những bài review chất lượng khác!
          </p>
        </article>

        {/* Social Share */}
        <div className="mt-12 pt-8 border-t border-gray-100 flex items-center justify-between">
           <div className="flex items-center gap-4">
              <span className="text-sm font-bold text-gray-900">Chia sẻ:</span>
              <button 
                onClick={handleShareFacebook}
                className="p-2 bg-blue-600 text-white rounded-full hover:opacity-90 transition-opacity"
                title="Chia sẻ Facebook"
              >
                <Facebook size={18} />
              </button>
              <button 
                onClick={handleShareMessenger}
                className="p-2 bg-sky-500 text-white rounded-full hover:opacity-90 transition-opacity"
                title="Gửi qua Messenger"
              >
                <MessageCircle size={18} />
              </button>
              <button 
                onClick={handleGeneralShare}
                className="p-2 bg-gray-200 text-gray-600 rounded-full hover:opacity-90 transition-opacity"
                title="Chia sẻ khác"
              >
                <Share2 size={18} />
              </button>
           </div>
        </div>

        {/* Related Products Section */}
        {relatedProducts.length > 0 && (
          <section className="mt-16 pt-12 border-t border-gray-200">
            <div className="flex items-center justify-between mb-8">
               <h3 className="text-2xl font-extrabold text-gray-900">Sản phẩm nhắc đến</h3>
               <Link to="/category/all" className="text-primary font-bold flex items-center gap-1 hover:underline">
                 Xem tất cả <ChevronRight size={18} />
               </Link>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
              {relatedProducts.map(p => (
                <ProductCard key={p.id} product={p} />
              ))}
            </div>
          </section>
        )}
      </div>
    </div>
  );
};

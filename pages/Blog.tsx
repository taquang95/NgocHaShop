
import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Calendar, ChevronRight } from 'lucide-react';
import { MOCK_POSTS } from '../constants';

export const BlogPage: React.FC = () => {
  useEffect(() => {
    document.title = "Tin Tức & Kinh Nghiệm Mua Sắm - NgocHaShop.com";
    const metaDesc = document.querySelector('meta[name="description"]');
    if (metaDesc) {
      metaDesc.setAttribute('content', 'Tổng hợp kinh nghiệm mua sắm, đánh giá sản phẩm chi tiết và bí kíp săn sale thời trang, mỹ phẩm, gia dụng hiệu quả tại Ngọc Hà Shop.');
    }
    window.scrollTo(0, 0);
  }, []);

  const schemaData = {
    "@context": "https://schema.org",
    "@type": "Blog",
    "name": "Tin Tức & Kinh Nghiệm Mua Sắm - Ngọc Hà Shop",
    "description": "Chia sẻ kinh nghiệm săn sale, đánh giá sản phẩm chân thực và cập nhật xu hướng mới nhất.",
    "url": window.location.href,
    "publisher": {
      "@type": "Organization",
      "name": "Ngọc Hà Shop",
      "logo": {
        "@type": "ImageObject",
        "url": "https://i.postimg.cc/YS74xvvL/logo-cam-web.png"
      }
    },
    "blogPost": MOCK_POSTS.map(post => ({
      "@type": "BlogPosting",
      "headline": post.title,
      "image": post.imageUrl,
      "datePublished": post.createdAt,
      "author": {
        "@type": "Organization",
        "name": "Ngọc Hà Shop"
      },
      "description": post.excerpt,
      "url": `${window.location.origin}/#/blog/${post.slug}`
    }))
  };

  return (
    <div className="bg-[#f8f9fa] min-h-screen pb-12">
      {/* Schema Injection */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(schemaData) }}
      />

      {/* Hero Header */}
      <div className="bg-white border-b border-gray-200 py-10 mb-8">
        <div className="max-w-7xl mx-auto px-4">
          <nav className="text-sm text-gray-500 mb-4 flex items-center gap-1">
            <Link to="/" className="hover:text-primary">Trang chủ</Link> 
            <ChevronRight size={14} />
            <span className="text-gray-900 font-medium">Tin tức</span>
          </nav>
          <h1 className="text-3xl md:text-4xl font-extrabold text-gray-900">Tin Tức & Kinh nghiệm</h1>
          <p className="text-gray-500 mt-2 max-w-3xl leading-relaxed">
            Tổng hợp các bài viết chia sẻ kinh nghiệm mua sắm thông minh, đánh giá chi tiết sản phẩm và cập nhật xu hướng tiêu dùng mới nhất giúp bạn chọn đúng, mua dễ.
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-8">
          {MOCK_POSTS.map((post) => (
            <Link 
              key={post.id} 
              to={`/blog/${post.slug}`} 
              className="flex flex-col md:flex-row bg-white rounded-2xl overflow-hidden border border-gray-200 shadow-sm hover:shadow-md transition-all group"
            >
              <div className="md:w-2/5 relative overflow-hidden h-48 md:h-auto">
                <img 
                  src={post.imageUrl} 
                  alt={post.title} 
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" 
                />
              </div>
              <div className="md:w-3/5 p-6 flex flex-col justify-center">
                <div className="flex items-center gap-2 text-xs text-gray-400 mb-3">
                  <Calendar size={14} />
                  <span>{new Date(post.createdAt).toLocaleDateString('vi-VN')}</span>
                  <span className="w-1 h-1 bg-gray-300 rounded-full"></span>
                  <span className="text-primary font-bold">Review</span>
                </div>
                <h2 className="text-xl font-bold text-gray-900 mb-3 group-hover:text-primary transition-colors line-clamp-2 leading-tight">
                  {post.title}
                </h2>
                <p className="text-gray-500 text-sm line-clamp-3 mb-5 leading-relaxed">
                  {post.excerpt}
                </p>
                <div className="mt-auto">
                  <span className="text-xs font-extrabold text-primary uppercase tracking-wider border-b-2 border-primary/20 group-hover:border-primary transition-all pb-1">
                    ĐỌC NGAY
                  </span>
                </div>
              </div>
            </Link>
          ))}
        </div>

        {/* Placeholder for pagination or more posts */}
        {MOCK_POSTS.length > 2 && (
          <div className="mt-12 text-center">
            <button className="bg-white border-2 border-primary text-primary font-bold py-3 px-8 rounded-xl hover:bg-primary hover:text-white transition-all">
              Tải thêm bài viết
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

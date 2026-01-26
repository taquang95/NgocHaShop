
import React, { useEffect, useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { 
  Zap, Tag,
  Smartphone, Home as HomeIcon, Shirt, Book, Sparkles, Baby, Dumbbell, ShoppingBasket,
  ChevronLeft, ChevronRight, Footprints, Watch, Heart
} from 'lucide-react';
import { ProductCard } from '../components/ProductCard';
import { Button } from '../components/ui/Button';
import { MOCK_POSTS, CATEGORIES } from '../constants';
import { Product, Category } from '../types';
import { useProducts } from '../context/ProductContext';

// Banner Configuration
const BANNERS = [
  {
    id: 1,
    url: "https://images.unsplash.com/photo-1607082348824-0a96f2a4b9da?auto=format&fit=crop&w=1200&q=80",
    alt: "Siêu Sale Mua Sắm",
    link: "https://s.shopee.vn/9zrlosSTXG"
  },
  {
    id: 2,
    url: "https://images.unsplash.com/photo-1550009158-9ebf69173e03?auto=format&fit=crop&w=1200&q=80",
    alt: "Đồ Điện Tử Công Nghệ",
    link: "https://s.shopee.vn/9zrlosSTXG"
  },
  {
    id: 3,
    url: "https://images.unsplash.com/photo-1441986300917-64674bd600d8?auto=format&fit=crop&w=1200&q=80",
    alt: "Thời Trang Phong Cách",
    link: "https://s.shopee.vn/9zrlosSTXG"
  }
];

// Hot categories for the suggestion section tabs - 'all' moved to end
const SUGGESTION_TABS = [
  { id: 'fashion', name: 'Thời trang' },
  { id: 'beauty', name: 'Làm đẹp' },
  { id: 'accessories', name: 'Phụ kiện' },
  { id: 'home-care', name: 'Gia dụng' },
  { id: 'all', name: 'Tất cả' },
];

export const Home: React.FC = () => {
  const { products, loading: productsLoading } = useProducts();
  const [dynamicCategories, setDynamicCategories] = useState<Category[]>([]);
  const [currentBanner, setCurrentBanner] = useState(0);
  const [activeTab, setActiveTab] = useState('fashion'); // Default to fashion instead of all

  // Filter products for the "Suggestion" section based on active tab
  const suggestionProducts = useMemo(() => {
    if (activeTab === 'all') return products.slice(0, 10);
    return products.filter(p => p.categoryId === activeTab).slice(0, 10);
  }, [products, activeTab]);

  useEffect(() => {
    if (products.length > 0) {
        const categoriesMap = new Map<string, number>();
        products.forEach(p => {
            const count = categoriesMap.get(p.categoryId) || 0;
            categoriesMap.set(p.categoryId, count + 1);
        });
        
        const sortedCats = Array.from(categoriesMap.entries())
            .sort((a, b) => b[1] - a[1])
            .slice(0, 8)
            .map(([slug]) => {
                const categoryDef = CATEGORIES.find(c => c.slug === slug);
                const displayName = categoryDef ? categoryDef.name : slug;
                const displayIcon = categoryDef ? categoryDef.icon : getIconNameForCategory(displayName);

                return {
                    id: slug,
                    name: displayName,
                    slug: slug,
                    icon: displayIcon
                };
            });
            
        setDynamicCategories(sortedCats);
    }
  }, [products]);

  // Auto-play banner
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentBanner((prev) => (prev + 1) % BANNERS.length);
    }, 5000);
    return () => clearInterval(timer);
  }, []);

  const nextBanner = () => setCurrentBanner((prev) => (prev + 1) % BANNERS.length);
  const prevBanner = () => setCurrentBanner((prev) => (prev - 1 + BANNERS.length) % BANNERS.length);

  const getIconNameForCategory = (name: string): string => {
    const n = name.toLowerCase();
    if (n.includes('điện thoại') || n.includes('công nghệ') || n.includes('phụ kiện')) return 'smartphone';
    if (n.includes('nhà') || n.includes('gia dụng')) return 'home';
    if (n.includes('áo') || n.includes('quần') || n.includes('thời trang')) return 'shirt';
    if (n.includes('sách')) return 'book';
    if (n.includes('mỹ phẩm') || n.includes('làm đẹp') || n.includes('chăm sóc')) return 'sparkles';
    if (n.includes('mẹ') || n.includes('bé')) return 'baby';
    if (n.includes('thể thao')) return 'dumbbell';
    if (n.includes('bách hóa') || n.includes('thực phẩm')) return 'shopping-basket';
    if (n.includes('sức khỏe')) return 'heart-pulse';
    return 'tag';
  };

  const getCategoryIcon = (iconName?: string) => {
    switch (iconName) {
      case 'smartphone': return Smartphone;
      case 'home': return HomeIcon;
      case 'shirt': return Shirt;
      case 'book': return Book;
      case 'sparkles': return Sparkles;
      case 'baby': return Baby;
      case 'dumbbell': return Dumbbell;
      case 'shopping-basket': return ShoppingBasket;
      case 'footprints': return Footprints;
      case 'watch': return Watch;
      case 'heart-pulse': return Heart;
      default: return Tag;
    }
  };

  return (
    <div className="space-y-8 pb-12 bg-[#f8f9fa]">
      
      {/* Image Slider Section */}
      <section className="max-w-7xl mx-auto px-4 pt-4 md:pt-6">
        <div className="relative rounded-2xl overflow-hidden shadow-lg aspect-[2/1] md:aspect-[3/1] bg-gray-100 group">
          {BANNERS.map((banner, index) => (
            <div 
              key={banner.id} 
              className={`absolute inset-0 transition-opacity duration-1000 ease-in-out ${index === currentBanner ? 'opacity-100 z-10' : 'opacity-0 z-0'}`}
            >
              <a href={banner.link} target="_blank" rel="noopener noreferrer" className="block w-full h-full">
                <img 
                  src={banner.url} 
                  alt={banner.alt} 
                  className="w-full h-full object-cover"
                />
              </a>
            </div>
          ))}

          {/* Navigation Buttons */}
          <button 
            onClick={(e) => { e.preventDefault(); prevBanner(); }}
            className="absolute left-4 top-1/2 -translate-y-1/2 z-20 bg-black/20 hover:bg-black/40 text-white p-2 rounded-full opacity-0 group-hover:opacity-100 transition-all duration-300 backdrop-blur-sm"
          >
            <ChevronLeft size={24} />
          </button>
          <button 
            onClick={(e) => { e.preventDefault(); nextBanner(); }}
            className="absolute right-4 top-1/2 -translate-y-1/2 z-20 bg-black/20 hover:bg-black/40 text-white p-2 rounded-full opacity-0 group-hover:opacity-100 transition-all duration-300 backdrop-blur-sm"
          >
            <ChevronRight size={24} />
          </button>

          {/* Dots Indicators */}
          <div className="absolute bottom-4 left-1/2 -translate-x-1/2 z-20 flex gap-2">
            {BANNERS.map((_, index) => (
              <button
                key={index}
                onClick={() => setCurrentBanner(index)}
                className={`h-1.5 rounded-full transition-all duration-500 ${index === currentBanner ? 'bg-white w-8' : 'bg-white/40 w-2 hover:bg-white/60'}`}
              />
            ))}
          </div>
        </div>
      </section>

      {/* Block 1: Featured Categories Card */}
      <section className="max-w-7xl mx-auto px-4">
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 md:p-8">
          <h2 className="text-base md:text-lg font-bold text-gray-900 mb-8 uppercase tracking-wider flex items-center gap-2 border-l-4 border-primary pl-4">
             DANH MỤC NỔI BẬT
          </h2>
          <div className="grid grid-cols-4 md:grid-cols-8 gap-4 md:gap-8 justify-items-center">
            {dynamicCategories.length > 0 ? (
              dynamicCategories.map(cat => {
                const Icon = getCategoryIcon(cat.icon);
                return (
                  <Link key={cat.id} to={`/category/${cat.id}`} className="group flex flex-col items-center gap-3 w-full max-w-[100px]">
                    <div className="w-14 h-14 md:w-20 md:h-20 bg-gray-50 border border-gray-100 rounded-3xl flex items-center justify-center text-gray-400 group-hover:bg-primary group-hover:border-primary group-hover:text-white group-hover:shadow-lg group-hover:-translate-y-1.5 transition-all duration-500">
                       <Icon strokeWidth={1.5} size={28} />
                    </div>
                    <span className="text-[10px] md:text-xs font-bold text-gray-600 text-center group-hover:text-primary transition-colors line-clamp-2 leading-tight px-1">
                      {cat.name}
                    </span>
                  </Link>
                );
              })
            ) : (
              Array(8).fill(0).map((_, i) => (
                <div key={i} className="flex flex-col items-center gap-3 animate-pulse">
                  <div className="w-14 h-14 md:w-20 md:h-20 bg-gray-100 rounded-3xl"></div>
                  <div className="h-3 bg-gray-100 w-12 rounded"></div>
                </div>
              ))
            )}
          </div>
        </div>
      </section>

      {/* Block 2: Products Card Section */}
      <section className="max-w-7xl mx-auto px-4">
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
          
          {/* Header & Tabs */}
          <div className="px-6 md:px-8 py-6 border-b border-gray-100">
            <div className="flex flex-col md:flex-row items-center justify-between gap-4">
              <h2 className="text-base md:text-xl font-bold text-primary uppercase flex items-center gap-2 shrink-0">
                <Zap size={22} fill="currentColor" className="text-yellow-500" />
                GỢI Ý HÔM NAY
              </h2>
              
              {/* Category Suggestion Pills - Aligned to right, 'All' at end */}
              <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-hide max-w-full md:ml-auto">
                {SUGGESTION_TABS.map((tab) => (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`
                      px-5 py-2.5 rounded-full text-xs md:text-sm font-bold transition-all whitespace-nowrap border
                      ${activeTab === tab.id 
                        ? 'bg-primary text-white border-primary shadow-md' 
                        : 'bg-white text-gray-500 border-gray-100 hover:border-primary hover:text-primary hover:shadow-sm'
                      }
                    `}
                  >
                    {tab.name}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Grid Content */}
          <div className="p-4 md:p-8 pt-6">
            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-4 md:gap-6">
              {productsLoading ? (
                 Array(10).fill(0).map((_, i) => <ProductCard key={i} product={{} as any} isLoading />)
              ) : (
                suggestionProducts.length > 0 ? (
                  suggestionProducts.map(product => <ProductCard key={product.id} product={product} />)
                ) : (
                  <div className="col-span-full py-12 text-center text-gray-400">
                    Chưa có sản phẩm gợi ý cho danh mục này.
                  </div>
                )
              )}
            </div>
            
            <div className="mt-12 flex justify-center pb-6">
               <Link to={activeTab === 'all' ? '/category/all' : `/category/${activeTab}`}>
                  <Button variant="outline" className="px-16 rounded-full border-gray-200 text-gray-400 hover:text-primary hover:border-primary font-bold shadow-sm transition-all hover:scale-105 h-12 bg-white">
                     Xem tất cả sản phẩm
                  </Button>
               </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Latest Reviews/News */}
      <section className="max-w-7xl mx-auto px-4 pb-12 mt-4">
        <h2 className="text-base md:text-lg font-bold text-gray-900 mb-8 uppercase tracking-wider flex items-center gap-2 border-l-4 border-primary pl-4">
            Tin Tức Săn Sale
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8">
           {MOCK_POSTS.map(post => (
             <Link key={post.id} to={`/blog/${post.slug}`} className="flex group bg-white rounded-2xl overflow-hidden border border-gray-100 shadow-sm hover:shadow-lg transition-all">
               <div className="w-1/3 relative overflow-hidden h-40 md:h-48">
                 <img src={post.imageUrl} alt={post.title} className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-110" />
                 <div className="absolute inset-0 bg-black/10 group-hover:bg-transparent transition-colors"></div>
               </div>
               <div className="w-2/3 p-4 md:p-6 flex flex-col justify-center">
                 <h3 className="font-bold text-sm md:text-lg mb-2 group-hover:text-primary transition-colors line-clamp-2 leading-snug">
                   {post.title}
                 </h3>
                 <p className="text-gray-400 text-[10px] md:text-xs line-clamp-2 mb-4 leading-relaxed font-medium">
                   {post.excerpt}
                 </p>
                 <span className="text-[10px] font-black text-primary uppercase tracking-[0.2em] flex items-center gap-1">
                   ĐỌC NGAY <ChevronRight size={12} strokeWidth={3} />
                 </span>
               </div>
             </Link>
           ))}
        </div>
      </section>
    </div>
  );
};

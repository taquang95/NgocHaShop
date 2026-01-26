
import React, { useState, useEffect, useMemo } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { 
  Search, Menu, ShoppingBag, X, HelpCircle, Facebook, MapPin, Phone, Mail, 
  ChevronDown, Shirt, Sparkles, Baby, Home as HomeIcon, Heart, Zap, FileText
} from 'lucide-react';
import { Button } from './ui/Button';

// --- MEGA MENU CONFIGURATION ---
interface SubItem {
  label: string;
  path: string;
  isHot?: boolean;
}

interface MenuColumn {
  title: string;
  items: SubItem[];
}

interface MenuItem {
  id: string;
  label: string;
  path: string;
  icon?: React.ReactNode;
  hasDropdown?: boolean;
  columns?: MenuColumn[];
  featuredImage?: string;
}

const MEGA_MENU_DATA: MenuItem[] = [
  { id: 'home', label: 'Home', path: '/', hasDropdown: false },
  { 
    id: 'deals', 
    label: 'Deal Hot', 
    path: '/category/deals', 
    icon: <Zap size={14} />,
    hasDropdown: true,
    columns: [
      {
        title: 'Săn Deal Theo Sàn',
        items: [
          { label: 'Shopee Sale', path: '/category/deals?retailer=shopee', isHot: true },
          { label: 'Lazada Sale', path: '/category/deals?retailer=lazada' },
          { label: 'Tiki Sale', path: '/category/deals?retailer=tiki' },
          { label: 'Mã Giảm Giá Độc Quyền', path: '/category/deals?type=voucher', isHot: true },
        ]
      },
      {
        title: 'Ngành Hàng Giảm Sâu',
        items: [
          { label: 'Công nghệ & Điện tử', path: '/category/deals?cat=tech' },
          { label: 'Mỹ phẩm chính hãng', path: '/category/deals?cat=beauty' },
          { label: 'Thời trang xu hướng', path: '/category/deals?cat=fashion' },
        ]
      }
    ],
    featuredImage: 'https://images.unsplash.com/photo-1607082348824-0a96f2a4b9da?auto=format&fit=crop&w=300&q=80'
  },
  { 
    id: 'fashion', 
    label: 'Thời trang', 
    path: '/category/fashion',
    icon: <Shirt size={14} />,
    hasDropdown: true,
    columns: [
      {
        title: 'Thời Trang Nữ',
        items: [
          { label: 'Áo kiểu & Sơ mi', path: '/category/fashion?type=women-tops' },
          { label: 'Đầm & Chân váy', path: '/category/fashion?type=dresses' },
          { label: 'Quần Jean & Kaki', path: '/category/fashion?type=women-pants' },
          { label: 'Đồ mặc nhà', path: '/category/fashion?type=homewear' },
        ]
      },
      {
        title: 'Thời Trang Nam',
        items: [
          { label: 'Áo Thun & Polo', path: '/category/fashion?type=men-tops' },
          { label: 'Quần Âu & Jean', path: '/category/fashion?type=men-pants' },
          { label: 'Áo Khoác', path: '/category/fashion?type=jackets' },
          { label: 'Đồ thể thao', path: '/category/fashion?type=sportswear' },
        ]
      },
      {
        title: 'Phụ Kiện',
        items: [
          { label: 'Túi xách & Ví', path: '/category/accessories?type=bags' },
          { label: 'Giày dép', path: '/category/footwear' },
          { label: 'Đồng hồ & Trang sức', path: '/category/accessories' },
        ]
      }
    ]
  },
  { 
    id: 'beauty', 
    label: 'Làm đẹp', 
    path: '/category/beauty',
    icon: <Sparkles size={14} />,
    hasDropdown: true,
    columns: [
      {
        title: 'Chăm Sóc Da',
        items: [
          { label: 'Sữa rửa mặt', path: '/category/beauty?type=cleanser' },
          { label: 'Toner & Nước hoa hồng', path: '/category/beauty?type=toner' },
          { label: 'Serum & Đặc trị', path: '/category/beauty?type=serum', isHot: true },
          { label: 'Kem chống nắng', path: '/category/beauty?type=sunscreen' },
        ]
      },
      {
        title: 'Trang Điểm',
        items: [
          { label: 'Son môi', path: '/category/beauty?type=lipstick' },
          { label: 'Phấn nền & Cushion', path: '/category/beauty?type=makeup-face' },
          { label: 'Trang điểm mắt', path: '/category/beauty?type=makeup-eye' },
        ]
      },
      {
        title: 'Cơ Thể & Tóc',
        items: [
          { label: 'Sữa tắm & Dưỡng thể', path: '/category/beauty?type=body' },
          { label: 'Dầu gội & Xả', path: '/category/beauty?type=hair' },
          { label: 'Nước hoa', path: '/category/beauty?type=perfume' },
        ]
      }
    ]
  },
  { 
    id: 'mom-baby', 
    label: 'Mẹ & Bé', 
    path: '/category/mom-baby-toys',
    icon: <Baby size={14} />,
    hasDropdown: true,
    columns: [
      {
        title: 'Đồ Dùng Cho Bé',
        items: [
          { label: 'Tã & Bỉm', path: '/category/mom-baby-toys?type=diapers', isHot: true },
          { label: 'Sữa công thức', path: '/category/mom-baby-toys?type=milk' },
          { label: 'Bình sữa & Phụ kiện', path: '/category/mom-baby-toys?type=feeding' },
        ]
      },
      {
        title: 'Thời Trang & Đồ Chơi',
        items: [
          { label: 'Quần áo sơ sinh', path: '/category/mom-baby-toys?type=clothes' },
          { label: 'Đồ chơi giáo dục', path: '/category/mom-baby-toys?type=toys-edu' },
          { label: 'Đồ chơi vận động', path: '/category/mom-baby-toys?type=toys-active' },
        ]
      }
    ]
  },
  { 
    id: 'home', 
    label: 'Giặt giũ', 
    path: '/category/home-care',
    icon: <HomeIcon size={14} />,
    hasDropdown: true,
    columns: [
      {
        title: 'Chăm Sóc Nhà Cửa',
        items: [
          { label: 'Nước giặt & Xả', path: '/category/home-care?type=laundry', isHot: true },
          { label: 'Vệ sinh nhà bếp', path: '/category/home-care?type=kitchen' },
          { label: 'Khử mùi & Sáp thơm', path: '/category/home-care?type=air' },
        ]
      },
      {
        title: 'Tiện Ích Gia Đình',
        items: [
          { label: 'Dụng cụ nhà bếp', path: '/category/home-care?type=tools' },
          { label: 'Sắp xếp nhà cửa', path: '/category/home-care?type=organize' },
        ]
      }
    ]
  },
  { 
    id: 'health', 
    label: 'Sức khỏe', 
    path: '/category/health',
    icon: <Heart size={14} />,
    hasDropdown: true,
    columns: [
      {
        title: 'Chăm Sóc Sức Khỏe',
        items: [
          { label: 'Thực phẩm chức năng', path: '/category/health?type=supplements' },
          { label: 'Vitamin & Khoáng chất', path: '/category/health?type=vitamins' },
          { label: 'Thiết bị y tế', path: '/category/health?type=devices' },
        ]
      }
    ]
  },
  { id: 'news', label: 'Tin tức', path: '/blog', icon: <FileText size={14} />, hasDropdown: false },
];


export const Layout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isMobileSearchOpen, setIsMobileSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    setIsMobileMenuOpen(false);
    setIsMobileSearchOpen(false);
    window.scrollTo(0, 0);
  }, [location.pathname]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/category/search?q=${encodeURIComponent(searchQuery)}`);
      setIsMobileSearchOpen(false);
    }
  };

  // Generate Schema for SiteNavigationElement
  const navSchema = useMemo(() => {
    return {
      "@context": "https://schema.org",
      "@type": "SiteNavigationElement",
      "name": MEGA_MENU_DATA.map(item => item.label),
      "url": MEGA_MENU_DATA.map(item => `https://ngochashop.com${item.path}`)
    };
  }, []);

  return (
    <div className="min-h-screen flex flex-col bg-[#f8f9fa] font-sans text-gray-800">
      
      {/* Schema Injection */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(navSchema) }}
      />

      {/* Top Bar - Orange Darker */}
      <div className="bg-[#d73211] text-white/90 text-[11px] md:text-xs py-1.5 hidden md:block border-b border-white/10">
         <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex justify-between items-center">
            <div className="flex gap-4 items-center">
               <a href="https://www.facebook.com/ngochashopcom" target="_blank" rel="noreferrer" className="hover:text-white cursor-pointer border-r border-white/20 pr-4 flex items-center gap-1">
                  <Facebook size={12} /> Facebook
               </a>
               <a href="https://s.shopee.vn/AUnx9hnhjc" target="_blank" rel="noreferrer" className="hover:text-white cursor-pointer">Tải ứng dụng</a>
            </div>
            <div className="flex gap-4 items-center">
               <Link to="/contact" className="hover:text-white flex items-center gap-1"><HelpCircle size={12} />Liên hệ</Link>
               <a href="https://s.shopee.vn/qdReS3KS7" target="_blank" rel="noreferrer" className="font-bold hover:text-white ml-2">Đăng nhập</a>
               <span className="border-r border-white/30 h-3"></span>
               <a href="https://s.shopee.vn/60LXnjJdEh" target="_blank" rel="noreferrer" className="font-bold hover:text-white">Đăng ký</a>
            </div>
         </div>
      </div>

      {/* Main Header - Gradient Orange */}
      <header className="sticky top-0 z-50 bg-gradient-to-b from-[#ee4d2d] to-[#f55939] shadow-md text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center h-20 md:h-24">
            
            {/* Logo */}
            <div className="flex-shrink-0 flex items-center md:w-64">
              <Link to="/" className="flex flex-col items-start leading-none group hover:opacity-90 transition-opacity">
                <img 
                  src="https://i.postimg.cc/MGfs1rfd/logo-trang-web.png" 
                  alt="Ngọc Hà Shop" 
                  className="h-16 md:h-24 w-auto object-contain brightness-0 invert" 
                />
              </Link>
            </div>

            {/* Desktop Search */}
            <div className="hidden md:flex flex-1 justify-center px-4 md:px-8">
              <form onSubmit={handleSearch} className="relative w-full max-w-4xl">
                <input
                  type="text"
                  placeholder="Tìm theo tên sản phẩm hoặc danh mục sản phẩm..."
                  className="w-full pl-5 pr-14 py-3 bg-white text-gray-800 border-none rounded-lg focus:ring-0 shadow-sm text-sm"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
                <button type="submit" className="absolute right-1 top-1 bottom-1 bg-[#fb5533] hover:bg-[#d73211] text-white w-14 rounded-md flex items-center justify-center transition-colors">
                   <Search className="w-5 h-5" />
                </button>
              </form>
            </div>

            {/* Right Actions */}
            <div className="hidden md:flex items-center justify-end md:w-64 gap-4">
               <a href="https://s.shopee.vn/8zzFGkAeRR" target="_blank" rel="noopener noreferrer" className="relative p-2 group">
                  <ShoppingBag className="w-7 h-7 text-white" strokeWidth={1.5} />
                  <span className="absolute top-1 right-0 bg-white text-[#ee4d2d] text-[10px] font-bold px-1.5 py-0.5 rounded-full border border-[#ee4d2d] shadow-sm">0</span>
               </a>
            </div>

            {/* Mobile Menu Button & Search Toggle */}
            <div className="flex md:hidden items-center gap-4 ml-auto">
               <button 
                onClick={() => setIsMobileSearchOpen(!isMobileSearchOpen)} 
                className="text-white p-1 hover:bg-white/10 rounded-full transition-colors"
               >
                  {isMobileSearchOpen ? <X size={24} /> : <Search size={24} />}
               </button>
               <button onClick={() => setIsMobileMenuOpen(true)} className="p-1 text-white hover:bg-white/10 rounded-full transition-colors">
                <Menu size={24} />
              </button>
            </div>
          </div>

          {/* Mobile Search Bar Input */}
          {isMobileSearchOpen && (
             <div className="md:hidden pb-4 pt-1 animate-in slide-in-from-top-2 fade-in duration-200">
                <form onSubmit={handleSearch} className="relative w-full">
                  <input
                    type="text"
                    placeholder="Tìm kiếm sản phẩm..."
                    className="w-full pl-4 pr-12 py-3 bg-white text-gray-800 border-none rounded-lg focus:ring-2 focus:ring-white/50 shadow-lg text-base"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    autoFocus
                  />
                  <button type="submit" className="absolute right-1.5 top-1.5 bottom-1.5 bg-[#ee4d2d] text-white w-10 rounded-md flex items-center justify-center shadow-sm">
                     <Search className="w-5 h-5" />
                  </button>
                </form>
             </div>
          )}
        </div>
      </header>

      {/* --- MEGA MENU NAVIGATION BAR --- */}
      <div className="bg-white shadow-sm border-b border-gray-100 hidden md:block relative z-40">
         <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <nav className="flex items-center justify-between h-12">
              <ul className="flex items-center gap-1 h-full">
                {MEGA_MENU_DATA.map((item) => (
                  <li key={item.id} className="h-full group static">
                    <Link 
                      to={item.path} 
                      className={`
                        h-full flex items-center gap-1.5 px-3 md:px-4 font-semibold text-[13px] uppercase tracking-wide transition-colors relative
                        ${location.pathname === item.path ? 'text-[#ee4d2d]' : 'text-gray-600 hover:text-[#ee4d2d]'}
                        after:content-[''] after:absolute after:bottom-0 after:left-0 after:w-full after:h-[2px] after:bg-[#ee4d2d] after:scale-x-0 group-hover:after:scale-x-100 after:transition-transform
                        ${location.pathname === item.path ? 'after:scale-x-100' : ''}
                      `}
                    >
                      {item.icon && <span className="opacity-80 group-hover:opacity-100 transition-opacity">{item.icon}</span>}
                      {item.label}
                      {item.hasDropdown && <ChevronDown size={14} className="opacity-50 group-hover:rotate-180 transition-transform duration-300" />}
                    </Link>

                    {/* MEGA MENU DROPDOWN */}
                    {item.hasDropdown && item.columns && (
                      <div className="absolute left-0 top-full w-full bg-white shadow-xl border-t border-gray-100 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300 transform origin-top pt-2 pb-6">
                        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex">
                          {/* Columns */}
                          <div className="flex-1 grid grid-cols-4 gap-8 py-4">
                            {item.columns.map((col, idx) => (
                              <div key={idx}>
                                <h4 className="font-bold text-gray-900 mb-3 uppercase text-xs tracking-wider border-b border-gray-100 pb-2">
                                  {col.title}
                                </h4>
                                <ul className="space-y-2">
                                  {col.items.map((subItem, sIdx) => (
                                    <li key={sIdx}>
                                      <Link 
                                        to={subItem.path} 
                                        className="text-sm text-gray-500 hover:text-[#ee4d2d] hover:translate-x-1 transition-all flex items-center justify-between"
                                      >
                                        {subItem.label}
                                        {subItem.isHot && <span className="text-[9px] bg-red-100 text-red-600 px-1.5 py-0.5 rounded font-bold">HOT</span>}
                                      </Link>
                                    </li>
                                  ))}
                                </ul>
                              </div>
                            ))}
                          </div>
                          
                          {/* Featured Image (Optional) */}
                          {item.featuredImage && (
                            <div className="w-64 p-4 hidden lg:block">
                              <div className="relative h-full rounded-xl overflow-hidden group/img">
                                <img 
                                  src={item.featuredImage} 
                                  alt={item.label} 
                                  className="w-full h-full object-cover transition-transform duration-700 group-hover/img:scale-110" 
                                />
                                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent flex items-end p-4">
                                  <span className="text-white font-bold text-lg">{item.label}</span>
                                </div>
                              </div>
                            </div>
                          )}
                        </div>
                      </div>
                    )}
                  </li>
                ))}
              </ul>
            </nav>
         </div>
      </div>

      {/* Mobile Drawer (Keep Simple List for Mobile) */}
      {isMobileMenuOpen && (
        <div className="fixed inset-0 z-[60] md:hidden">
          <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={() => setIsMobileMenuOpen(false)} />
          <div className="absolute right-0 top-0 bottom-0 w-[280px] bg-white shadow-xl flex flex-col animate-in slide-in-from-right duration-300">
            <div className="p-4 border-b border-gray-100 flex justify-between items-center bg-[#ee4d2d] text-white">
              <h2 className="text-lg font-bold flex items-center gap-2"><Menu size={20} /> Danh mục</h2>
              <button onClick={() => setIsMobileMenuOpen(false)} className="hover:bg-white/20 p-1 rounded"><X size={20} /></button>
            </div>
            <nav className="flex-1 overflow-y-auto p-4 space-y-2">
              {MEGA_MENU_DATA.map((item) => (
                <div key={item.id} className="border-b border-gray-50 last:border-0 pb-2">
                  <Link 
                    to={item.path} 
                    className="flex items-center gap-3 py-2 px-2 text-gray-700 hover:bg-gray-50 rounded-lg font-medium"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                     <span className="text-gray-400">{item.icon}</span>
                     {item.label}
                  </Link>
                  {/* Simple sub-links for mobile */}
                  {item.columns && (
                    <div className="pl-11 pr-2 space-y-1 mt-1">
                      {item.columns.slice(0, 2).flatMap(col => col.items.slice(0, 3)).map((sub, idx) => (
                         <Link 
                           key={idx} 
                           to={sub.path}
                           className="block text-xs text-gray-500 py-1.5 hover:text-[#ee4d2d]"
                           onClick={() => setIsMobileMenuOpen(false)}
                         >
                           {sub.label}
                         </Link>
                      ))}
                      <Link to={item.path} className="block text-xs font-bold text-[#ee4d2d] py-1">Xem tất cả...</Link>
                    </div>
                  )}
                </div>
              ))}
            </nav>
          </div>
        </div>
      )}

      {/* Main Content */}
      <main className="flex-grow">
        {children}
      </main>

      {/* Footer */}
      <footer className="bg-white border-t border-gray-200 mt-12 py-12" role="contentinfo" itemScope itemType="http://schema.org/WPFooter">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 md:grid-cols-4 gap-8">
          
          {/* Column 1: Brand & Description (Organization Schema) */}
          <div className="col-span-1" itemScope itemType="http://schema.org/Organization">
             <Link to="/" className="inline-block mb-4" itemProp="url">
                <img 
                  src="https://i.postimg.cc/YS74xvvL/logo-cam-web.png" 
                  alt="Ngọc Hà Shop" 
                  className="h-20 w-auto object-contain" 
                  itemProp="logo"
                />
              </Link>
            <meta itemProp="name" content="Ngọc Hà Shop" />
            <p className="text-gray-500 text-sm leading-relaxed mb-4" itemProp="description">
              NgocHaShop.com – Chuyên thời trang nam nữ, mỹ phẩm, giày dép, phụ kiện, mẹ & bé và gia dụng. Mua sắm thông minh, tiết kiệm và an tâm.
            </p>
            <div className="flex gap-4">
              <a href="https://www.facebook.com/ngochashopcom" target="_blank" rel="noreferrer" className="text-gray-400 hover:text-[#1877F2] transition-colors" aria-label="Facebook">
                <Facebook size={20} />
              </a>
            </div>
          </div>

          {/* Column 2: Khám phá */}
          <div>
            <h3 className="font-bold mb-4 text-gray-900 uppercase text-xs tracking-wider">Danh mục nổi bật</h3>
            <ul className="space-y-2 text-sm text-gray-500">
              <li><Link to="/deals" className="hover:text-primary transition-colors">Săn Deal Hot</Link></li>
              <li><Link to="/category/fashion" className="hover:text-primary transition-colors">Thời trang Nam Nữ</Link></li>
              <li><Link to="/category/beauty" className="hover:text-primary transition-colors">Mỹ phẩm & Làm đẹp</Link></li>
              <li><Link to="/category/mom-baby-toys" className="hover:text-primary transition-colors">Mẹ & Bé / Đồ chơi</Link></li>
              <li><Link to="/category/health" className="hover:text-primary transition-colors">Sức khỏe & Đời sống</Link></li>
              <li><Link to="/category/home-care" className="hover:text-primary transition-colors">Nhà cửa & Giặt giũ</Link></li>
            </ul>
          </div>

          {/* Column 3: Thông tin */}
          <div>
            <h3 className="font-bold mb-4 text-gray-900 uppercase text-xs tracking-wider">Về Ngọc Hà Shop</h3>
            <ul className="space-y-2 text-sm text-gray-500">
              <li><Link to="/about" className="hover:text-primary transition-colors">Giới thiệu</Link></li>
              <li><Link to="/blog" className="hover:text-primary transition-colors">Tin tức & Kinh nghiệm</Link></li>
              <li><Link to="/privacy" className="hover:text-primary transition-colors">Chính sách bảo mật</Link></li>
              <li><Link to="/contact" className="hover:text-primary transition-colors">Điều khoản sử dụng</Link></li>
            </ul>
          </div>

           {/* Column 4: Liên hệ */}
           <div>
            <h3 className="font-bold mb-4 text-gray-900 uppercase text-xs tracking-wider">Liên hệ hỗ trợ</h3>
            <ul className="space-y-3 text-sm text-gray-500">
              <li className="flex items-start gap-2">
                 <MapPin size={16} className="text-primary mt-0.5 flex-shrink-0" />
                 <span>229 Tây Sơn, Đống Đa, Hà Nội</span>
              </li>
              <li className="flex items-center gap-2">
                 <Phone size={16} className="text-primary flex-shrink-0" />
                 <a href="tel:0924422268" className="hover:text-primary">092 44 222 68</a>
              </li>
              <li className="flex items-center gap-2">
                 <Mail size={16} className="text-primary flex-shrink-0" />
                 <a href="mailto:contact@ngochashop.com" className="hover:text-primary">contact@ngochashop.com</a>
              </li>
              <li className="pt-2">
                 <Link to="/contact" className="inline-block text-xs font-bold text-primary border border-primary px-3 py-1.5 rounded hover:bg-primary hover:text-white transition-all">
                    Gửi yêu cầu hỗ trợ
                 </Link>
              </li>
            </ul>
          </div>
        </div>
        
        {/* Simple Copyright */}
        <div className="max-w-7xl mx-auto px-4 mt-12 pt-8 border-t border-gray-100 text-center text-xs text-gray-400">
          <p>© 2025 NgocHaShop.com – Thời trang, Mỹ phẩm, Mẹ Bé, Sức khỏe & Gia dụng</p>
        </div>
      </footer>
    </div>
  );
};


import React, { useEffect } from 'react';
import { 
  Target, Heart, CheckCircle, HelpCircle, 
  ShoppingBag, ShieldCheck, MapPin, Phone, Facebook 
} from 'lucide-react';

export const About: React.FC = () => {
  useEffect(() => {
    document.title = "Về NgocHaShop.com - Chọn Đúng, Mua Dễ Cho Cả Gia Đình";
    window.scrollTo(0, 0);
  }, []);

  const schemaData = {
    "@context": "https://schema.org",
    "@type": "AboutPage",
    "name": "Về NgocHaShop.com",
    "description": "NgocHaShop.com là website mua sắm định hướng 'chọn đúng – mua dễ' cho cả gia đình.",
    "mainEntity": {
      "@type": "Organization",
      "name": "Ngọc Hà Shop",
      "url": "https://ngochashop.com",
      "logo": "https://i.postimg.cc/YS74xvvL/logo-cam-web.png",
      "sameAs": [
        "https://facebook.com/ngochashopcom"
      ],
      "contactPoint": {
        "@type": "ContactPoint",
        "telephone": "092 44 222 68",
        "contactType": "customer service",
        "areaServed": "VN",
        "availableLanguage": "Vietnamese"
      },
      "address": {
        "@type": "PostalAddress",
        "streetAddress": "229 Tây Sơn, Đống Đa",
        "addressLocality": "Hà Nội",
        "addressCountry": "VN"
      }
    }
  };

  return (
    <div className="bg-[#f8f9fa] min-h-screen font-sans text-gray-800">
      {/* Inject JSON-LD Schema */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(schemaData) }}
      />

      {/* Header Banner */}
      <div className="bg-gradient-to-r from-[#ee4d2d] to-[#ff7337] text-white py-12 md:py-16">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <h1 className="text-3xl md:text-5xl font-extrabold mb-4">Về NgocHaShop.com</h1>
          <p className="text-lg md:text-xl font-medium opacity-90 max-w-2xl mx-auto">
            Định hướng "Chọn Đúng – Mua Dễ" cho cả gia đình.
          </p>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-4 py-10 space-y-12">
        
        {/* Intro Section */}
        <section className="bg-white rounded-2xl p-6 md:p-10 shadow-sm border border-gray-100 leading-relaxed text-gray-700">
          <p className="mb-4 text-lg">
            <strong>NgocHaShop.com</strong> là website mua sắm định hướng <span className="text-[#ee4d2d] font-bold">"chọn đúng – mua dễ"</span> cho cả gia đình. Tại đây, chúng tôi tuyển chọn và tổng hợp các sản phẩm thuộc nhiều ngành hàng: thời trang nam nữ, mỹ phẩm, giày dép, phụ kiện, trang sức, thời trang trẻ em, đồ chơi, sức khỏe, mẹ & bé, giặt giũ — kèm thông tin rõ ràng để bạn dễ so sánh và quyết nhanh.
          </p>
          <p className="text-lg">
            Chúng tôi tin rằng mua sắm hiệu quả không nằm ở việc xem thật nhiều, mà nằm ở việc <strong>xem đúng thứ mình cần</strong>, hiểu rõ sản phẩm và lựa chọn phù hợp ngân sách, thói quen sử dụng.
          </p>
        </section>

        {/* Mission Section */}
        <section className="grid md:grid-cols-2 gap-8 items-center">
          <div>
             <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-6 flex items-center gap-3">
               <Target className="text-[#ee4d2d] w-8 h-8" />
               Sứ mệnh của chúng tôi
             </h2>
             <ul className="space-y-4">
               <li className="flex items-start gap-3">
                 <CheckCircle className="text-green-500 w-6 h-6 flex-shrink-0 mt-0.5" />
                 <div>
                   <strong className="text-gray-900 block mb-1">Giúp bạn chọn mua dễ hơn</strong>
                   <span className="text-gray-600">Nội dung ngắn gọn, tập trung vào điểm quan trọng (điểm nổi bật, thông số, phù hợp với ai, cách dùng).</span>
                 </div>
               </li>
               <li className="flex items-start gap-3">
                 <CheckCircle className="text-green-500 w-6 h-6 flex-shrink-0 mt-0.5" />
                 <div>
                   <strong className="text-gray-900 block mb-1">Giảm rủi ro mua sai</strong>
                   <span className="text-gray-600">Có FAQ, lưu ý sử dụng/bảo quản, gợi ý lựa chọn thay thế khi cần.</span>
                 </div>
               </li>
               <li className="flex items-start gap-3">
                 <CheckCircle className="text-green-500 w-6 h-6 flex-shrink-0 mt-0.5" />
                 <div>
                   <strong className="text-gray-900 block mb-1">Ưu tiên trải nghiệm thực tế</strong>
                   <span className="text-gray-600">Gợi ý theo nhu cầu phổ biến của gia đình Việt (đi làm – đi chơi – chăm con – chăm da – chăm nhà).</span>
                 </div>
               </li>
             </ul>
          </div>
          <div className="bg-orange-50 rounded-2xl p-8 flex items-center justify-center">
             <img 
               src="https://cdn-icons-png.flaticon.com/512/3081/3081559.png" 
               alt="Sứ mệnh" 
               className="w-48 h-48 object-contain opacity-80" 
             />
          </div>
        </section>

        {/* Categories Section */}
        <section>
          <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-8 text-center">NgocHaShop.com có gì?</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {[
              { title: "Thời trang nam & nữ", desc: "Đồ đi làm, đi chơi, đồ basic dễ phối", icon: "👕" },
              { title: "Giày dép", desc: "Sneaker, sandal, giày công sở", icon: "👟" },
              { title: "Phụ kiện & Trang sức", desc: "Túi, ví, thắt lưng, kính, đồng hồ", icon: "👜" },
              { title: "Mỹ phẩm & Cá nhân", desc: "Skincare, makeup, tóc & body", icon: "💄" },
              { title: "Trẻ em & Đồ chơi", desc: "Theo độ tuổi, nhu cầu học–chơi", icon: "🧸" },
              { title: "Mẹ & bé", desc: "Bỉm/tã, đồ dùng, chăm sóc mẹ và bé", icon: "👶" },
              { title: "Sức khỏe", desc: "Chăm sóc an toàn, không 'thần thánh hóa'", icon: "💊" },
              { title: "Giặt giũ", desc: "Nước giặt, xả, tẩy rửa, vệ sinh nhà cửa", icon: "🧺" },
            ].map((item, idx) => (
              <div key={idx} className="bg-white p-5 rounded-xl border border-gray-100 hover:shadow-md transition-shadow">
                <div className="text-3xl mb-3">{item.icon}</div>
                <h3 className="font-bold text-lg text-gray-900 mb-2">{item.title}</h3>
                <p className="text-sm text-gray-600">{item.desc}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Why Choose Us */}
        <section className="bg-white rounded-2xl p-6 md:p-10 shadow-sm border border-gray-100">
           <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-6 flex items-center gap-3">
             <Heart className="text-[#ee4d2d] w-8 h-8" />
             Vì sao khách hàng chọn chúng tôi?
           </h2>
           <div className="grid md:grid-cols-2 gap-8">
             <div className="space-y-4">
                <div className="flex gap-4">
                   <div className="bg-orange-100 text-[#ee4d2d] w-10 h-10 rounded-full flex items-center justify-center font-bold flex-shrink-0">1</div>
                   <div>
                      <h4 className="font-bold text-lg mb-1">Tối giản thông tin nhưng đủ dùng</h4>
                      <p className="text-gray-600 text-sm">Bạn chỉ cần nhìn 30–60 giây là nắm được "hợp hay không".</p>
                   </div>
                </div>
                <div className="flex gap-4">
                   <div className="bg-orange-100 text-[#ee4d2d] w-10 h-10 rounded-full flex items-center justify-center font-bold flex-shrink-0">2</div>
                   <div>
                      <h4 className="font-bold text-lg mb-1">Cấu trúc rõ ràng</h4>
                      <p className="text-gray-600 text-sm">Mô tả ngắn, đặc điểm nổi bật, thông số, FAQ và gợi ý liên quan.</p>
                   </div>
                </div>
             </div>
             <div className="space-y-4">
                <div className="flex gap-4">
                   <div className="bg-orange-100 text-[#ee4d2d] w-10 h-10 rounded-full flex items-center justify-center font-bold flex-shrink-0">3</div>
                   <div>
                      <h4 className="font-bold text-lg mb-1">Trải nghiệm mượt, dễ dùng</h4>
                      <p className="text-gray-600 text-sm">Website tối ưu cho mobile, thao tác nhanh, dễ tìm danh mục.</p>
                   </div>
                </div>
                <div className="flex gap-4">
                   <div className="bg-orange-100 text-[#ee4d2d] w-10 h-10 rounded-full flex items-center justify-center font-bold flex-shrink-0">4</div>
                   <div>
                      <h4 className="font-bold text-lg mb-1">Minh bạch liên kết mua hàng</h4>
                      <p className="text-gray-600 text-sm">Chúng tôi ưu tiên dẫn tới các kênh mua uy tín.</p>
                   </div>
                </div>
             </div>
           </div>
        </section>

        {/* Affiliate Disclosure */}
        <section className="bg-gray-50 rounded-2xl p-6 md:p-8 border-l-4 border-[#ee4d2d]">
           <h3 className="font-bold text-xl text-gray-900 mb-4 flex items-center gap-2">
             <ShieldCheck size={24} />
             Cam kết nội dung & Minh bạch (Affiliate Disclosure)
           </h3>
           <div className="text-sm text-gray-600 space-y-3 leading-relaxed">
             <p>
               Một số liên kết trên NgocHaShop.com có thể là liên kết tiếp thị liên kết (affiliate). Khi bạn mua hàng qua các liên kết này, chúng tôi có thể nhận một khoản hoa hồng nhỏ từ nhà bán — <strong>không làm tăng chi phí của bạn.</strong>
             </p>
             <p className="font-medium text-gray-800">Chúng tôi luôn ưu tiên:</p>
             <ul className="list-disc list-inside space-y-1 pl-2">
               <li>Nội dung viết rõ ràng, trung thực, hạn chế phóng đại.</li>
               <li>Với nhóm sức khỏe/mẹ & bé, thông tin mang tính tham khảo, không thay thế tư vấn chuyên môn.</li>
             </ul>
           </div>
        </section>

        {/* Contact Info */}
        <section className="text-center pt-8 border-t border-gray-200">
           <h2 className="text-2xl font-bold text-gray-900 mb-8">Thông tin liên hệ</h2>
           <div className="flex flex-col md:flex-row justify-center gap-6 md:gap-12">
              <div className="flex flex-col items-center gap-2">
                 <div className="w-12 h-12 bg-blue-50 text-blue-600 rounded-full flex items-center justify-center">
                    <Facebook size={24} />
                 </div>
                 <a href="https://facebook.com/ngochashopcom" target="_blank" rel="noreferrer" className="font-medium hover:text-[#ee4d2d]">
                   facebook.com/ngochashopcom
                 </a>
              </div>
              <div className="flex flex-col items-center gap-2">
                 <div className="w-12 h-12 bg-red-50 text-red-600 rounded-full flex items-center justify-center">
                    <MapPin size={24} />
                 </div>
                 <span className="font-medium">229 Tây Sơn, Đống Đa, Hà Nội</span>
              </div>
              <div className="flex flex-col items-center gap-2">
                 <div className="w-12 h-12 bg-green-50 text-green-600 rounded-full flex items-center justify-center">
                    <Phone size={24} />
                 </div>
                 <span className="font-bold text-lg">092 44 222 68</span>
              </div>
           </div>
        </section>

      </div>
    </div>
  );
};

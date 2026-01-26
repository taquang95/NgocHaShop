
import React, { useEffect } from 'react';
import { 
  MapPin, Clock, MessageCircle, 
  HelpCircle, ShieldCheck, Phone, Facebook
} from 'lucide-react';
import { Button } from '../components/ui/Button';

export const Contact: React.FC = () => {
  useEffect(() => {
    document.title = "Liên hệ NgocHaShop.com";
    window.scrollTo(0, 0);
  }, []);

  const schemaData = {
    "@context": "https://schema.org",
    "@type": "ContactPage",
    "name": "Liên hệ NgocHaShop.com",
    "description": "Trang liên hệ chính thức của NgocHaShop.com. Hỗ trợ chọn mua sản phẩm, hợp tác nội dung và giải đáp thắc mắc.",
    "mainEntity": {
      "@type": "Organization",
      "name": "Ngọc Hà Shop",
      "url": "https://ngochashop.com",
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
    <div className="bg-[#f8f9fa] min-h-screen font-sans text-gray-800 pb-12">
      {/* Schema */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(schemaData) }}
      />

      {/* Header */}
      <div className="bg-white border-b border-gray-200 py-10 mb-8">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <h1 className="text-3xl md:text-4xl font-extrabold text-gray-900 mb-4">
            Liên hệ NgocHaShop.com
          </h1>
          <p className="text-gray-500 font-medium max-w-2xl mx-auto leading-relaxed">
            Bạn cần hỗ trợ chọn mua sản phẩm, góp ý nội dung, hoặc muốn hợp tác? 
            Hãy liên hệ với NgocHaShop.com theo các kênh dưới đây — chúng tôi sẽ phản hồi sớm nhất có thể.
          </p>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Left Column: Contact Info */}
        <div className="space-y-6">
          
          {/* Main Channel */}
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
             <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
                <MessageCircle className="text-primary" /> Kênh liên hệ chính thức
             </h2>
             <p className="text-gray-600 mb-6">
                Nhắn tin trực tiếp qua Fanpage để được đội ngũ admin hỗ trợ nhanh nhất.
             </p>
             <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <a 
                  href="https://www.facebook.com/ngochashopcom" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="block"
                >
                    <Button fullWidth size="lg" className="bg-[#1877F2] hover:bg-[#166fe5] shadow-lg shadow-blue-500/20 border-none h-12">
                      <Facebook size={20} className="mr-2" /> Chat Facebook
                    </Button>
                </a>
                <a 
                  href="tel:0924422268" 
                  className="block"
                >
                    <Button fullWidth size="lg" variant="outline" className="border-gray-300 hover:bg-gray-50 text-gray-700 h-12">
                      <Phone size={20} className="mr-2" /> Gọi ngay
                    </Button>
                </a>
             </div>
          </div>

          {/* Contact Details */}
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
             <div className="space-y-6">
                <div>
                   <h3 className="font-bold text-gray-900 flex items-center gap-2 mb-2">
                      <MapPin className="text-red-500" size={20} /> Địa chỉ
                   </h3>
                   <p className="text-gray-600 pl-7">
                      NgocHaShop.com<br/>
                      229 Tây Sơn, Đống Đa, Hà Nội
                   </p>
                </div>

                <div>
                   <h3 className="font-bold text-gray-900 flex items-center gap-2 mb-2">
                      <Clock className="text-orange-500" size={20} /> Thời gian phản hồi
                   </h3>
                   <ul className="text-gray-600 pl-7 space-y-1">
                      <li><strong>Thứ 2 – Thứ 7:</strong> 09:00 – 18:00</li>
                      <li className="text-sm text-gray-500">Ngoài giờ: chúng tôi sẽ phản hồi trong thời gian sớm nhất.</li>
                   </ul>
                </div>
             </div>
          </div>
          
           {/* Topics */}
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
             <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
                <HelpCircle className="text-green-500" /> Bạn có thể liên hệ về?
             </h2>
             <ul className="space-y-4">
               {[
                 { title: "Tư vấn chọn mua", desc: "thời trang nam nữ, mỹ phẩm, giày dép, phụ kiện, trang sức" },
                 { title: "Mẹ & bé / trẻ em", desc: "thời trang trẻ em, đồ chơi, đồ dùng mẹ bé" },
                 { title: "Sức khỏe & giặt giũ", desc: "sản phẩm chăm sóc cá nhân, giặt giũ – vệ sinh nhà cửa" },
                 { title: "Hợp tác", desc: "nội dung, review sản phẩm, đối tác/nhãn hàng" }
               ].map((item, idx) => (
                 <li key={idx} className="flex gap-3 items-start">
                    <div className="mt-2 w-1.5 h-1.5 rounded-full bg-primary flex-shrink-0" />
                    <div>
                       <span className="font-bold text-gray-800 block">{item.title}</span>
                       <span className="text-sm text-gray-500 capitalize">{item.desc}</span>
                    </div>
                 </li>
               ))}
             </ul>
          </div>
          
          {/* Disclaimer */}
           <div className="bg-orange-50 p-5 rounded-xl border border-orange-100 text-sm text-gray-700">
              <h4 className="font-bold text-gray-900 flex items-center gap-2 mb-2">
                 <ShieldCheck size={16} className="text-[#ee4d2d]" /> Lưu ý (Minh bạch)
              </h4>
              <p>
                 NgocHaShop.com có thể sử dụng liên kết tiếp thị liên kết (affiliate). Khi bạn mua qua liên kết, chúng tôi có thể nhận hoa hồng mà không làm tăng chi phí của bạn.
              </p>
           </div>
        </div>

        {/* Right Column: Map */}
        <div className="h-[400px] md:h-auto bg-gray-200 rounded-2xl overflow-hidden shadow-sm border border-gray-100 relative min-h-[500px]">
          <iframe 
            src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3724.580798782276!2d105.82386227608246!3d21.00943368843997!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3135ac804b772741%3A0x6a0e6320076a0840!2zMjI5IFAuIFTDonkgU8ahbiwgTmfDoyBUxrUgU-G7nywgxJDhu5FuZyDEkGEsIEjDoCBO4buZaSwgVmlldG5hbQ!5e0!3m2!1sen!2s!4v1705912345678!5m2!1sen!2s" 
            width="100%" 
            height="100%" 
            style={{ border: 0 }} 
            allowFullScreen={true} 
            loading="lazy" 
            referrerPolicy="no-referrer-when-downgrade"
            title="Map"
          ></iframe>
        </div>
      </div>
    </div>
  );
};

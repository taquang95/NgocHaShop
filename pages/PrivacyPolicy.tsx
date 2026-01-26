
import React, { useEffect } from 'react';
import { 
  Shield, Lock, Eye, Server, Globe, 
  FileText, Calendar, AlertCircle, Mail 
} from 'lucide-react';

export const PrivacyPolicy: React.FC = () => {
  useEffect(() => {
    document.title = "Chính sách bảo mật (Privacy Policy) - NgocHaShop.com";
    window.scrollTo(0, 0);
  }, []);

  const schemaData = {
    "@context": "https://schema.org",
    "@type": "WebPage",
    "name": "Chính sách bảo mật (Privacy Policy)",
    "description": "Chính sách bảo mật thông tin của NgocHaShop.com. Chúng tôi cam kết bảo vệ dữ liệu cá nhân, minh bạch về việc thu thập dữ liệu và liên kết tiếp thị liên kết.",
    "url": "https://ngochashop.com/#/privacy",
    "datePublished": "2024-01-01",
    "dateModified": "2025-01-22",
    "publisher": {
      "@type": "Organization",
      "name": "Ngọc Hà Shop",
      "logo": {
        "@type": "ImageObject",
        "url": "https://i.postimg.cc/YS74xvvL/logo-cam-web.png"
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
      <div className="bg-white border-b border-gray-200 py-10">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <div className="inline-flex items-center justify-center p-3 bg-green-50 rounded-full mb-4">
            <Shield className="w-8 h-8 text-green-600" />
          </div>
          <h1 className="text-3xl md:text-4xl font-extrabold text-gray-900 mb-2">
            Chính sách bảo mật
          </h1>
          <p className="text-gray-500 font-medium">Privacy Policy</p>
          <p className="text-sm text-gray-400 mt-4">Cập nhật lần cuối: 22/01/2025</p>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 py-10">
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 md:p-10 space-y-8 leading-relaxed text-gray-700">
          
          <section>
            <p className="mb-4">
              <strong>NgocHaShop.com</strong> (“chúng tôi”) tôn trọng quyền riêng tư và cam kết bảo vệ dữ liệu cá nhân của bạn khi truy cập website. Chính sách này mô tả cách chúng tôi thu thập, sử dụng, lưu trữ và bảo vệ thông tin.
            </p>
            <p className="flex items-center gap-2 p-4 bg-blue-50 text-blue-800 rounded-lg text-sm">
              <AlertCircle size={18} />
              <span>Nếu bạn có câu hỏi, vui lòng liên hệ qua Facebook: <a href="https://www.facebook.com/ngochashopcom" className="underline font-bold" target="_blank" rel="noreferrer">ngochashopcom</a></span>
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
              <span className="bg-gray-100 w-8 h-8 flex items-center justify-center rounded-full text-sm">1</span>
              Phạm vi áp dụng
            </h2>
            <p>
              Chính sách này áp dụng cho toàn bộ hoạt động truy cập và sử dụng website NgocHaShop.com, bao gồm các trang nội dung, trang sản phẩm và các liên kết chuyển hướng sang nền tảng mua hàng bên thứ ba.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
              <span className="bg-gray-100 w-8 h-8 flex items-center justify-center rounded-full text-sm">2</span>
              Dữ liệu chúng tôi có thể thu thập
            </h2>
            <p className="mb-3">Tùy cách bạn sử dụng website, chúng tôi có thể thu thập một số thông tin sau:</p>
            
            <div className="ml-4 space-y-4">
              <div>
                <h3 className="font-bold text-gray-800 mb-2">2.1. Dữ liệu bạn chủ động cung cấp</h3>
                <ul className="list-disc pl-5 space-y-1">
                  <li>Thông tin bạn gửi khi liên hệ (ví dụ: tên, nội dung tin nhắn).</li>
                  <li>Thông tin bạn cung cấp khi đăng ký nhận tin (nếu website có tính năng này): email/số điện thoại.</li>
                </ul>
              </div>
              
              <div>
                <h3 className="font-bold text-gray-800 mb-2">2.2. Dữ liệu thu thập tự động (khi bạn truy cập)</h3>
                <ul className="list-disc pl-5 space-y-1">
                  <li>Thông tin kỹ thuật: loại thiết bị, trình duyệt, hệ điều hành, độ phân giải màn hình.</li>
                  <li>Dữ liệu sử dụng: trang đã xem, thời gian ở lại trang, liên kết đã bấm, nguồn truy cập (referrer).</li>
                  <li>Địa chỉ IP (có thể được rút gọn/ẩn danh tùy cấu hình đo lường).</li>
                </ul>
              </div>

              <div>
                <h3 className="font-bold text-gray-800 mb-2">2.3. Cookie và công nghệ tương tự</h3>
                <p className="mb-2">Chúng tôi có thể sử dụng cookie hoặc công nghệ tương tự để:</p>
                <ul className="list-disc pl-5 space-y-1">
                  <li>Ghi nhớ lựa chọn cơ bản (ví dụ: ngôn ngữ, bộ lọc tìm kiếm).</li>
                  <li>Đo lường hiệu suất website và hành vi người dùng (analytics).</li>
                  <li>Ghi nhận sự kiện bấm link (đặc biệt là liên kết affiliate).</li>
                </ul>
              </div>
            </div>
          </section>

          <section>
            <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
              <span className="bg-gray-100 w-8 h-8 flex items-center justify-center rounded-full text-sm">3</span>
              Mục đích sử dụng dữ liệu
            </h2>
            <ul className="list-disc pl-5 space-y-2">
              <li>Cải thiện trải nghiệm người dùng (tốc độ, điều hướng, nội dung phù hợp).</li>
              <li>Thống kê lượt xem, lượt bấm, hiệu quả nội dung (phân tích – tối ưu SEO).</li>
              <li>Phòng chống gian lận, tấn công hoặc truy cập trái phép.</li>
              <li>Phản hồi yêu cầu liên hệ/hỗ trợ (nếu bạn gửi thông tin cho chúng tôi).</li>
            </ul>
            <p className="mt-3 font-semibold text-gray-900">Chúng tôi không bán dữ liệu cá nhân của bạn cho bên thứ ba.</p>
          </section>

          <section className="bg-orange-50 p-6 rounded-xl border border-orange-100">
            <h2 className="text-xl font-bold text-orange-700 mb-4 flex items-center gap-2">
              <span className="bg-white w-8 h-8 flex items-center justify-center rounded-full text-sm border border-orange-200">4</span>
              Liên kết bên thứ ba & Affiliate (Quan trọng)
            </h2>
            <p className="mb-3">
              NgocHaShop.com có thể chứa các liên kết dẫn tới website/ứng dụng của bên thứ ba (ví dụ: sàn TMĐT, nhà bán lẻ). Khi bạn bấm liên kết và rời website, việc thu thập và xử lý dữ liệu sẽ tuân theo chính sách của bên thứ ba đó.
            </p>
            <p>
              Trong một số trường hợp, liên kết có thể là liên kết tiếp thị liên kết (affiliate). Khi bạn mua hàng qua liên kết, chúng tôi có thể nhận hoa hồng mà không làm tăng chi phí của bạn.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
              <span className="bg-gray-100 w-8 h-8 flex items-center justify-center rounded-full text-sm">5</span>
              Chia sẻ dữ liệu với bên thứ ba
            </h2>
            <p className="mb-3">Chúng tôi có thể chia sẻ dữ liệu ở mức cần thiết trong các trường hợp:</p>
            <div className="space-y-4 ml-4">
              <div>
                <h3 className="font-bold text-gray-800">5.1. Nhà cung cấp dịch vụ</h3>
                <p>Chúng tôi có thể sử dụng dịch vụ của bên thứ ba để vận hành website, ví dụ:</p>
                <ul className="list-disc pl-5 mt-1">
                  <li>Lưu trữ/hosting, CDN</li>
                  <li>Công cụ đo lường (analytics)</li>
                  <li>Công cụ bảo mật, chống spam</li>
                </ul>
                <p className="mt-1 text-sm italic">Các bên này chỉ được xử lý dữ liệu theo hướng dẫn của chúng tôi và trong phạm vi cần thiết để cung cấp dịch vụ.</p>
              </div>
              <div>
                <h3 className="font-bold text-gray-800">5.2. Yêu cầu pháp lý</h3>
                <p>Chúng tôi có thể cung cấp dữ liệu khi có yêu cầu hợp pháp từ cơ quan nhà nước có thẩm quyền hoặc theo quy định pháp luật.</p>
              </div>
            </div>
          </section>

          <section>
            <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
              <span className="bg-gray-100 w-8 h-8 flex items-center justify-center rounded-full text-sm">6</span>
              Thời gian lưu trữ
            </h2>
            <p className="mb-2">Chúng tôi lưu trữ dữ liệu trong khoảng thời gian cần thiết cho mục đích nêu tại Chính sách này hoặc theo yêu cầu pháp luật.</p>
            <ul className="list-disc pl-5 space-y-1">
              <li><strong>Dữ liệu đo lường (analytics/click tracking):</strong> thường lưu theo chu kỳ tối ưu hệ thống (ví dụ 6–24 tháng tùy cấu hình).</li>
              <li><strong>Dữ liệu liên hệ:</strong> lưu đến khi hoàn tất hỗ trợ hoặc khi bạn yêu cầu xóa.</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
              <span className="bg-gray-100 w-8 h-8 flex items-center justify-center rounded-full text-sm">7</span>
              Bảo mật dữ liệu
            </h2>
            <p className="mb-3">Chúng tôi áp dụng các biện pháp hợp lý để bảo vệ dữ liệu, bao gồm:</p>
            <ul className="list-disc pl-5 space-y-1 mb-3">
              <li>Hạn chế truy cập nội bộ theo quyền (role-based access).</li>
              <li>Mã hóa/ẩn danh một phần dữ liệu khi phù hợp.</li>
              <li>Giám sát truy cập bất thường và tăng cường bảo mật máy chủ.</li>
            </ul>
            <p>Tuy nhiên, không có phương thức truyền tải hay lưu trữ nào an toàn tuyệt đối. Chúng tôi sẽ cố gắng bảo vệ dữ liệu trong khả năng tốt nhất.</p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
              <span className="bg-gray-100 w-8 h-8 flex items-center justify-center rounded-full text-sm">8</span>
              Quyền của bạn đối với dữ liệu cá nhân
            </h2>
            <p className="mb-2">Bạn có quyền:</p>
            <ul className="list-disc pl-5 space-y-1 mb-3">
              <li>Yêu cầu xem, chỉnh sửa hoặc cập nhật dữ liệu bạn đã cung cấp.</li>
              <li>Yêu cầu xóa dữ liệu (trong phạm vi pháp luật cho phép).</li>
              <li>Từ chối cookie không cần thiết (bằng cách cài đặt trên trình duyệt hoặc banner cookie nếu website có).</li>
            </ul>
            <p>Gửi yêu cầu qua Facebook: <a href="https://www.facebook.com/ngochashopcom" className="text-blue-600 hover:underline">https://www.facebook.com/ngochashopcom</a></p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
              <span className="bg-gray-100 w-8 h-8 flex items-center justify-center rounded-full text-sm">9</span>
              Trẻ em
            </h2>
            <p>NgocHaShop.com không hướng tới việc thu thập dữ liệu cá nhân của trẻ em. Nếu bạn là phụ huynh/người giám hộ và phát hiện trẻ em cung cấp dữ liệu, vui lòng liên hệ để chúng tôi hỗ trợ xử lý.</p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
              <span className="bg-gray-100 w-8 h-8 flex items-center justify-center rounded-full text-sm">10</span>
              Thay đổi chính sách
            </h2>
            <p>Chúng tôi có thể cập nhật Chính sách này theo thời gian để phù hợp với hoạt động website và quy định pháp luật. Phiên bản mới sẽ được đăng tại trang này và ghi rõ ngày cập nhật.</p>
          </section>

          <section className="bg-gray-50 p-6 rounded-xl border border-gray-200 mt-8">
            <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
              <span className="bg-white w-8 h-8 flex items-center justify-center rounded-full text-sm border border-gray-200">11</span>
              Thông tin liên hệ
            </h2>
            <div className="space-y-2">
              <p className="font-bold text-lg text-primary">NgocHaShop.com</p>
              <p className="flex items-center gap-2 text-gray-600">
                <span>Địa chỉ:</span> 
                <strong>229 Tây Sơn, Đống Đa, Hà Nội</strong>
              </p>
              <p className="flex items-center gap-2 text-gray-600">
                <span>Facebook:</span> 
                <a href="https://www.facebook.com/ngochashopcom" className="text-blue-600 hover:underline font-medium">https://www.facebook.com/ngochashopcom</a>
              </p>
            </div>
          </section>

        </div>
      </div>
    </div>
  );
};

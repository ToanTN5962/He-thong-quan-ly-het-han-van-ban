import React from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  FileText, 
  Bell, 
  ShieldCheck, 
  Layout, 
  BarChart3,  
  PlayCircle,
  Menu,
  X
} from 'lucide-react';

const Features = [
  {
    icon: Bell,
    title: 'Cảnh báo thông minh',
    description: 'Hệ thống gửi thông báo đa kênh qua Email, SMS và Push thông báo trước 30, 60, 90 ngày.',
    color: 'text-red-500',
    bgColor: 'bg-red-50'
  },
  {
    icon: ShieldCheck,
    title: 'Lưu trữ an toàn',
    description: 'Mã hóa AES-256 đảm bảo tài liệu của bạn luôn an toàn và riêng tư tuyệt đối.',
    color: 'text-emerald-500',
    bgColor: 'bg-emerald-50'
  },
  {
    icon: Layout,
    title: 'Đa nền tảng',
    description: 'Truy cập dữ liệu từ bất cứ đâu, từ máy tính để bàn đến điện thoại di động.',
    color: 'text-blue-500',
    bgColor: 'bg-blue-50'
  },
  {
    icon: BarChart3,
    title: 'Báo cáo chi tiết',
    description: 'Theo dõi trạng thái văn bản theo thời gian thực với biểu đồ trực quan và dễ hiểu.',
    color: 'text-orange-500',
    bgColor: 'bg-orange-50'
  }
];

const Stats = [
  { label: 'VĂN BẢN ĐÃ ĐƯỢC BẢO VỆ', value: '100,000+' },
  { label: 'KHÁCH HÀNG HÀI LÒNG', value: '99%' },
  { label: 'HỖ TRỢ KHÁCH HÀNG', value: '24/7' }
];

export default function HomePage() {
  const [isMenuOpen, setIsMenuOpen] = React.useState(false);
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-white font-sans text-slate-900 overflow-x-hidden">
      {/* Navigation */}
      <nav className="fixed top-0 w-full bg-white/80 backdrop-blur-md z-50 border-b border-slate-100">
        <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-[#e53935] rounded-lg flex items-center justify-center text-white">
              <FileText size={20} />
            </div>
            <span className="text-xl font-bold text-[#e53935] tracking-tight">DocWatch</span>
          </div>

          {/* Desktop Nav */}
          <div className="hidden md:flex items-center gap-10">
            <a href="#" className="text-sm font-semibold text-[#e53935]">Trang chủ</a>
            <a href="#" className="text-sm font-medium text-slate-600 hover:text-[#e53935] transition-colors">Tính năng</a>
            <a href="#" className="text-sm font-medium text-slate-600 hover:text-[#e53935] transition-colors">Giải pháp</a>
            <a href="#" className="text-sm font-medium text-slate-600 hover:text-[#e53935] transition-colors">Bảng giá</a>
            <a href="#" className="text-sm font-medium text-slate-600 hover:text-[#e53935] transition-colors">Về chúng tôi</a>
          </div>

          <div className="hidden md:flex items-center gap-4">
            <button className="px-6 py-2.5 text-sm font-bold text-slate-700 hover:bg-slate-50 rounded-xl transition-all" onClick = {() => navigate('/login')}>
              Đăng nhập
            </button>
            <button className="px-6 py-2.5 bg-[#e53935] text-white rounded-xl text-sm font-bold hover:scale-[1.02] active:scale-95 transition-all shadow-lg shadow-red-100" onClick = {() => navigate('/register')}>
              Bắt đầu miễn phí
            </button>
          </div>

          {/* Mobile Menu Toggle */}
          <button className="md:hidden p-2 text-slate-600" onClick={() => setIsMenuOpen(!isMenuOpen)}>
            {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>

        {/* Mobile Nav */}
        {isMenuOpen && (
          <div className="md:hidden bg-white border-b border-slate-100 p-6 space-y-4 animate-in slide-in-from-top duration-300">
            <a href="#" className="block text-lg font-semibold text-[#e53935]">Trang chủ</a>
            <a href="#" className="block text-lg font-medium text-slate-600">Tính năng</a>
            <a href="#" className="block text-lg font-medium text-slate-600">Giải pháp</a>
            <a href="#" className="block text-lg font-medium text-slate-600">Bảng giá</a>
            <div className="pt-4 flex flex-col gap-4">
               <button className="w-full py-3 text-slate-700 font-bold border border-slate-200 rounded-xl">Đăng nhập</button>
               <button className="w-full py-3 bg-[#e53935] text-white font-bold rounded-xl shadow-lg">Bắt đầu miễn phí</button>
            </div>
          </div>
        )}
      </nav>

      {/* Hero Section */}
      <section className="pt-40 pb-20 px-6">
        <div className="max-w-7xl mx-auto grid lg:grid-cols-2 gap-16 items-center">
          <div className="space-y-8 animate-in fade-in slide-in-from-left duration-700">
            <div className="inline-flex items-center gap-2 px-3 py-1 bg-red-50 text-[#e53935] rounded-full text-xs font-bold uppercase tracking-wider">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-[#e53935]"></span>
              </span>
              Hệ thống quản lý thông minh
            </div>
            <h1 className="text-5xl lg:text-6xl font-extrabold text-slate-900 leading-[1.1]">
              Quản lý văn bản thông minh, <br />
              <span className="text-[#e53935]">Không bao giờ lỡ thời hạn</span>
            </h1>
            <p className="text-lg text-slate-500 leading-relaxed max-w-lg">
              Theo dõi hộ chiếu, hợp đồng, chứng chỉ và các văn bản quan trọng một cách tự động. Nhận thông báo trước khi chúng hết hạn để bạn luôn làm chủ tình hình.
            </p>
            <div className="flex flex-col sm:flex-row items-center gap-4">
              <button className="w-full sm:w-auto px-8 py-4 bg-[#e53935] text-white rounded-2xl font-bold text-lg hover:scale-105 active:scale-95 transition-all shadow-xl shadow-red-200">
                Bắt đầu miễn phí
              </button>
              <button className="w-full sm:w-auto px-8 py-4 bg-white text-slate-700 border border-slate-200 rounded-2xl font-bold text-lg flex items-center justify-center gap-3 hover:bg-slate-50 transition-all">
                <PlayCircle size={24} className="text-[#e53935]" />
                Xem demo
              </button>
            </div>
          </div>
          <div className="relative animate-in fade-in slide-in-from-right duration-1000">
            <div className="absolute -inset-4 bg-red-100/50 rounded-[40px] blur-3xl"></div>
            <div className="relative bg-white p-4 rounded-[40px] border border-slate-100 shadow-2xl overflow-hidden group">
              <img 
                src="https://images.unsplash.com/photo-1497215728101-856f4ea42174?ixlib=rb-1.2.1&auto=format&fit=crop&w=1200&q=80" 
                alt="DocWatch Dashboard" 
                className="rounded-[32px] w-full object-cover transition-transform duration-700 group-hover:scale-105"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Trust Badges */}
      <section className="py-12 bg-slate-50/50 border-y border-slate-100">
        <div className="max-w-7xl mx-auto px-6">
          <p className="text-center text-[10px] font-bold text-slate-400 uppercase tracking-[0.3em] mb-10">Được tin dùng bởi hơn 2000+ doanh nghiệp</p>
          <div className="flex flex-wrap justify-center items-center gap-12 lg:gap-24 opacity-40 grayscale hover:grayscale-0 transition-all">
            <div className="h-8 w-32 bg-slate-400 rounded-lg"></div>
            <div className="h-8 w-24 bg-slate-400 rounded-lg"></div>
            <div className="h-8 w-40 bg-slate-400 rounded-lg"></div>
            <div className="h-8 w-28 bg-slate-400 rounded-lg"></div>
            <div className="h-8 w-36 bg-slate-400 rounded-lg"></div>
          </div>
        </div>
      </section>

      {/* Features Grid */}
      <section className="py-24 px-6 bg-white">
        <div className="max-w-7xl mx-auto">
          <div className="text-center max-w-2xl mx-auto mb-20 space-y-4">
            <h2 className="text-4xl font-extrabold text-slate-900 tracking-tight">Giải pháp tối ưu cho tài liệu của bạn</h2>
            <p className="text-lg text-slate-500 leading-relaxed">
              Tất cả những gì bạn cần để không bao giờ phải lo lắng về việc một văn bản hết hạn đột ngột.
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-8">
            {Features.map((feature, idx) => {
              const Icon = feature.icon;
              return (
                <div 
                  key={idx} 
                  className="bg-white p-10 rounded-[32px] border border-slate-100 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 group"
                >
                  <div className={`w-14 h-14 ${feature.bgColor} ${feature.color} rounded-2xl flex items-center justify-center mb-8 group-hover:scale-110 transition-transform`}>
                    <Icon size={28} />
                  </div>
                  <h3 className="text-2xl font-bold text-slate-900 mb-4">{feature.title}</h3>
                  <p className="text-slate-500 leading-relaxed mb-8">{feature.description}</p>
                  <div className="w-full h-1 bg-slate-50 rounded-full overflow-hidden">
                     <div className={`h-full bg-[#e53935] transition-all duration-1000 delay-300`} style={{ width: idx === 0 ? '75%' : idx === 1 ? '90%' : idx === 2 ? '60%' : '85%' }}></div>
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-24 bg-[#e53935] text-white overflow-hidden relative">
        <div className="absolute top-0 left-0 w-full h-full">
           <div className="absolute -left-20 -top-20 w-96 h-96 bg-white/5 rounded-full blur-3xl"></div>
           <div className="absolute -right-20 -bottom-20 w-96 h-96 bg-white/5 rounded-full blur-3xl"></div>
        </div>
        <div className="max-w-7xl mx-auto px-6 relative z-10">
          <div className="grid md:grid-cols-3 gap-12 text-center">
            {Stats.map((stat, idx) => (
              <div key={idx} className="space-y-4">
                <p className="text-[10px] font-bold text-white/60 uppercase tracking-[0.4em]">{stat.label}</p>
                <h3 className="text-6xl font-black">{stat.value}</h3>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 px-6 bg-[#fcf9f8]">
        <div className="max-w-5xl mx-auto bg-white p-12 md:p-20 rounded-[48px] border border-slate-100 shadow-2xl text-center space-y-10 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-40 h-40 bg-red-50 rounded-full -mr-20 -mt-20 blur-3xl"></div>
          <div className="absolute bottom-0 left-0 w-40 h-40 bg-red-50 rounded-full -ml-20 -mb-20 blur-3xl"></div>
          
          <div className="relative z-10 space-y-6">
            <h2 className="text-4xl md:text-5xl font-extrabold text-slate-900 leading-tight">Sẵn sàng quản lý văn bản của bạn?</h2>
            <p className="text-lg text-slate-500 max-w-2xl mx-auto">
              Tham gia cùng hàng nghìn người đang sử dụng DocWatch để quản lý tài liệu cá nhân và doanh nghiệp một cách chuyên nghiệp.
            </p>
          </div>

          <div className="relative z-10 flex flex-col sm:flex-row items-center justify-center gap-4">
            <button className="w-full sm:w-auto px-10 py-5 bg-[#e53935] text-white rounded-2xl font-bold text-xl hover:scale-105 active:scale-95 transition-all shadow-xl shadow-red-200">
              Đăng ký ngay
            </button>
            <button className="w-full sm:w-auto px-10 py-5 bg-white text-slate-700 border border-slate-200 rounded-2xl font-bold text-xl hover:bg-slate-50 transition-all">
              Liên hệ tư vấn
            </button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="pt-24 pb-12 px-6 bg-white border-t border-slate-100">
        <div className="max-w-7xl mx-auto">
          <div className="grid md:grid-cols-4 gap-12 mb-20">
            <div className="col-span-2 space-y-6">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 bg-[#e53935] rounded-lg flex items-center justify-center text-white">
                  <FileText size={20} />
                </div>
                <span className="text-2xl font-bold text-[#e53935] tracking-tight">DocWatch</span>
              </div>
              <p className="text-slate-500 max-w-xs leading-relaxed">
                Hệ thống quản lý thời hạn văn bản thông minh hàng đầu Việt Nam, giúp bạn an tâm trước mọi deadline.
              </p>
            </div>
            
            <div className="space-y-6">
              <h4 className="text-sm font-bold text-slate-900 uppercase tracking-widest">Sản phẩm</h4>
              <ul className="space-y-4">
                <li><a href="#" className="text-sm text-slate-500 hover:text-[#e53935] transition-colors">Tính năng</a></li>
                <li><a href="#" className="text-sm text-slate-500 hover:text-[#e53935] transition-colors">Bảng giá</a></li>
                <li><a href="#" className="text-sm text-slate-500 hover:text-[#e53935] transition-colors">Bảo mật</a></li>
                <li><a href="#" className="text-sm text-slate-500 hover:text-[#e53935] transition-colors">Hướng dẫn</a></li>
              </ul>
            </div>

            <div className="space-y-6">
              <h4 className="text-sm font-bold text-slate-900 uppercase tracking-widest">Hỗ trợ</h4>
              <ul className="space-y-4">
                <li><a href="#" className="text-sm text-slate-500 hover:text-[#e53935] transition-colors">Trung tâm hỗ trợ</a></li>
                <li><a href="#" className="text-sm text-slate-500 hover:text-[#e53935] transition-colors">Liên hệ</a></li>
                <li><a href="#" className="text-sm text-slate-500 hover:text-[#e53935] transition-colors">Điều khoản</a></li>
                <li><a href="#" className="text-sm text-slate-500 hover:text-[#e53935] transition-colors">Báo cáo lỗi</a></li>
              </ul>
            </div>
          </div>

          <div className="pt-12 border-t border-slate-50 flex flex-col md:flex-row justify-between items-center gap-6">
            <p className="text-sm text-slate-400">© 2024 DocWatch System. All rights reserved.</p>
            <div className="flex gap-8">
              <a href="#" className="text-xs text-slate-400 hover:text-[#e53935] transition-colors">Privacy Policy</a>
              <a href="#" className="text-xs text-slate-400 hover:text-[#e53935] transition-colors">Terms of Service</a>
              <a href="#" className="text-xs text-slate-400 hover:text-[#e53935] transition-colors">Security</a>
            </div>
          </div>
        </div>
      </footer>

      <style dangerouslySetInnerHTML={{ __html: `
        @keyframes bounce-slow {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-15px); }
        }
        .animate-bounce-slow {
          animation: bounce-slow 5s ease-in-out infinite;
        }
      `}} />
    </div>
  );
}

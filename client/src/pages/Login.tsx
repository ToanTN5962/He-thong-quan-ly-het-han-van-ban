import { useState, type FormEventHandler } from 'react';
import { 
  Mail, 
  Lock, 
  Eye, 
  EyeOff, 
  FileText 
} from 'lucide-react';

export default function LoginPage() {
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(false);

  const handleSubmit: FormEventHandler<HTMLFormElement> = (e) => {
    e.preventDefault();
    // Logic đăng nhập sẽ được thực hiện ở đây
    console.log('Login attempt:', { email, password, rememberMe });
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#f5f5f5] p-4 font-sans">
      <div className="w-full max-w-[1000px] flex rounded-[32px] overflow-hidden bg-white shadow-2xl">
        
        {/* Cột bên trái - Nội dung quảng bá */}
        <div className="hidden lg:flex w-1/2 bg-[#e53935] p-12 flex-col justify-between relative overflow-hidden">
          {/* Họa tiết trang trí */}
          <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full -mr-20 -mt-20 blur-3xl"></div>
          
          <div className="relative z-10">
            <div className="flex items-center gap-2 mb-20">
              <FileText className="text-white" size={32} />
              <span className="text-2xl font-bold text-white tracking-tight">DocWatch</span>
            </div>

            <h1 className="text-5xl font-bold text-white leading-tight mb-8">
              Quản lý tài liệu,<br />Làm chủ thời gian.
            </h1>
            
            <p className="text-white/80 text-lg leading-relaxed max-w-md">
              Hệ thống theo dõi và cảnh báo hết hạn tài liệu thông minh giúp bạn không bao giờ bỏ lỡ một thời hạn quan trọng nào.
            </p>
          </div>

        </div>

        {/* Cột bên phải - Form đăng nhập */}
        <div className="w-full lg:w-1/2 p-12 lg:p-16 flex flex-col justify-center">
          <div className="max-w-md mx-auto w-full">
            <h2 className="text-3xl font-bold text-slate-900 mb-2">Đăng nhập vào hệ thống</h2>
            <p className="text-slate-500 mb-10">Chào mừng bạn trở lại. Vui lòng nhập thông tin tài khoản.</p>

            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Email Input */}
              <div className="space-y-2">
                <label className="text-xs font-bold text-slate-400 uppercase tracking-widest">Email</label>
                <div className="relative">
                  <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                  <input 
                    type="email" 
                    placeholder="name@company.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full pl-12 pr-4 py-3.5 bg-slate-50 border border-slate-100 rounded-xl focus:ring-2 focus:ring-[#e53935]/10 focus:border-[#e53935] focus:bg-white outline-none transition-all text-sm"
                    required
                  />
                </div>
              </div>

              {/* Password Input */}
              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <label className="text-xs font-bold text-slate-400 uppercase tracking-widest">Mật khẩu</label>
                  <button type="button" className="text-xs font-bold text-[#e53935] hover:underline">Quên mật khẩu?</button>
                </div>
                <div className="relative">
                  <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                  <input 
                    type={showPassword ? 'text' : 'password'} 
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full pl-12 pr-12 py-3.5 bg-slate-50 border border-slate-100 rounded-xl focus:ring-2 focus:ring-[#e53935]/10 focus:border-[#e53935] focus:bg-white outline-none transition-all text-sm"
                    required
                  />
                  <button 
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 transition-colors"
                  >
                    {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>
              </div>

              {/* Remember Me */}
              <label className="flex items-center gap-3 cursor-pointer group">
                <div className="relative flex items-center">
                  <input 
                    type="checkbox" 
                    className="peer sr-only"
                    checked={rememberMe}
                    onChange={(e) => setRememberMe(e.target.checked)}
                  />
                  <div className="w-5 h-5 bg-slate-100 border border-slate-200 rounded peer-checked:bg-[#e53935] peer-checked:border-[#e53935] transition-all"></div>
                  <svg className="absolute w-3.5 h-3.5 text-white left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 opacity-0 peer-checked:opacity-100 transition-opacity" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="3">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                <span className="text-sm text-slate-600 group-hover:text-slate-900 transition-colors">Ghi nhớ mật khẩu</span>
              </label>

              {/* Submit Button */}
              <button 
                type="submit" 
                className="w-full py-4 bg-[#e53935] text-white rounded-xl font-bold shadow-lg shadow-red-100 hover:scale-[1.01] active:scale-[0.99] transition-all"
              >
                Đăng nhập
              </button>
            </form>

            {/* Social Login */}
            <div className="mt-10">
              <div className="relative flex items-center justify-center mb-8">
                <div className="absolute w-full border-t border-slate-100"></div>
                <span className="relative px-4 bg-white text-[10px] font-bold text-slate-400 uppercase tracking-widest">Hoặc đăng nhập bằng</span>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <button className="flex items-center justify-center gap-3 py-3 border border-slate-200 rounded-xl hover:bg-slate-50 transition-colors">
                  <img src="https://www.gstatic.com/images/branding/product/1x/googleg_48dp.png" alt="Google" className="w-5 h-5" />
                  <span className="text-sm font-semibold text-slate-700">Google</span>
                </button>
                <button className="flex items-center justify-center gap-3 py-3 border border-slate-200 rounded-xl hover:bg-slate-50 transition-colors">
                  <img src="https://upload.wikimedia.org/wikipedia/commons/4/44/Microsoft_logo.svg" alt="Microsoft" className="w-5 h-5" />
                  <span className="text-sm font-semibold text-slate-700">Microsoft</span>
                </button>
              </div>
            </div>

            {/* Footer Links */}
            <p className="mt-12 text-center text-sm text-slate-500">
              Chưa có tài khoản?{' '}
              <button className="font-bold text-[#e53935] hover:underline">Đăng ký tài khoản mới</button>
            </p>
          </div>
        </div>
      </div>
      
      {/* Copyright */}
      <p className="fixed bottom-6 text-slate-400 text-xs">
        © 2024 DocWatch System. All rights reserved.
      </p>
    </div>
  );
}

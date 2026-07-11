import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  User, 
  Mail, 
  Lock, 
  Eye, 
  EyeOff, 
  RotateCcw,
  FileText
} from 'lucide-react';

export default function RegisterPage() {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    password: '',
    confirmPassword: '',
    agreeToTerms: false
  });

  const navigate = useNavigate();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const payload = {
      fullName: formData.fullName,
      email: formData.email,
      password: formData.password,
      confirmPassword: formData.confirmPassword
    };

    try {
      const response = await fetch('http://localhost:8080/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      const data = await response.json();

      if (response.ok) {
        alert(data.message);
        navigate('/login');
      } else {
        alert(data.error || 'Có lỗi xảy ra, vui lòng thử lại.');
      }
    } catch (error) {
      console.error('Error connecting to backend:', error);
      alert('Không thể kết nối đến máy chủ.');
    }
  };

  return (
    <div className="min-h-screen bg-[#fcf9f8] font-sans text-slate-900 flex flex-col">
      {/* Header/Nav */}
      <header className="w-full px-8 py-6 flex justify-between items-center bg-white/50 backdrop-blur-sm sticky top-0 z-50">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 bg-[#e53935] rounded-lg flex items-center justify-center text-white">
            <FileText size={20} />
          </div>
          <span className="text-xl font-bold text-[#e53935] tracking-tight">DocWatch</span>
        </div>
        <nav className="hidden md:flex items-center gap-8">
          <a href="#" className="text-sm font-medium text-slate-600 hover:text-[#e53935] transition-colors">Tính năng</a>
          <a href="#" className="text-sm font-medium text-slate-600 hover:text-[#e53935] transition-colors">Bảng giá</a>
          <a href="#" className="text-sm font-bold text-[#e53935] border-b-2 border-[#e53935] pb-1">Đăng ký</a>
        </nav>
        <button className="px-6 py-2.5 bg-[#e53935] text-white rounded-xl text-sm font-bold hover:scale-[1.02] active:scale-95 transition-all shadow-lg shadow-red-100">
          Đăng nhập
        </button>
      </header>

      <main className="flex-1 flex items-center justify-center p-6 md:p-12">
        <div className="max-w-[1100px] w-full grid lg:grid-cols-2 gap-16 items-center">
          
          {/* Left Side: Branding/Visual */}
          <div className="hidden lg:block space-y-10">
            <div className="relative group">
              <div className="absolute -inset-4 bg-red-100/50 rounded-[40px] blur-2xl group-hover:bg-red-200/50 transition-colors duration-500"></div>
              <div className="relative bg-white p-4 rounded-[32px] border border-slate-100 shadow-2xl">
                <img 
                  src="https://images.unsplash.com/photo-1497215728101-856f4ea42174?ixlib=rb-1.2.1&auto=format&fit=crop&w=1200&q=80" 
                  alt="Workspace" 
                  className="rounded-[24px] w-full h-[450px] object-cover"
                />
              </div>
            </div>

            <div className="space-y-4">
              <h1 className="text-5xl font-extrabold text-slate-900 leading-[1.1]">
                Tự động hóa việc <br />
                <span className="text-[#e53935]">theo dõi văn bản</span>
              </h1>
              <p className="text-lg text-slate-500 leading-relaxed max-w-md">
                Tiết kiệm thời gian và giảm thiểu rủi ro với hệ thống cảnh báo thông minh của DocWatch. Quản lý hộ chiếu, chứng chỉ và hợp đồng tại một nơi duy nhất.
              </p>
            </div>
          </div>

          {/* Right Side: Registration Form */}
          <div className="bg-white p-10 md:p-12 rounded-[40px] border border-slate-100 shadow-xl relative overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 bg-red-50/50 rounded-full -mr-16 -mt-16 blur-2xl"></div>
            
            <div className="relative z-10 mb-10">
              <h2 className="text-3xl font-bold text-slate-900 mb-2">Tạo tài khoản mới</h2>
              <p className="text-slate-500">Bắt đầu quản lý văn bản hiệu quả ngay hôm nay.</p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6 relative z-10">
              {/* Full Name */}
              <div className="space-y-2">
                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-[0.2em]">Họ và Tên</label>
                <div className="relative">
                  <User className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                  <input 
                    type="text" 
                    name="fullName"
                    placeholder="Nguyễn Văn A"
                    value={formData.fullName}
                    onChange={handleChange}
                    className="w-full pl-12 pr-4 py-4 bg-slate-50 border border-slate-100 rounded-2xl focus:ring-4 focus:ring-[#e53935]/5 focus:border-[#e53935] focus:bg-white outline-none transition-all text-sm font-medium"
                    required
                  />
                </div>
              </div>

              {/* Email */}
              <div className="space-y-2">
                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-[0.2em]">Email</label>
                <div className="relative">
                  <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                  <input 
                    type="email" 
                    name="email"
                    placeholder="email@example.com"
                    value={formData.email}
                    onChange={handleChange}
                    className="w-full pl-12 pr-4 py-4 bg-slate-50 border border-slate-100 rounded-2xl focus:ring-4 focus:ring-[#e53935]/5 focus:border-[#e53935] focus:bg-white outline-none transition-all text-sm font-medium"
                    required
                  />
                </div>
              </div>

              {/* Password */}
              <div className="grid md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-[10px] font-bold text-slate-400 uppercase tracking-[0.2em]">Mật khẩu</label>
                  <div className="relative">
                    <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                    <input 
                      type={showPassword ? 'text' : 'password'} 
                      name="password"
                      placeholder="••••••••"
                      value={formData.password}
                      onChange={handleChange}
                      className="w-full pl-12 pr-12 py-4 bg-slate-50 border border-slate-100 rounded-2xl focus:ring-4 focus:ring-[#e53935]/5 focus:border-[#e53935] focus:bg-white outline-none transition-all text-sm font-medium"
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

                <div className="space-y-2">
                  <label className="text-[10px] font-bold text-slate-400 uppercase tracking-[0.2em]">Xác nhận mật khẩu</label>
                  <div className="relative">
                    <RotateCcw className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                    <input 
                      type={showConfirmPassword ? 'text' : 'password'} 
                      name="confirmPassword"
                      placeholder="••••••••"
                      value={formData.confirmPassword}
                      onChange={handleChange}
                      className="w-full pl-12 pr-12 py-4 bg-slate-50 border border-slate-100 rounded-2xl focus:ring-4 focus:ring-[#e53935]/5 focus:border-[#e53935] focus:bg-white outline-none transition-all text-sm font-medium"
                      required
                    />
                    <button 
                      type="button"
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                      className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 transition-colors"
                    >
                      {showConfirmPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                    </button>
                  </div>
                </div>
              </div>

              {/* Terms Checkbox */}
              <label className="flex items-start gap-3 cursor-pointer group">
                <div className="relative flex items-center mt-0.5">
                  <input 
                    type="checkbox" 
                    name="agreeToTerms"
                    className="peer sr-only"
                    checked={formData.agreeToTerms}
                    onChange={handleChange}
                    required
                  />
                  <div className="w-5 h-5 bg-slate-100 border border-slate-200 rounded-lg peer-checked:bg-[#e53935] peer-checked:border-[#e53935] transition-all"></div>
                  <svg className="absolute w-3 h-3 text-white left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 opacity-0 peer-checked:opacity-100 transition-opacity" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="4">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                <span className="text-xs text-slate-500 leading-relaxed group-hover:text-slate-700 transition-colors">
                  Tôi đồng ý với các <button type="button" className="font-bold text-[#e53935] hover:underline">Điều khoản dịch vụ</button> và <button type="button" className="font-bold text-[#e53935] hover:underline">Chính sách bảo mật</button> của DocWatch.
                </span>
              </label>

              {/* Submit Button */}
              <button 
                type="submit" 
                className="w-full py-5 bg-[#e53935] text-white rounded-2xl font-bold shadow-xl shadow-red-100 hover:scale-[1.01] hover:shadow-red-200 active:scale-[0.99] transition-all"
              >
                Đăng ký ngay
              </button>
            </form>

            {/* Social Login Divider */}
            <div className="mt-12 relative flex items-center justify-center">
              <div className="absolute w-full border-t border-slate-100"></div>
              <span className="relative px-4 bg-white text-[10px] font-bold text-slate-400 uppercase tracking-widest">Hoặc đăng ký bằng</span>
            </div>

            <div className="grid grid-cols-2 gap-4 mt-8">
              <button className="flex items-center justify-center gap-3 py-3.5 border border-slate-200 rounded-2xl hover:bg-slate-50 transition-all font-semibold text-sm text-slate-700">
                <img src="https://www.gstatic.com/images/branding/product/1x/googleg_48dp.png" alt="Google" className="w-5 h-5" />
                Google
              </button>
              <button className="flex items-center justify-center gap-3 py-3.5 border border-slate-200 rounded-2xl hover:bg-slate-50 transition-all font-semibold text-sm text-slate-700">
                <svg className="w-5 h-5 text-[#00a4ef]" viewBox="0 0 23 23" fill="currentColor"><path d="M11.4 24H0V12.6h11.4V24zM24 24H12.6V12.6H24V24zM11.4 11.4H0V0h11.4v11.4zM24 11.4H12.6V0H24v11.4z"/></svg>
                Apple
              </button>
            </div>

            <p className="mt-12 text-center text-sm text-slate-500">
              Đã có tài khoản?{' '}
              <button className="font-bold text-[#e53935] hover:underline transition-all">Đăng nhập</button>
            </p>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="px-8 py-10 border-t border-slate-100 flex flex-col md:flex-row justify-between items-center gap-6 text-slate-400 text-xs bg-white">
        <div className="flex items-center gap-2">
          <FileText size={16} />
          <span className="font-bold text-slate-600">DocWatch System</span>
          <span>© 2026 All rights reserved.</span>
        </div>
        <div className="flex gap-8">
          <a href="#" className="hover:text-[#e53935] transition-colors">Privacy Policy</a>
          <a href="#" className="hover:text-[#e53935] transition-colors">Terms of Service</a>
          <a href="#" className="hover:text-[#e53935] transition-colors">Security</a>
          <a href="#" className="hover:text-[#e53935] transition-colors">Contact Support</a>
        </div>
      </footer>

      <style dangerouslySetInnerHTML={{ __html: `
        @keyframes bounce-slow {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-10px); }
        }
        .animate-bounce-slow {
          animation: bounce-slow 4s ease-in-out infinite;
        }
      `}} />
    </div>
  );
}

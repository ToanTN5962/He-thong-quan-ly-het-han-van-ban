import { useState } from 'react';
import {
  type LucideIcon,
  LayoutDashboard, 
  UserRound, 
  Settings, 
  LogOut, 
  Search, 
  FileText, 
  CheckCircle2,
  Plus,
  Edit3,
  RotateCcw,
  Lock,
  Unlock,
  Filter,
  Download,
  ChevronLeft,
  ChevronRight
} from 'lucide-react';

interface User {
  id: number;
  initials: string;
  name: string;
  email: string;
  role: 'Admin' | 'User';
  status: 'Đang hoạt động' | 'Bị khóa';
  color: string;
}

const userStats = [
  { label: 'TỔNG NGƯỜI DÙNG', value: '1,284', icon: UserRound, color: 'text-[#e53935]', bgColor: 'bg-red-50' },
  { label: 'ĐANG HOẠT ĐỘNG', value: '1,120', icon: CheckCircle2, color: 'text-emerald-500', bgColor: 'bg-emerald-50' },
  { label: 'BỊ KHÓA', value: '14', icon: Lock, color: 'text-[#e53935]', bgColor: 'bg-red-50' },
  { label: 'YÊU CẦU MỚI', value: '8', icon: UserRound, color: 'text-slate-400', bgColor: 'bg-slate-100' }
];

const users: User[] = [
  { id: 1, initials: 'NT', name: 'Nguyễn Thành Trung', email: 'trung.nt@docwatch.io', role: 'Admin', status: 'Đang hoạt động', color: 'bg-red-100 text-red-600' },
  { id: 2, initials: 'LA', name: 'Lê Thị Anh', email: 'anh.lt@docwatch.io', role: 'User', status: 'Bị khóa', color: 'bg-slate-100 text-slate-600' },
  { id: 3, initials: 'HM', name: 'Hoàng Minh', email: 'minh.h@docwatch.io', role: 'User', status: 'Đang hoạt động', color: 'bg-slate-100 text-slate-600' },
  { id: 4, initials: 'PV', name: 'Phạm Văn Vũ', email: 'vu.pv@docwatch.io', role: 'User', status: 'Đang hoạt động', color: 'bg-slate-100 text-slate-600' },
];

export default function AdminDashboard() {
  const [activeTab, setActiveTab] = useState('users');

  return (
    <div className="flex min-h-screen bg-[#fcf9f8] font-sans text-slate-900">
      
      {/* ================= SIDEBAR ================= */}
      <aside className="w-64 border-r border-slate-200 bg-white flex flex-col sticky top-0 h-screen">
        {/* Header Logo */}
        <div className="p-6 border-b border-slate-100 flex items-center gap-3">
          <div className="w-8 h-8 bg-[#e53935] rounded-lg flex items-center justify-center text-white font-bold text-lg">
            D
          </div>
          <span className="text-xl font-bold text-[#e53935]">DocWatch</span>
        </div>

        {/* User Profile Block */}
        <div className="p-4 flex items-center gap-3 mb-6 mt-2">
          <div className="w-10 h-10 rounded-full bg-red-50 flex items-center justify-center text-[#e53935] font-semibold text-sm border border-red-100">
            <UserRound size={18} />
          </div>
          <div>
            <h4 className="text-sm font-bold text-slate-800">System Admin</h4>
            <p className="text-xs text-slate-400">admin@docwatch.io</p>
          </div>
        </div>

        {/* Navigation Menu */}
        <nav className="flex-1 px-3 space-y-1">
          {[
            { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
            { id: 'users', label: 'Quản lý người dùng', icon: UserRound },
            { id: 'documents', label: 'Tài liệu', icon: FileText },
            { id: 'settings', label: 'Cài đặt', icon: Settings },
          ].map((item) => {
            const isActive = activeTab === item.id;
            return (
              <button 
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${
                  isActive 
                    ? 'bg-slate-100 text-slate-800 font-semibold' 
                    : 'text-slate-600 hover:bg-slate-50'
                }`}
              >
                <item.icon size={18} className={isActive ? 'text-[#e53935]' : 'text-slate-500'} />
                <span className="text-sm">{item.label}</span>
              </button>
            );
          })}
        </nav>

        {/* Sidebar Footer */}
        <div className="p-4 border-t border-slate-100">
          <button className="w-full flex items-center gap-3 px-4 py-3 text-slate-600 hover:text-[#e53935] hover:bg-red-50 rounded-xl transition-colors">
            <LogOut size={18} />
            <span className="text-sm font-medium">Đăng xuất</span>
          </button>
          <p className="text-[11px] text-slate-400 pl-4 mt-2">V1.0.4</p>
        </div>
      </aside>

      {/* ================= MAIN CONTENT ================= */}
      <main className="flex-1 p-8 overflow-y-auto">
        
        {/* Top Navbar Header */}
        <header className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold mb-1">Quản lý người dùng</h1>
            <p className="text-slate-400 text-sm">Kiểm soát quyền truy cập và bảo mật hệ thống.</p>
          </div>
          <div className="flex items-center gap-4">
            <button className="p-2 text-slate-600 hover:bg-slate-100 rounded-full transition-colors">
              <Search size={22} />
            </button>
            <div className="w-8 h-8 bg-[#e53935] rounded-full flex items-center justify-center text-white font-bold text-xs">
              SA
            </div>
            <span className="text-xs font-semibold text-slate-500">System Admin</span>
          </div>
        </header>

        {/* Stats Section */}
        <section className="grid grid-cols-4 gap-6 mb-8">
          {userStats.map((stat, idx) => (
            <div key={idx} className="bg-white p-5 rounded-2xl border border-slate-200/60 shadow-sm flex justify-between items-center h-28">
              <div>
                <p className="text-[11px] font-bold text-slate-400 mb-1">{stat.label}</p>
                <h3 className="text-3xl font-extrabold text-slate-800">{stat.value}</h3>
              </div>
              <div className={`w-11 h-11 rounded-full ${stat.bgColor} flex items-center justify-center`}>
                <stat.icon size={20} className={stat.color} />
              </div>
            </div>
          ))}
        </section>

        {/* Action Controls Filter and Search */}
        <div className="flex justify-between items-center mb-6">
          <div className="relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
            <input 
              type="text" 
              placeholder="Tìm kiếm theo tên hoặc email..." 
              className="pl-11 pr-4 py-2.5 bg-white border border-slate-200 rounded-xl w-80 text-sm focus:outline-none focus:ring-1 focus:ring-red-400 focus:border-red-400 transition-all shadow-sm"
            />
          </div>
          <div className="flex items-center gap-3">
            <button className="flex items-center gap-2 px-4 py-2 border border-slate-200 bg-white rounded-xl text-xs font-medium text-slate-700 hover:bg-slate-50 transition-colors shadow-sm">
              <Filter size={14} /> Bộ lọc
            </button>
            <button className="flex items-center gap-2 px-4 py-2 border border-slate-200 bg-white rounded-xl text-xs font-medium text-slate-700 hover:bg-slate-50 transition-colors shadow-sm">
              <Download size={14} /> Xuất dữ liệu
            </button>
            <button className="flex items-center gap-2 px-5 py-2.5 bg-[#e53935] hover:bg-[#c62828] text-white rounded-xl text-xs font-bold transition-all shadow-md shadow-red-100">
              <Plus size={16} /> Thêm người dùng mới
            </button>
          </div>
        </div>

        {/* Data Table Area */}
        <div className="bg-white rounded-2xl border border-slate-200/60 shadow-sm overflow-hidden">
          <table className="w-full text-left">
            <thead className="bg-slate-50/70 border-b border-slate-100 text-xs font-bold text-slate-400">
              <tr>
                <th className="px-6 py-4 font-semibold">Tên người dùng</th>
                <th className="px-6 py-4 font-semibold">Email</th>
                <th className="px-6 py-4 font-semibold">Vai trò</th>
                <th className="px-6 py-4 font-semibold">Trạng thái</th>
                <th className="px-6 py-4 font-semibold text-right">Thao tác</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {users.map((user) => (
                <tr key={user.id} className="hover:bg-slate-50/40 transition-colors">
                  {/* Name column */}
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className={`w-9 h-9 rounded-full flex items-center justify-center font-bold text-xs ${user.color}`}>
                        {user.initials}
                      </div>
                      <span className="text-sm font-bold text-slate-700">{user.name}</span>
                    </div>
                  </td>
                  {/* Email column */}
                  <td className="px-6 py-4 text-sm text-slate-500">{user.email}</td>
                  {/* Role column */}
                  <td className="px-6 py-4 text-sm">
                    <span className={`px-3 py-1 rounded-full text-xs font-semibold ${user.role === 'Admin' ? 'bg-red-100 text-[#e53935]' : 'bg-slate-100 text-slate-500'}`}>
                      {user.role}
                    </span>
                  </td>
                  {/* Status column */}
                  <td className="px-6 py-4 text-sm">
                    <div className="flex items-center gap-2">
                      <div className={`w-1.5 h-1.5 rounded-full ${user.status === 'Đang hoạt động' ? 'bg-emerald-500' : 'bg-slate-400'}`}></div>
                      <span className={`text-xs font-medium ${user.status === 'Đang hoạt động' ? 'text-emerald-600' : 'text-slate-400'}`}>
                        {user.status}
                      </span>
                    </div>
                  </td>
                  {/* Actions column */}
                  <td className="px-6 py-4 text-right">
                    <div className="flex justify-end gap-1">
                      <button title="Sửa" className="p-2 text-slate-700 hover:bg-slate-100 rounded-lg transition-colors">
                        <Edit3 size={16} />
                      </button>
                      <button title="Gia hạn/Reset" className="p-2 text-slate-700 hover:bg-slate-100 rounded-lg transition-colors">
                        <RotateCcw size={16} />
                      </button>
                      <button title={user.status === 'Bị khóa' ? 'Mở khóa' : 'Khóa'} className="p-2 text-slate-700 hover:bg-slate-100 rounded-lg transition-colors">
                        {user.status === 'Bị khóa' ? (
                          <Unlock size={16} className="text-emerald-500" />
                        ) : (
                          <Lock size={16} className="text-[#e53935]" />
                        )}
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {/* Pagination Footer */}
          <div className="px-6 py-4 border-t border-slate-100 flex justify-between items-center bg-white">
            <p className="text-xs text-slate-500 font-medium">Đang xem 1 - 10 của 1,284 người dùng</p>
            <div className="flex items-center gap-1.5">
              <button className="p-1.5 border border-slate-200 bg-white rounded-lg text-slate-400 hover:bg-slate-50 transition-colors disabled:opacity-50">
                <ChevronLeft size={16} />
              </button>
              {[1, 2, 3].map(p => (
                <button 
                  key={p} 
                  className={`w-7 h-7 rounded-lg text-xs font-bold transition-all ${
                    p === 1 
                      ? 'bg-[#e53935] text-white' 
                      : 'text-slate-600 hover:bg-slate-50'
                  }`}
                >
                  {p}
                </button>
              ))}
              <button className="p-1.5 border border-slate-200 bg-white rounded-lg text-slate-400 hover:bg-slate-50 transition-colors">
                <ChevronRight size={16} />
              </button>
            </div>
          </div>
        </div>

      </main>
    </div>
  );
}
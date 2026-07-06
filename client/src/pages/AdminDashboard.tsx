import {
  type LucideIcon,
  LayoutDashboard,
  User,
  Settings,
  HelpCircle,
  LogOut,
  Search,
  Bell,
  FileText,
  AlertTriangle,
  Clock,
  CheckCircle,
  TrendingUp,
  MoreVertical,
  ArrowRight,
  Plus,
} from 'lucide-react';

// Mock data based on the screenshot
const stats = [
  { 
    label: 'TỔNG VĂN BẢN', 
    value: '1,284', 
    change: '+12% so với tháng trước', 
    icon: FileText, 
    color: 'text-slate-600',
    bgColor: 'bg-white'
  },
  { 
    label: 'SẮP HẾT HẠN', 
    value: '08', 
    change: 'Cần xử lý trong 7 ngày tới', 
    icon: AlertTriangle, 
    color: 'text-white',
    bgColor: 'bg-[#e53935]'
  },
  { 
    label: 'ĐÃ HẾT HẠN', 
    value: '12', 
    change: 'Yêu cầu gia hạn ngay lập tức', 
    icon: Clock, 
    color: 'text-[#e53935]',
    bgColor: 'bg-white',
    borderColor: 'border-[#e53935]'
  },
  { 
    label: 'ĐANG HOẠT ĐỘNG', 
    value: '1,264', 
    change: 'Trạng thái hợp lệ', 
    icon: CheckCircle, 
    color: 'text-slate-600',
    bgColor: 'bg-white'
  }
];

const urgentAlerts = [
  { id: 1, title: 'Giấy phép kinh doanh', status: 'HẾT HẠN', date: '24/05/2024', color: 'bg-red-500' },
  { id: 2, title: 'Hợp đồng thuê văn phòng', status: 'CÒN 3 NGÀY', date: '29/05/2024', color: 'bg-orange-500' },
  { id: 3, title: 'Chứng chỉ PCCC', status: 'CÒN 7 NGÀY', date: '02/06/2024', color: 'bg-orange-400' }
];

const recentActivities = [
  { id: 1, file: 'Báo cáo tài chính Q1.pdf', action: 'Cập nhật', user: 'Nguyễn Văn A', time: '2 giờ trước', statusColor: 'bg-blue-100 text-blue-600' },
  { id: 2, file: 'Hợp đồng lao động - Trần B.docx', action: 'Đã tải lên', user: 'Lê Thị C', time: '5 giờ trước', statusColor: 'bg-green-100 text-green-600' },
  { id: 3, file: 'Hồ sơ cũ 2021 (Lưu trữ)', action: 'Xóa', user: 'System Admin', time: 'Hôm qua', statusColor: 'bg-red-100 text-red-600' }
];

interface SidebarItemProps {
  icon: LucideIcon;
  label: string;
  active?: boolean;
}

const SidebarItem = ({ icon: Icon, label, active = false }: SidebarItemProps) => (
  <button className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${
    active ? 'bg-slate-100 text-[#e53935] font-semibold' : 'text-slate-600 hover:bg-slate-50'
  }`}>
    <Icon size={20} />
    <span className="text-sm">{label}</span>
  </button>
);

export default function Dashboard() {
  return (
    <div className="flex min-h-screen bg-[#fcf9f8] font-sans text-slate-900">
      {/* Sidebar */}
      <aside className="w-72 border-r border-slate-100 bg-white flex flex-col sticky top-0 h-screen p-6">
        <div className="mb-10">
          <h1 className="text-2xl font-bold text-[#e53935]">DocWatch</h1>
          <p className="text-[10px] text-slate-400 uppercase tracking-widest mt-1">Hệ thống Quản lý Văn bản</p>
        </div>

        <div className="flex items-center gap-3 p-3 bg-slate-50 rounded-2xl mb-8 border border-slate-100">
          <div className="w-10 h-10 rounded-full overflow-hidden bg-slate-200">
             <img src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-1.2.1&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80" alt="Admin" />
          </div>
          <div>
            <h4 className="text-sm font-bold">System Admin</h4>
            <p className="text-[10px] text-slate-500">admin@docwatch.io</p>
          </div>
        </div>

        <nav className="flex-1 space-y-1">
          <SidebarItem icon={LayoutDashboard} label="Dashboard" active />
          <SidebarItem icon={User} label="My Profile" />
          <SidebarItem icon={Settings} label="Settings" />
          <SidebarItem icon={HelpCircle} label="Help & Support" />
        </nav>

        <div className="pt-6 border-t border-slate-100">
          <button className="w-full flex items-center gap-3 px-4 py-3 text-slate-600 hover:text-[#e53935] hover:bg-red-50 rounded-xl transition-colors">
            <LogOut size={20} />
            <span className="text-sm font-medium">Logout</span>
          </button>
          <p className="text-[10px] text-center mt-6 text-slate-400 uppercase tracking-widest">Version V1.0.4</p>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 p-8 overflow-y-auto">
        <header className="flex justify-between items-center mb-10">
          <h2 className="text-2xl font-bold">Tổng quan</h2>
          <div className="flex items-center gap-4">
            <div className="relative">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
              <input 
                type="text" 
                placeholder="Tìm kiếm tài liệu..." 
                className="pl-12 pr-6 py-3 bg-slate-100 border-none rounded-full w-96 focus:ring-2 focus:ring-[#e53935]/20 focus:bg-white transition-all text-sm"
              />
            </div>
            <button className="p-3 bg-white border border-slate-100 rounded-full text-slate-600 relative hover:bg-slate-50 transition-colors">
              <Bell size={20} />
              <span className="absolute top-2 right-2.5 w-2 h-2 bg-[#e53935] rounded-full border-2 border-white"></span>
            </button>
          </div>
        </header>

        {/* Stats Grid */}
        <section className="grid grid-cols-4 gap-6 mb-10">
          {stats.map((stat, idx) => (
            <div 
              key={idx} 
              className={`${stat.bgColor} ${stat.borderColor ? `border ${stat.borderColor}` : 'border border-slate-100'} p-6 rounded-[24px] shadow-sm flex flex-col justify-between h-40`}
            >
              <div className="flex justify-between items-start">
                <div>
                  <p className={`text-[10px] font-bold tracking-widest uppercase mb-1 ${stat.color === 'text-white' ? 'text-white/80' : 'text-slate-400'}`}>
                    {stat.label}
                  </p>
                  <h3 className={`text-4xl font-bold ${stat.color === 'text-white' ? 'text-white' : 'text-slate-900'}`}>
                    {stat.value}
                  </h3>
                </div>
                <div className={`p-2 rounded-lg ${stat.color === 'text-white' ? 'bg-white/20' : 'bg-slate-50'}`}>
                  <stat.icon size={20} className={stat.color} />
                </div>
              </div>
              <p className={`text-xs mt-4 flex items-center gap-1 ${stat.color === 'text-white' ? 'text-white/80' : 'text-slate-500'}`}>
                {stat.label === 'TỔNG VĂN BẢN' && <TrendingUp size={14} className="text-emerald-500" />}
                {stat.change}
              </p>
            </div>
          ))}
        </section>

        <div className="grid grid-cols-3 gap-8">
          {/* Main Chart/Trends Area */}
          <div className="col-span-2 space-y-8">
            <div className="bg-white p-8 rounded-[32px] border border-slate-100 shadow-sm min-h-[400px] flex flex-col">
              <div className="flex justify-between items-center mb-8">
                <h3 className="text-xl font-bold">Xu hướng văn bản</h3>
                <select className="text-sm bg-slate-50 border-none rounded-lg px-3 py-1.5 focus:ring-0 text-slate-600">
                  <option>6 tháng qua</option>
                  <option>1 năm qua</option>
                </select>
              </div>
              <div className="flex-1 flex items-end justify-between px-4 pb-4 border-b border-slate-50">
                {['Tháng 1', 'Tháng 2', 'Tháng 3', 'Tháng 4', 'Tháng 5', 'Tháng 6'].map((m) => (
                  <div key={m} className="flex flex-col items-center gap-4">
                    <div className="w-12 bg-slate-100 rounded-t-lg transition-all hover:bg-[#e53935]/10 cursor-pointer" style={{ height: `${Math.random() * 200 + 50}px` }}></div>
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-tighter">{m}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Recent Activity */}
            <div className="bg-white rounded-[32px] border border-slate-100 shadow-sm overflow-hidden">
              <div className="p-8 border-b border-slate-50 flex justify-between items-center">
                <h3 className="text-xl font-bold">Hoạt động gần đây</h3>
                <button className="text-slate-400 hover:text-[#e53935]"><MoreVertical size={20} /></button>
              </div>
              <div className="p-4">
                <table className="w-full text-left">
                  <thead className="text-[10px] font-bold text-slate-400 uppercase tracking-widest border-b border-slate-50">
                    <tr>
                      <th className="px-4 py-4">Tài liệu</th>
                      <th className="px-4 py-4">Hành động</th>
                      <th className="px-4 py-4">Người thực hiện</th>
                      <th className="px-4 py-4">Thời gian</th>
                      <th className="px-4 py-4 text-right">Chi tiết</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-50">
                    {recentActivities.map((act) => (
                      <tr key={act.id} className="group hover:bg-slate-50 transition-colors">
                        <td className="px-4 py-5 flex items-center gap-3">
                          <div className={`p-2 rounded-lg ${act.id === 3 ? 'bg-red-50 text-red-500' : 'bg-slate-100 text-slate-600'}`}>
                            <FileText size={18} />
                          </div>
                          <span className="text-sm font-semibold">{act.file}</span>
                        </td>
                        <td className="px-4 py-5">
                          <span className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider ${act.statusColor}`}>
                            {act.action}
                          </span>
                        </td>
                        <td className="px-4 py-5 text-sm text-slate-600">{act.user}</td>
                        <td className="px-4 py-5 text-sm text-slate-400">{act.time}</td>
                        <td className="px-4 py-5 text-right">
                          <button className="p-2 text-slate-300 hover:text-[#e53935] transition-colors"><ArrowRight size={18} /></button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
                <button className="w-full py-4 text-sm font-bold text-[#e53935] hover:bg-red-50 transition-colors mt-2">
                  Xem tất cả các hoạt động
                </button>
              </div>
            </div>
          </div>

          {/* Right Sidebar - Alerts & Upgrade */}
          <div className="space-y-8">
            <div className="bg-white p-8 rounded-[32px] border border-slate-100 shadow-sm">
              <h3 className="text-xl font-bold mb-8">Cảnh báo khẩn cấp</h3>
              <div className="space-y-6">
                {urgentAlerts.map((alert) => (
                  <div key={alert.id} className="relative pl-4">
                    <div className={`absolute left-0 top-0 bottom-0 w-1 rounded-full ${alert.color}`}></div>
                    <div className="flex justify-between items-start mb-2">
                      <h4 className="text-sm font-bold">{alert.title}</h4>
                      <span className="text-[10px] font-bold text-red-500">{alert.status}</span>
                    </div>
                    <p className="text-[10px] text-slate-500 flex items-center gap-1">
                      <Clock size={12} /> Hết hạn vào {alert.date}
                    </p>
                    <div className="mt-3 w-full h-1.5 bg-slate-100 rounded-full overflow-hidden">
                       <div className={`${alert.color} h-full`} style={{ width: alert.id === 1 ? '100%' : alert.id === 2 ? '85%' : '60%' }}></div>
                    </div>
                  </div>
                ))}
              </div>
              <button className="w-full mt-8 flex items-center justify-center gap-2 text-sm font-bold text-[#e53935] hover:gap-3 transition-all">
                Xem tất cả cảnh báo <ArrowRight size={16} />
              </button>
            </div>
          </div>
        </div>
      </main>

      {/* Floating Action Button */}
      <button className="fixed bottom-8 right-8 w-16 h-16 bg-[#e53935] text-white rounded-full shadow-2xl shadow-red-300 flex items-center justify-center hover:scale-110 active:scale-95 transition-all group">
        <Plus size={32} className="group-hover:rotate-90 transition-transform duration-300" />
      </button>
    </div>
  );
}

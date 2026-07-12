import { useEffect, useState } from 'react';
import {
  LayoutDashboard, 
  UserRound, 
  Settings, 
  LogOut, 
  Search, 
  FileText, 
  CheckCircle2,
  Plus,
  Edit3,
  Lock,
  Unlock,
  Filter,
  Download,
  ChevronLeft,
  ChevronRight,
  Clock3,
  Activity,
  Layers,
  Eye
} from 'lucide-react';

interface User {
  id: number;
  initials: string;
  name: string;
  email: string;
  role: 'Admin' | 'User';
  status: UserStatus;
  color: string;
}

type UserStatus = 'Đang hoạt động' | 'Bị khóa';

interface BackendUser {
  id: number;
  name: string | null;
  email: string | null;
  role: 'ADMIN' | 'USER' | 'Admin' | 'User' | string | null;
  isActive: boolean | null;
}

interface UserStats {
  totalUsers: number;
  activeUsers: number;
  lockedUsers: number;
}

interface DashboardData {
  summary: {
    totalDocuments: number;
    totalFiles: number;
    expiredDocuments: number;
    activeDocuments: number;
  };
  uploadTimeline: Array<{
    label: string;
    fileCount: number;
    value: number;
  }>;
  uploadStats: {
    topDayFiles: number;
    averageFiles: number;
  };
  auditLogs: Array<{
    id: number;
    event: string;
    actor: string;
    detail: string;
    createdAt: string;
  }>;
}

const initialStats: UserStats = {
  totalUsers: 0,
  activeUsers: 0,
  lockedUsers: 0,
};

const initialDashboardData: DashboardData = {
  summary: {
    totalDocuments: 0,
    totalFiles: 0,
    expiredDocuments: 0,
    activeDocuments: 0,
  },
  uploadTimeline: [],
  uploadStats: {
    topDayFiles: 0,
    averageFiles: 0,
  },
  auditLogs: [],
};

const BACKEND_URL = 'http://localhost:8080';
const ACTIVE_STATUS: UserStatus = 'Đang hoạt động';
const LOCKED_STATUS: UserStatus = 'Bị khóa';

const getInitials = (name: string | null | undefined) => {
  if (!name) {
    return 'NA';
  }
  const words = name.trim().split(' ').filter(Boolean);
  if (words.length === 0) return 'NA';
  if (words.length === 1) return words[0].slice(0, 2).toUpperCase();
  return (words[0][0] + words[words.length - 1][0]).toUpperCase();
};

const mapBackendUser = (user: BackendUser): User => {
  const role = user.role?.toUpperCase() === 'ADMIN' ? 'Admin' : 'User';
  const name = user.name?.trim() || user.email || 'Người dùng';
  const email = user.email || '';
  const status = user.isActive === false ? LOCKED_STATUS : ACTIVE_STATUS;

  return {
    id: user.id,
    initials: getInitials(name),
    name,
    email,
    role,
    status,
    color: role === 'Admin' ? 'bg-red-100 text-red-600' : 'bg-slate-100 text-slate-600',
  };
};

const mapBackendDocument = (backendDoc: any): AdminDocument => {
  const statusMap: Record<string, AdminDocument['status']> = {
    EXPIRED: 'expired',
    EXPIRINGSOON: 'expiring',
    ACTIVE: 'active',
    DRAFT: 'active',
  };

  const rawExpire = backendDoc.expireDate;
  const rawEnacted = backendDoc.enactedDate;
  const rawEffective = backendDoc.effectiveDate;
  const expiryDate = rawExpire ? new Date(rawExpire).toLocaleDateString('vi-VN') : '';
  const enactedDate = rawEnacted ? new Date(rawEnacted).toLocaleDateString('vi-VN') : '';
  const effectiveDate = rawEffective ? new Date(rawEffective).toLocaleDateString('vi-VN') : '';
  const today = new Date();
  const expiry = rawExpire ? new Date(rawExpire) : null;
  const rawDiffDays = expiry ? Math.ceil((expiry.getTime() - today.getTime()) / (1000 * 60 * 60 * 24)) : undefined;

  const attachments: Attachment[] = Array.isArray(backendDoc.attachments)
    ? backendDoc.attachments.map((item: any) => ({
        id: String(item.id ?? ''),
        originalName: item.originalName ?? 'Không tên',
        filePath: item.filePath ?? '',
        fileSize: Number(item.fileSize ?? 0),
        uploadedAt: item.uploadedAt ? new Date(item.uploadedAt).toLocaleString('vi-VN') : '',
      }))
    : [];

  return {
    id: String(backendDoc.id ?? ''),
    code: backendDoc.documentNumber ?? String(backendDoc.id ?? '-'),
    title: backendDoc.title ?? 'Không tên',
    category: backendDoc.category ?? 'Khác',
    expiryDate,
    status: statusMap[backendDoc.status] ?? 'active',
    daysLeft: rawDiffDays !== undefined && rawDiffDays >= 0 ? rawDiffDays : undefined,
    overdueDays: rawDiffDays !== undefined && rawDiffDays < 0 ? Math.abs(rawDiffDays) : undefined,
    summary: backendDoc.summary ?? '',
    issuingAgency: backendDoc.issuingAgency ?? '',
    enactedDate,
    effectiveDate,
    ownerEmail: backendDoc.ownerEmail ?? '',
    attachments,
  };
};

const getDocumentStatusLabel = (status: AdminDocument['status']) => {
  if (status === 'expired') return 'Hết hạn';
  if (status === 'expiring') return 'Sắp hết hạn';
  return 'Còn hiệu lực';
};

export default function AdminDashboard() {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [users, setUsers] = useState<User[]>([]);
  const [stats, setStats] = useState<UserStats>(initialStats);
  const [dashboardData, setDashboardData] = useState<DashboardData>(initialDashboardData);
  const [userToToggle, setUserToToggle] = useState<User | null>(null);
  const [isUpdatingUserStatus, setIsUpdatingUserStatus] = useState(false);
  const [userSearchQuery, setUserSearchQuery] = useState('');
  const [documents, setDocuments] = useState<AdminDocument[]>([]);
  const [documentSearchQuery, setDocumentSearchQuery] = useState('');
  const [documentPage, setDocumentPage] = useState(1);
  const [documentError, setDocumentError] = useState<string | null>(null);
  const [selectedDocument, setSelectedDocument] = useState<AdminDocument | null>(null);
  const [previewAttachment, setPreviewAttachment] = useState<Attachment | null>(null);

  const dashboardSummary = [
    { label: 'TỔNG SỐ VĂN BẢN', value: dashboardData.summary.totalDocuments.toLocaleString(), icon: FileText, color: 'text-[#e53935]', bgColor: 'bg-red-50' },
    { label: 'TỔNG SỐ FILE', value: dashboardData.summary.totalFiles.toLocaleString(), icon: Layers, color: 'text-[#1e40af]', bgColor: 'bg-blue-50' },
    { label: 'ĐÃ HẾT HẠN', value: dashboardData.summary.expiredDocuments.toLocaleString(), icon: Clock3, color: 'text-[#f59e0b]', bgColor: 'bg-amber-50' },
    { label: 'CÒN HẠN', value: dashboardData.summary.activeDocuments.toLocaleString(), icon: CheckCircle2, color: 'text-emerald-500', bgColor: 'bg-emerald-50' },
  ];
  const formatRelativeTime = (dateTime: string) => {
    const createdAt = new Date(dateTime);
    if (Number.isNaN(createdAt.getTime())) return '';

    const diffMinutes = Math.max(Math.floor((Date.now() - createdAt.getTime()) / 60000), 0);
    if (diffMinutes < 1) return 'Vừa xong';
    if (diffMinutes < 60) return `${diffMinutes} phút trước`;

    const diffHours = Math.floor(diffMinutes / 60);
    if (diffHours < 24) return `${diffHours} giờ trước`;

    return `${Math.floor(diffHours / 24)} ngày trước`;
  };

  useEffect(() => {
    const fetchDashboard = async () => {
      try {
        const response = await fetch(`${BACKEND_URL}/api/admin/dashboard`);
        if (!response.ok) {
          throw new Error('Không thể lấy dữ liệu dashboard');
        }
        const data: DashboardData = await response.json();
        setDashboardData(data);
      } catch (error) {
        console.error(error);
      }
    };

    const fetchUsers = async () => {
      try {
        const response = await fetch(`${BACKEND_URL}/api/users`);
        if (!response.ok) {
          throw new Error('Không tìm thấy danh sách người dùng');
        }
        const data: BackendUser[] = await response.json();
        setUsers(data.map(mapBackendUser));
      } catch (error) {
        console.error(error);
      }
    };

    const fetchDocuments = async () => {
      setDocumentError(null);
      try {
        const response = await fetch(`${BACKEND_URL}/api/documents`);
        if (!response.ok) {
          throw new Error('Không thể tải danh sách tài liệu');
        }
        const data = await response.json();
        setDocuments(Array.isArray(data) ? data.map(mapBackendDocument) : []);
      } catch (error) {
        setDocumentError(error instanceof Error ? error.message : 'Lỗi khi lấy dữ liệu tài liệu');
        setDocuments([]);
      }
    };

    const fetchStats = async () => {
      try {
        const response = await fetch(`${BACKEND_URL}/api/users/stats`);
        if (!response.ok) {
          throw new Error('Không thấy dữ liệu thống kê người dùng');
        }
        const data: UserStats = await response.json();
        setStats(data);
      } catch (error) {
        console.error(error);
      }
    };

    fetchDashboard();
    fetchStats();
    fetchUsers();
    fetchDocuments();
  }, []);

  const confirmToggleUserStatus = async () => {
    if (!userToToggle) return;

    const nextIsActive = userToToggle.status === LOCKED_STATUS;
    setIsUpdatingUserStatus(true);

    try {
      const response = await fetch(`${BACKEND_URL}/api/users/${userToToggle.id}/active`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ isActive: nextIsActive }),
      });

      if (!response.ok) {
        throw new Error('Không thể cập nhật trạng thái người dùng');
      }

      const updatedUser: BackendUser = await response.json();
      const mappedUser = mapBackendUser(updatedUser);

      setUsers((currentUsers) =>
        currentUsers.map((user) => (user.id === mappedUser.id ? mappedUser : user))
      );
      setStats((currentStats) => ({
        totalUsers: currentStats.totalUsers,
        activeUsers: currentStats.activeUsers + (nextIsActive ? 1 : -1),
        lockedUsers: currentStats.lockedUsers + (nextIsActive ? -1 : 1),
      }));
      setUserToToggle(null);
    } catch (error) {
      console.error(error);
    } finally {
      setIsUpdatingUserStatus(false);
    }
  };

  const handleAttachmentAction = async (attachment: Attachment, action: 'PREVIEW' | 'DOWNLOAD') => {
    if (!attachment.filePath) return;

    try {
      const response = await fetch(`${BACKEND_URL}/api/files/preview?fileName=${encodeURIComponent(attachment.filePath)}`);
      if (!response.ok) {
        throw new Error('Không thể lấy link file');
      }
      const presignedUrl = await response.text();

      if (action === 'PREVIEW') {
        setPreviewAttachment({ ...attachment, filePath: presignedUrl });
        return;
      }

      window.open(presignedUrl, '_blank', 'noopener,noreferrer');
    } catch (error) {
      console.error(error);
    }
  };

  const userStats = [
    { label: 'Tổng số người dùng', value: stats.totalUsers.toLocaleString(), icon: UserRound, color: 'text-[#e53935]', bgColor: 'bg-red-50' },
    { label: 'Đang hoạt động', value: stats.activeUsers.toLocaleString(), icon: CheckCircle2, color: 'text-emerald-500', bgColor: 'bg-emerald-50' },
    { label: 'Bị khóa', value: stats.lockedUsers.toLocaleString(), icon: Lock, color: 'text-[#e53935]', bgColor: 'bg-red-50' },
  ];

  const normalizedUserSearch = userSearchQuery.trim().toLowerCase();
  const filteredUsers = normalizedUserSearch
    ? users.filter((user) =>
        user.name.toLowerCase().includes(normalizedUserSearch) ||
        user.email.toLowerCase().includes(normalizedUserSearch)
      )
    : users;

  const normalizedDocumentSearch = documentSearchQuery.trim().toLowerCase();
  const filteredDocuments = normalizedDocumentSearch
    ? documents.filter((doc) =>
        doc.title.toLowerCase().includes(normalizedDocumentSearch) ||
        doc.id.toLowerCase().includes(normalizedDocumentSearch) ||
        doc.code.toLowerCase().includes(normalizedDocumentSearch)
      )
    : documents;
  const documentsPerPage = 10;
  const totalDocumentPages = Math.max(Math.ceil(filteredDocuments.length / documentsPerPage), 1);
  const currentDocumentPage = Math.min(documentPage, totalDocumentPages);
  const paginatedDocuments = filteredDocuments.slice(
    (currentDocumentPage - 1) * documentsPerPage,
    currentDocumentPage * documentsPerPage
  );
  const visibleDocumentPages = Array.from({ length: totalDocumentPages }, (_, index) => index + 1)
    .filter((page) =>
      page === 1 ||
      page === totalDocumentPages ||
      Math.abs(page - currentDocumentPage) <= 1
    );

  useEffect(() => {
    setDocumentPage(1);
  }, [documentSearchQuery]);

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
            <h1 className="text-3xl font-bold mb-1">Quản lý hệ thống</h1>
            <p className="text-slate-400 text-sm">Kiểm soát quyền truy cập và báo cáo hàng tháng.</p>
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

        {activeTab === 'dashboard' && (
          <>
            <section className="grid grid-cols-4 gap-6 mb-8">
              {dashboardSummary.map((stat, idx) => (
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

            <section className="grid xl:grid-cols-[1.5fr_1fr] gap-6 mb-8">
              <div className="bg-white rounded-3xl border border-slate-200/70 shadow-sm p-6">
                <div className="flex items-center justify-between mb-6">
                  <div>
                    <p className="text-xs uppercase tracking-[0.24em] text-slate-400 font-bold">Biểu đồ upload</p>
                    <h2 className="text-xl font-semibold text-slate-900">Số file upload theo ngày</h2>
                  </div>
                  <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-slate-100 text-slate-600 text-xs font-semibold">
                    <Activity size={14} /> Theo tuần
                  </span>
                </div>
                <div className="flex items-end gap-3 h-56">
                  {dashboardData.uploadTimeline.map((item) => (
                    <div key={item.label} className="flex-1 flex flex-col justify-end gap-2">
                      <div className="h-40 bg-slate-100 rounded-3xl relative overflow-hidden">
                        <div className="absolute bottom-0 left-0 right-0 bg-[#e53935] rounded-t-3xl transition-all" style={{ height: `${item.value}%` }} />
                      </div>
                      <span className="text-center text-xs text-slate-500">{item.label}</span>
                    </div>
                  ))}
                </div>
                <div className="grid grid-cols-2 gap-4 mt-6">
                  <div className="bg-slate-50 p-4 rounded-3xl">
                    <p className="text-[11px] text-slate-500 uppercase tracking-[0.24em]">Top ngày</p>
                    <p className="mt-2 text-xl font-bold text-slate-900">{dashboardData.uploadStats.topDayFiles.toLocaleString()} file</p>
                  </div>
                  <div className="bg-slate-50 p-4 rounded-3xl">
                    <p className="text-[11px] text-slate-500 uppercase tracking-[0.24em]">Trung bình</p>
                    <p className="mt-2 text-xl font-bold text-slate-900">{dashboardData.uploadStats.averageFiles.toLocaleString()} file</p>
                  </div>
                </div>
              </div>
              <div className="bg-white rounded-3xl border border-slate-200/70 shadow-sm p-6">
                <div className="flex items-center justify-between mb-6">
                  <div>
                    <p className="text-xs uppercase tracking-[0.24em] text-slate-400 font-bold">Audit log</p>
                    <h2 className="text-xl font-semibold text-slate-900">Hoạt động gần nhất</h2>
                  </div>
                  <button className="text-xs font-semibold text-[#e53935] hover:text-[#c62828] transition-colors">Xem tất cả</button>
                </div>
                <div className="space-y-4">
                  {dashboardData.auditLogs.map((log) => (
                    <div key={log.id} className="rounded-3xl border border-slate-200 bg-slate-50 p-4">
                      <div className="flex justify-between items-center gap-3 mb-1">
                        <div className="flex items-center gap-2 text-slate-700 font-semibold">
                          <Clock3 size={16} />
                          <span>{log.event}</span>
                        </div>
                        <span className="text-[11px] uppercase tracking-[0.24em] text-slate-400">{formatRelativeTime(log.createdAt)}</span>
                      </div>
                      <p className="text-sm text-slate-500">{log.detail}</p>
                      <p className="mt-3 text-[11px] uppercase tracking-[0.24em] text-slate-400">Người dùng {log.actor}</p>
                    </div>
                  ))}
                </div>
              </div>
            </section>
          </>
        )}

        {activeTab === 'users' && (
          <>
            <section className="grid grid-cols-3 gap-6 mb-8">
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

            <div className="flex justify-between items-center mb-6">
              <div className="relative">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                <input 
                  type="text" 
                  placeholder="Tìm kiếm theo tên hoặc email..." 
                  value={userSearchQuery}
                  onChange={(event) => setUserSearchQuery(event.target.value)}
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
                  {filteredUsers.map((user) => (
                    <tr key={user.id} className="hover:bg-slate-50/40 transition-colors">
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <div className={`w-9 h-9 rounded-full flex items-center justify-center font-bold text-xs ${user.color}`}>
                            {user.initials}
                          </div>
                          <span className="text-sm font-bold text-slate-700">{user.name}</span>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-sm text-slate-500">{user.email}</td>
                      <td className="px-6 py-4 text-sm">
                        <span className={`px-3 py-1 rounded-full text-xs font-semibold ${user.role === 'Admin' ? 'bg-red-100 text-[#e53935]' : 'bg-slate-100 text-slate-500'}`}>
                          {user.role}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-sm">
                        <div className="flex items-center gap-2">
                          <div className={`w-1.5 h-1.5 rounded-full ${user.status === ACTIVE_STATUS ? 'bg-emerald-500' : 'bg-slate-400'}`}></div>
                          <span className={`text-xs font-medium ${user.status === ACTIVE_STATUS ? 'text-emerald-600' : 'text-slate-400'}`}>
                            {user.status}
                          </span>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-right">
                        <div className="flex justify-end gap-1">
                          <button title="Sửa" className="p-2 text-slate-700 hover:bg-slate-100 rounded-lg transition-colors">
                            <Edit3 size={16} />
                          </button>
                          <button
                            title={user.status === LOCKED_STATUS ? 'Mở khóa' : 'Khóa'}
                            onClick={() => setUserToToggle(user)}
                            className="p-2 text-slate-700 hover:bg-slate-100 rounded-lg transition-colors"
                          >
                            {user.status === LOCKED_STATUS ? (
                              <Unlock size={16} className="text-emerald-500" />
                            ) : (
                              <Lock size={16} className="text-[#e53935]" />
                            )}
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                  {filteredUsers.length === 0 && (
                    <tr>
                      <td colSpan={5} className="px-6 py-10 text-center text-sm text-slate-500">
                        Không tìm thấy người dùng phù hợp.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>

              <div className="px-6 py-4 border-t border-slate-100 flex justify-between items-center bg-white">
                <p className="text-xs text-slate-500 font-medium">
                  {normalizedUserSearch
                    ? `${filteredUsers.length.toLocaleString()} kết quả / ${stats.totalUsers.toLocaleString()} người dùng`
                    : `Tất cả ${stats.totalUsers.toLocaleString()} người dùng`}
                </p>
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
          </>
        )}

        {activeTab === 'documents' && (
          <>
            <div className="flex justify-between items-center mb-6">
              <div>
                <h2 className="text-xl font-bold text-slate-900">Danh sách tài liệu</h2>
                <p className="text-sm text-slate-500">Tất cả tài liệu đang có trong hệ thống.</p>
              </div>
              <div className="relative">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                <input
                  type="text"
                  placeholder="Tìm kiếm theo tên hoặc ID..."
                  value={documentSearchQuery}
                  onChange={(event) => setDocumentSearchQuery(event.target.value)}
                  className="pl-11 pr-4 py-2.5 bg-white border border-slate-200 rounded-xl w-80 text-sm focus:outline-none focus:ring-1 focus:ring-red-400 focus:border-red-400 transition-all shadow-sm"
                />
              </div>
            </div>

            <div className="bg-white rounded-2xl border border-slate-200/60 shadow-sm overflow-hidden">
              <table className="w-full text-left">
                <thead className="bg-slate-50/70 border-b border-slate-100 text-xs font-bold text-slate-400">
                  <tr>
                    <th className="px-6 py-4 font-semibold">Tài liệu</th>
                    <th className="px-6 py-4 font-semibold">Danh mục</th>
                    <th className="px-6 py-4 font-semibold">Chủ sở hữu</th>
                    <th className="px-6 py-4 font-semibold">Ngày hết hạn</th>
                    <th className="px-6 py-4 font-semibold">Trạng thái</th>
                    <th className="px-6 py-4 font-semibold text-right">Thao tác</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {documentError ? (
                    <tr>
                      <td colSpan={6} className="px-6 py-10 text-center text-sm text-red-500">{documentError}</td>
                    </tr>
                  ) : filteredDocuments.length > 0 ? (
                    paginatedDocuments.map((doc) => (
                      <tr key={doc.id} className="hover:bg-slate-50/40 transition-colors">
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-3">
                            <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${
                              doc.status === 'expired'
                                ? 'bg-red-50 text-red-500'
                                : doc.status === 'expiring'
                                ? 'bg-orange-50 text-orange-500'
                                : 'bg-emerald-50 text-emerald-500'
                            }`}>
                              <FileText size={18} />
                            </div>
                            <div>
                              <p className="text-sm font-bold text-slate-700">{doc.title}</p>
                              <p className="text-xs text-slate-400">ID: {doc.id} • Mã: {doc.code}</p>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 text-sm text-slate-500">{doc.category}</td>
                        <td className="px-6 py-4 text-sm text-slate-500">{doc.ownerEmail || 'Chưa có'}</td>
                        <td className="px-6 py-4">
                          <span className="text-sm font-semibold text-slate-700">{doc.expiryDate || 'Chưa có'}</span>
                          {doc.overdueDays !== undefined && (
                            <p className="text-[10px] text-red-500 mt-1">Quá hạn {doc.overdueDays} ngày</p>
                          )}
                          {doc.daysLeft !== undefined && (
                            <p className="text-[10px] text-slate-400 mt-1">Còn {doc.daysLeft} ngày</p>
                          )}
                        </td>
                        <td className="px-6 py-4">
                          <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                            doc.status === 'expired'
                              ? 'bg-red-100 text-red-600'
                              : doc.status === 'expiring'
                              ? 'bg-orange-100 text-orange-600'
                              : 'bg-emerald-100 text-emerald-600'
                          }`}>
                            <span className={`w-1.5 h-1.5 rounded-full ${
                              doc.status === 'expired'
                                ? 'bg-red-600'
                                : doc.status === 'expiring'
                                ? 'bg-orange-600'
                                : 'bg-emerald-600'
                            }`} />
                            {getDocumentStatusLabel(doc.status)}
                          </span>
                        </td>
                        <td className="px-6 py-4 text-right">
                          <button
                            title="Xem chi tiết"
                            onClick={() => setSelectedDocument(doc)}
                            className="p-2 text-slate-700 hover:bg-slate-100 rounded-lg transition-colors"
                          >
                            <Eye size={16} />
                          </button>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan={6} className="px-6 py-10 text-center text-sm text-slate-500">
                        Không tìm thấy tài liệu phù hợp.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
              <div className="px-6 py-4 border-t border-slate-100 flex justify-between items-center bg-white">
                <p className="text-xs text-slate-500 font-medium">
                  {filteredDocuments.length > 0
                    ? `Hiển thị ${((currentDocumentPage - 1) * documentsPerPage + 1).toLocaleString()} - ${Math.min(currentDocumentPage * documentsPerPage, filteredDocuments.length).toLocaleString()} trong ${filteredDocuments.length.toLocaleString()} tài liệu`
                    : 'Không có tài liệu'}
                  {normalizedDocumentSearch ? ` / ${documents.length.toLocaleString()} tổng` : ''}
                </p>
                <div className="flex items-center gap-1.5">
                  <button
                    type="button"
                    disabled={currentDocumentPage === 1}
                    onClick={() => setDocumentPage((page) => Math.max(page - 1, 1))}
                    className="p-1.5 border border-slate-200 bg-white rounded-lg text-slate-500 hover:bg-slate-50 transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
                  >
                    <ChevronLeft size={16} />
                  </button>
                  {visibleDocumentPages.map((page) => (
                    <button
                      key={page}
                      type="button"
                      onClick={() => setDocumentPage(page)}
                      className={`w-7 h-7 rounded-lg text-xs font-bold transition-all ${
                        page === currentDocumentPage
                          ? 'bg-[#e53935] text-white'
                          : 'text-slate-600 hover:bg-slate-50'
                      }`}
                    >
                      {page}
                    </button>
                  ))}
                  <button
                    type="button"
                    disabled={currentDocumentPage === totalDocumentPages}
                    onClick={() => setDocumentPage((page) => Math.min(page + 1, totalDocumentPages))}
                    className="p-1.5 border border-slate-200 bg-white rounded-lg text-slate-500 hover:bg-slate-50 transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
                  >
                    <ChevronRight size={16} />
                  </button>
                </div>
              </div>
            </div>
          </>
        )}

        {activeTab === 'settings' && (
          <div className="bg-white rounded-3xl border border-slate-200/70 shadow-sm p-8 text-slate-500">
            <p className="text-lg font-semibold text-slate-800 mb-3">Cài đặt</p>
            <p>Đang xây dựng.</p>
          </div>
        )}

      </main>

      {selectedDocument && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 px-4 py-6">
          <div className="w-full max-w-2xl rounded-3xl bg-white p-6 shadow-2xl overflow-y-auto max-h-[calc(100vh-4rem)]">
            <div className="flex items-start justify-between gap-4 mb-6">
              <div>
                <h3 className="text-xl font-bold text-slate-900">Chi tiết tài liệu</h3>
                <p className="text-sm text-slate-500">Thông tin đầy đủ và file đính kèm.</p>
              </div>
              <button
                onClick={() => setSelectedDocument(null)}
                className="text-sm font-semibold text-slate-500 hover:text-slate-900 transition-colors"
              >
                Đóng
              </button>
            </div>

            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-3">
                <div>
                  <h4 className="text-sm font-semibold text-slate-500">Tiêu đề</h4>
                  <p className="mt-1 text-sm text-slate-900">{selectedDocument.title}</p>
                </div>
                <div>
                  <h4 className="text-sm font-semibold text-slate-500">ID / Mã tài liệu</h4>
                  <p className="mt-1 text-sm text-slate-900">{selectedDocument.id} / {selectedDocument.code}</p>
                </div>
                <div>
                  <h4 className="text-sm font-semibold text-slate-500">Danh mục</h4>
                  <p className="mt-1 text-sm text-slate-900">{selectedDocument.category}</p>
                </div>
                <div>
                  <h4 className="text-sm font-semibold text-slate-500">Cơ quan ban hành</h4>
                  <p className="mt-1 text-sm text-slate-900">{selectedDocument.issuingAgency || 'Chưa có'}</p>
                </div>
              </div>
              <div className="space-y-3">
                <div>
                  <h4 className="text-sm font-semibold text-slate-500">Ngày ban hành</h4>
                  <p className="mt-1 text-sm text-slate-900">{selectedDocument.enactedDate || 'Chưa có'}</p>
                </div>
                <div>
                  <h4 className="text-sm font-semibold text-slate-500">Ngày hiệu lực</h4>
                  <p className="mt-1 text-sm text-slate-900">{selectedDocument.effectiveDate || 'Chưa có'}</p>
                </div>
                <div>
                  <h4 className="text-sm font-semibold text-slate-500">Ngày hết hạn</h4>
                  <p className="mt-1 text-sm text-slate-900">{selectedDocument.expiryDate || 'Chưa có'}</p>
                </div>
                <div>
                  <h4 className="text-sm font-semibold text-slate-500">Chủ sở hữu</h4>
                  <p className="mt-1 text-sm text-slate-900">{selectedDocument.ownerEmail || 'Chưa có'}</p>
                </div>
              </div>
            </div>

            <div className="mt-6 space-y-4">
              <div>
                <h4 className="text-sm font-semibold text-slate-500">Tóm tắt</h4>
                <p className="mt-1 text-sm text-slate-900 whitespace-pre-line">{selectedDocument.summary || 'Không có tóm tắt.'}</p>
              </div>
              <div>
                <h4 className="text-sm font-semibold text-slate-500">Trạng thái</h4>
                <p className="mt-1 text-sm font-semibold text-slate-900">{getDocumentStatusLabel(selectedDocument.status)}</p>
              </div>
            </div>

            <div className="mt-6">
              <h4 className="text-sm font-semibold text-slate-500">File đính kèm</h4>
              {selectedDocument.attachments.length > 0 ? (
                <div className="mt-3 space-y-3">
                  {selectedDocument.attachments.map((attachment) => (
                    <div key={attachment.id} className="rounded-2xl border border-slate-200 p-4 bg-slate-50">
                      <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                        <div>
                          <p className="font-semibold text-slate-900">{attachment.originalName}</p>
                          <p className="text-xs text-slate-500">
                            {attachment.uploadedAt ? `Uploaded: ${attachment.uploadedAt}` : 'Không có thời gian upload'} • {attachment.fileSize.toLocaleString()} bytes
                          </p>
                        </div>
                        <div className="flex flex-wrap items-center gap-2 mt-3 sm:mt-0">
                          <button
                            type="button"
                            onClick={() => handleAttachmentAction(attachment, 'PREVIEW')}
                            className="rounded-xl bg-[#e53935] px-4 py-2 text-xs font-semibold text-white hover:bg-[#c62828] transition-colors"
                          >
                            Xem trước
                          </button>
                          <button
                            type="button"
                            onClick={() => handleAttachmentAction(attachment, 'DOWNLOAD')}
                            className="rounded-xl border border-slate-200 bg-white px-4 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-100 transition-colors"
                          >
                            Tải về
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="mt-3 text-sm text-slate-500">Không có file đính kèm.</p>
              )}
            </div>
          </div>
        </div>
      )}

      {previewAttachment && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 px-4 py-6">
          <div className="w-full max-w-4xl rounded-3xl bg-white shadow-2xl overflow-hidden max-h-[calc(100vh-4rem)]">
            <div className="flex items-center justify-between px-6 py-4 border-b border-slate-200">
              <div>
                <h3 className="text-lg font-bold text-slate-900">Xem trước file</h3>
                <p className="text-sm text-slate-500">{previewAttachment.originalName}</p>
              </div>
              <button
                onClick={() => setPreviewAttachment(null)}
                className="text-sm font-semibold text-slate-500 hover:text-slate-900 transition-colors"
              >
                Đóng
              </button>
            </div>
            <div className="bg-slate-950 p-4 min-h-[480px] overflow-auto">
              <iframe
                src={previewAttachment.filePath}
                title={previewAttachment.originalName}
                className="w-full min-h-[520px] border-0"
              />
            </div>
          </div>
        </div>
      )}

      {userToToggle && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 px-4">
          <div className="w-full max-w-md rounded-2xl bg-white p-6 shadow-xl border border-slate-200">
            <div className="flex items-start gap-4">
              <div className={`mt-1 flex h-11 w-11 shrink-0 items-center justify-center rounded-full ${userToToggle.status === LOCKED_STATUS ? 'bg-emerald-50' : 'bg-red-50'}`}>
                {userToToggle.status === LOCKED_STATUS ? (
                  <Unlock size={20} className="text-emerald-600" />
                ) : (
                  <Lock size={20} className="text-[#e53935]" />
                )}
              </div>
              <div>
                <h2 className="text-lg font-bold text-slate-900">
                  {userToToggle.status === LOCKED_STATUS ? 'Mở khóa tài khoản?' : 'Khóa tài khoản?'}
                </h2>
                <p className="mt-2 text-sm leading-6 text-slate-500">
                  Bạn có chắc chắn muốn {userToToggle.status === LOCKED_STATUS ? 'mở khóa' : 'khóa'} tài khoản <span className="font-semibold text-slate-800">{userToToggle.email || userToToggle.name}</span>?
                </p>
              </div>
            </div>
            <div className="mt-6 flex justify-end gap-3">
              <button
                type="button"
                onClick={() => setUserToToggle(null)}
                disabled={isUpdatingUserStatus}
                className="rounded-xl border border-slate-200 bg-white px-4 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-60"
              >
                Hủy
              </button>
              <button
                type="button"
                onClick={confirmToggleUserStatus}
                disabled={isUpdatingUserStatus}
                className={`rounded-xl px-4 py-2 text-sm font-bold text-white shadow-sm disabled:cursor-not-allowed disabled:opacity-60 ${
                  userToToggle.status === LOCKED_STATUS
                    ? 'bg-emerald-600 hover:bg-emerald-700'
                    : 'bg-[#e53935] hover:bg-[#c62828]'
                }`}
              >
                {isUpdatingUserStatus ? 'Đang xử lý...' : 'Xác nhận'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

interface Attachment {
  id: string;
  originalName: string;
  filePath: string;
  fileSize: number;
  uploadedAt?: string;
}

interface AdminDocument {
  id: string;
  code: string;
  title: string;
  category: string;
  expiryDate: string;
  status: 'expired' | 'expiring' | 'active';
  daysLeft?: number;
  overdueDays?: number;
  summary?: string;
  issuingAgency?: string;
  enactedDate?: string;
  effectiveDate?: string;
  ownerEmail?: string;
  attachments: Attachment[];
}


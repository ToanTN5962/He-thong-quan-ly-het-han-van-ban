import { useState, type FormEvent } from 'react';
import {
  LayoutDashboard,
  FileText,
  Bell,
  Settings,
  LogOut,
  Search,
  PlusCircle,
  Filter,
  RefreshCw,
  Eye,
  Edit3,
  Trash2,
  ChevronLeft,
  ChevronRight,
  Calendar,
} from 'lucide-react';

// Định nghĩa Interface rõ ràng cho Document
interface Document {
  id: string;
  code: string;
  title: string;
  category: string;
  expiryDate: string;
  status: 'expired' | 'expiring' | 'active';
  daysLeft?: number;
  overdueDays?: number;
}

// Dữ liệu mẫu (Mock Data)
const initialDocuments: Document[] = [
  {
    id: '1',
    code: 'DOC-2023-089',
    title: 'Hợp đồng thuê văn phòng Q1',
    category: 'Hợp đồng',
    expiryDate: '15/10/2023',
    status: 'expired',
    overdueDays: 12,
  },
  {
    id: '2',
    code: 'LIC-9922-FIRE',
    title: 'Giấy phép PCCC 2023-2024',
    category: 'Giấy phép',
    expiryDate: '20/11/2023',
    status: 'expiring',
  },
  {
    id: '3',
    code: 'INS-332-CAR',
    title: 'Bảo hiểm xe Mercedes E300',
    category: 'Bảo hiểm',
    expiryDate: '12/08/2024',
    status: 'active',
    daysLeft: 289,
  },
  {
    id: '4',
    code: 'CERT-ISO-22',
    title: 'Chứng chỉ ISO 9001:2015',
    category: 'Chứng chỉ',
    expiryDate: '05/05/2025',
    status: 'active',
    daysLeft: 550,
  },
];

export default function UserHomePage() {
  const [activeTab, setActiveTab] = useState<string>('documents');
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [selectedCategory, setSelectedCategory] = useState<string>('Tất cả danh mục');
  const [selectedStatus, setSelectedStatus] = useState<string>('Tất cả trạng thái');
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [uploadCode, setUploadCode] = useState('');
  const [uploadTitle, setUploadTitle] = useState('');
  const [uploadCategory, setUploadCategory] = useState('Hợp đồng');
  const [uploadExpiryDate, setUploadExpiryDate] = useState('');
  const [uploadDescription, setUploadDescription] = useState('');
  const [uploadFiles, setUploadFiles] = useState<File[]>([]);
  const [uploadStatus, setUploadStatus] = useState<string | null>(null);
  const [uploadError, setUploadError] = useState<string | null>(null);

  const uploadCategories = ['Hợp đồng', 'Giấy phép', 'Bảo hiểm', 'Chứng chỉ', 'Khác'];

  const resetUploadForm = () => {
    setUploadCode('');
    setUploadTitle('');
    setUploadCategory('Hợp đồng');
    setUploadExpiryDate('');
    setUploadDescription('');
    setUploadFiles([]);
    setUploadError(null);
    setUploadStatus(null);
  };

  const addUploadFiles = (files: FileList | null) => {
    if (!files) return;
    const newFiles = Array.from(files).filter(
      (file) =>
        !uploadFiles.some(
          (existing) =>
            existing.name === file.name &&
            existing.size === file.size &&
            existing.type === file.type
        )
    );
    if (newFiles.length > 0) {
      setUploadFiles((prev) => [...prev, ...newFiles]);
    }
  };

  // Logic lọc tài liệu theo Tìm kiếm, Danh mục và Trạng thái
  const filteredDocuments = initialDocuments.filter((doc) => {
    const matchesSearch =
      doc.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      doc.code.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesCategory =
      selectedCategory === 'Tất cả danh mục' || doc.category === selectedCategory;

    const matchesStatus =
      selectedStatus === 'Tất cả trạng thái' ||
      (selectedStatus === 'Hết hạn' && doc.status === 'expired') ||
      (selectedStatus === 'Sắp hết hạn' && doc.status === 'expiring') ||
      (selectedStatus === 'Còn hiệu lực' && doc.status === 'active');

    return matchesSearch && matchesCategory && matchesStatus;
  });

  // Hàm reset bộ lọc về mặc định
  const handleResetFilters = () => {
    setSearchTerm('');
    setSelectedCategory('Tất cả danh mục');
    setSelectedStatus('Tất cả trạng thái');
  };

  return (
    <div className="flex min-h-screen bg-[#fcf9f8] font-sans text-slate-900">
      {/* ================= SIDEBAR ================= */}
      <aside className="sticky top-0 flex flex-col w-64 h-screen bg-white border-r border-slate-200">
        {/* Logo */}
        <div className="flex items-center gap-2 p-6 border-b border-slate-100">
          <div className="w-8 h-8 bg-[#e53935] rounded-lg flex items-center justify-center text-white font-bold">
            D
          </div>
          <span className="text-xl font-bold text-[#e53935]">DocWatch</span>
        </div>

        {/* User Info */}
        <div className="flex items-center gap-3 p-4 mb-6">
          <div className="w-10 h-10 rounded-full bg-[#e53935] flex items-center justify-center text-white font-semibold">
            SA
          </div>
          <div>
            <h4 className="text-sm font-bold">System Admin</h4>
            <p className="text-xs text-slate-500">admin@docwatch.io</p>
          </div>
        </div>

        {/* Navigation Links */}
        <nav className="flex-1 px-2 space-y-1">
          {[
            { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
            { id: 'documents', label: 'Tài liệu của tôi', icon: FileText },
            { id: 'notifications', label: 'Thông báo', icon: Bell },
            { id: 'settings', label: 'Cài đặt', icon: Settings },
          ].map((item) => (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
                activeTab === item.id
                  ? 'bg-slate-100 text-[#e53935] font-semibold'
                  : 'text-slate-600 hover:bg-slate-50'
              }`}
            >
              <item.icon size={20} />
              <span className="text-sm">{item.label}</span>
            </button>
          ))}
        </nav>

        {/* Sidebar Footer */}
        <div className="p-4 border-t border-slate-100">
          <button className="w-full flex items-center gap-3 px-4 py-3 text-slate-600 hover:text-[#e53935] hover:bg-red-50 rounded-lg transition-colors">
            <LogOut size={20} />
            <span className="text-sm font-medium">Đăng xuất</span>
          </button>
          <p className="text-[10px] text-center mt-4 text-slate-400">Phiên bản V1.0.4</p>
        </div>
      </aside>

      {/* ================= MAIN CONTENT ================= */}
      <main className="flex-1 p-8 overflow-y-auto">
        {/* Header */}
        <header className="flex items-start justify-between mb-8">
          <div>
            <h1 className="mb-2 text-3xl font-bold">Quản lý Tài liệu</h1>
            <p className="text-slate-500">Theo dõi và quản lý thời hạn các văn bản pháp lý.</p>
          </div>
          <div className="flex items-center gap-4">
            <div className="relative">
              <Search
                className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
                size={18}
              />
              <input
                type="text"
                placeholder="Tìm kiếm tài liệu..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 pr-4 py-2 border border-slate-200 rounded-full w-80 focus:outline-none focus:ring-2 focus:ring-[#e53935]/20 focus:border-[#e53935] transition-all"
              />
            </div>
            <button
              onClick={() => {
                setShowUploadModal(true);
                resetUploadForm();
              }}
              className="flex items-center gap-2 bg-[#e53935] hover:bg-[#c62828] text-white px-6 py-2.5 rounded-xl font-semibold shadow-lg shadow-red-200 transition-all active:scale-95"
            >
              <PlusCircle size={20} /> Tải lên tài liệu mới
            </button>
          </div>
        </header>

        {/* Upload Modal */}
        {showUploadModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 px-4 py-8">
            <div className="w-full max-w-3xl rounded-3xl bg-white shadow-2xl overflow-hidden">
              <div className="flex items-center justify-between px-8 py-6 border-b border-slate-200">
                <div>
                  <h2 className="text-2xl font-bold text-slate-900">Tải lên tài liệu mới</h2>
                  <p className="text-sm text-slate-500">Nhập thông tin tài liệu và chọn file để upload.</p>
                </div>
                <button
                  onClick={() => setShowUploadModal(false)}
                  className="text-slate-500 hover:text-slate-900 transition-colors"
                >
                  Đóng
                </button>
              </div>

              <form
                onSubmit={async (e) => {
                  e.preventDefault();
                  setUploadError(null);
                  setUploadStatus(null);

                  if (uploadFiles.length === 0) {
                    setUploadError('Vui lòng chọn ít nhất một file để upload.');
                    return;
                  }

                  const formData = new FormData();
                  uploadFiles.forEach((file) => formData.append('file', file));
                  formData.append('code', uploadCode);
                  formData.append('title', uploadTitle);
                  formData.append('category', uploadCategory);
                  formData.append('expiryDate', uploadExpiryDate);
                  formData.append('description', uploadDescription);

                  try {
                    const response = await fetch('http://localhost:8080/api/files/upload', {
                      method: 'POST',
                      body: formData,
                    });

                    const data = await response.json();
                    if (response.ok) {
                      setUploadStatus('Upload thành công! File đã được lưu vào hệ thống.');
                    } else {
                      setUploadError(data.error || 'Có lỗi khi upload file.');
                    }
                  } catch (error) {
                    setUploadError('Không thể kết nối đến server. Vui lòng thử lại.');
                    console.error(error);
                  }
                }}
                className="space-y-6 px-8 py-6"
              >
                <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                  <label className="block">
                    <span className="text-sm font-semibold text-slate-600">Mã tài liệu</span>
                    <input
                      type="text"
                      value={uploadCode}
                      onChange={(e) => setUploadCode(e.target.value)}
                      placeholder="VD: DOC-2024-001"
                      className="mt-2 w-full rounded-2xl border border-slate-200 px-4 py-3 text-sm focus:border-[#e53935] focus:outline-none focus:ring-2 focus:ring-[#e53935]/20"
                      required
                    />
                  </label>
                  <label className="block">
                    <span className="text-sm font-semibold text-slate-600">Tiêu đề</span>
                    <input
                      type="text"
                      value={uploadTitle}
                      onChange={(e) => setUploadTitle(e.target.value)}
                      placeholder="Tên tài liệu"
                      className="mt-2 w-full rounded-2xl border border-slate-200 px-4 py-3 text-sm focus:border-[#e53935] focus:outline-none focus:ring-2 focus:ring-[#e53935]/20"
                      required
                    />
                  </label>
                </div>

                <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                  <label className="block">
                    <span className="text-sm font-semibold text-slate-600">Danh mục</span>
                    <select
                      value={uploadCategory}
                      onChange={(e) => setUploadCategory(e.target.value)}
                      className="mt-2 w-full rounded-2xl border border-slate-200 px-4 py-3 text-sm focus:border-[#e53935] focus:outline-none focus:ring-2 focus:ring-[#e53935]/20"
                    >
                      {uploadCategories.map((category) => (
                        <option key={category} value={category}>
                          {category}
                        </option>
                      ))}
                    </select>
                  </label>
                  <label className="block">
                    <span className="text-sm font-semibold text-slate-600">Ngày hết hạn</span>
                    <input
                      type="date"
                      value={uploadExpiryDate}
                      onChange={(e) => setUploadExpiryDate(e.target.value)}
                      className="mt-2 w-full rounded-2xl border border-slate-200 px-4 py-3 text-sm focus:border-[#e53935] focus:outline-none focus:ring-2 focus:ring-[#e53935]/20"
                      required
                    />
                  </label>
                </div>

                <label className="block">
                  <span className="text-sm font-semibold text-slate-600">Mô tả / Ghi chú</span>
                  <textarea
                    value={uploadDescription}
                    onChange={(e) => setUploadDescription(e.target.value)}
                    placeholder="Thêm mô tả ngắn cho tài liệu"
                    className="mt-2 w-full min-h-[120px] rounded-2xl border border-slate-200 px-4 py-3 text-sm focus:border-[#e53935] focus:outline-none focus:ring-2 focus:ring-[#e53935]/20"
                  />
                </label>

                <label className="block">
                  <span className="text-sm font-semibold text-slate-600">File tài liệu</span>
                  <input
                    type="file"
                    multiple
                    accept="application/pdf,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document"
                    onChange={(e) => addUploadFiles(e.target.files)}
                    className="mt-2 w-full text-sm text-slate-700 file:mr-4 file:rounded-full file:border-0 file:bg-[#e53935] file:px-4 file:py-2 file:text-sm file:text-white hover:file:bg-[#c62828]"
                    required
                  />
                  {uploadFiles.length > 0 && (
                    <p className="mt-2 text-sm text-slate-500">
                      Đã chọn {uploadFiles.length} file: {uploadFiles.map((file) => file.name).join(', ')}
                    </p>
                  )}
                </label>

                {uploadError && (
                  <div className="rounded-2xl bg-red-50 border border-red-100 px-4 py-3 text-sm text-red-700">
                    {uploadError}
                  </div>
                )}
                {uploadStatus && (
                  <div className="rounded-2xl bg-emerald-50 border border-emerald-100 px-4 py-3 text-sm text-emerald-700">
                    {uploadStatus}
                  </div>
                )}

                <div className="flex flex-col gap-3 sm:flex-row sm:justify-end">
                  <button
                    type="button"
                    onClick={() => setShowUploadModal(false)}
                    className="w-full rounded-2xl border border-slate-200 px-5 py-3 text-sm font-semibold text-slate-600 hover:bg-slate-100 transition-colors sm:w-auto"
                  >
                    Hủy
                  </button>
                  <button
                    type="submit"
                    className="w-full rounded-2xl bg-[#e53935] px-5 py-3 text-sm font-semibold text-white shadow-lg shadow-red-200 hover:bg-[#c62828] transition-colors sm:w-auto"
                  >
                    Gửi lên
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Filters Panel */}
        <section className="grid grid-cols-4 gap-6 p-6 mb-8 bg-white border rounded-2xl border-slate-100 shadow-sm items-end">
          <div>
            <label className="block mb-2 text-xs font-bold uppercase tracking-wider text-slate-400">
              Danh mục
            </label>
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="w-full border border-slate-200 rounded-lg px-4 py-2 text-sm focus:outline-none focus:border-[#e53935]"
            >
              <option>Tất cả danh mục</option>
              <option>Hợp đồng</option>
              <option>Giấy phép</option>
              <option>Bảo hiểm</option>
              <option>Chứng chỉ</option>
            </select>
          </div>
          <div>
            <label className="block mb-2 text-xs font-bold uppercase tracking-wider text-slate-400">
              Trạng thái
            </label>
            <select
              value={selectedStatus}
              onChange={(e) => setSelectedStatus(e.target.value)}
              className="w-full border border-slate-200 rounded-lg px-4 py-2 text-sm focus:outline-none focus:border-[#e53935]"
            >
              <option>Tất cả trạng thái</option>
              <option>Hết hạn</option>
              <option>Sắp hết hạn</option>
              <option>Còn hiệu lực</option>
            </select>
          </div>
          <div>
            <label className="block mb-2 text-xs font-bold uppercase tracking-wider text-slate-400">
              Khoảng thời gian
            </label>
            <div className="relative">
              <Calendar
                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400"
                size={16}
              />
              <input
                type="text"
                placeholder="mm/dd/yyyy"
                className="w-full border border-slate-200 rounded-lg px-4 py-2 text-sm focus:outline-none focus:border-[#e53935]"
              />
            </div>
          </div>
          <div className="flex gap-2">
            <button className="flex-1 flex items-center justify-center gap-2 bg-slate-100 hover:bg-slate-200 px-4 py-2 rounded-lg text-sm font-semibold transition-colors">
              <Filter size={16} /> Lọc dữ liệu
            </button>
            <button
              onClick={handleResetFilters}
              title="Làm mới bộ lọc"
              className="p-2 border border-slate-200 rounded-lg hover:bg-slate-50 transition-colors"
            >
              <RefreshCw size={18} className="text-slate-600" />
            </button>
          </div>
        </section>

        {/* Document Table */}
        <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
          <table className="w-full text-left">
            <thead className="bg-slate-50 border-b border-slate-100">
              <tr>
                <th className="px-6 py-4 text-xs font-bold uppercase tracking-wider text-slate-500">
                  Tên tài liệu
                </th>
                <th className="px-6 py-4 text-xs font-bold uppercase tracking-wider text-slate-500">
                  Danh mục
                </th>
                <th className="px-6 py-4 text-xs font-bold uppercase tracking-wider text-slate-500">
                  Ngày hết hạn
                </th>
                <th className="px-6 py-4 text-xs font-bold uppercase tracking-wider text-slate-500">
                  Trạng thái
                </th>
                <th className="px-6 py-4 text-xs font-bold uppercase tracking-wider text-slate-500 text-right">
                  Thao tác
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredDocuments.length > 0 ? (
                filteredDocuments.map((doc) => (
                  <tr key={doc.id} className="hover:bg-slate-50/50 transition-colors group">
                    <td className="px-6 py-5">
                      <div className="flex items-center gap-4">
                        <div
                          className={`w-10 h-10 rounded-xl flex items-center justify-center ${
                            doc.status === 'expired'
                              ? 'bg-red-50 text-red-500'
                              : doc.status === 'expiring'
                              ? 'bg-orange-50 text-orange-500'
                              : 'bg-slate-50 text-slate-500'
                          }`}
                        >
                          <FileText size={20} />
                        </div>
                        <div>
                          <h4 className="font-bold text-sm">{doc.title}</h4>
                          <p className="text-xs text-slate-400">ID: {doc.code}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-5 text-sm text-slate-600">{doc.category}</td>
                    <td className="px-6 py-5">
                      <span className="text-sm font-bold">{doc.expiryDate}</span>
                      {doc.overdueDays !== undefined && (
                        <p className="text-[10px] text-red-500 mt-1">
                          Quá hạn {doc.overdueDays} ngày
                        </p>
                      )}
                      {doc.daysLeft !== undefined && (
                        <p className="text-[10px] text-slate-400 mt-1">Còn {doc.daysLeft} ngày</p>
                      )}
                    </td>
                    <td className="px-6 py-5">
                      <span
                        className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                          doc.status === 'expired'
                            ? 'bg-red-100 text-red-600'
                            : doc.status === 'expiring'
                            ? 'bg-orange-100 text-orange-600'
                            : 'bg-emerald-100 text-emerald-600'
                        }`}
                      >
                        <span
                          className={`w-1.5 h-1.5 rounded-full ${
                            doc.status === 'expired'
                              ? 'bg-red-600'
                              : doc.status === 'expiring'
                              ? 'bg-orange-600'
                              : 'bg-emerald-600'
                          }`}
                        />
                        {doc.status === 'expired'
                          ? 'Hết hạn'
                          : doc.status === 'expiring'
                          ? 'Sắp hết hạn'
                          : 'Còn hiệu lực'}
                      </span>
                    </td>
                    <td className="px-6 py-5 text-right">
                      <div className="flex items-center justify-end gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                        <button
                          title="Xem"
                          className="p-2 text-slate-400 hover:text-[#e53935] hover:bg-red-50 rounded-lg transition-all"
                        >
                          <Eye size={18} />
                        </button>
                        <button
                          title="Sửa"
                          className="p-2 text-slate-400 hover:text-[#e53935] hover:bg-red-50 rounded-lg transition-all"
                        >
                          <Edit3 size={18} />
                        </button>
                        <button
                          title="Xóa"
                          className="p-2 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-all"
                        >
                          <Trash2 size={18} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={5} className="px-6 py-10 text-center text-sm text-slate-400">
                    Không tìm thấy tài liệu phù hợp.
                  </td>
                </tr>
              )}
            </tbody>
          </table>

          {/* Pagination */}
          <div className="px-6 py-4 border-t border-slate-100 flex items-center justify-between">
            <span className="text-xs text-slate-500">
              Hiển thị 1 - {filteredDocuments.length} trong {filteredDocuments.length} tài liệu
            </span>
            <div className="flex items-center gap-2">
              <button className="p-1.5 border border-slate-200 rounded-lg hover:bg-slate-50 disabled:opacity-50 transition-colors">
                <ChevronLeft size={16} />
              </button>
              {[1, 2, 3].map((page) => (
                <button
                  key={page}
                  className={`w-8 h-8 text-xs font-bold rounded-lg transition-all ${
                    page === 1
                      ? 'bg-[#e53935] text-white shadow-md shadow-red-200'
                      : 'text-slate-600 hover:bg-slate-100'
                  }`}
                >
                  {page}
                </button>
              ))}
              <button className="p-1.5 border border-slate-200 rounded-lg hover:bg-slate-50 transition-colors">
                <ChevronRight size={16} />
              </button>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
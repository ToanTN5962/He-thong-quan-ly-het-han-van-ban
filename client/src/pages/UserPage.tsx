import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  LayoutDashboard,
  FileText,
  Bell,
  Settings,
  LogOut,
  Search,
  PlusCircle,
  Eye,
  Edit3,
  Trash2,
  ChevronLeft,
  ChevronRight,
  Calendar,
  CheckCircle,
  AlertCircle,
  Loader2,
} from 'lucide-react';

interface Attachment {
  id: string;
  originalName: string;
  filePath: string;
  fileSize: number;
  uploadedAt?: string;
}

interface Document {
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
  attachments?: Attachment[];
}

interface NotificationItem {
  id: string;
  title: string;
  message: string;
  time: string;
  variant: 'success' | 'warning' | 'info';
  isRead: boolean;
}

type FileAction = 'PREVIEW' | 'DOWNLOAD';
type UploadResult = {
  type: 'success' | 'error';
  message: string;
};

export default function UserHomePage() {
  const [activeTab, setActiveTab] = useState<string>('dashboard');
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [selectedCategory, setSelectedCategory] = useState<string>('Tất cả danh mục');
  const [selectedStatus, setSelectedStatus] = useState<string>('Tất cả trạng thái');
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [uploadCode, setUploadCode] = useState('');
  const [uploadTitle, setUploadTitle] = useState('');
  const [uploadCategory, setUploadCategory] = useState('Hợp đồng');
  const [uploadIssuingAgency, setUploadIssuingAgency] = useState('');
  const [uploadIssueDate, setUploadIssueDate] = useState('');
  const [uploadEffectiveDate, setUploadEffectiveDate] = useState('');
  const [uploadExpiryDate, setUploadExpiryDate] = useState('');
  const [uploadDescription, setUploadDescription] = useState('');
  const [uploadFiles, setUploadFiles] = useState<File[]>([]);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadResult, setUploadResult] = useState<UploadResult | null>(null);
  const [userName, setUserName] = useState<string>('System Admin');
  const [userEmail, setUserEmail] = useState<string>('admin@docwatch.io');
  const [documents, setDocuments] = useState<Document[]>([]);
  const [documentError, setDocumentError] = useState<string | null>(null);
  const [selectedDocument, setSelectedDocument] = useState<Document | null>(null);
  const [showDocumentModal, setShowDocumentModal] = useState(false);
  const [previewAttachment, setPreviewAttachment] = useState<Attachment | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<Document | null>(null);
  const [isDeletingDocument, setIsDeletingDocument] = useState(false);
  const [documentPage, setDocumentPage] = useState(1);
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);
  const navigate = useNavigate();

  const [notifications, setNotifications] = useState<NotificationItem[]>([]);

  const fetchNotifications = async (email?: string) => {
    if (!email) return;
    try {
      const resp = await fetch(`/api/notifications/user?email=${encodeURIComponent(email)}`);
      if (!resp.ok) return;
      const data = await resp.json();
      const mapped: NotificationItem[] = (data || []).map((n: any) => ({
        id: String(n.id || ''),
        title: n.title || (n.notificationType || ''),
        message: n.content || '',
        time: n.createdAt ? new Date(n.createdAt).toLocaleString('vi-VN') : '',
        variant: n.notificationType === 'NEW_DOCUMENT' ? 'success' : n.notificationType === 'EXPIRING' ? 'warning' : 'info',
        isRead: Boolean(n.isRead),
      }));
      setNotifications(mapped);
    } catch (e) {
      console.error('Lỗi khi lấy thông báo:', e);
    }
  };

  const markNotificationAsRead = async (notificationId: string) => {
    const target = notifications.find((item) => item.id === notificationId);
    if (!target || target.isRead) {
      return;
    }

    setNotifications((items) =>
      items.map((item) =>
        item.id === notificationId ? { ...item, isRead: true } : item
      )
    );

    try {
      const response = await fetch(`/api/notifications/${notificationId}/read`, {
        method: 'PATCH',
      });

      if (!response.ok) {
        throw new Error('Không thể đánh dấu thông báo đã đọc.');
      }
    } catch (error) {
      setNotifications((items) =>
        items.map((item) =>
          item.id === notificationId ? { ...item, isRead: false } : item
        )
      );
      console.error(error);
    }
  };

  const deleteDocument = async () => {
    if (!deleteTarget || isDeletingDocument) {
      return;
    }

    setIsDeletingDocument(true);
    try {
      const actorEmail = userEmail || localStorage.getItem('userEmail') || '';
      const response = await fetch(
        `/api/documents/${encodeURIComponent(deleteTarget.id)}?userEmail=${encodeURIComponent(actorEmail)}`,
        { method: 'DELETE' }
      );

      if (!response.ok) {
        throw new Error('Không thể xóa văn bản. Vui lòng thử lại.');
      }

      setDocuments((items) => items.filter((item) => item.id !== deleteTarget.id));
      setDeleteTarget(null);
      await fetchNotifications(actorEmail);
    } catch (error) {
      alert(error instanceof Error ? error.message : 'Có lỗi khi xóa văn bản.');
      console.error(error);
    } finally {
      setIsDeletingDocument(false);
    }
  };

  const uploadCategories = ['Hợp đồng', 'Giấy phép', 'Bảo hiểm', 'Chứng chỉ', 'Khác'];

  const resetUploadForm = () => {
    setUploadCode('');
    setUploadTitle('');
    setUploadCategory('Hợp đồng');
    setUploadIssuingAgency('');
    setUploadIssueDate('');
    setUploadEffectiveDate('');
    setUploadExpiryDate('');
    setUploadDescription('');
    setUploadFiles([]);
    setUploadResult(null);
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

  const mapBackendDocument = (backendDoc: any): Document => {
    const statusMap: Record<string, Document['status']> = {
      EXPIRED: 'expired',
      EXPIRINGSOON: 'expiring',
      ACTIVE: 'active',
      DRAFT: 'active',
    };

    const rawExpire = backendDoc.expireDate;
    const rawEnacted = backendDoc.enactedDate;
    const rawEffective = backendDoc.effectiveDate;
    const expiryDate = rawExpire
      ? new Date(rawExpire).toLocaleDateString('vi-VN')
      : '';
    const enactedDate = rawEnacted
      ? new Date(rawEnacted).toLocaleDateString('vi-VN')
      : '';
    const effectiveDate = rawEffective
      ? new Date(rawEffective).toLocaleDateString('vi-VN')
      : '';
    const attachments: Attachment[] = Array.isArray(backendDoc.attachments)
      ? backendDoc.attachments.map((item: any) => ({
          id: String(item.id ?? ''),
          originalName: item.originalName ?? 'Không tên',
          filePath: item.filePath ?? '',
          fileSize: Number(item.fileSize ?? 0),
          uploadedAt: item.uploadedAt ? new Date(item.uploadedAt).toLocaleString('vi-VN') : '',
        }))
      : [];

    const today = new Date();
    const expiry = rawExpire ? new Date(rawExpire) : null;
    const rawDiffDays = expiry ? Math.ceil((expiry.getTime() - today.getTime()) / (1000 * 60 * 60 * 24)) : undefined;

    return {
      id: String(backendDoc.id ?? ''),
      code: backendDoc.documentNumber ?? '-',
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

  const fetchUserDocuments = async (ownerEmail: string) => {
    setDocumentError(null);
    try {
      const response = await fetch(`/api/documents/owner?ownerEmail=${encodeURIComponent(ownerEmail)}`);
      if (!response.ok) {
        throw new Error('Không thể tải danh sách tài liệu.');
      }
      const data = await response.json();
      setDocuments(Array.isArray(data) ? data.map(mapBackendDocument) : []);
    } catch (error) {
      setDocumentError(error instanceof Error ? error.message : 'Lỗi khi lấy dữ liệu tài liệu.');
      setDocuments([]);
    }
  };

  const filteredDocuments = documents.filter((doc) => {
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
  }, [searchTerm, selectedCategory, selectedStatus]);

  useEffect(() => {
    const storedName = localStorage.getItem('userFullname');
    const storedEmail = localStorage.getItem('userEmail');

    if (storedName) {
      setUserName(storedName);
    }
    if (storedEmail) {
      setUserEmail(storedEmail);
      fetchUserDocuments(storedEmail);
      fetchNotifications(storedEmail);
    }
  }, []);

  const handleResetFilters = () => {
    setSearchTerm('');
    setSelectedCategory('Tất cả danh mục');
    setSelectedStatus('Tất cả trạng thái');
  };

  const handleLogout = () => {
    localStorage.removeItem('authToken');
    localStorage.removeItem('userEmail');
    localStorage.removeItem('userFullname');
    localStorage.removeItem('userRole');
    navigate('/login');
  };

  const dashboardStats = {
    totalDocuments: documents.length,
    activeDocuments: documents.filter((doc) => doc.status === 'active').length,
    expiringDocuments: documents.filter((doc) => doc.status === 'expiring').length,
    expiredDocuments: documents.filter((doc) => doc.status === 'expired').length,
  };

  const handleActionWithPresignedUrl = async (attachment: Attachment, actionType: FileAction) => {
    try {
      const response = await fetch(
        `/api/files/preview?fileName=${encodeURIComponent(attachment.filePath)}`
      );
      
      if (!response.ok) {
        throw new Error('Không thể lấy mã truy cập file');
      }
      
      const presignedUrl = await response.text();

      if (actionType === 'PREVIEW') {
        setPreviewAttachment({
          ...attachment,
          filePath: presignedUrl 
        });
      } else if (actionType === 'DOWNLOAD') {
        const link = document.createElement('a');
        link.href = presignedUrl;
        link.setAttribute('download', attachment.originalName);
        link.setAttribute('target', '_blank');
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
      }
    } catch (error) {
      console.error("Lỗi khi xử lý file:", error);
      alert("Không thể truy cập file này vào lúc này.");
    }
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
            {userName
              .split(' ')
              .map((part) => part[0])
              .slice(0, 2)
              .join('')
              .toUpperCase()}
          </div>
          <div>
            <h4 className="text-sm font-bold">{userName}</h4>
            <p className="text-xs text-slate-500">{userEmail}</p>
          </div>
        </div>

        {/* Navigation Links */}
        <nav className="flex-1 px-2 space-y-1">
          {[
            { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
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
          <button
            onClick={() => setShowLogoutConfirm(true)}
            className="w-full flex items-center gap-3 px-4 py-3 text-slate-600 hover:text-[#e53935] hover:bg-red-50 rounded-lg transition-colors"
          >
            <LogOut size={20} />
            <span className="text-sm font-medium">Đăng xuất</span>
          </button>
          <p className="text-[10px] text-center mt-4 text-slate-400">Phiên bản V1.0.4</p>
        </div>
      </aside>

      {showLogoutConfirm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 px-4 py-6">
          <div className="w-full max-w-sm rounded-3xl bg-white p-6 shadow-2xl">
            <h3 className="text-lg font-bold text-slate-900">Xác nhận đăng xuất</h3>
            <p className="mt-3 text-sm text-slate-600">
              Bạn có chắc chắn muốn đăng xuất khỏi tài khoản không?
            </p>
            <div className="mt-6 flex items-center justify-end gap-3">
              <button
                onClick={() => setShowLogoutConfirm(false)}
                className="rounded-2xl border border-slate-200 px-4 py-2 text-sm font-semibold text-slate-600 hover:bg-slate-100 transition-colors"
              >
                Hủy
              </button>
              <button
                onClick={handleLogout}
                className="rounded-2xl bg-[#e53935] px-4 py-2 text-sm font-semibold text-white hover:bg-[#c62828] transition-colors"
              >
                Đăng xuất
              </button>
            </div>
          </div>
        </div>
      )}

      {showDocumentModal && selectedDocument && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 px-4 py-6">
          <div className="w-full max-w-2xl rounded-3xl bg-white p-6 shadow-2xl overflow-y-auto max-h-[calc(100vh-4rem)]">
            <div className="flex items-start justify-between gap-4 mb-6">
              <div>
                <h3 className="text-xl font-bold text-slate-900">Chi tiết tài liệu</h3>
                <p className="text-sm text-slate-500">Xem thông tin đầy đủ về tài liệu đã upload.</p>
              </div>
              <button
                onClick={() => setShowDocumentModal(false)}
                className="text-slate-500 hover:text-slate-900 transition-colors"
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
                  <h4 className="text-sm font-semibold text-slate-500">Mã tài liệu</h4>
                  <p className="mt-1 text-sm text-slate-900">{selectedDocument.code}</p>
                </div>
                <div>
                  <h4 className="text-sm font-semibold text-slate-500">Danh mục</h4>
                  <p className="mt-1 text-sm text-slate-900">{selectedDocument.category}</p>
                </div>
                <div>
                  <h4 className="text-sm font-semibold text-slate-500">Cơ quan ban hành</h4>
                  <p className="mt-1 text-sm text-slate-900">{selectedDocument.issuingAgency ?? 'Chưa có'}</p>
                </div>
              </div>
              <div className="space-y-3">
                <div>
                  <h4 className="text-sm font-semibold text-slate-500">Ngày ban hành</h4>
                  <p className="mt-1 text-sm text-slate-900">{selectedDocument.enactedDate ?? 'Chưa có'}</p>
                </div>
                <div>
                  <h4 className="text-sm font-semibold text-slate-500">Ngày hiệu lực</h4>
                  <p className="mt-1 text-sm text-slate-900">{selectedDocument.effectiveDate ?? 'Chưa có'}</p>
                </div>
                <div>
                  <h4 className="text-sm font-semibold text-slate-500">Ngày hết hạn</h4>
                  <p className="mt-1 text-sm text-slate-900">{selectedDocument.expiryDate ?? 'Chưa có'}</p>
                </div>
                <div>
                  <h4 className="text-sm font-semibold text-slate-500">Người sở hữu</h4>
                  <p className="mt-1 text-sm text-slate-900">{selectedDocument.ownerEmail ?? 'Chưa có'}</p>
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
                <p className="mt-1 text-sm text-slate-900 uppercase tracking-wide">
                  {selectedDocument.status === 'expired'
                    ? 'Hết hạn'
                    : selectedDocument.status === 'expiring'
                    ? 'Sắp hết hạn'
                    : 'Còn hiệu lực'}
                </p>
              </div>
              <div className="grid gap-3 md:grid-cols-2">
                <div className="rounded-2xl bg-slate-50 p-4">
                  <p className="text-xs text-slate-500">Còn lại</p>
                  <p className="mt-1 text-sm font-semibold text-slate-900">{selectedDocument.daysLeft ?? '-'}</p>
                </div>
                <div className="rounded-2xl bg-slate-50 p-4">
                  <p className="text-xs text-slate-500">Quá hạn</p>
                  <p className="mt-1 text-sm font-semibold text-slate-900">{selectedDocument.overdueDays ?? '-'}</p>
                </div>
              </div>
            </div>
            <div className="mt-6">
              <h4 className="text-sm font-semibold text-slate-500">File đính kèm</h4>
              {selectedDocument.attachments && selectedDocument.attachments.length > 0 ? (
                <div className="mt-3 space-y-3">
                  {selectedDocument.attachments.map((attachment: Attachment) => (
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
                            onClick={() => handleActionWithPresignedUrl(attachment, 'PREVIEW')}
                            className="rounded-2xl bg-[#e53935] px-4 py-2 text-xs font-semibold text-white hover:bg-[#c62828] transition-colors"
                          >
                            Xem trước
                          </button>

                          <button
                            type="button"
                            onClick={() => handleActionWithPresignedUrl(attachment, 'DOWNLOAD')}
                            className="rounded-2xl border border-slate-200 bg-white px-4 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-100 transition-colors"
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
                className="text-slate-500 hover:text-slate-900 transition-colors"
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

      {/* ================= MAIN CONTENT ================= */}
      <main className="flex-1 p-8 overflow-y-auto">
        {/* Header */}
        <header className="flex items-start justify-between mb-8">
          <div>
            <h1 className="mb-2 text-3xl font-bold">Quản lý Tài liệu</h1>
            <p className="text-slate-500">Theo dõi và quản lý thời hạn các văn bản pháp lý.</p>
          </div>
          <div className="flex items-center gap-4">
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

        {activeTab === 'dashboard' && (
          <>
            <section className="grid gap-6 mb-8 md:grid-cols-3">
              <div className="rounded-3xl bg-white p-6 shadow-sm border border-slate-100">
                <p className="text-sm uppercase tracking-[0.16em] text-slate-400">Tổng tài liệu</p>
                <p className="mt-4 text-4xl font-bold text-slate-900">{dashboardStats.totalDocuments}</p>
                <p className="mt-2 text-sm text-slate-500">Số tài liệu bạn đã upload lên hệ thống.</p>
              </div>
              <div className="rounded-3xl bg-white p-6 shadow-sm border border-slate-100">
                <p className="text-sm uppercase tracking-[0.16em] text-slate-400">Còn hiệu lực</p>
                <p className="mt-4 text-4xl font-bold text-emerald-600">{dashboardStats.activeDocuments}</p>
                <p className="mt-2 text-sm text-slate-500">Tài liệu đang trong trạng thái còn hiệu lực.</p>
              </div>
              <div className="rounded-3xl bg-white p-6 shadow-sm border border-slate-100">
                <p className="text-sm uppercase tracking-[0.16em] text-slate-400">Hết hạn</p>
                <p className="mt-4 text-4xl font-bold text-red-600">{dashboardStats.expiredDocuments}</p>
                <p className="mt-2 text-sm text-slate-500">Tài liệu đã hết hạn cần xem xét.</p>
              </div>
            </section>

            <section className="bg-white rounded-3xl border border-slate-100 shadow-sm p-6 mb-8">
              <div className="flex items-center justify-between mb-5">
                <div>
                  <h2 className="text-xl font-bold text-slate-900">Tài liệu của tôi</h2>
                  <p className="text-sm text-slate-500">Danh sách tài liệu đã upload và tình trạng hiện tại.</p>
                </div>
                <div className="relative ml-auto">
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
              </div>

              <section className="grid grid-cols-1 gap-6 mb-6 md:grid-cols-2 lg:grid-cols-4">
                <div className="rounded-3xl bg-slate-50 p-5 border border-slate-100">
                  <p className="text-xs uppercase tracking-[0.2em] text-slate-400">Danh mục</p>
                  <select
                    value={selectedCategory}
                    onChange={(e) => setSelectedCategory(e.target.value)}
                    className="mt-3 w-full rounded-2xl border border-slate-200 bg-white px-4 py-2 text-sm focus:outline-none focus:border-[#e53935]"
                  >
                    <option>Tất cả danh mục</option>
                    <option>Hợp đồng</option>
                    <option>Giấy phép</option>
                    <option>Bảo hiểm</option>
                    <option>Chứng chỉ</option>
                    <option>Khác</option>
                  </select>
                </div>
                <div className="rounded-3xl bg-slate-50 p-5 border border-slate-100">
                  <p className="text-xs uppercase tracking-[0.2em] text-slate-400">Trạng thái</p>
                  <select
                    value={selectedStatus}
                    onChange={(e) => setSelectedStatus(e.target.value)}
                    className="mt-3 w-full rounded-2xl border border-slate-200 bg-white px-4 py-2 text-sm focus:outline-none focus:border-[#e53935]"
                  >
                    <option>Tất cả trạng thái</option>
                    <option>Hết hạn</option>
                    <option>Sắp hết hạn</option>
                    <option>Còn hiệu lực</option>
                  </select>
                </div>
                <div className="rounded-3xl bg-slate-50 p-5 border border-slate-100">
                  <p className="text-xs uppercase tracking-[0.2em] text-slate-400">Khoảng thời gian</p>
                  <div className="relative mt-3">
                    <Calendar className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
                    <input
                      type="text"
                      placeholder="mm/dd/yyyy"
                      className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-2 text-sm focus:outline-none focus:border-[#e53935]"
                    />
                  </div>
                </div>
                <div className="rounded-3xl bg-slate-50 p-5 border border-slate-100 flex flex-col justify-between">
                  <div>
                    <p className="text-xs uppercase tracking-[0.2em] text-slate-400">Hành động</p>
                    <p className="mt-3 text-sm text-slate-500">Lọc và làm mới danh sách tài liệu.</p>
                  </div>
                  <div className="mt-4 flex gap-2">
                    <button className="flex-1 rounded-2xl bg-[#e53935] px-4 py-3 text-sm font-semibold text-white hover:bg-[#c62828] transition-colors">
                      Lọc dữ liệu
                    </button>
                    <button
                      onClick={handleResetFilters}
                      className="rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm font-semibold text-slate-700 hover:bg-slate-100 transition-colors"
                    >
                      Làm mới
                    </button>
                  </div>
                </div>
              </section>

              <div className="overflow-x-auto rounded-3xl border border-slate-100">
                <table className="w-full text-left">
                  <thead className="bg-slate-50 border-b border-slate-100">
                    <tr>
                      <th className="px-6 py-4 text-xs font-bold uppercase tracking-wider text-slate-500">Tên tài liệu</th>
                      <th className="px-6 py-4 text-xs font-bold uppercase tracking-wider text-slate-500">Danh mục</th>
                      <th className="px-6 py-4 text-xs font-bold uppercase tracking-wider text-slate-500">Ngày hết hạn</th>
                      <th className="px-6 py-4 text-xs font-bold uppercase tracking-wider text-slate-500">Trạng thái</th>
                      <th className="px-6 py-4 text-xs font-bold uppercase tracking-wider text-slate-500 text-right">Thao tác</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {documentError ? (
                      <tr>
                        <td colSpan={5} className="px-6 py-10 text-center text-sm text-red-500">{documentError}</td>
                      </tr>
                    ) : filteredDocuments.length > 0 ? (
                      paginatedDocuments.map((doc) => (
                        <tr key={doc.id} className="hover:bg-slate-50/50 transition-colors group">
                          <td className="px-6 py-5">
                            <div className="flex items-center gap-4">
                              <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${
                                doc.status === 'expired'
                                  ? 'bg-red-50 text-red-500'
                                  : doc.status === 'expiring'
                                  ? 'bg-orange-50 text-orange-500'
                                  : 'bg-slate-50 text-slate-500'
                              }`}>
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
                              <p className="text-[10px] text-red-500 mt-1">Quá hạn {doc.overdueDays} ngày</p>
                            )}
                            {doc.daysLeft !== undefined && (
                              <p className="text-[10px] text-slate-400 mt-1">Còn {doc.daysLeft} ngày</p>
                            )}
                          </td>
                          <td className="px-6 py-5">
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
                              {doc.status === 'expired' ? 'Hết hạn' : doc.status === 'expiring' ? 'Sắp hết hạn' : 'Còn hiệu lực'}
                            </span>
                          </td>
                          <td className="px-6 py-5 text-right">
                            <div className="flex items-center justify-end gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                              <button
                                title="Xem"
                                onClick={() => {
                                  setSelectedDocument(doc);
                                  setShowDocumentModal(true);
                                }}
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
                                onClick={() => setDeleteTarget(doc)}
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

                <div className="px-6 py-4 border-t border-slate-100 flex items-center justify-between">
                  <span className="text-xs text-slate-500">
                    {filteredDocuments.length > 0
                      ? `Hiển thị ${((currentDocumentPage - 1) * documentsPerPage + 1).toLocaleString()} - ${Math.min(currentDocumentPage * documentsPerPage, filteredDocuments.length).toLocaleString()} trong ${filteredDocuments.length.toLocaleString()} tài liệu`
                      : 'Không có tài liệu'}
                  </span>
                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      disabled={currentDocumentPage === 1}
                      onClick={() => setDocumentPage((page) => Math.max(page - 1, 1))}
                      className="p-1.5 border border-slate-200 rounded-lg hover:bg-slate-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                    >
                      <ChevronLeft size={16} />
                    </button>
                    {visibleDocumentPages.map((page) => (
                      <button
                        key={page}
                        type="button"
                        onClick={() => setDocumentPage(page)}
                        className={`w-8 h-8 text-xs font-bold rounded-lg transition-all ${
                          page === currentDocumentPage
                            ? 'bg-[#e53935] text-white shadow-md shadow-red-200'
                            : 'text-slate-600 hover:bg-slate-100'
                        }`}
                      >
                        {page}
                      </button>
                    ))}
                    <button
                      type="button"
                      disabled={currentDocumentPage === totalDocumentPages}
                      onClick={() => setDocumentPage((page) => Math.min(page + 1, totalDocumentPages))}
                      className="p-1.5 border border-slate-200 rounded-lg hover:bg-slate-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                    >
                      <ChevronRight size={16} />
                    </button>
                  </div>
                </div>
              </div>
            </section>
          </>
        )}
        {activeTab === 'notifications' && (
          <>
          <section className="space-y-5 mb-8">
            <div className="rounded-3xl bg-white p-6 shadow-sm border border-slate-100">
              <h2 className="text-xl font-bold text-slate-900">Thông báo</h2>
              <p className="mt-2 text-sm text-slate-500">Các thông báo mới nhất liên quan đến tài liệu của bạn.</p>
            </div>
            <div className="grid gap-4">
              {notifications.map((item) => (
                <button
                  type="button"
                  key={item.id}
                  onClick={() => markNotificationAsRead(item.id)}
                  className={`w-full rounded-3xl border p-5 text-left transition-all hover:-translate-y-0.5 hover:shadow-sm ${
                    item.isRead
                      ? 'border-slate-100 bg-white opacity-75'
                      : item.variant === 'success'
                      ? 'border-emerald-100 bg-emerald-50'
                      : item.variant === 'warning'
                      ? 'border-orange-100 bg-orange-50'
                      : 'border-slate-100 bg-slate-50'
                  }`}
                >
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <div className="flex items-center gap-2">
                        {!item.isRead && <span className="h-2.5 w-2.5 rounded-full bg-[#e53935]" />}
                        <h3 className={`text-base font-semibold ${item.isRead ? 'text-slate-600' : 'text-slate-900'}`}>{item.title}</h3>
                      </div>
                      <p className="mt-2 text-sm text-slate-700">{item.message}</p>
                    </div>
                    <span className="text-xs uppercase tracking-[0.2em] text-slate-500">{item.time}</span>
                  </div>
                </button>
              ))}
            </div>
          </section>
          </>
        )}

        {/* Upload Modal */}
        {showUploadModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 px-4 py-8">
            <div className="w-full max-w-3xl rounded-3xl bg-white shadow-2xl overflow-hidden max-h-[calc(100vh-5rem)] flex flex-col">
              <div className="flex items-center justify-between px-8 py-6 border-b border-slate-200 flex-shrink-0">
                <div>
                  <h2 className="text-2xl font-bold text-slate-900">Tải lên tài liệu mới</h2>
                  <p className="text-sm text-slate-500">Nhập thông tin tài liệu và chọn file để upload.</p>
                </div>
                <div className="relative ml-auto">
                  <Search
                    className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
                    size={18}
                  />
                  <input
                    type="text"
                    placeholder="Tìm kiếm tài liệu..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    disabled={isUploading}
                    className="pl-10 pr-4 py-2 border border-slate-200 rounded-full w-80 focus:outline-none focus:ring-2 focus:ring-[#e53935]/20 focus:border-[#e53935] transition-all"
                  />
                </div>
                <button
                  onClick={() => setShowUploadModal(false)}
                  disabled={isUploading}
                  className="text-slate-500 hover:text-slate-900 transition-colors disabled:cursor-not-allowed disabled:opacity-50"
                >
                  Đóng
                </button>
              </div>

              <div className="overflow-y-auto px-8 py-6 max-h-[calc(100vh-11rem)] min-h-0">
                <form
                  onSubmit={async (e) => {
                  e.preventDefault();
                  if (isUploading) {
                    return;
                  }

                  setUploadResult(null);

                  if (uploadFiles.length === 0) {
                    setUploadResult({
                      type: 'error',
                      message: 'Vui lòng chọn ít nhất một file để upload.',
                    });
                    return;
                  }

                  const formData = new FormData();
                  uploadFiles.forEach((file) => formData.append('file', file));
                  formData.append('code', uploadCode);
                  formData.append('title', uploadTitle);
                  formData.append('category', uploadCategory);
                  formData.append('issuingAgency', uploadIssuingAgency);
                  formData.append('issueDate', uploadIssueDate);
                  formData.append('effectiveDate', uploadEffectiveDate);
                  formData.append('expiryDate', uploadExpiryDate);
                  formData.append('description', uploadDescription);

                  const ownerEmail = localStorage.getItem('userEmail');
                  if (ownerEmail) {
                    formData.append('ownerEmail', ownerEmail);
                  }

                  setIsUploading(true);
                  try {
                    const response = await fetch('/api/files/upload', {
                      method: 'POST',
                      body: formData,
                    });

                    const data = await response.json().catch(() => ({}));
                    if (response.ok) {
                      setUploadResult({
                        type: 'success',
                        message: 'Upload thành công! File đã được lưu vào hệ thống.',
                      });
                      if (ownerEmail) {
                        await fetchUserDocuments(ownerEmail);
                      }
                    } else {
                      setUploadResult({
                        type: 'error',
                        message: data.error || 'Có lỗi khi upload file.',
                      });
                    }
                  } catch (error) {
                    setUploadResult({
                      type: 'error',
                      message: 'Không thể kết nối đến server. Vui lòng thử lại.',
                    });
                    console.error(error);
                  } finally {
                    setIsUploading(false);
                  }
                }}
                className="space-y-6 px-8 py-6"
              >
                <fieldset disabled={isUploading} className="space-y-6 disabled:opacity-70">
                <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                  <label className="block">
                    <span className="text-sm font-semibold text-slate-600">Mã tài liệu</span>
                    <input
                      type="text"
                      value={uploadCode}
                      onChange={(e) => setUploadCode(e.target.value)}
                      placeholder="VD: DOC-2026-001"
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
                    <span className="text-sm font-semibold text-slate-600">Cơ quan ban hành</span>
                    <input
                      type="text"
                      value={uploadIssuingAgency}
                      onChange={(e) => setUploadIssuingAgency(e.target.value)}
                      placeholder="Tên cơ quan ban hành"
                      className="mt-2 w-full rounded-2xl border border-slate-200 px-4 py-3 text-sm focus:border-[#e53935] focus:outline-none focus:ring-2 focus:ring-[#e53935]/20"
                      required
                    />
                  </label>
                </div>

                <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
                  <label className="block">
                    <span className="text-sm font-semibold text-slate-600">Ngày ban hành</span>
                    <input
                      type="date"
                      value={uploadIssueDate}
                      onChange={(e) => setUploadIssueDate(e.target.value)}
                      className="mt-2 w-full rounded-2xl border border-slate-200 px-4 py-3 text-sm focus:border-[#e53935] focus:outline-none focus:ring-2 focus:ring-[#e53935]/20"
                      required
                    />
                  </label>
                  <label className="block">
                    <span className="text-sm font-semibold text-slate-600">Ngày hiệu lực</span>
                    <input
                      type="date"
                      value={uploadEffectiveDate}
                      onChange={(e) => setUploadEffectiveDate(e.target.value)}
                      className="mt-2 w-full rounded-2xl border border-slate-200 px-4 py-3 text-sm focus:border-[#e53935] focus:outline-none focus:ring-2 focus:ring-[#e53935]/20"
                      required
                    />
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

                <div className="flex flex-col gap-3 sm:flex-row sm:justify-end">
                  <button
                    type="button"
                    onClick={() => setShowUploadModal(false)}
                    disabled={isUploading}
                    className="w-full rounded-2xl border border-slate-200 px-5 py-3 text-sm font-semibold text-slate-600 hover:bg-slate-100 transition-colors disabled:cursor-not-allowed disabled:opacity-60 sm:w-auto"
                  >
                    Hủy
                  </button>
                  <button
                    type="submit"
                    disabled={isUploading}
                    className="flex w-full items-center justify-center gap-2 rounded-2xl bg-[#e53935] px-5 py-3 text-sm font-semibold text-white shadow-lg shadow-red-200 hover:bg-[#c62828] transition-colors disabled:cursor-not-allowed disabled:bg-slate-400 disabled:shadow-none sm:w-auto"
                  >
                    {isUploading && <Loader2 size={18} className="animate-spin" />}
                    {isUploading ? 'Đang gửi...' : 'Gửi lên'}
                  </button>
                </div>
                </fieldset>
              </form>
            </div>
          </div>
        </div>
        )}

        {uploadResult && (
          <div className="fixed inset-0 z-[60] flex items-center justify-center bg-slate-900/60 px-4">
            <div className="w-full max-w-md rounded-3xl bg-white p-6 shadow-2xl">
              <div className="flex items-start gap-4">
                <div className={`flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-2xl ${
                  uploadResult.type === 'success'
                    ? 'bg-emerald-50 text-emerald-600'
                    : 'bg-red-50 text-red-600'
                }`}>
                  {uploadResult.type === 'success' ? <CheckCircle size={26} /> : <AlertCircle size={26} />}
                </div>
                <div className="min-w-0">
                  <h3 className="text-lg font-bold text-slate-900">
                    {uploadResult.type === 'success' ? 'Gửi tài liệu thành công' : 'Gửi tài liệu thất bại'}
                  </h3>
                  <p className="mt-2 text-sm leading-6 text-slate-600">{uploadResult.message}</p>
                </div>
              </div>
              <div className="mt-6 flex justify-end">
                <button
                  type="button"
                  onClick={() => {
                    const wasSuccess = uploadResult.type === 'success';
                    setUploadResult(null);
                    if (wasSuccess) {
                      setShowUploadModal(false);
                      resetUploadForm();
                    }
                  }}
                  className="rounded-2xl bg-[#e53935] px-5 py-3 text-sm font-semibold text-white shadow-lg shadow-red-200 transition-colors hover:bg-[#c62828]"
                >
                  Đóng
                </button>
              </div>
            </div>
          </div>
        )}

        {deleteTarget && (
          <div className="fixed inset-0 z-[60] flex items-center justify-center bg-slate-900/60 px-4">
            <div className="w-full max-w-md rounded-3xl bg-white p-6 shadow-2xl">
              <div className="flex items-start gap-4">
                <div className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-2xl bg-red-50 text-red-600">
                  <Trash2 size={26} />
                </div>
                <div className="min-w-0">
                  <h3 className="text-lg font-bold text-slate-900">Xác nhận xóa văn bản</h3>
                  <p className="mt-2 text-sm leading-6 text-slate-600">
                    Bạn có chắc chắn muốn xóa văn bản "{deleteTarget.title}" không?
                  </p>
                  <p className="mt-2 text-xs text-slate-500">
                    Văn bản sẽ được xóa mềm khỏi danh sách và hệ thống sẽ ghi nhận lịch sử thao tác.
                  </p>
                </div>
              </div>
              <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:justify-end">
                <button
                  type="button"
                  onClick={() => setDeleteTarget(null)}
                  disabled={isDeletingDocument}
                  className="rounded-2xl border border-slate-200 px-5 py-3 text-sm font-semibold text-slate-600 transition-colors hover:bg-slate-100 disabled:cursor-not-allowed disabled:opacity-60"
                >
                  Không
                </button>
                <button
                  type="button"
                  onClick={deleteDocument}
                  disabled={isDeletingDocument}
                  className="flex items-center justify-center gap-2 rounded-2xl bg-red-600 px-5 py-3 text-sm font-semibold text-white shadow-lg shadow-red-200 transition-colors hover:bg-red-700 disabled:cursor-not-allowed disabled:bg-slate-400 disabled:shadow-none"
                >
                  {isDeletingDocument && <Loader2 size={18} className="animate-spin" />}
                  {isDeletingDocument ? 'Đang xóa...' : 'Có, xóa văn bản'}
                </button>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}

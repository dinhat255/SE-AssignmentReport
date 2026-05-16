import { useEffect, useState, useCallback } from 'react';
import { AlertTriangle, CheckCircle2, Clock, MapPin, Filter, Search, Plus, X, Upload, FileText } from 'lucide-react';
import { getStoredRole, getStoredUser } from '../../api/client';
import { employeeApi } from '../../api/employeeApi';

interface MaintenanceIssue {
  id: string;
  zone: string;
  spot: string;
  sensor: string;
  issueType: string;
  severity: 'critical' | 'warning' | 'info';
  status: 'pending' | 'in-progress' | 'resolved';
  reportedAt: string;
  description: string;
  resolvedAt?: string;
  resolvedBy?: string;
  reportedBy?: string;
  attachments?: string[];
}

export function Maintenance() {
  const accountRole = getStoredRole('student');
  const currentUser = getStoredUser()?.fullName || 'Admin';
  const isEmployee = accountRole === 'employee';
  const isAdmin = accountRole === 'admin';
  const hasAccess = isAdmin || isEmployee;

  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [filterZone, setFilterZone] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [showReportModal, setShowReportModal] = useState(false);
  const [showSuccessNotification, setShowSuccessNotification] = useState(false);
  const [showErrorNotification, setShowErrorNotification] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  // Form state
  const [reportForm, setReportForm] = useState({
    incidentCategory: '',
    incidentType: '',
    zone: '',
    spotNumber: '',
    description: '',
    severity: 'warning' as 'critical' | 'warning' | 'info',
    attachments: [] as File[]
  });

  const [issues, setIssues] = useState<MaintenanceIssue[]>([]);
  const [loadingIssues, setLoadingIssues] = useState(true);
  const [errorIssues, setErrorIssues] = useState<string | null>(null);
  
  const fetchData = useCallback(async () => {
  try {
    setLoadingIssues(true);
    const response = await employeeApi.getIncidents();
    
    const convertedIssues = response.incidents.map((incident: any) => ({
      id: incident.id,
      zone: incident.spotId?.charAt(0) || 'N/A',
      spot: incident.spotId || 'N/A',
      sensor: incident.sensorId || 'N/A',
      issueType: incident.title || 'Sự cố thiết bị',
      severity: 
        incident.severity === 'HIGH' ? 'critical' : 
        incident.severity === 'MEDIUM' ? 'warning' : 'info',
      status: 
        (incident.status === 'Chưa xử lý' || incident.status === 'OPEN') ? 'pending' : 
        (incident.status === 'Đang xử lý' || incident.status === 'IN_PROGRESS') ? 'in-progress' : 'resolved',
      reportedAt: incident.reportedAt,
      description: incident.description,
      reportedBy: incident.reportedBy,
      resolvedAt: incident.resolvedAt,
      attachments: incident.attachments || [],
    }));

    setIssues(convertedIssues);
    setErrorIssues(null);
  } catch (err) {
    setErrorIssues('Không tải được danh sách sự cố.');
    console.error('Error fetching incidents:', err);
  } finally {
    setLoadingIssues(false);
  }
}, []); // Dùng useCallback để hàm không bị khởi tạo lại vô ích
  // Fetch incidents from API
  useEffect(() => {
    if (hasAccess) {
      fetchData();
    }
  }, [hasAccess, fetchData]);

  if (!hasAccess) {
    return (
      <div className="p-6">
        <div className="max-w-2xl rounded-xl border border-yellow-200 bg-yellow-50 p-6">
          <div className="flex items-start gap-3">
            <AlertTriangle className="mt-0.5 h-5 w-5 text-yellow-600" />
            <div>
              <h1 className="text-xl font-semibold text-gray-900">Không có quyền truy cập</h1>
              <p className="mt-2 text-sm text-gray-700">
                Trang bảo trì chỉ dành cho quản trị viên và nhân viên vận hành.
              </p>
              <a href="/dashboard" className="mt-4 inline-flex rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700">
                Quay về dashboard
              </a>
            </div>
          </div>
        </div>
      </div>
    );
  }

  const incidentCategories = [
    { value: 'on-site', label: 'Sự cố tại chỗ' },
    { value: 'equipment', label: 'Sự cố thiết bị' },
    { value: 'other', label: 'Sự cố khác' }
  ];

  const onSiteIncidentTypes = [
    'Sai thông tin thẻ',
    'Hư hỏng tài sản'
  ];

  const equipmentIncidentTypes = [
    'Cảm biến không hoạt động',
    'Đèn LED hỏng',
    'Barrier không đóng/mở',
    'Camera không hoạt động',
    'Vỉa hè bị hư hỏng',
    'Biển báo bị che khuất',
    'Thiết bị bị hư hỏng vật lý'
  ];

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'critical':
        return 'bg-red-100 text-red-700 border-red-200';
      case 'warning':
        return 'bg-orange-100 text-orange-700 border-orange-200';
      case 'info':
        return 'bg-blue-100 text-blue-700 border-blue-200';
      default:
        return 'bg-gray-100 text-gray-700 border-gray-200';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending':
        return 'bg-red-100 text-red-700';
      case 'in-progress':
        return 'bg-yellow-100 text-yellow-700';
      case 'resolved':
        return 'bg-green-100 text-green-700';
      default:
        return 'bg-gray-100 text-gray-700';
    }
  };

  const getStatusLabel = (status: string) => {
    switch (status) {
      case 'pending':
        return 'Chưa xử lý';
      case 'in-progress':
        return 'Đang xử lý';
      case 'resolved':
        return 'Đã xử lý';
      default:
        return status;
    }
  };

  const handleStatusChange = async (issueId: string, newStatus: 'pending' | 'in-progress' | 'resolved') => {
    try {
      // 1. Chuyển đổi format trạng thái phù hợp với Backend
      const apiStatus = newStatus === 'resolved' ? 'Đã xử lý' : 
                        newStatus === 'in-progress' ? 'Đang xử lý' : 'Chưa xử lý';

      // 2. Gọi API cập nhật
      await employeeApi.updateIncidentStatus(issueId, apiStatus);
      // 3. Gọi hàm fetchData để đồng bộ lại toàn bộ danh sách từ server
      await fetchData(); 
      
    } catch (err) {
      console.error('Lỗi khi cập nhật trạng thái:', err);
      setErrorMessage('Không thể cập nhật trạng thái. Vui lòng thử lại.');
      setShowErrorNotification(true);
      setTimeout(() => setShowErrorNotification(false), 3000);
    }
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const newFiles = Array.from(e.target.files);
      setReportForm({
        ...reportForm,
        attachments: [...reportForm.attachments, ...newFiles]
      });
    }
  };

  const removeAttachment = (index: number) => {
    const newAttachments = [...reportForm.attachments];
    newAttachments.splice(index, 1);
    setReportForm({
      ...reportForm,
      attachments: newAttachments
    });
  };

  const validateForm = () => {
    if (!reportForm.incidentCategory) {
      setErrorMessage('Vui lòng chọn loại sự cố');
      return false;
    }

    if ((reportForm.incidentCategory === 'on-site' || reportForm.incidentCategory === 'equipment') && !reportForm.incidentType) {
      setErrorMessage('Vui lòng chọn chi tiết sự cố');
      return false;
    }

    if ((reportForm.incidentCategory === 'equipment' || reportForm.incidentCategory === 'other') && (!reportForm.zone || !reportForm.spotNumber)) {
      setErrorMessage('Vui lòng chọn khu vực và vị trí');
      return false;
    }

    if (!reportForm.description || reportForm.description.trim().length < 10) {
      setErrorMessage('Vui lòng nhập mô tả chi tiết (ít nhất 10 ký tự)');
      return false;
    }

    return true;
  };

 const handleSubmitReport = async () => {
    // Validate form trước khi gửi
    if (!validateForm()) {
      setShowErrorNotification(true);
      setTimeout(() => setShowErrorNotification(false), 3000);
      return;
    }

    try {
      // 1. Chuẩn bị dữ liệu (Payload) theo đúng cấu trúc Backend/Swagger
      const payload = {
        spotId: reportForm.zone && reportForm.spotNumber 
          ? `${reportForm.zone}${reportForm.spotNumber.padStart(2, '0')}` 
          : 'N/A',
        title: reportForm.incidentType || 'Sự cố mới',
        description: reportForm.description,
        type: reportForm.incidentCategory,
        severity: reportForm.severity === 'critical' ? 'HIGH' : 
                  reportForm.severity === 'warning' ? 'MEDIUM' : 'LOW',
        reportedBy: currentUser,
      };

      // 2. Gọi API tạo mới (Có await nên phải có async ở đầu hàm)
      await employeeApi.createIncident(payload);

      // 3. Reset form về trạng thái ban đầu
      setReportForm({
        incidentCategory: '',
        incidentType: '',
        zone: '',
        spotNumber: '',
        description: '',
        severity: 'warning',
        attachments: []
      });

      // 4. Đóng Modal và tải lại dữ liệu mới nhất
      setShowReportModal(false);
      await fetchData(); 
      
      setShowSuccessNotification(true);
      setTimeout(() => setShowSuccessNotification(false), 3000);
    } catch (error) {
      setErrorMessage('Không thể gửi báo cáo. Vui lòng kiểm tra lại Backend.');
      setShowErrorNotification(true);
      setTimeout(() => setShowErrorNotification(false), 3000);
      console.error('Error creating incident:', error);
    }
  };

  const filteredIssues = issues.filter(issue => {
    const matchesStatus = filterStatus === 'all' || issue.status === filterStatus;
    const matchesZone = filterZone === 'all' || issue.zone === filterZone;
    const matchesSearch =
      issue.spot.toLowerCase().includes(searchQuery.toLowerCase()) ||
      issue.sensor.toLowerCase().includes(searchQuery.toLowerCase()) ||
      issue.issueType.toLowerCase().includes(searchQuery.toLowerCase());

    return matchesStatus && matchesZone && matchesSearch;
  });

  const stats = {
    total: issues.length,
    pending: issues.filter(i => i.status === 'pending').length,
    inProgress: issues.filter(i => i.status === 'in-progress').length,
    resolved: issues.filter(i => i.status === 'resolved').length,
    critical: issues.filter(i => i.severity === 'critical').length
  };

  return (
    <div className="p-6">
      {/* Success Notification */}
      {showSuccessNotification && (
        <div className="fixed top-4 right-4 bg-green-600 text-white px-6 py-4 rounded-lg shadow-lg flex items-center gap-3 z-50 animate-fade-in">
          <CheckCircle2 className="w-5 h-5" />
          <span>Báo cáo lỗi đã được gửi thành công!</span>
        </div>
      )}

      {/* Error Notification */}
      {showErrorNotification && (
        <div className="fixed top-4 right-4 bg-red-600 text-white px-6 py-4 rounded-lg shadow-lg flex items-center gap-3 z-50 animate-fade-in">
          <AlertTriangle className="w-5 h-5" />
          <span>{errorMessage}</span>
        </div>
      )}

      {/* Header */}
      <div className="mb-6 flex justify-between items-start">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 mb-1">Bảo trì & Sửa chữa</h1>
          <p className="text-gray-600">Quản lý các lỗi và sự cố từ cảm biến tại bãi đậu xe</p>
        </div>
        {isEmployee && (
          <button
            onClick={() => setShowReportModal(true)}
            className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            <Plus className="w-5 h-5" />
            Báo cáo lỗi mới
          </button>
        )}
      </div>

      {/* Report Modal */}
      {showReportModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            {/* Modal Header */}
            <div className="flex justify-between items-center p-6 border-b border-gray-200">
              <h2 className="text-xl font-bold text-gray-900">Báo cáo lỗi mới</h2>
              <button
                onClick={() => setShowReportModal(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            {/* Modal Body */}
            <div className="p-6 space-y-6">
              {/* Loại sự cố */}
              <div>
                <label className="block text-sm font-semibold text-gray-900 mb-2">
                  Chọn loại sự cố <span className="text-red-600">*</span>
                </label>
                <select
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  value={reportForm.incidentCategory}
                  onChange={(e) => setReportForm({ ...reportForm, incidentCategory: e.target.value, incidentType: '' })}
                >
                  <option value="">-- Chọn loại sự cố --</option>
                  {incidentCategories.map(cat => (
                    <option key={cat.value} value={cat.value}>{cat.label}</option>
                  ))}
                </select>
              </div>

              {/* Chi tiết sự cố (nếu chọn "Sự cố tại chỗ" hoặc "Sự cố thiết bị") */}
              {reportForm.incidentCategory === 'on-site' && (
                <div>
                  <label className="block text-sm font-semibold text-gray-900 mb-2">
                    Chọn chi tiết sự cố <span className="text-red-600">*</span>
                  </label>
                  <select
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    value={reportForm.incidentType}
                    onChange={(e) => setReportForm({ ...reportForm, incidentType: e.target.value })}
                  >
                    <option value="">-- Chọn chi tiết sự cố --</option>
                    {onSiteIncidentTypes.map(type => (
                      <option key={type} value={type}>{type}</option>
                    ))}
                  </select>
                </div>
              )}

              {reportForm.incidentCategory === 'equipment' && (
                <div>
                  <label className="block text-sm font-semibold text-gray-900 mb-2">
                    Chọn chi tiết sự cố <span className="text-red-600">*</span>
                  </label>
                  <select
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    value={reportForm.incidentType}
                    onChange={(e) => setReportForm({ ...reportForm, incidentType: e.target.value })}
                  >
                    <option value="">-- Chọn chi tiết sự cố --</option>
                    {equipmentIncidentTypes.map(type => (
                      <option key={type} value={type}>{type}</option>
                    ))}
                  </select>
                </div>
              )}

              {/* Khu vực và vị trí - Chỉ hiển thị cho sự cố thiết bị và sự cố khác */}
              {(reportForm.incidentCategory === 'equipment' || reportForm.incidentCategory === 'other') && (
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-semibold text-gray-900 mb-2">
                      Khu vực <span className="text-red-600">*</span>
                    </label>
                    <select
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      value={reportForm.zone}
                      onChange={(e) => setReportForm({ ...reportForm, zone: e.target.value })}
                    >
                      <option value="">-- Chọn khu --</option>
                      <option value="A">Khu A</option>
                      <option value="B">Khu B</option>
                      <option value="C">Khu C</option>
                      <option value="D">Khu D</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-900 mb-2">
                      Số vị trí <span className="text-red-600">*</span>
                    </label>
                    <input
                      type="text"
                      placeholder="Ví dụ: 01, 02, 15..."
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      value={reportForm.spotNumber}
                      onChange={(e) => {
                        const value = e.target.value.replace(/[^0-9]/g, '');
                        setReportForm({ ...reportForm, spotNumber: value });
                      }}
                    />
                    {reportForm.zone && reportForm.spotNumber && (
                      <div className="text-xs text-gray-500 mt-1">
                        Vị trí đầy đủ: {reportForm.zone}{reportForm.spotNumber.padStart(2, '0')}
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* Mức độ nghiêm trọng */}
              <div>
                <label className="block text-sm font-semibold text-gray-900 mb-2">
                  Mức độ nghiêm trọng
                </label>
                <div className="flex gap-3">
                  <button
                    onClick={() => setReportForm({ ...reportForm, severity: 'info' })}
                    className={`flex-1 px-4 py-2 border rounded-lg transition-colors ${
                      reportForm.severity === 'info'
                        ? 'bg-blue-100 border-blue-500 text-blue-700'
                        : 'border-gray-300 text-gray-700 hover:bg-gray-50'
                    }`}
                  >
                    Thông tin
                  </button>
                  <button
                    onClick={() => setReportForm({ ...reportForm, severity: 'warning' })}
                    className={`flex-1 px-4 py-2 border rounded-lg transition-colors ${
                      reportForm.severity === 'warning'
                        ? 'bg-orange-100 border-orange-500 text-orange-700'
                        : 'border-gray-300 text-gray-700 hover:bg-gray-50'
                    }`}
                  >
                    Cảnh báo
                  </button>
                  <button
                    onClick={() => setReportForm({ ...reportForm, severity: 'critical' })}
                    className={`flex-1 px-4 py-2 border rounded-lg transition-colors ${
                      reportForm.severity === 'critical'
                        ? 'bg-red-100 border-red-500 text-red-700'
                        : 'border-gray-300 text-gray-700 hover:bg-gray-50'
                    }`}
                  >
                    Nghiêm trọng
                  </button>
                </div>
              </div>

              {/* Mô tả chi tiết */}
              <div>
                <label className="block text-sm font-semibold text-gray-900 mb-2">
                  Mô tả chi tiết <span className="text-red-600">*</span>
                </label>
                <textarea
                  rows={4}
                  placeholder="Nhập mô tả chi tiết về sự cố..."
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  value={reportForm.description}
                  onChange={(e) => setReportForm({ ...reportForm, description: e.target.value })}
                />
                <div className="text-xs text-gray-500 mt-1">
                  {reportForm.description.length}/500 ký tự
                </div>
              </div>

              {/* Upload files */}
              <div>
                <label className="block text-sm font-semibold text-gray-900 mb-2">
                  Đính kèm hình ảnh/file (tùy chọn)
                </label>
                <div className="border-2 border-dashed border-gray-300 rounded-lg p-4">
                  <input
                    type="file"
                    multiple
                    accept="image/*,.pdf"
                    onChange={handleFileUpload}
                    className="hidden"
                    id="file-upload"
                  />
                  <label
                    htmlFor="file-upload"
                    className="flex flex-col items-center cursor-pointer"
                  >
                    <Upload className="w-8 h-8 text-gray-400 mb-2" />
                    <span className="text-sm text-gray-600">Nhấp để tải lên hình ảnh hoặc file</span>
                    <span className="text-xs text-gray-500 mt-1">PNG, JPG, PDF (tối đa 5MB)</span>
                  </label>
                </div>

                {/* Danh sách file đã chọn */}
                {reportForm.attachments.length > 0 && (
                  <div className="mt-3 space-y-2">
                    {reportForm.attachments.map((file, index) => (
                      <div key={index} className="flex items-center justify-between bg-gray-50 px-3 py-2 rounded-lg">
                        <div className="flex items-center gap-2">
                          <FileText className="w-4 h-4 text-gray-500" />
                          <span className="text-sm text-gray-700">{file.name}</span>
                          <span className="text-xs text-gray-500">({(file.size / 1024).toFixed(1)} KB)</span>
                        </div>
                        <button
                          onClick={() => removeAttachment(index)}
                          className="text-red-600 hover:text-red-700"
                        >
                          <X className="w-4 h-4" />
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* Modal Footer */}
            <div className="flex justify-end gap-3 p-6 border-t border-gray-200">
              <button
                onClick={() => setShowReportModal(false)}
                className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
              >
                Hủy
              </button>
              <button
                onClick={handleSubmitReport}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                Gửi báo cáo
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Statistics Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-5 gap-4 mb-6">
        <div className="bg-white rounded-xl shadow-sm p-4 border border-gray-200">
          <div className="text-sm text-gray-600 mb-1">Tổng số lỗi</div>
          <div className="text-2xl font-bold text-gray-900">{stats.total}</div>
        </div>
        <div className="bg-white rounded-xl shadow-sm p-4 border border-gray-200">
          <div className="text-sm text-gray-600 mb-1">Chưa xử lý</div>
          <div className="text-2xl font-bold text-red-600">{stats.pending}</div>
        </div>
        <div className="bg-white rounded-xl shadow-sm p-4 border border-gray-200">
          <div className="text-sm text-gray-600 mb-1">Đang xử lý</div>
          <div className="text-2xl font-bold text-yellow-600">{stats.inProgress}</div>
        </div>
        <div className="bg-white rounded-xl shadow-sm p-4 border border-gray-200">
          <div className="text-sm text-gray-600 mb-1">Đã xử lý</div>
          <div className="text-2xl font-bold text-green-600">{stats.resolved}</div>
        </div>
        <div className="bg-white rounded-xl shadow-sm p-4 border border-gray-200">
          <div className="text-sm text-gray-600 mb-1">Nghiêm trọng</div>
          <div className="text-2xl font-bold text-red-700">{stats.critical}</div>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-xl shadow-sm p-4 border border-gray-200 mb-6">
        <div className="flex flex-col lg:flex-row gap-4">
          {/* Search */}
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              placeholder="Tìm kiếm theo vị trí, cảm biến hoặc loại lỗi..."
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>

          {/* Zone Filter */}
          <div className="flex items-center gap-2">
            <Filter className="w-5 h-5 text-gray-500" />
            <select
              className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={filterZone}
              onChange={(e) => setFilterZone(e.target.value)}
            >
              <option value="all">Tất cả khu</option>
              <option value="A">Khu A</option>
              <option value="B">Khu B</option>
              <option value="C">Khu C</option>
              <option value="D">Khu D</option>
            </select>
          </div>

          {/* Status Filter */}
          <div className="flex items-center gap-2">
            <select
              className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
            >
              <option value="all">Tất cả trạng thái</option>
              <option value="pending">Chưa xử lý</option>
              <option value="in-progress">Đang xử lý</option>
              <option value="resolved">Đã xử lý</option>
            </select>
          </div>
        </div>
      </div>

      {/* Issues List */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Mã lỗi</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Vị trí</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Cảm biến</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Loại lỗi</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Mức độ</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Trạng thái</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Báo cáo bởi</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Thời gian</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Hành động</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {loadingIssues ? (
                <tr>
                  <td colSpan={9} className="px-6 py-8 text-center text-gray-500">
                    Đang tải dữ liệu...
                  </td>
                </tr>
              ) : errorIssues ? (
                <tr>
                  <td colSpan={9} className="px-6 py-8 text-center text-red-500">
                    {errorIssues}
                  </td>
                </tr>
              ) : filteredIssues.length === 0 ? (
                <tr>
                  <td colSpan={9} className="px-6 py-8 text-center text-gray-500">
                    Không tìm thấy lỗi nào
                  </td>
                </tr>
              ) : (
                filteredIssues.map((issue) => (
                  <tr key={issue.id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-4">
                      <span className="font-mono text-sm font-semibold text-gray-900">{issue.id}</span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        <MapPin className="w-4 h-4 text-gray-500" />
                        <span className="font-semibold text-gray-900">{issue.spot}</span>
                        <span className="text-sm text-gray-500">(Khu {issue.zone})</span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className="font-mono text-xs text-gray-600">{issue.sensor}</span>
                    </td>
                    <td className="px-6 py-4">
                      <span className="text-sm text-gray-900">{issue.issueType}</span>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium border ${getSeverityColor(issue.severity)}`}>
                        {issue.severity === 'critical' && <AlertTriangle className="w-3 h-3" />}
                        {issue.severity === 'critical' && 'Nghiêm trọng'}
                        {issue.severity === 'warning' && 'Cảnh báo'}
                        {issue.severity === 'info' && 'Thông tin'}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(issue.status)}`}>
                        {issue.status === 'resolved' && <CheckCircle2 className="w-3 h-3" />}
                        {issue.status === 'in-progress' && <Clock className="w-3 h-3" />}
                        {getStatusLabel(issue.status)}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <span className="text-sm text-gray-700">{issue.reportedBy}</span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-sm text-gray-900">{issue.reportedAt}</div>
                      {issue.resolvedAt && (
                        <div className="text-xs text-green-600 mt-1">
                          Xử lý: {issue.resolvedAt}
                        </div>
                      )}
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        {issue.status === 'pending' && (isAdmin || isEmployee) && (
                          <button
                            onClick={() => handleStatusChange(issue.id, 'in-progress')}
                            className="px-3 py-1 bg-yellow-600 text-white text-xs rounded-lg hover:bg-yellow-700 transition-colors"
                          >
                            Xử lý
                          </button>
                        )}
                        {issue.status === 'in-progress' && (isAdmin || isEmployee) && (
                          <button
                            onClick={() => handleStatusChange(issue.id, 'resolved')}
                            className="px-3 py-1 bg-green-600 text-white text-xs rounded-lg hover:bg-green-700 transition-colors"
                          >
                            Hoàn tất
                          </button>
                        )}
                        {issue.status === 'resolved' && (
                          <span className="text-xs text-gray-500">
                            Bởi: {issue.resolvedBy}
                          </span>
                        )}
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Issue Details Section */}
        {filteredIssues.length > 0 && (
          <div className="border-t border-gray-200 bg-gray-50 p-6">
            <h3 className="text-sm font-semibold text-gray-900 mb-3">Chi tiết lỗi gần đây</h3>
            <div className="space-y-3">
              {filteredIssues.slice(0, 2).map((issue) => (
                <div key={issue.id} className="bg-white rounded-lg p-4 border border-gray-200">
                  <div className="flex items-start justify-between mb-2">
                    <div>
                      <span className="font-mono text-sm font-semibold text-gray-900">{issue.id}</span>
                      <span className="ml-2 text-sm text-gray-600">- {issue.spot} ({issue.issueType})</span>
                    </div>
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(issue.status)}`}>
                      {getStatusLabel(issue.status)}
                    </span>
                  </div>
                  <p className="text-sm text-gray-700 mb-2">{issue.description}</p>
                  <div className="flex items-center gap-4 text-xs text-gray-500">
                    <span>Báo cáo bởi: {issue.reportedBy}</span>
                    {issue.attachments && issue.attachments.length > 0 && (
                      <span className="flex items-center gap-1">
                        <FileText className="w-3 h-3" />
                        {issue.attachments.length} file đính kèm
                      </span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
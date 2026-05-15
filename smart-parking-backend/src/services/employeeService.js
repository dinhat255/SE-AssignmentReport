const userRepository = require('../repositories/userRepository');

// Hardcoded incidents data
let incidents = [
  {
    id: 'M001',
    spotId: 'A01',
    sensorId: 'SENSOR-A01',
    title: 'Cảm biến lỗi khu A',
    description: 'Cảm biến chỗ A01 không phản ứng',
    type: 'equipment',
    severity: 'Cảnh báo',
    status: 'Chưa xử lý',
    reportedBy: 'System',
    reportedAt: '2026-05-14 10:30',
    attachments: [],
  },
  {
    id: 'M002',
    spotId: 'B05',
    sensorId: 'SENSOR-B05',
    title: 'Barrier hỏng khu B',
    description: 'Cổng chắn không mở được',
    type: 'equipment',
    severity: 'Nghiêm trọng',
    status: 'Đang xử lý',
    reportedBy: 'Employee01',
    reportedAt: '2026-05-13 14:15',
    resolvedAt: null,
    attachments: [],
  },
  {
    id: 'M003',
    spotId: 'C08',
    sensorId: 'SENSOR-C08',
    title: 'Đèn LED hỏng',
    description: 'Đèn chiếu sáng tại C08 bị hỏng',
    type: 'equipment',
    severity: 'Cảnh báo',
    status: 'Đã xử lý',
    reportedBy: 'Employee02',
    reportedAt: '2026-05-12 08:45',
    resolvedAt: '2026-05-12 16:20',
    attachments: [],
  },
  {
    id: 'M004',
    spotId: 'D03',
    sensorId: 'SENSOR-D03',
    title: 'Sai thông tin thẻ',
    description: 'Thẻ sinh viên không được nhận diện',
    type: 'on-site',
    severity: 'Cảnh báo',
    status: 'Chưa xử lý',
    reportedBy: 'Student01',
    reportedAt: '2026-05-14 09:00',
    attachments: [],
  },
  {
    id: 'M005',
    spotId: 'A12',
    sensorId: 'SENSOR-A12',
    title: 'Camera không hoạt động',
    description: 'Camera tại khu A12 bị mất kết nối',
    type: 'equipment',
    severity: 'Nghiêm trọng',
    status: 'Đang xử lý',
    reportedBy: 'Admin',
    reportedAt: '2026-05-13 11:30',
    resolvedAt: null,
    attachments: [],
  },
];

const shifts = [];

function getProfile(userId) {
  const user = userRepository.findById(userId);
  if (!user) return null;
  return {
    id: user.id,
    fullName: user.fullName,
    email: user.email,
    department: user.department,
    phone: user.phone,
    shiftStart: '08:00',
    shiftEnd: '17:00',
  };
}

function getIncidents(params) {
  let filtered = incidents;

  // Filter theo status
  if (params.status) {
    filtered = filtered.filter((i) => i.status === params.status);
  }

  // Filter theo spotId
  if (params.spotId) {
    filtered = filtered.filter((i) => i.spotId === params.spotId);
  }

  // Phân trang
  const offset = params.offset || 0;
  const limit = params.limit || 20;
  const paginated = filtered.slice(offset, offset + limit);

  return {
    incidents: paginated,
    total: filtered.length,
  };
}

function createIncident(userId, payload) {
  // Auto generate ID
  const maxId = incidents.reduce((max, incident) => {
    const num = parseInt(incident.id.substring(1));
    return num > max ? num : max;
  }, 0);
  const newId = `M${String(maxId + 1).padStart(3, '0')}`;

  const incident = {
    id: newId,
    spotId: payload.spotId || 'N/A',
    sensorId: payload.sensorId || `SENSOR-${payload.spotId || 'N/A'}`,
    title: payload.title,
    description: payload.description,
    type: payload.type || 'other',
    severity: payload.severity === 'HIGH' ? 'Nghiêm trọng' : payload.severity === 'MEDIUM' ? 'Cảnh báo' : 'Thông tin',
    status: 'Chưa xử lý',
    reportedBy: payload.reportedBy || 'Employee',
    reportedAt: new Date().toISOString().replace('T', ' ').substring(0, 16),
    attachments: payload.attachments || [],
  };

  // Thêm vào đầu array (mới nhất ở trên)
  incidents.unshift(incident);
  return incident;
}

function updateIncidentStatus(incidentId, status) {
  const incident = incidents.find((i) => i.id === incidentId);
  if (!incident) return null;

  incident.status = status;

  if (status === 'Đã xử lý' || status === 'CLOSED' || status === 'RESOLVED') {
    incident.resolvedAt = new Date().toISOString().replace('T', ' ').substring(0, 16);
  }

  return incident;
}

function getShiftInfo(userId, date) {
  const shiftDate = date || new Date().toISOString().split('T')[0];
  return {
    employeeId: userId,
    date: shiftDate,
    shiftStart: '08:00',
    shiftEnd: '17:00',
    duties: ['Monitor parking lots', 'Check-in/check-out operations', 'Respond to incidents'],
    status: 'ACTIVE',
  };
}

module.exports = {
  getProfile,
  getIncidents,
  createIncident,
  updateIncidentStatus,
  getShiftInfo,
};
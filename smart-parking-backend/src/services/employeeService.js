const userRepository = require('../repositories/userRepository');
//const auditRepository = require('../repositories/auditLogRepository');

const incidents = [];
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
  if (params.status) filtered = filtered.filter((i) => i.status === params.status);
  if (params.spotId) filtered = filtered.filter((i) => i.spotId === params.spotId);

  const paginated = filtered.slice(
    params.offset,
    params.offset + params.limit
  );

  return {
    incidents: paginated,
    total: filtered.length,
  };
}

function createIncident(userId, payload) {
 const newId = `M${String(incidents.length + 1).padStart(3, '0')}`; 
  
  const incident = {
    id: newId,                                    
    spotId: payload.spotId,                        
    sensorId: `SENSOR-${payload.spotId}`,          
    title: payload.title,                         
    description: payload.description,
    type: payload.type,
    severity: payload.severity === 'HIGH' ? 'Nghiêm trọng' : 'Cảnh báo', 
    status: 'Chưa xử lý',                          
    reportedBy: 'Hệ thống',                        
    reportedAt: new Date().toISOString().replace('T', ' ').substring(0, 16), // Khớp cột 'Thời gian'
    attachments: payload.attachments || [],
  };

  incidents.unshift(incident); 
  return incident;
}

function updateIncidentStatus(incidentId, status) {
  const incident = incidents.find((i) => i.id === incidentId);
  if (!incident) return null;
  incident.status = status;
  if (status === 'CLOSED' || status === 'RESOLVED') {
    incident.resolvedAt = new Date().toISOString();
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

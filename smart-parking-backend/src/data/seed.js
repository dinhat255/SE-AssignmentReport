const users = require('./users.data');
const parkingSpots = require('./parkingSpots.data');
const parkingSessions = require('./parkingSessions.data');
const subscriptions = require('./subscriptions.data');
const lecturerQuotas = require('./lecturerQuotas.data');
const payments = require('./payments.data');
const auditLogs = require('./auditLogs.data');

function replaceAll(target, items) {
  target.splice(0, target.length, ...items);
}

function buildParkingSpots() {
  const zones = ['A', 'B', 'C', 'D'];
  return zones.flatMap((zone) =>
    Array.from({ length: 10 }, (_, index) => {
      const id = `${zone}${String(index + 1).padStart(2, '0')}`;
      const isOccupied = ['B07', 'C02'].includes(id);
      const isMaintenance = ['D10'].includes(id);
      return {
        id,
        zone,
        status: isMaintenance ? 'MAINTENANCE' : isOccupied ? 'OCCUPIED' : 'AVAILABLE',
        sensorId: `SENSOR-${id}`,
        occupiedByCurrentUser: false,
      };
    })
  );
}

function resetData() {
  replaceAll(users, [
    {
      id: 'u-student-001',
      fullName: 'Nguyen Van Sinh Vien',
      email: 'student@hcmut.edu.vn',
      password: 'student123',
      role: 'student',
      cardId: 'STU-CARD-001',
      vehiclePlate: '59A1-12345',
      balance: 100000,
      department: 'Faculty of Computer Science and Engineering',
      phone: '0123456789',
    },
    {
      id: 'u-lecturer-001',
      fullName: 'Tran Van Giang Vien',
      email: 'lecturer@hcmut.edu.vn',
      password: 'lecturer123',
      role: 'lecturer',
      cardId: 'LEC-CARD-001',
      vehiclePlate: '59B1-54321',
      department: 'Faculty of Computer Science and Engineering',
      phone: '0987654321',
    },
    {
      id: 'u-admin-001',
      fullName: 'Nguyen Van Quan Tri',
      email: 'admin@hcmut.edu.vn',
      password: 'admin123',
      role: 'admin',
      department: 'Parking Operation Center',
    },
    {
      id: 'u-employee-001',
      fullName: 'Le Thi Nhan Vien',
      email: 'employee@hcmut.edu.vn',
      password: 'employee123',
      role: 'employee',
      department: 'Parking Operations',
    },
  ]);

  replaceAll(parkingSpots, buildParkingSpots());

  replaceAll(parkingSessions, [
    {
      sessionId: 'ps-001',
      userId: 'u-student-001',
      cardId: 'STU-CARD-001',
      slot: 'B07',
      date: '2026-05-11',
      entryTime: '2026-05-11T07:30:00.000Z',
      exitTime: '2026-05-11T11:20:00.000Z',
      timeIn: '07:30',
      timeOut: '11:20',
      duration: '3h50m',
      fee: 5000,
      status: 'COMPLETED',
      cardType: 'Thang',
    },
    {
      sessionId: 'ps-002',
      userId: 'u-student-001',
      cardId: 'STU-CARD-001',
      slot: 'A03',
      date: '2026-05-10',
      entryTime: '2026-05-10T08:05:00.000Z',
      exitTime: '2026-05-10T10:15:00.000Z',
      timeIn: '08:05',
      timeOut: '10:15',
      duration: '2h10m',
      fee: 0,
      status: 'COMPLETED',
      cardType: 'Thang',
    },
    {
      sessionId: 'ps-lecturer-001',
      userId: 'u-lecturer-001',
      cardId: 'LEC-CARD-001',
      slot: 'C04',
      date: '2026-05-09',
      entryTime: '2026-05-09T07:45:00.000Z',
      exitTime: '2026-05-09T16:30:00.000Z',
      timeIn: '07:45',
      timeOut: '16:30',
      duration: '8h45m',
      fee: 0,
      status: 'COMPLETED',
      cardType: 'Lecturer',
    },
  ]);

  replaceAll(subscriptions, [
    {
      id: 'sub-student-001',
      userId: 'u-student-001',
      status: 'ACTIVE',
      month: 5,
      year: 2026,
      validFrom: '2026-05-01',
      validTo: '2026-05-31',
      amount: 50000,
    },
  ]);

  replaceAll(lecturerQuotas, [
    {
      userId: 'u-lecturer-001',
      month: 5,
      year: 2026,
      monthlyLimit: 50,
      currentUsage: 15,
      remaining: 35,
    },
  ]);

  replaceAll(payments, []);
  replaceAll(auditLogs, []);
}

resetData();

module.exports = { resetData };

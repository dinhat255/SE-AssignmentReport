import { useEffect, useMemo, useState } from 'react';
import { Filter, RefreshCw, Car, Clock, DollarSign } from 'lucide-react';
import { getStoredUserId } from '../../api/client';
import { parkingApi, type ParkingMapResponse, type ParkingSpotDto } from '../../api/parkingApi';

type Zone = 'A' | 'B' | 'C' | 'D';
type SlotStatus = 'available' | 'full' | 'yours';

interface ParkingSlot {
  id: string;
  status: SlotStatus;
}

export function Parking() {
  const [selectedZone, setSelectedZone] = useState<Zone>('A');
  const [selectedSlot, setSelectedSlot] = useState<string | null>('A04');

  const fallbackParkingSlotsByZone = useMemo<Record<Zone, ParkingSlot[][]>>(() => {
    const rows = ['A', 'B', 'C', 'D'] as const;
    const cols = 10;

    const buildZoneSlots = (zone: Zone) => {
      const zoneIndex = zone.charCodeAt(0) - 64;

      return rows.map((row, rowIndex) => {
        return Array.from({ length: cols }, (_, colIndex) => {
          const slotId = `${row}${String(colIndex + 1).padStart(2, '0')}`;

          if (zone === 'A' && slotId === 'A04') {
            return { id: slotId, status: 'yours' as SlotStatus };
          }

          const score = zoneIndex + rowIndex + colIndex;
          const status: SlotStatus = score % 4 === 0 ? 'full' : 'available';

          return { id: slotId, status };
        });
      });
    };

    return {
      A: buildZoneSlots('A'),
      B: buildZoneSlots('B'),
      C: buildZoneSlots('C'),
      D: buildZoneSlots('D'),
    };
  }, []);

  const [apiSlotsByZone, setApiSlotsByZone] = useState<Record<Zone, ParkingSlot[][]> | null>(null);
  const parkingSlotsByZone = apiSlotsByZone || fallbackParkingSlotsByZone;
  const parkingSlots = parkingSlotsByZone[selectedZone];
  const zones: Zone[] = ['A', 'B', 'C', 'D'];

  const selectedSlotData = selectedSlot
    ? parkingSlots.flat().find(slot => slot.id === selectedSlot)
    : null;

  // Simulated scanner state (for UI preview)
  const [scannedType, setScannedType] = useState<'student' | 'temporary' | null>(null);
  const [scannedData, setScannedData] = useState<Record<string, string> | null>(null);
  const [checkedIn, setCheckedIn] = useState(false);
  const [checkInTime, setCheckInTime] = useState<string | null>(null);
  const [checkOutTime, setCheckOutTime] = useState<string | null>(null);
  const [assignedSlot, setAssignedSlot] = useState<string | null>(null);
  const [activeSessionId, setActiveSessionId] = useState<string | null>(null);

  const mapSpotStatus = (spot?: ParkingSpotDto): SlotStatus => {
    if (spot?.occupiedByCurrentUser) return 'yours';
    return spot?.status === 'AVAILABLE' ? 'available' : 'full';
  };

  const buildSlotsFromApi = (map: ParkingMapResponse): Record<Zone, ParkingSlot[][]> => {
    const zones: Zone[] = ['A', 'B', 'C', 'D'];
    const rows = ['A', 'B', 'C', 'D'] as const;
    return zones.reduce((acc, zone) => {
      acc[zone] = rows.map((row) =>
        Array.from({ length: 10 }, (_, colIndex) => {
          const id = `${row}${String(colIndex + 1).padStart(2, '0')}`;
          const spot = map.spots.find((item) => item.zone === zone && item.id === id);
          return { id, status: mapSpotStatus(spot) };
        })
      );
      return acc;
    }, {} as Record<Zone, ParkingSlot[][]>);
  };

  const loadParkingMap = async () => {
    try {
      const map = await parkingApi.getMap();
      setApiSlotsByZone(buildSlotsFromApi(map));
    } catch (err) {
      console.warn('Parking API unavailable, keeping local parking map.', err);
      setApiSlotsByZone(null);
    }
  };

  useEffect(() => {
    void loadParkingMap();
  }, []);

  const generateRandomSlot = () => {
    const zones = ['A', 'B', 'C', 'D'];
    const zone = zones[Math.floor(Math.random() * zones.length)];
    const number = String(Math.floor(Math.random() * 10) + 1).padStart(2, '0');
    return `${zone}${number}`;
  };

  const simulateStudentScan = () => {
    setScannedType('student');
    setScannedData({
      name: 'Nguyễn Văn A',
      mssv: 'B1234567',
      plate: '30A-123.45',
      vehicleType: 'Xe máy',
    });
    setCheckedIn(false);
    setCheckInTime(null);
    setCheckOutTime(null);
    setAssignedSlot(null);
  };

  const simulateTemporaryScan = () => {
    setScannedType('temporary');
    setScannedData({
      cardId: 'TMP-998877',
      plate: '29B-987.65',
    });
    setCheckedIn(false);
    setCheckInTime(null);
    setCheckOutTime(null);
    setAssignedSlot(null);
  };

  const applyLocalCheckIn = (slot?: string, sessionId?: string, timeIn?: string) => {
    setCheckedIn(true);
    setCheckInTime(timeIn || new Date().toLocaleTimeString('vi-VN'));
    setCheckOutTime(null);
    setAssignedSlot(slot || generateRandomSlot());
    setActiveSessionId(sessionId || null);
  };

  const handleCheckIn = async () => {
    try {
      const result = await parkingApi.checkIn({
        userId: getStoredUserId(),
        cardId: scannedData?.mssv,
        visitorCardId: scannedData?.cardId,
        vehiclePlate: scannedData?.plate,
      });
      applyLocalCheckIn(result.assignedSlot, result.sessionId, result.timeIn);
      void loadParkingMap();
    } catch (err) {
      console.warn('Check-in API unavailable, falling back to local state.', err);
      applyLocalCheckIn();
    }
  };

  const handleCheckOut = async () => {
    try {
      const result = await parkingApi.checkOut({
        sessionId: activeSessionId || undefined,
        cardId: scannedData?.mssv,
        visitorCardId: scannedData?.cardId,
      });
      setCheckOutTime(result.timeOut || new Date().toLocaleTimeString('vi-VN'));
      void loadParkingMap();
    } catch (err) {
      console.warn('Check-out API unavailable, falling back to local state.', err);
      setCheckOutTime(new Date().toLocaleTimeString('vi-VN'));
    }
    setCheckedIn(false);
    setAssignedSlot(null);
    setActiveSessionId(null);
  };

  return (
    <div className="p-6">
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900 mb-2">Tình trạng bãi</h1>
        <p className="text-gray-600">Tìm và chọn chỗ đậu xe còn trống.</p>
      </div>

      <div className="flex justify-between items-center mb-6">
        {/* Zone Tabs */}
        <div className="flex gap-2">
          {zones.map(zone => (
            <button
              key={zone}
              onClick={() => setSelectedZone(zone)}
              className={`px-6 py-2 rounded-lg font-medium transition-colors ${
                selectedZone === zone
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
              }`}
            >
              Khu {zone}
            </button>
          ))}
        </div>

        {/* Actions */}
        <div className="flex gap-3">
          <button onClick={() => void loadParkingMap()} className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
            <RefreshCw className="w-4 h-4" />
            Làm mới
          </button>
        </div>
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        {/* Parking Grid */}
        <div className="lg:col-span-2 bg-white rounded-xl shadow-sm p-6 border border-gray-200">
          <div className="space-y-3">
            {/* Column Numbers */}
            <div className="flex gap-2 ml-12 mb-2">
              {Array.from({ length: 10 }, (_, i) => (
                <div key={i} className="w-14 text-center text-sm font-medium text-gray-600">
                  {String(i + 1).padStart(2, '0')}
                </div>
              ))}
            </div>

            {/* Parking Slots */}
            {parkingSlots.map((row, rowIndex) => (
              <div key={rowIndex} className="flex gap-2">
                {/* Row Label */}
                <div className="w-8 flex items-center justify-center text-lg font-bold text-gray-700">
                  {String.fromCharCode(65 + rowIndex)}
                </div>
                
                {row.map((slot) => (
                  <button
                    key={slot.id}
                    onClick={() => setSelectedSlot(slot.id)}
                    disabled={slot.status === 'full'}
                    className={`w-14 h-16 rounded-lg flex flex-col items-center justify-center transition-all relative ${
                      slot.status === 'available'
                        ? 'bg-green-100 hover:bg-green-200 cursor-pointer border-2 border-green-300'
                        : slot.status === 'full'
                        ? 'bg-red-100 cursor-not-allowed border-2 border-red-300'
                        : 'bg-blue-100 border-2 border-blue-500'
                    } ${
                      selectedSlot === slot.id ? 'ring-4 ring-blue-400 scale-105' : ''
                    }`}
                  >
                    <Car
                      className={`w-6 h-6 ${
                        slot.status === 'available'
                          ? 'text-green-600'
                          : slot.status === 'full'
                          ? 'text-red-600'
                          : 'text-blue-600'
                      }`}
                    />
                  </button>
                ))}
              </div>
            ))}
          </div>
        </div>

        {/* Right Panel: Scanner / Slot Details / Legend */}
        <div className="space-y-6">
          {/* Scanner Controls (simulation) */}
          <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-200">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-semibold text-gray-900">Kết quả quét / Thao tác</h3>
              <div className="flex gap-2">
                <button onClick={simulateStudentScan} className="px-3 py-1 bg-green-600 text-white rounded hover:bg-green-700">Quét người dùng</button>
                <button onClick={simulateTemporaryScan} className="px-3 py-1 bg-yellow-500 text-white rounded hover:bg-yellow-600">Quét khách</button>
              </div>
            </div>

            {!scannedType && (
              <p className="text-gray-600">Chưa có dữ liệu quét. Nhấn một trong các nút để mô phỏng kết quả.</p>
            )}

            {scannedType === 'student' && scannedData && (
              <div className="space-y-3">
                <div className="text-sm text-gray-500">Loại thẻ: <strong className="text-gray-800">Sinh viên</strong></div>
                <div className="text-lg font-semibold text-gray-900">{scannedData.name}</div>
                <div className="text-sm text-gray-600">MSSV: {scannedData.mssv}</div>
                <div className="text-sm text-gray-600">Biển số: {scannedData.plate}</div>
                <div className="text-sm text-gray-600">Loại phương tiện: {scannedData.vehicleType}</div>

                {/* Time In/Out Section */}
                <div className="bg-blue-50 rounded-lg p-3 space-y-2">
                  {checkInTime && (
                    <div className="flex items-center gap-2 text-sm">
                      <Clock className="w-4 h-4 text-blue-600" />
                      <span className="text-gray-600">Giờ vào:</span>
                      <span className="font-semibold text-gray-900">{checkInTime}</span>
                    </div>
                  )}
                  {checkOutTime && (
                    <div className="flex items-center gap-2 text-sm">
                      <Clock className="w-4 h-4 text-red-600" />
                      <span className="text-gray-600">Giờ ra:</span>
                      <span className="font-semibold text-gray-900">{checkOutTime}</span>
                    </div>
                  )}
                </div>

                {/* Assigned Slot Display */}
                {assignedSlot && checkedIn && (
                  <div className="bg-green-50 border border-green-200 rounded-lg p-3">
                    <div className="text-sm text-gray-600 mb-1">Vị trí đậu xe</div>
                    <div className="text-2xl font-bold text-green-600">{assignedSlot}</div>
                  </div>
                )}

                <div className="flex gap-2 mt-4">
                  {!checkedIn ? (
                    <button onClick={handleCheckIn} className="w-full py-2 rounded-lg font-medium bg-blue-600 text-white hover:bg-blue-700">Check in</button>
                  ) : (
                    <button onClick={handleCheckOut} className="w-full py-2 rounded-lg font-medium bg-red-600 text-white hover:bg-red-700">Check out</button>
                  )}
                </div>

                <div className="text-sm text-gray-500">Trạng thái: <strong className="text-gray-800">{checkedIn ? 'Đã vào' : 'Chưa vào'}</strong></div>
              </div>
            )}

            {scannedType === 'temporary' && scannedData && (
              <div className="space-y-3">
                <div className="text-sm text-gray-500">Loại thẻ: <strong className="text-gray-800">Tạm thời (Khách)</strong></div>
                <div className="text-lg font-semibold text-gray-900">Mã thẻ: {scannedData.cardId}</div>
                <div className="text-sm text-gray-600">Biển số: {scannedData.plate}</div>

                {/* Time In/Out Section */}
                <div className="bg-yellow-50 rounded-lg p-3 space-y-2">
                  {checkInTime && (
                    <div className="flex items-center gap-2 text-sm">
                      <Clock className="w-4 h-4 text-yellow-600" />
                      <span className="text-gray-600">Giờ vào:</span>
                      <span className="font-semibold text-gray-900">{checkInTime}</span>
                    </div>
                  )}
                  {checkOutTime && (
                    <div className="flex items-center gap-2 text-sm">
                      <Clock className="w-4 h-4 text-red-600" />
                      <span className="text-gray-600">Giờ ra:</span>
                      <span className="font-semibold text-gray-900">{checkOutTime}</span>
                    </div>
                  )}
                </div>

                {/* Payment Fee Section */}
                {!checkedIn && (
                  <div className="bg-red-50 border border-red-200 rounded-lg p-3">
                    <div className="flex items-center gap-2 text-sm mb-2">
                      <DollarSign className="w-4 h-4 text-red-600" />
                      <span className="font-semibold text-gray-900">Thanh toán tại chỗ</span>
                    </div>
                    <div className="text-lg font-bold text-red-600">50,000đ</div>
                    <div className="text-xs text-gray-600 mt-1">Phí đậu xe tạm thời (khách)</div>
                  </div>
                )}

                {/* Assigned Slot Display */}
                {assignedSlot && checkedIn && (
                  <div className="bg-green-50 border border-green-200 rounded-lg p-3">
                    <div className="text-sm text-gray-600 mb-1">Vị trí đậu xe</div>
                    <div className="text-2xl font-bold text-green-600">{assignedSlot}</div>
                  </div>
                )}

                <div className="flex gap-2 mt-4">
                  {!checkedIn ? (
                    <button onClick={handleCheckIn} className="w-full py-2 rounded-lg font-medium bg-blue-600 text-white hover:bg-blue-700">Check in</button>
                  ) : (
                    <button onClick={handleCheckOut} className="w-full py-2 rounded-lg font-medium bg-red-600 text-white hover:bg-red-700">Check out</button>
                  )}
                </div>

                <div className="text-sm text-gray-500">Ghi chú: {checkedIn ? 'Khách thanh toán tiền vé tại quầy khi ra bãi.' : 'Nhấn Check in để vào bãi.'}</div>
              </div>
            )}
          </div>

          {/* Legend */}
          <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-200">
            <h3 className="font-semibold text-gray-900 mb-4">Chú thích</h3>
            
            <div className="space-y-3">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 bg-green-100 border-2 border-green-300 rounded flex items-center justify-center">
                  <Car className="w-5 h-5 text-green-600" />
                </div>
                <span className="text-gray-700">Còn trống</span>
              </div>
              
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 bg-red-100 border-2 border-red-300 rounded flex items-center justify-center">
                  <Car className="w-5 h-5 text-red-600" />
                </div>
                <span className="text-gray-700">Đã đầy</span>
              </div>
              
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 bg-blue-100 border-2 border-blue-500 rounded flex items-center justify-center">
                  <Car className="w-5 h-5 text-blue-600" />
                </div>
                <span className="text-gray-700">Chỗ của bạn</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

import { useEffect, useState } from 'react';
import { Link } from 'react-router';
import { Car, Calendar, CreditCard, ArrowRight, Clock, CheckCircle2 } from 'lucide-react';
import { getLoginFrequency, getParkingMap } from '../../../mocks/mockData';
import { getStoredRole, getStoredUserId } from '../../api/client';
import { lecturerApi, type LecturerQuota } from '../../api/lecturerApi';
import { parkingApi, type ParkingMapResponse } from '../../api/parkingApi';
import { studentApi, type StudentProfile } from '../../api/studentApi';

type ParkingSlotStatus = 'available' | 'full';

export function Dashboard() {
  const accountRole = getStoredRole('student');
  const isAdmin = accountRole === 'admin';
  const isEmployee = accountRole === 'employee';
  const isLecturer = accountRole === 'lecturer';
  const isStudent = accountRole === 'student';

  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [studentProfile, setStudentProfile] = useState<StudentProfile | null>(null);
  const [lecturerQuota, setLecturerQuota] = useState<LecturerQuota | null>(null);
  const [parkingData, setParkingData] = useState({
    available: 120,
    total: 200,
    percentage: 60,
  });

  const [parkingSlots, setParkingSlots] = useState<ParkingSlotStatus[][]>([]);

  const walletBalance = studentProfile?.walletBalance ?? 20000;
  const subscriptionExpiry =
    studentProfile?.subscription?.validTo ||
    studentProfile?.subscription?.expiresAt ||
    '30/04/2026';
  const lecturerUsed = lecturerQuota?.currentUsage ?? 15;
  const lecturerLimit = lecturerQuota?.monthlyLimit ?? 50;
  const lecturerPercent = lecturerLimit > 0 ? Math.min(100, (lecturerUsed / lecturerLimit) * 100) : 0;

  const mapParkingSlots = (map: ParkingMapResponse): ParkingSlotStatus[][] => {
    const rows = ['A', 'B', 'C', 'D'];
    return rows.map((row) =>
      Array.from({ length: 10 }, (_, colIndex) => {
        const id = `${row}${String(colIndex + 1).padStart(2, '0')}`;
        const spot = map.spots.find((item) => item.id === id);
        return spot?.status === 'AVAILABLE' ? 'available' : 'full';
      })
    );
  };

  useEffect(() => {
    let mounted = true;
    (async () => {
      try {
        try {
          const map = await parkingApi.getMap();
          if (!mounted) return;
          setParkingSlots(mapParkingSlots(map));
          if (map.summary) {
            setParkingData({
              available: map.summary.available,
              total: map.summary.total,
              percentage: map.summary.total ? Math.round((map.summary.available / map.summary.total) * 100) : 0,
            });
          }
        } catch (err) {
          console.warn('Parking API unavailable, falling back to mock dashboard map.', err);
          const map = await getParkingMap();
          if (mounted) setParkingSlots(map as any);
        }
      } catch (err) {
        if (mounted) setError('Không lấy được sơ đồ bãi đậu xe.');
      }
    })();
    return () => { mounted = false; };
  }, []);

  useEffect(() => {
    let mounted = true;
    (async () => {
      try {
        if (isStudent) {
          const profile = await studentApi.getProfile();
          if (mounted) setStudentProfile(profile);
        } else if (isLecturer) {
          const quota = await lecturerApi.getQuota(getStoredUserId());
          if (mounted) setLecturerQuota(quota);
        }
      } catch (err) {
        console.warn('Role dashboard API unavailable, keeping hardcoded dashboard values.', err);
      }
    })();
    return () => { mounted = false; };
  }, [isLecturer, isStudent]);

  const [loginFrequency, setLoginFrequency] = useState<{ month: string; count: number }[]>([]);
  const [maxCount, setMaxCount] = useState(1);

  useEffect(() => {
    let mounted = true;
    (async () => {
      try {
        const data = await getLoginFrequency({ period: 'monthly', role: accountRole });
        if (!mounted) return;
        setLoginFrequency(data);
        setMaxCount(Math.max(...data.map((d) => d.count), 1));
      } catch (err) {
        if (mounted) setError('Không lấy được dữ liệu tần suất đăng nhập.');
      }
    })();
    return () => { mounted = false; };
  }, [accountRole]);

  useEffect(() => {
    const timer = window.setTimeout(() => {
      setIsLoading(false);
    }, 350);

    return () => window.clearTimeout(timer);
  }, []);

  const roleCard = isAdmin
    ? {
        title: 'Quản trị viên',
        description: 'Quyền truy cập đầy đủ vào hệ thống',
        iconClass: 'bg-blue-100 text-blue-600',
        cardClass: 'bg-white rounded-xl shadow-sm p-6 border border-gray-200',
      }
    : isEmployee
      ? {
          title: 'Nhân viên vận hành',
          description: 'Theo dõi và hỗ trợ bãi đậu xe',
          iconClass: 'bg-emerald-100 text-emerald-600',
          cardClass: 'bg-white rounded-xl shadow-sm p-6 border border-gray-200',
        }
      : isLecturer
        ? {
            title: 'Giảng viên',
            description: 'Giới hạn truy cập hàng tháng',
            iconClass: 'bg-purple-100 text-purple-600',
            cardClass: 'bg-gradient-to-br from-purple-50 to-blue-50 rounded-xl shadow-sm p-6 border border-purple-200',
          }
        : {
            title: 'Sinh viên',
            description: 'Đang hoạt động với gói tháng',
            iconClass: 'bg-orange-100 text-orange-600',
            cardClass: 'bg-white rounded-xl shadow-sm p-6 border border-gray-200',
          };

  return (
    <div className="p-6">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900 mb-1">Dashboard</h1>
        <p className="text-gray-600">Chào mừng trở lại! Đây là tổng quan bãi đậu xe của bạn.</p>
      </div>

      {error && (
        <div className="mb-6 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          {error}
        </div>
      )}

      {!isAdmin && !isEmployee && (
        isLoading ? (
          <div className="flex justify-end mb-4">
            <div className="h-9 w-56 rounded-full bg-gray-200 animate-pulse" />
          </div>
        ) : (
          <div className="flex justify-end mb-4">
            <div className="flex items-center gap-2 px-3 py-1 bg-yellow-50 border border-yellow-200 rounded-full text-xs shadow-sm">
              <CreditCard className="w-3 h-3 text-yellow-600" />
              <span className="text-gray-600">Ví:</span>
              <span className="font-semibold text-gray-900">{walletBalance.toLocaleString()}đ</span>
              <button className="ml-2 px-2 py-0.5 bg-blue-600 text-white rounded-full hover:bg-blue-700 transition-colors">
                Nạp thêm
              </button>
            </div>
          </div>
        )
      )}

      <div className={`grid grid-cols-1 md:grid-cols-2 ${isAdmin || isEmployee ? 'xl:grid-cols-2' : 'xl:grid-cols-3'} gap-6 mb-6`}>
        {isLoading ? (
          <>
            <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-200 animate-pulse">
              <div className="h-4 w-24 bg-gray-200 rounded mb-4" />
              <div className="h-8 w-40 bg-gray-200 rounded mb-2" />
              <div className="h-4 w-20 bg-gray-200 rounded" />
            </div>
            <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-200 animate-pulse">
              <div className="h-4 w-24 bg-gray-200 rounded mb-4" />
              <div className="h-8 w-32 bg-gray-200 rounded mb-2" />
              <div className="h-4 w-28 bg-gray-200 rounded" />
            </div>
            <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-200 animate-pulse">
              <div className="h-4 w-24 bg-gray-200 rounded mb-4" />
              <div className="h-8 w-32 bg-gray-200 rounded mb-2" />
              <div className="h-4 w-20 bg-gray-200 rounded" />
            </div>
          </>
        ) : (
          <>
            <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-200">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                  <Car className="w-6 h-6 text-green-600" />
                </div>
                <div>
                  <div className="text-sm text-gray-600">Chỗ còn trống</div>
                  <div className="text-2xl font-bold text-gray-900">
                    {parkingData.available} / {parkingData.total}
                  </div>
                </div>
              </div>
              <div className="text-sm text-gray-600">{parkingData.percentage}% còn trống</div>
            </div>

            <div className={roleCard.cardClass}>
              <div className="flex items-center gap-3 mb-4">
                <div className={`w-12 h-12 rounded-lg flex items-center justify-center ${roleCard.iconClass}`}>
                  <CheckCircle2 className="w-6 h-6" />
                </div>
                <div>
                  <div className="text-sm text-gray-600">Vai trò</div>
                  <div className="text-2xl font-bold text-gray-900">{roleCard.title}</div>
                </div>
              </div>
              <div className="text-sm text-gray-600">{roleCard.description}</div>
            </div>

            {isStudent ? (
              <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-200">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                    <CreditCard className="w-6 h-6 text-blue-600" />
                  </div>
                  <div>
                    <div className="text-sm text-gray-600">Gói tháng</div>
                    <div className="text-2xl font-bold text-gray-900">Còn hiệu lực</div>
                  </div>
                </div>

                <div className="flex items-center justify-between text-sm text-gray-600">
                  <span>Đến {subscriptionExpiry}</span>
                  <button className="px-3 py-1 text-xs bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
                    Gia hạn
                  </button>
                </div>
              </div>
            ) : isLecturer ? (
              <div className="bg-gradient-to-br from-purple-50 to-blue-50 rounded-xl shadow-sm p-6 border border-purple-200">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
                    <CheckCircle2 className="w-6 h-6 text-purple-600" />
                  </div>
                  <div>
                    <div className="text-sm text-gray-600">Giới hạn truy cập</div>
                    <div className="text-2xl font-bold text-purple-600">{lecturerUsed} / {lecturerLimit}</div>
                  </div>
                </div>

                <div className="text-sm text-purple-600 mb-2">đã sử dụng</div>

                <div className="w-full bg-purple-200 rounded-full h-2">
                  <div className="bg-purple-600 h-2 rounded-full" style={{ width: `${lecturerPercent}%` }} />
                </div>
              </div>
            ) : (
              <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-200">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-12 h-12 bg-emerald-100 rounded-lg flex items-center justify-center">
                    <CheckCircle2 className="w-6 h-6 text-emerald-600" />
                  </div>
                  <div>
                    <div className="text-sm text-gray-600">Hệ thống</div>
                    <div className="text-2xl font-bold text-gray-900">Sẵn sàng</div>
                  </div>
                </div>
                <div className="text-sm text-gray-600">Thông tin dành cho quản trị viên hoặc nhân viên vận hành.</div>
              </div>
            )}
          </>
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-200">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-lg font-semibold text-gray-900">Sơ đồ bãi đậu xe</h2>
            <div className="flex gap-4 text-sm">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 bg-green-400 rounded" />
                <span className="text-gray-600">Trống</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 bg-red-400 rounded" />
                <span className="text-gray-600">Đầy</span>
              </div>
            </div>
          </div>

          {isLoading ? (
            <div className="space-y-2 animate-pulse">
              <div className="h-6 w-40 bg-gray-200 rounded mb-3" />
              {Array.from({ length: 4 }, (_, rowIndex) => (
                <div key={rowIndex} className="flex gap-2">
                  <div className="w-8 h-10 bg-gray-200 rounded" />
                  {Array.from({ length: 10 }, (_, colIndex) => (
                    <div key={colIndex} className="w-10 h-10 bg-gray-200 rounded-lg" />
                  ))}
                </div>
              ))}
            </div>
          ) : (
            <div className="space-y-2">
              <div className="flex gap-2 text-xs text-gray-600 mb-2">
                <div className="w-8" />
                {Array.from({ length: 10 }, (_, i) => (
                  <div key={i} className="w-10 text-center">
                    {String(i + 1).padStart(2, '0')}
                  </div>
                ))}
              </div>

              {parkingSlots.map((row, rowIndex) => (
                <div key={rowIndex} className="flex gap-2">
                  <div className="w-8 flex items-center justify-center text-sm font-semibold text-gray-700">
                    {String.fromCharCode(65 + rowIndex)}
                  </div>
                  {row.map((status, colIndex) => (
                    <div
                      key={colIndex}
                      className={`w-10 h-10 rounded-lg flex items-center justify-center transition-all ${
                        status === 'available'
                          ? 'bg-green-400 hover:bg-green-500 cursor-pointer'
                          : 'bg-red-400 cursor-not-allowed'
                      }`}
                    >
                      <Car className="w-5 h-5 text-white" />
                    </div>
                  ))}
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="space-y-6">
          <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-200">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-lg font-semibold text-gray-900">Tần suất đăng nhập (theo tháng)</h2>
              <button className="text-sm text-blue-600 hover:text-blue-700">Tháng này</button>
            </div>

            {isLoading ? (
              <div className="h-40 border-l-2 border-b-2 border-gray-300 pl-2 pb-2 flex items-end justify-around gap-3 animate-pulse">
                {Array.from({ length: 5 }, (_, index) => (
                  <div key={index} className="flex-1 flex flex-col items-center gap-2 h-full justify-end">
                    <div className="h-4 w-6 bg-gray-200 rounded" />
                    <div className="w-full bg-gray-200 rounded-t-lg min-h-[10px]" style={{ height: `${20 + index * 10}%` }} />
                    <div className="h-3 w-10 bg-gray-200 rounded" />
                  </div>
                ))}
              </div>
            ) : (
              <div className="flex items-end justify-around gap-2 h-40 border-l-2 border-b-2 border-gray-300 pl-2 pb-2 overflow-x-auto">
                {loginFrequency.map((data, index) => (
                  <div key={index} className="min-w-[56px] flex-1 flex flex-col items-center gap-2 h-full justify-end">
                    <div className="text-xs font-bold text-gray-900">{data.count}</div>
                    <div
                      className="w-full bg-blue-500 rounded-t-lg transition-all hover:bg-blue-600 min-h-[10px]"
                      style={{ height: `${(data.count / maxCount) * 80}%` }}
                    />
                    <div className="text-xs text-gray-600">{data.month}</div>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-200">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-lg font-semibold text-gray-900">Truy cập nhanh</h2>
              <button className="text-sm text-blue-600 hover:text-blue-700">Xem tất cả</button>
            </div>

            <div className="space-y-3">
              <Link
                to="/dashboard/parking"
                className="flex items-center justify-between p-3 hover:bg-gray-50 rounded-lg transition-colors"
              >
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                    <Car className="w-5 h-5 text-blue-600" />
                  </div>
                  <span className="font-medium text-gray-900">Tìm chỗ đậu</span>
                </div>
                <ArrowRight className="w-5 h-5 text-gray-400" />
              </Link>

              <Link
                to="/dashboard/history"
                className="flex items-center justify-between p-3 hover:bg-gray-50 rounded-lg transition-colors"
              >
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
                    <Clock className="w-5 h-5 text-purple-600" />
                  </div>
                  <span className="font-medium text-gray-900">Lịch sử của tôi</span>
                </div>
                <ArrowRight className="w-5 h-5 text-gray-400" />
              </Link>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-200 mt-6">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-lg font-semibold text-gray-900">Hoạt động gần đây</h2>
          <button className="text-sm text-blue-600 hover:text-blue-700">Xem tất cả</button>
        </div>

        <div className="space-y-3">
          <div className="flex items-center justify-between py-3 border-b border-gray-100">
            <div className="flex items-center gap-3">
              <div className="w-2 h-2 bg-green-500 rounded-full" />
              <div>
                <div className="font-medium text-gray-900">Đã vào bãi</div>
                <div className="text-sm text-gray-600">Chỗ: A04, 08:00 AM</div>
              </div>
            </div>
            <div className="text-sm text-gray-600">Hôm nay</div>
          </div>

          <div className="flex items-center justify-between py-3 border-b border-gray-100">
            <div className="flex items-center gap-3">
              <div className="w-2 h-2 bg-blue-500 rounded-full" />
              <div>
                <div className="font-medium text-gray-900">Thanh toán</div>
                <div className="text-sm text-gray-600">Hoàn thành: 50,000 VND</div>
              </div>
            </div>
            <div className="text-sm text-gray-600">01/04</div>
          </div>

          <div className="flex items-center justify-between py-3">
            <div className="flex items-center gap-3">
              <div className="w-2 h-2 bg-red-500 rounded-full" />
              <div>
                <div className="font-medium text-gray-900">Đã ra khỏi bãi</div>
                <div className="text-sm text-gray-600">Chỗ: B07, 05:30 PM</div>
              </div>
            </div>
            <div className="text-sm text-gray-600">01/04</div>
          </div>
        </div>
      </div>
    </div>
  );
}

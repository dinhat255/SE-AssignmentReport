import { useEffect, useState } from 'react';
import { Link } from 'react-router';
import { Calendar, ArrowDownToLine, ArrowUpFromLine, AlertTriangle } from 'lucide-react';
import { getLoginFrequency, getEntryHistory } from '../../../mocks/mockData';
import { getLoginFrequencyFromStoredLogins, getStoredRole, getStoredUserId } from '../../api/client';
import { lecturerApi } from '../../api/lecturerApi';

export function LoginFrequency() {
  const accountRole = getStoredRole('student');
  const isLecturer = accountRole === 'lecturer';
  const isStudent = accountRole === 'student';
  const allowed = isLecturer || isStudent;

  const [loginFrequency, setLoginFrequency] = useState<{ month: string; count: number }[]>([]);
  const [entryHistory, setEntryHistory] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // Render yearly view with months as columns, mock for Tháng 1..4
    let mounted = true;
    (async () => {
      try {
        setLoading(true);

        // Build 12 months: 1..4 = mock, 5 = current/stored count, 6..12 = 0
        const now = new Date();
        const currentMonth = now.getMonth() + 1; // 1-12
        const currentYear = now.getFullYear();

        const months: { month: string; count: number }[] = Array.from({ length: 12 }).map((_, i) => ({ month: `Tháng ${i + 1}`, count: 0 }));

        // mock for months 1..4
        months[0].count = 1;
        months[1].count = 2;
        months[2].count = 3;
        months[3].count = 4;

        // month 5: use stored login events for this role and current month if available
        try {
          const stored = getLoginFrequencyFromStoredLogins(accountRole);
          const key = `${String(currentMonth).padStart(2, '0')}/${currentYear}`;
          const found = stored.find((s) => s.month === key);
          months[4].count = found ? found.count : 0;
        } catch {
          months[4].count = 0;
        }

        // Try to fetch recent entry history for the current user/role, fallback to mock
        let entries: any[] = [];
        try {
          if (isLecturer) {
            entries = await lecturerApi.getEntryHistory(getStoredUserId());
          } else {
            entries = await getEntryHistory({ role: accountRole }) as any[];
          }
        } catch {
          entries = [];
        }

        if (!mounted) return;
        setLoginFrequency(months);
        setEntryHistory(entries as any[]);
      } catch (err) {
        if (!mounted) return;
        setError('Không lấy được dữ liệu tần suất hoặc lịch sử.');
      } finally {
        if (mounted) setLoading(false);
      }
    })();
    return () => { mounted = false; };
  }, [accountRole, isLecturer]);

  if (!allowed) {
    return (
      <div className="p-6">
        <div className="max-w-2xl rounded-xl border border-yellow-200 bg-yellow-50 p-6">
          <div className="flex items-start gap-3">
            <AlertTriangle className="mt-0.5 h-5 w-5 text-yellow-600" />
            <div>
              <h1 className="text-xl font-semibold text-gray-900">Không có quyền truy cập</h1>
              <p className="mt-2 text-sm text-gray-700">
                Trang tần suất đăng nhập chỉ dành cho sinh viên hoặc giảng viên.
              </p>
              <Link to="/dashboard" className="mt-4 inline-flex rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700">
                Quay về dashboard
              </Link>
            </div>
          </div>
        </div>
      </div>
    );
  }

  const maxCount = Math.max(...loginFrequency.map(d => d.count), 1);

  return (
    <div className="p-6">
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900 mb-2">Tần suất đăng nhập</h1>
        <p className="text-gray-600">Theo dõi tần suất ra vào bãi đậu xe của bạn.</p>
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        {/* Left - Login Frequency Chart */}
        <div className={isLecturer ? 'lg:col-span-2' : 'lg:col-span-3'}>
          <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-200">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-lg font-semibold text-gray-900">Tần suất đăng nhập (theo năm)</h2>
              <div className="text-sm text-blue-600 px-4 py-2 border border-blue-600 rounded-lg">
                Từ lịch sử đăng nhập
              </div>
            </div>
            
            <div className="flex items-end justify-around gap-4 h-64 border-l-2 border-b-2 border-gray-300 pl-4 pb-2">
              {loginFrequency.map((data, index) => (
                <div key={index} className="flex-1 flex flex-col items-center gap-2 h-full justify-end">
                  <div className="text-sm font-bold text-gray-900">{data.count}</div>
                  <div 
                    className="w-full bg-blue-500 rounded-t-lg transition-all hover:bg-blue-600 cursor-pointer min-h-[20px]"
                    style={{ height: `${(data.count / maxCount) * 80}%` }}
                  ></div>
                  <div className="text-xs text-gray-600 font-medium">{data.month}</div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right - Access Limit Card (Lecturer or Student) */}
        {allowed && (
          <div className="bg-gradient-to-br from-purple-50 to-blue-50 rounded-xl shadow-sm p-6 border border-purple-200">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Thẻ giới hạn truy cập</h2>
            <p className="text-sm text-gray-600 mb-6">Quản lý giới hạn truy cập hàng tháng của bạn.</p>
            
            {/* Access Limit Display */}
            <div className="bg-white rounded-lg p-4 mb-4">
              <div className="text-sm text-gray-600 mb-2">Giới hạn truy cập hàng tháng</div>
              <div className="text-4xl font-bold text-purple-600 mb-1">15 / 20</div>
              <div className="text-xs text-purple-600 mb-3">đã sử dụng</div>
              
              {/* Progress Bar */}
              <div className="w-full bg-gray-200 rounded-full h-2.5 mb-2">
                <div className="bg-purple-600 h-2.5 rounded-full" style={{ width: '75%' }}></div>
              </div>
              <div className="text-xs text-gray-500">còn 5 lượt</div>
            </div>

            {/* Plan Detail */}
            <div className="mb-4">
              <h3 className="text-sm font-semibold text-gray-900 mb-3">Chi tiết gói</h3>
              <div className="space-y-2 text-sm text-gray-700">
                <div className="flex items-start gap-2">
                  <span className="text-green-600">✓</span>
                  <span>20 lượt ra vào mỗi tháng</span>
                </div>
                <div className="flex items-start gap-2">
                  <span className="text-green-600">✓</span>
                  <span>Gia hạn vào đầu mỗi tháng</span>
                </div>
                <div className="flex items-start gap-2">
                  <span className="text-green-600">✓</span>
                  <span>Thêm lượt: 5,000 VND / lượt</span>
                </div>
              </div>
            </div>

            {/* This Month */}
            <div className="bg-purple-100 rounded-lg p-3 mb-4">
              <div className="text-sm font-semibold text-gray-900 mb-2">Tháng này</div>
              <div className="flex items-center gap-2 text-sm text-gray-700">
                <Calendar className="w-4 h-4" />
                <span>01/04/2026 - 30/04/2026</span>
              </div>
            </div>
          </div>
        )}
      </div>

        {/* Entry History (Lecturer or Student) */}
      {allowed && (
        <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-200 mt-6">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-lg font-semibold text-gray-900">Lịch sử ra vào</h2>
            <button className="text-sm text-blue-600 hover:text-blue-700">Xem tất cả</button>
          </div>

          <div className="space-y-3">
            {entryHistory.map((entry, index) => (
              <div key={index} className="flex items-center justify-between py-3 border-b border-gray-100 last:border-b-0">
                <div className="flex items-center gap-3">
                  <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                    entry.type === 'in' ? 'bg-green-100' : 'bg-red-100'
                  }`}>
                    {entry.type === 'in' ? (
                      <ArrowDownToLine className="w-5 h-5 text-green-600" />
                    ) : (
                      <ArrowUpFromLine className="w-5 h-5 text-red-600" />
                    )}
                  </div>
                  <div>
                    <div className="font-medium text-gray-900">
                      {entry.type === 'in' ? 'Vào bãi' : 'Ra khỏi bãi'}
                    </div>
                    <div className="text-sm text-gray-600">{entry.timeIn}</div>
                  </div>
                </div>
                <div className="text-sm text-gray-600">{entry.date}</div>
              </div>
            ))}
          </div>

          <div className="mt-4 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
            <div className="flex items-start gap-3">
              <AlertTriangle className="w-5 h-5 text-yellow-600 flex-shrink-0 mt-0.5" />
              <div className="text-sm text-gray-700">
                <span className="font-medium">Cần thêm lượt?</span> Liên hệ quản trị viên hoặc thanh toán thêm qua BKPay.
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

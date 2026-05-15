import { Bell, ChevronDown } from 'lucide-react';
import { getStoredRole, getStoredUser } from '../api/client';

interface DashboardHeaderProps {
  userName?: string;
  userRole?: string;
  userId?: string;
}

export function DashboardHeader({ userName = 'Minh Le', userRole = 'Student', userId = '2311234' }: DashboardHeaderProps) {
  const userType = localStorage.getItem('userType') || 'hcmut';
  const storedUser = getStoredUser();
  const accountRole = getStoredRole('student');
  const storedUserName = storedUser?.fullName || localStorage.getItem('userName') || userName || 'Minh Le';

  const displayRole = userType === 'hcmut'
    ? (accountRole === 'lecturer' ? 'Giảng viên' : 'Sinh viên')
    : userType === 'admin'
      ? 'Quản trị viên'
      : accountRole === 'employee'
        ? 'Nhân viên'
        : 'Khách';

  const displayId = userType === 'hcmut'
    ? (accountRole === 'lecturer' ? 'GV001' : '2011234')
    : userType === 'admin'
      ? 'ADM001'
      : accountRole === 'employee'
        ? 'EMP002'
        : 'GST123';

  // 📅 Ngày hiện tại
  const today = new Date();
  const formattedDate = today.toLocaleDateString('vi-VN', {
    weekday: 'long',
    day: '2-digit',
    month: '2-digit',
    year: 'numeric'
  });
  return (
    <header className="bg-white border-b border-gray-200 px-4 sm:px-6 py-4">
      <div className="flex flex-col gap-4 xl:flex-row xl:items-center xl:justify-between">

        {/* LEFT: Date */}
        <div className="flex items-center gap-6 flex-1 max-w-xl min-w-0">
          <div className="hidden md:block text-sm text-gray-600 whitespace-nowrap">
            📅 {formattedDate}
          </div>
        </div>

        {/* RIGHT */}
        <div className="flex items-center justify-end gap-3 sm:gap-4 min-w-0">
          {/* User */}
          <div className="flex items-center gap-3 cursor-pointer hover:bg-gray-50 rounded-lg p-2 min-w-0">
            <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
              <span className="text-blue-600 font-semibold">
                {storedUserName.split(' ').map(n => n[0]).join('').toUpperCase()}
              </span>
            </div>
            <div className="text-left min-w-0 hidden sm:block">
              <div className="font-medium text-gray-900 truncate">
                Xin chào, {storedUserName.split(' ').slice(-1)[0]}
              </div>
              <div className="text-sm text-gray-600 truncate">
                {displayRole} - {displayId}
              </div>
            </div>
            <ChevronDown className="w-4 h-4 text-gray-400" />
          </div>
        </div>

      </div>
    </header>
  );
}

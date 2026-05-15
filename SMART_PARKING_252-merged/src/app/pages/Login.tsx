import { useState } from 'react';
import { Link, useNavigate } from 'react-router';
import { ArrowLeft, Eye, EyeOff, ParkingSquare, GraduationCap, ShieldCheck, UserCircle } from 'lucide-react';
import logoImage from "/src/assets/01_logobachkhoa.png";
import { authApi } from '../api/authApi';
import { saveAuthSession } from '../api/client';

type AccountType = 'hcmut' | 'admin' | 'employee';

export function Login() {
  const navigate = useNavigate();
  const [accountType, setAccountType] = useState<AccountType>('hcmut');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);

  const demoAccounts = {
    hcmut: [
      {
        label: 'Sinh viên',
        email: 'student@hcmut.edu.vn',
        password: 'student123',
        name: 'Minh Lê',
      },
      {
        label: 'Giảng viên',
        email: 'lecturer@hcmut.edu.vn',
        password: 'lecturer123',
        name: 'Dr. Trần Văn An',
      },
    ],
    admin: {
      email: 'admin@smartparking.vn',
      password: 'admin123',
      name: 'Nguyễn Văn Quản',
    },
    employee: {
      email: 'employee@smartparking.vn',
      password: 'employee123',
      name: 'Lê Thị Mai',
    },
  } as const;

  const fillDemoCredentials = (demoEmail: string, demoPassword: string) => {
    setEmail(demoEmail);
    setPassword(demoPassword);
  };

  const fallbackLogin = () => {
    // Demo credentials validation
    // Check if user is a student or lecturer
    // Check if user is a student, lecturer, admin, or employee
    if (accountType === 'hcmut') {
      if (email === demoAccounts.hcmut[0].email && password === demoAccounts.hcmut[0].password) {
        saveAuthSession('mock-token', {
          id: 'u-student-001',
          fullName: demoAccounts.hcmut[0].name,
          email,
          role: 'student',
          cardId: 'STU-CARD-001',
          vehiclePlate: '59A-123.45',
          userType: 'hcmut',
        }, { rememberMe });
        navigate('/dashboard');
      } else if (email === demoAccounts.hcmut[1].email && password === demoAccounts.hcmut[1].password) {
        saveAuthSession('mock-token', {
          id: 'u-lecturer-001',
          fullName: demoAccounts.hcmut[1].name,
          email,
          role: 'lecturer',
          cardId: 'LEC-CARD-001',
          vehiclePlate: '59A-567.89',
          userType: 'hcmut',
        }, { rememberMe });
        navigate('/dashboard');
      } else {
        alert('Sai email hoặc mật khẩu! Vui lòng kiểm tra lại thông tin demo bên dưới.');
      }
    } else {
      const selectedDemo = accountType === 'admin' ? demoAccounts.admin : demoAccounts.employee;

      if (email === selectedDemo.email && password === selectedDemo.password) {
        saveAuthSession('mock-token', {
          id: accountType === 'admin' ? 'u-admin-001' : 'u-employee-001',
          fullName: selectedDemo.name,
          email,
          role: accountType,
          userType: accountType,
        }, { rememberMe });
        navigate('/dashboard');
      } else {
        alert('Sai email hoặc mật khẩu! Vui lòng kiểm tra lại thông tin demo bên dưới.');
      }
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const result = await authApi.login({
        email,
        password,
        provider: accountType === 'hcmut' ? 'HCMUT_SSO' : 'LOCAL',
      });
      saveAuthSession(result.accessToken, result.user, { rememberMe });
      navigate('/dashboard');
    } catch (err) {
      console.warn('Auth API unavailable, falling back to demo login.', err);
      fallbackLogin();
    }
  };

  return (
    <div className="min-h-screen grid lg:grid-cols-2 bg-gray-50">
      {/* Left Panel - Blue Design */}
      <div className="hidden lg:flex bg-blue-600 relative overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          {/* Grid pattern */}
          <div className="absolute inset-0" style={{
            backgroundImage: 'linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px)',
            backgroundSize: '50px 50px'
          }}></div>
        </div>

        <div className="relative z-10 flex flex-col justify-between p-10 text-white w-full">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-3 text-white">
            <div className="w-20 h-20">
              <img src={logoImage} alt="Logo BK TPHCM" className="w-full h-full object-contain" />
            </div>
            <div>
              <div className="font-bold">Hệ Thống Đậu Xe Thông Minh</div>
              <div className="text-xs opacity-90">Đại học Bách Khoa - ĐHQG TP.HCM</div>
            </div>
          </Link>

          {/* Center Content */}
          <div className="space-y-6">
            <div className="w-44 h-44 mx-auto border-2 border-white/30 rounded-2xl p-5">
              <div className="w-full h-full border border-white/50 rounded-2xl flex items-center justify-center">
                <ParkingSquare className="w-20 h-20 opacity-50" />
              </div>
            </div>

            <div className="text-center space-y-3">
              <h2 className="text-3xl font-bold">Chào mừng trở lại</h2>
              <p className="text-blue-100 text-sm leading-6 max-w-sm mx-auto">
                Đăng nhập để tiếp tục vào hệ thống đậu xe thông minh.
              </p>
            </div>
          </div>

          <div className="text-sm text-blue-100 text-center">
            Thiết kế kỹ thuật © 2026 ĐHBK
          </div>
        </div>
      </div>

      {/* Right Panel - Login Form */}
      <div className="relative flex flex-col bg-gray-50">
        <div className="absolute right-4 top-4 z-20">
          <Link
            to="/"
            className="inline-flex items-center gap-2 rounded-full bg-blue-600 px-4 py-2 text-sm font-medium text-white shadow-md transition-colors hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-400"
          >
            <ArrowLeft className="w-4 h-4" />
            Quay lại trang chủ
          </Link>
        </div>

        <div className="flex-1 flex items-center justify-center px-5 pb-5 pt-20 lg:px-6 lg:pt-24">
          <div className="w-full max-w-md">
            <div className="bg-white rounded-2xl shadow-lg p-6 lg:p-7">
              <h1 className="text-2xl lg:text-3xl font-bold text-gray-900 mb-2">
                Đăng nhập tài khoản
              </h1>
              <p className="text-sm text-gray-600 mb-5">
                Chọn loại tài khoản và nhập thông tin đăng nhập
              </p>

              {/* Account Type Tabs */}
              <div className="grid grid-cols-3 gap-2 mb-4 bg-gray-100 p-1 rounded-xl">
                <button
                  onClick={() => setAccountType('hcmut')}
                  className={`py-2.5 px-2 rounded-lg transition-all flex flex-col items-center gap-1.5 ${
                    accountType === 'hcmut'
                      ? 'bg-blue-600 text-white shadow-md'
                      : 'text-gray-600 hover:bg-gray-200'
                  }`}
                >
                  <GraduationCap className="w-5 h-5" />
                  <span className="text-xs font-medium">HCMUT</span>
                </button>
                <button
                  onClick={() => setAccountType('admin')}
                  className={`py-3 px-2 rounded-md transition-all flex flex-col items-center gap-1 ${
                    accountType === 'admin'
                      ? 'bg-blue-600 text-white shadow-md'
                      : 'text-gray-600 hover:bg-gray-200'
                  }`}
                >
                  <ShieldCheck className="w-5 h-5" />
                  <span className="text-xs font-medium">Quản trị</span>
                </button>
                <button
                  onClick={() => setAccountType('employee')}
                  className={`py-3 px-2 rounded-md transition-all flex flex-col items-center gap-1 ${
                    accountType === 'employee'
                      ? 'bg-blue-600 text-white shadow-md'
                      : 'text-gray-600 hover:bg-gray-200'
                  }`}
                >
                  <UserCircle className="w-5 h-5" />
                  <span className="text-xs font-medium">Nhân viên</span>
                </button>
              </div>
              <div className="mb-4 text-xs text-gray-500">
                {accountType === 'hcmut' && 'Sinh viên và giảng viên HCMUT.'}
                {accountType === 'admin' && 'Tài khoản quản trị hệ thống.'}
                {accountType === 'employee' && 'Tài khoản nhân viên bãi xe.'}
              </div>

              {/* SSO Button - Only for HCMUT account */}
              {accountType === 'hcmut' && (
                <>
                  <button className="w-full border-2 border-blue-600 text-blue-600 py-3 rounded-xl hover:bg-blue-50 transition-colors font-medium mb-4 flex items-center justify-center gap-2">
                    <div className="w-6 h-6">
                      <img src={logoImage} alt="Logo BK" className="w-full h-full object-contain" />
                    </div>
                    Đăng nhập bằng HCMUT SSO
                  </button>

                  <div className="relative mb-6">
                    <div className="absolute inset-0 flex items-center">
                      <div className="w-full border-t border-gray-200"></div>
                    </div>
                    <div className="relative flex justify-center text-sm">
                      <span className="bg-white px-4 text-gray-500">hoặc</span>
                    </div>
                  </div>
                </>
              )}

              {/* Login Form */}
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    {accountType === 'hcmut' ? 'Email HCMUT' : 'Email'}
                  </label>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder={
                      accountType === 'hcmut'
                        ? 'you@hcmut.edu.vn'
                        : accountType === 'admin'
                        ? 'admin@smartparking.vn'
                        : 'employee@smartparking.vn'
                    }
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Mật khẩu
                  </label>
                  <div className="relative">
                    <input
                      type={showPassword ? 'text' : 'password'}
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="••••••••"
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      required
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                    >
                      {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                    </button>
                  </div>
                </div>

                <div className="flex items-center justify-between gap-3">
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={rememberMe}
                      onChange={(e) => setRememberMe(e.target.checked)}
                      className="w-4 h-4 text-blue-600 rounded border-gray-300 focus:ring-blue-500"
                    />
                    <span className="text-sm text-gray-700">Ghi nhớ đăng nhập</span>
                  </label>
                  <a href="#" className="text-sm text-blue-600 hover:text-blue-700">
                    Quên mật khẩu?
                  </a>
                </div>

                <button
                  type="submit"
                  className="w-full bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700 transition-colors font-medium"
                >
                  Đăng nhập
                </button>
              </form>

              {accountType !== 'admin' && (
                <div className="mt-5 text-center text-sm text-gray-600">
                  Chưa có tài khoản?{' '}
                  <a href="#" className="text-blue-600 hover:text-blue-700 font-medium">
                    Đăng ký
                  </a>
                </div>
              )}

              {/* Demo Credentials */}
              <details className="mt-5 rounded-xl border border-yellow-200 bg-yellow-50 p-4">
                <summary className="cursor-pointer list-none text-xs font-semibold text-yellow-800 flex items-center gap-2">
                  <span>🔑</span>
                  <span>Tài khoản demo</span>
                </summary>
                <div className="mt-3 space-y-3 text-xs text-gray-700">
                  {accountType === 'hcmut' && (
                    <div className="grid gap-2 sm:grid-cols-2">
                      {demoAccounts.hcmut.map((account) => (
                        <button
                          key={account.label}
                          type="button"
                          onClick={() => fillDemoCredentials(account.email, account.password)}
                          className="text-left bg-white p-3 rounded-lg border border-gray-200 hover:border-blue-300 hover:bg-blue-50 transition-colors"
                        >
                          <div className="font-medium text-blue-700">{account.label}</div>
                          <div className="mt-1 text-gray-700 truncate">{account.email}</div>
                          <div className="text-gray-500 truncate">{account.password}</div>
                        </button>
                      ))}
                    </div>
                  )}
                  {accountType === 'admin' && (
                    <button
                      type="button"
                      onClick={() => fillDemoCredentials(demoAccounts.admin.email, demoAccounts.admin.password)}
                      className="w-full text-left bg-white p-3 rounded-lg border border-gray-200 hover:border-blue-300 hover:bg-blue-50 transition-colors"
                    >
                      <div className="font-medium text-blue-700">Quản trị viên</div>
                      <div className="mt-1 text-gray-700 truncate">{demoAccounts.admin.email}</div>
                      <div className="text-gray-500 truncate">{demoAccounts.admin.password}</div>
                    </button>
                  )}
                  {accountType === 'employee' && (
                    <button
                      type="button"
                      onClick={() => fillDemoCredentials(demoAccounts.employee.email, demoAccounts.employee.password)}
                      className="w-full text-left bg-white p-3 rounded-lg border border-gray-200 hover:border-blue-300 hover:bg-blue-50 transition-colors"
                    >
                      <div className="font-medium text-blue-700">Nhân viên</div>
                      <div className="mt-1 text-gray-700 truncate">{demoAccounts.employee.email}</div>
                      <div className="text-gray-500 truncate">{demoAccounts.employee.password}</div>
                    </button>
                  )}
                  <div className="text-yellow-700/90 text-[11px]">
                    Bấm vào một ô để tự điền email và mật khẩu.
                  </div>
                </div>
              </details>
            </div>

            <div className="mt-4 text-center text-xs text-gray-500">
              Bằng việc tiếp tục, bạn đồng ý với{' '}
              <a href="#" className="text-blue-600 hover:underline">
                Điều khoản dịch vụ
              </a>{' '}
              và{' '}
              <a href="#" className="text-blue-600 hover:underline">
                Chính sách bảo mật
              </a>
              .
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

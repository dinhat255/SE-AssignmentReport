import { useState } from 'react';
import { Link, useNavigate } from 'react-router';
import { ArrowLeft, Eye, EyeOff, Users, ParkingSquare, Activity, GraduationCap, ShieldCheck, UserCircle } from 'lucide-react';
import logoImage from "/src/assets/01_logobachkhoa.png";

type AccountType = 'hcmut' | 'admin' | 'employee';

export function Login() {
  const navigate = useNavigate();
  const [accountType, setAccountType] = useState<AccountType>('hcmut');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Demo credentials validation
    const validCredentials = {
      hcmut: { email: 'student@hcmut.edu.vn', password: 'student123' },
      admin: { email: 'admin@smartparking.vn', password: 'admin123' },
      employee: { email: 'employee@smartparking.vn', password: 'employee123' },
      lecturer: { email: 'lecturer@hcmut.edu.vn', password: 'lecturer123' }
    };

    // Check if user is a student or lecturer
    // Check if user is a student, lecturer, admin, or employee
    if (accountType === 'hcmut') {
      if (email === validCredentials.hcmut.email && password === validCredentials.hcmut.password) {
        localStorage.setItem('userType', accountType);
        localStorage.setItem('accountRole', 'student');
        localStorage.setItem('userName', 'Minh Lê');
        navigate('/dashboard');
      } else if (email === validCredentials.lecturer.email && password === validCredentials.lecturer.password) {
        localStorage.setItem('userType', accountType);
        localStorage.setItem('accountRole', 'lecturer');
        localStorage.setItem('userName', 'Dr. Trần Văn An');
        navigate('/dashboard');
      } else {
        alert('Sai email hoặc mật khẩu! Vui lòng kiểm tra lại thông tin demo bên dưới.');
      }
    } else if (email === validCredentials[accountType].email && password === validCredentials[accountType].password) {
      localStorage.setItem('userType', accountType);
      localStorage.setItem('accountRole', accountType);
      localStorage.setItem('userName', 
        accountType === 'admin' ? 'Nguyễn Văn Quản' : 'Lê Thị Mai'
      );
      navigate('/dashboard');
    } else {
      alert('Sai email hoặc mật khẩu! Vui lòng kiểm tra lại thông tin demo bên dưới.');
    }
  };

  return (
    <div className="min-h-screen grid lg:grid-cols-2">
      {/* Left Panel - Blue Design */}
      <div className="hidden lg:flex bg-blue-600 relative overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          {/* Grid pattern */}
          <div className="absolute inset-0" style={{
            backgroundImage: 'linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px)',
            backgroundSize: '50px 50px'
          }}></div>
        </div>

        <div className="relative z-10 flex flex-col justify-between p-12 text-white w-full">
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
          <div className="space-y-8">
            {/* Blueprint Style Icon */}
            <div className="w-48 h-48 mx-auto border-2 border-white/30 rounded-lg p-6">
              <div className="w-full h-full border border-white/50 rounded flex items-center justify-center">
                <ParkingSquare className="w-24 h-24 opacity-50" />
              </div>
            </div>

            <div className="text-center">
              <h2 className="text-4xl font-bold mb-4">Chào mừng trở lại!</h2>
              <p className="text-blue-100">
                Đăng nhập để tiếp tục<br />vào tài khoản của bạn
              </p>
            </div>

            {/* Stats */}
            <div className="flex justify-center gap-8">
              <div className="text-center">
                <Users className="w-8 h-8 mx-auto mb-2 opacity-80" />
                <div className="text-2xl font-bold">5000+</div>
                <div className="text-sm text-blue-100">Người dùng</div>
              </div>
              <div className="text-center">
                <ParkingSquare className="w-8 h-8 mx-auto mb-2 opacity-80" />
                <div className="text-2xl font-bold">1200+</div>
                <div className="text-sm text-blue-100">Chỗ đậu xe</div>
              </div>
              <div className="text-center">
                <Activity className="w-8 h-8 mx-auto mb-2 opacity-80" />
                <div className="text-2xl font-bold">99.9%</div>
                <div className="text-sm text-blue-100">Độ ổn định</div>
              </div>
            </div>
          </div>

          <div className="text-sm text-blue-100 text-center">
            Thiết kế kỹ thuật © 2026 ĐHBK
          </div>
        </div>
      </div>

      {/* Right Panel - Login Form */}
      <div className="flex flex-col bg-gray-50">
        <div className="p-6">
          <Link
            to="/"
            className="inline-flex items-center gap-2 text-gray-600 hover:text-gray-900 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            Quay lại trang chủ
          </Link>
        </div>

        <div className="flex-1 flex items-center justify-center p-6">
          <div className="w-full max-w-md">
            <div className="bg-white rounded-2xl shadow-lg p-8">
              <h1 className="text-3xl font-bold text-gray-900 mb-2">
                Đăng nhập tài khoản
              </h1>
              <p className="text-gray-600 mb-6">
                Chọn loại tài khoản và nhập thông tin đăng nhập
              </p>

              {/* Account Type Tabs */}
              <div className="grid grid-cols-3 gap-2 mb-6 bg-gray-100 p-1 rounded-lg">
                <button
                  onClick={() => setAccountType('hcmut')}
                  className={`py-3 px-2 rounded-md transition-all flex flex-col items-center gap-1 ${
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

              {/* Account Type Description */}
              <div className="mb-6 p-3 bg-blue-50 rounded-lg border border-blue-100">
                <p className="text-sm text-gray-700">
                  {accountType === 'hcmut' && (
                    <>
                      <span className="font-medium text-blue-700">Tài khoản HCMUT:</span> Dành cho sinh viên, giảng viên và cán bộ của trường
                    </>
                  )}
                  {accountType === 'admin' && (
                    <>
                      <span className="font-medium text-blue-700">Quản trị viên:</span> Dành cho nhân viên quản lý hệ thống bãi đậu xe
                    </>
                  )}
                  {accountType === 'employee' && (
                    <>
                      <span className="font-medium text-blue-700">Nhân viên:</span> Dành cho nhân viên bãi xe
                    </>
                  )}
                </p>
              </div>

              {/* SSO Button - Only for HCMUT account */}
              {accountType === 'hcmut' && (
                <>
                  <button className="w-full border-2 border-blue-600 text-blue-600 py-3 rounded-lg hover:bg-blue-50 transition-colors font-medium mb-4 flex items-center justify-center gap-2">
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

                <div className="flex items-center justify-between">
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
                <div className="mt-6 text-center text-sm text-gray-600">
                  Chưa có tài khoản?{' '}
                  <a href="#" className="text-blue-600 hover:text-blue-700 font-medium">
                    Đăng ký
                  </a>
                </div>
              )}

              {/* Demo Credentials */}
              <div className="mt-6 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
                <div className="text-xs font-semibold text-yellow-800 mb-2 flex items-center gap-2">
                  <span>🔑</span>
                  <span>THÔNG TIN DEMO - Dùng để test:</span>
                </div>
                <div className="space-y-2 text-xs text-gray-700">
                  {accountType === 'hcmut' && (
                    <>
                      <div className="bg-white p-2 rounded">
                        <div className="font-medium text-blue-700">HCMUT (Sinh viên):</div>
                        <div>Email: <code className="bg-gray-100 px-1 rounded">student@hcmut.edu.vn</code></div>
                        <div>Mật khẩu: <code className="bg-gray-100 px-1 rounded">student123</code></div>
                      </div>
                      <div className="bg-white p-2 rounded">
                        <div className="font-medium text-purple-700">HCMUT (Giảng viên):</div>
                        <div>Email: <code className="bg-gray-100 px-1 rounded">lecturer@hcmut.edu.vn</code></div>
                        <div>Mật khẩu: <code className="bg-gray-100 px-1 rounded">lecturer123</code></div>
                      </div>
                    </>
                  )}
                  {accountType === 'admin' && (
                    <div className="bg-white p-2 rounded">
                      <div className="font-medium text-blue-700">Quản trị viên:</div>
                      <div>Email: <code className="bg-gray-100 px-1 rounded">admin@smartparking.vn</code></div>
                      <div>Mật khẩu: <code className="bg-gray-100 px-1 rounded">admin123</code></div>
                    </div>
                  )}
                  {accountType === 'employee' && (
                    <div className="bg-white p-2 rounded">
                      <div className="font-medium text-blue-700">Nhân viên:</div>
                      <div>Email: <code className="bg-gray-100 px-1 rounded">employee@smartparking.vn</code></div>
                      <div>Mật khẩu: <code className="bg-gray-100 px-1 rounded">employee123</code></div>
                    </div>
                  )}
                  <div className="text-yellow-700 italic mt-2">
                    💡 Copy và paste thông tin trên để đăng nhập
                  </div>
                </div>
              </div>
            </div>

            <div className="mt-6 text-center text-xs text-gray-500">
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
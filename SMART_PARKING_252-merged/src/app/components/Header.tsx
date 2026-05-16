import { Link } from 'react-router';
import logoImage from "/src/assets/01_logobachkhoa.png";

export function Header() {
  return (
    <header className="bg-white border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-6 py-4">
        <div className="flex justify-between items-center">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-3">
            {/* Logo HCMUT chính thống */}
            <div className="w-20 h-20">
              <img src={logoImage} alt="Logo BK TPHCM" className="w-full h-full object-contain" />
            </div>
            <div>
              <div className="font-bold text-gray-900">Hệ Thống Đậu Xe Thông Minh</div>
              <div className="text-xs text-gray-600">Đại học Bách Khoa - ĐHQG TP.HCM</div>
            </div>
          </Link>

          {/* Navigation */}
          <nav className="hidden md:flex items-center gap-8">
            <a href="#features" className="text-gray-700 hover:text-blue-600 transition-colors">
              Tính năng
            </a>
            <a href="#how-it-works" className="text-gray-700 hover:text-blue-600 transition-colors">
              Cách hoạt động
            </a>
            <a href="#pricing" className="text-gray-700 hover:text-blue-600 transition-colors">
              Giá cả
            </a>
            <a href="#about" className="text-gray-700 hover:text-blue-600 transition-colors">
              Giới thiệu
            </a>
            <a href="#contact" className="text-gray-700 hover:text-blue-600 transition-colors">
              Liên hệ
            </a>
          </nav>

          {/* Auth Buttons */}
          <div className="flex items-center gap-4">
            <Link
              to="/login"
              className="text-gray-700 hover:text-blue-600 transition-colors"
            >
              Đăng nhập
            </Link>
            <Link
              to="/login"
              className="bg-blue-600 text-white px-5 py-2 rounded-md hover:bg-blue-700 transition-colors"
            >
              Đăng ký
            </Link>
          </div>
        </div>
      </div>
    </header>
  );
}
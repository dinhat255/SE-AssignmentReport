import { Link } from 'react-router';
import { Clock, Lock, CreditCard, TrendingUp, Grid3x3, Shield, ChevronRight } from 'lucide-react';
import { Header } from '../components/Header';
import { Footer } from '../components/Footer';
import { ImageWithFallback } from '../components/figma/ImageWithFallback';

export function Home() {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />

      {/* Hero Section */}
      <section className="bg-gradient-to-br from-blue-50 to-white py-20">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            {/* Left Content */}
            <div>
              <div className="text-blue-600 text-sm font-semibold mb-4 tracking-wide uppercase">
                ĐẠI HỌC BÁCH KHOA TP HỒ CHÍ MINH
              </div>
              <h1 className="text-5xl font-bold text-gray-900 mb-6">
                Hệ Thống Đậu Xe<br />Thông Minh 
              </h1>
              <p className="text-xl text-gray-600 mb-8">
                Cập nhật chỗ đậu xe theo thời gian thực,<br />
                truy cập tự động và thanh toán liền mạch.
              </p>
              <div className="flex gap-4">
                <Link
                  to="/login"
                  className="bg-blue-600 text-white px-8 py-3 rounded-md hover:bg-blue-700 transition-colors font-medium"
                >
                  Bắt đầu
                </Link>
                <button className="text-blue-600 px-8 py-3 rounded-md hover:bg-blue-50 transition-colors font-medium flex items-center gap-2">
                  Tìm hiểu thêm <ChevronRight className="w-4 h-4" />
                </button>
              </div>

              {/* Feature Cards */}
              <div className="grid grid-cols-3 gap-4 mt-12">
                <div className="bg-white p-4 rounded-lg shadow-sm">
                  <Clock className="w-8 h-8 text-blue-600 mb-3" />
                  <div className="font-semibold text-gray-900 mb-1">Cập nhật thời gian thực</div>
                  <div className="text-sm text-gray-600">Xem chỗ trống ngay lập tức, tiết kiệm thời gian.</div>
                </div>
                <div className="bg-white p-4 rounded-lg shadow-sm">
                  <Lock className="w-8 h-8 text-blue-600 mb-3" />
                  <div className="font-semibold text-gray-900 mb-1">Truy cập tự động</div>
                  <div className="text-sm text-gray-600">Dùng thẻ sinh viên để vào nhanh chóng.</div>
                </div>
                <div className="bg-white p-4 rounded-lg shadow-sm">
                  <CreditCard className="w-8 h-8 text-blue-600 mb-3" />
                  <div className="font-semibold text-gray-900 mb-1">Thanh toán không tiền mặt</div>
                  <div className="text-sm text-gray-600">Thanh toán dễ dàng qua BKPay hoặc ví điện tử.</div>
                </div>
              </div>
            </div>

            {/* Right Content - Parking Visual with Real Images */}
            <div className="relative">
              <div className="bg-white rounded-2xl shadow-xl p-8">
                {/* Available Spaces Card */}
                <div className="absolute top-8 left-8 bg-white rounded-lg shadow-lg p-4 z-10">
                  <div className="text-sm text-gray-600 mb-1">Chỗ trống</div>
                  <div className="text-3xl font-bold text-gray-900 flex items-center gap-2">
                    128 <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                  </div>
                  <div className="text-sm text-gray-600">vị trí</div>
                </div>

                {/* Occupancy Card */}
                <div className="absolute bottom-8 right-8 bg-white rounded-lg shadow-lg p-4 z-10">
                  <div className="text-sm text-gray-600 mb-1">Lấp đầy</div>
                  <div className="text-3xl font-bold text-red-500 flex items-center gap-2">
                    72% <TrendingUp className="w-6 h-6" />
                  </div>
                </div>

                {/* Parking Images */}
                <div className="space-y-4">
                  {/* Aerial view of parking */}
                  <div className="rounded-xl overflow-hidden">
                    <ImageWithFallback 
                      src="https://images.unsplash.com/photo-1725758575836-08bfbcae0469?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjYXIlMjBwYXJraW5nJTIwYWVyaWFsJTIwdmlld3xlbnwxfHx8fDE3NzUzNTQ1NzB8MA&ixlib=rb-4.1.0&q=80&w=1080"
                      alt="Bãi đậu xe từ trên cao"
                      className="w-full h-64 object-cover"
                    />
                  </div>
                  
                  {/* Parking spots lines */}
                  <div className="rounded-xl overflow-hidden">
                    <ImageWithFallback 
                      src="https://images.unsplash.com/photo-1579372778680-604834b02240?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxlbXB0eSUyMHBhcmtpbmclMjBzcG90cyUyMGxpbmVzfGVufDF8fHx8MTc3NTM1NDU3MHww&ixlib=rb-4.1.0&q=80&w=1080"
                      alt="Vạch kẻ bãi đậu xe"
                      className="w-full h-48 object-cover"
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Why Smart Parking Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-6">
          <h2 className="text-4xl font-bold text-center text-gray-900 mb-16">
            Tại sao chọn Đậu Xe Thông Minh?
          </h2>
          <div className="grid md:grid-cols-3 gap-8">
            {/* Save Time */}
            <div className="text-center">
              <div className="bg-blue-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-6">
                <Clock className="w-8 h-8 text-blue-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-3">Tiết kiệm thời gian</h3>
              <p className="text-gray-600">
                Tìm chỗ đậu xe nhanh hơn và tránh xếp hàng dài.
              </p>
            </div>

            {/* Reduce Congestion */}
            <div className="text-center">
              <div className="bg-blue-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-6">
                <Grid3x3 className="w-8 h-8 text-blue-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-3">Giảm ùn tắc</h3>
              <p className="text-gray-600">
                Hệ thống dẫn đường thông minh giúp giảm ùn tắc trong khuôn viên.
              </p>
            </div>

            {/* Security & Reliability */}
            <div className="text-center">
              <div className="bg-blue-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-6">
                <Shield className="w-8 h-8 text-blue-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-3">An toàn & Tin cậy</h3>
              <p className="text-gray-600">
                Tích hợp với hệ thống ĐHBK để quản lý an toàn.
              </p>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
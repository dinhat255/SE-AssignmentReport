import { Facebook, Linkedin, Youtube, Github, MapPin, Phone, Mail } from 'lucide-react';
import logoImage from "/src/assets/01_logobachkhoa.png";

export function Footer() {
  return (
    <footer className="bg-blue-950 text-white py-12">
      <div className="max-w-7xl mx-auto px-6">
        <div className="grid md:grid-cols-3 gap-8 mb-8">
          {/* Logo & Info */}
          <div>
            <div className="flex items-center gap-3 mb-4">
              <div className="w-15 h-15">
                <img src={logoImage} alt="Logo BK TPHCM" className="w-full h-full object-contain" />
              </div>
              <div>
                <div className="font-bold">Đại học Bách Khoa</div>
                <div className="text-xs text-blue-200">ĐHQG TP.HCM</div>
              </div>
            </div>
            <div className="text-sm text-blue-200">
              Trường Đại học Bách Khoa - ĐHQG TP.HCM
            </div>
          </div>

          {/* Campus Locations */}
          <div>
            <h3 className="font-semibold text-white mb-4">Cơ sở</h3>
            <div className="space-y-3 text-sm text-blue-200">
              <div className="flex items-start gap-2">
                <MapPin className="w-4 h-4 mt-1 flex-shrink-0" />
                <div>
                  <div className="font-medium text-white">Cơ sở Lý Thường Kiệt</div>
                  <div>268 Lý Thường Kiệt, P.14, Q.10, TP.HCM</div>
                </div>
              </div>
              <div className="flex items-start gap-2">
                <MapPin className="w-4 h-4 mt-1 flex-shrink-0" />
                <div>
                  <div className="font-medium text-white">Cơ sở Dĩ An</div>
                  <div>Đông Hòa, Dĩ An, Bình Dương</div>
                </div>
              </div>
            </div>
          </div>

          {/* Technical Support */}
          <div>
            <h3 className="font-semibold text-white mb-4">Hỗ trợ kỹ thuật</h3>
            <div className="space-y-3 text-sm text-blue-200">
              <div className="flex items-center gap-2">
                <Phone className="w-4 h-4 flex-shrink-0" />
                <a href="tel:+842838647256" className="hover:text-white transition-colors">
                  (028) 3864 7256 - Ext: 5258
                </a>
              </div>
              <div className="flex items-center gap-2">
                <Mail className="w-4 h-4 flex-shrink-0" />
                <a href="mailto:smartparking@hcmut.edu.vn" className="hover:text-white transition-colors">
                  smartparking@hcmut.edu.vn
                </a>
              </div>
              <div className="text-xs">
                Thời gian hỗ trợ: 7:00 - 21:00 (Thứ 2 - Thứ 7)
              </div>
            </div>
          </div>
        </div>

        {/* Social & Copyright */}
        <div className="pt-8 border-t border-blue-900">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <div className="text-center md:text-left text-blue-300 text-sm">
              © 2026 Hệ Thống Đậu Xe Thông Minh HCMUT. Bản quyền thuộc về Đại học Bách Khoa.
            </div>
            
            {/* Social Links */}
            <div className="flex gap-3">
              <a
                href="#"
                className="w-9 h-9 bg-blue-900 rounded flex items-center justify-center hover:bg-blue-800 transition-colors"
                aria-label="Facebook"
              >
                <Facebook className="w-4 h-4" />
              </a>
              <a
                href="#"
                className="w-9 h-9 bg-blue-900 rounded flex items-center justify-center hover:bg-blue-800 transition-colors"
                aria-label="LinkedIn"
              >
                <Linkedin className="w-4 h-4" />
              </a>
              <a
                href="#"
                className="w-9 h-9 bg-blue-900 rounded flex items-center justify-center hover:bg-blue-800 transition-colors"
                aria-label="YouTube"
              >
                <Youtube className="w-4 h-4" />
              </a>
              <a
                href="#"
                className="w-9 h-9 bg-blue-900 rounded flex items-center justify-center hover:bg-blue-800 transition-colors"
                aria-label="GitHub"
              >
                <Github className="w-4 h-4" />
              </a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
# Frontend / Backend Mock Data Contract

Tài liệu này mô tả các phần frontend hiện còn dùng mock data và hướng backend cần hiện thực để thay thế.

## 1. Login / Role Context

- File: `src/app/pages/Login.tsx`
- Mục tiêu backend:
  - Xác thực `student`, `lecturer`, `admin`, `employee`.
  - Trả về `userType`, `accountRole`, `userName`, `userId`, `email`, `department` khi login thành công.
  - Đồng bộ session/token để `DashboardHeader`, `Sidebar`, `Profile`, `Payment` đọc cùng một nguồn dữ liệu.

## 2. Dashboard Summary

- File: `src/app/pages/dashboard/Dashboard.tsx`
- Mock data cần thay bằng API:
  - `walletBalance`
  - `parkingData.available`, `parkingData.total`, `parkingData.percentage`
  - `parkingSlots`
  - `loginFrequency`
  - recent activity feed
- Đề xuất API:
  - `GET /api/dashboard/summary`
  - `GET /api/dashboard/parking-map`
  - `GET /api/dashboard/activity`

## 3. Login Frequency / Lecturer Access

- File: `src/app/pages/dashboard/LoginFrequency.tsx`
- Backend cần cung cấp:
  - Dữ liệu tần suất đăng nhập theo tháng.
  - Số lượt truy cập còn lại của giảng viên.
  - Lịch sử vào/ra theo thời gian thực hoặc theo kỳ.

## 4. Maintenance

- File: `src/app/pages/dashboard/Maintenance.tsx`
- Backend cần hiện thực:
  - Danh sách sự cố thiết bị.
  - Tạo report mới.
  - Upload attachment.
  - Cập nhật trạng thái `pending / in-progress / resolved`.
  - Phân quyền `admin` và `employee`.

## 5. Parking History

- File: `src/app/pages/dashboard/MyHistory.tsx`
- Backend cần trả:
  - Danh sách lịch sử ra vào có phân trang.
  - Bộ lọc theo kỳ thời gian.
  - Trạng thái phiên, phí, loại thẻ.

## 6. Payment / BKPay QR

- File: `src/app/pages/dashboard/Payment.tsx`
- Backend cần cung cấp endpoint tạo QR cho BKPay.
- Contract hiện tại frontend đang dùng:
  - `POST /api/payments/bkpay/qr`
  - Request body:
    - `amount`
    - `role`
    - `context` (`student` hoặc `lecturer`)
    - `expiresInSeconds`
  - Response ưu tiên:
    - `qrImageUrl` hoặc `qrCodeBase64`
    - `qrToken`
    - `expiresInSeconds`
- Frontend sẽ tự đóng popup sau 5 phút nếu backend không trả thời gian khác.

## 7. Role-Based UI

- File liên quan:
  - `src/app/components/Sidebar.tsx`
  - `src/app/components/DashboardHeader.tsx`
  - `src/app/pages/dashboard/Profile.tsx`
  - `src/app/pages/dashboard/Payment.tsx`
- Backend cần đảm bảo role mapping nhất quán:
  - `student`
  - `lecturer`
  - `admin`
  - `employee`

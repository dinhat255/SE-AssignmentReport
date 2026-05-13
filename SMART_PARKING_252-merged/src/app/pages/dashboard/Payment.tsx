import { useEffect, useState } from "react";
import { CreditCard, CheckCircle, Calendar, Smartphone, X, LoaderCircle } from "lucide-react";
import { getStoredRole, getStoredUserId, type ApiRole } from "../../api/client";
import { paymentApi } from "../../api/paymentApi";

const QR_EXPIRE_SECONDS = 300;

type QrContext = "student" | "lecturer";

export function Payment() {
  const role = getStoredRole("student") as ApiRole;

  const isAdmin = role === "admin";
  const isEmployee = role === "employee";
  const isStudent = role === "student";
  const isLecturer = role === "lecturer";

  // lecturer state
  const [quantity, setQuantity] = useState(1);
  const [purchased, setPurchased] = useState(0);
  const [isQrModalOpen, setIsQrModalOpen] = useState(false);
  const [isCreatingQr, setIsCreatingQr] = useState(false);
  const [qrError, setQrError] = useState<string | null>(null);
  const [qrImageUrl, setQrImageUrl] = useState<string | null>(null);
  const [qrToken, setQrToken] = useState<string | null>(null);
  const [isConfirmingPayment, setIsConfirmingPayment] = useState(false);
  const [paymentConfirmMessage, setPaymentConfirmMessage] = useState<string | null>(null);
  const [countdownSeconds, setCountdownSeconds] = useState(QR_EXPIRE_SECONDS);
  const [activeAmount, setActiveAmount] = useState(0);

  const pricePerEntry = 5000;
  const total = quantity * pricePerEntry;

  const closeQrModal = () => {
    setIsQrModalOpen(false);
    setIsCreatingQr(false);
    setQrError(null);
    setQrImageUrl(null);
    setQrToken(null);
    setIsConfirmingPayment(false);
    setPaymentConfirmMessage(null);
    setCountdownSeconds(QR_EXPIRE_SECONDS);
  };

  const formatCountdown = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${String(mins).padStart(2, "0")}:${String(secs).padStart(2, "0")}`;
  };

  // Backend contract:
  // POST /api/payments/bkpay/qr
  // body: { amount, role, context, expiresInSeconds }
  // response: { qrImageUrl | qrCodeBase64, qrToken, expiresInSeconds }
  useEffect(() => {
    if (!isQrModalOpen) return;

    const timer = window.setInterval(() => {
      setCountdownSeconds((prev) => {
        if (prev <= 1) {
          closeQrModal();
          return QR_EXPIRE_SECONDS;
        }
        return prev - 1;
      });
    }, 1000);

    return () => window.clearInterval(timer);
  }, [isQrModalOpen]);

  useEffect(() => {
    if (!isQrModalOpen) return;

    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        closeQrModal();
      }
    };

    window.addEventListener("keydown", handleEscape);
    return () => window.removeEventListener("keydown", handleEscape);
  }, [isQrModalOpen]);

  useEffect(() => {
    if (!isQrModalOpen) return;

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';

    return () => {
      document.body.style.overflow = previousOverflow;
    };
  }, [isQrModalOpen]);

  const confirmBkPayPayment = async (token: string) => {
    setIsConfirmingPayment(true);
    setPaymentConfirmMessage(null);

    try {
      await paymentApi.confirm(token);
      setPaymentConfirmMessage("ÄĂ£ ghi nháº­n thanh toĂ¡n thĂ nh cĂ´ng.");
    } catch (err) {
      console.warn("Payment confirm is not available yet.", err);
      setPaymentConfirmMessage("ChÆ°a thá»ƒ xĂ¡c nháº­n thanh toĂ¡n. Vui lĂ²ng thá»­ láº¡i sau.");
    } finally {
      setIsConfirmingPayment(false);
    }
  };

  const openBkPayQr = async (amount: number, context: QrContext) => {
    setIsQrModalOpen(true);
    setIsCreatingQr(true);
    setQrError(null);
    setQrImageUrl(null);
    setQrToken(null);
    setPaymentConfirmMessage(null);
    setActiveAmount(amount);
    setCountdownSeconds(QR_EXPIRE_SECONDS);

    try {
      const data = await paymentApi.createBkpayQr({
        amount,
        role,
        context: {
          type: context === "student" ? "STUDENT_SUBSCRIPTION" : "LECTURER_QUOTA_PURCHASE",
          userId: getStoredUserId(),
          ...(context === "lecturer" ? { quantity } : {}),
        },
        expiresInSeconds: QR_EXPIRE_SECONDS,
      });
      const resolvedQrImage = data.qrImageUrl
        ? data.qrImageUrl
        : data.qrCodeBase64
          ? data.qrCodeBase64.startsWith("data:")
            ? data.qrCodeBase64
            : `data:image/png;base64,${data.qrCodeBase64}`
          : null;

      if (!resolvedQrImage) {
        throw new Error("Backend chưa trả về dữ liệu QR hợp lệ");
      }

      setQrImageUrl(resolvedQrImage);
      setQrToken(data.qrToken ?? null);

      if (typeof data.expiresInSeconds === "number" && data.expiresInSeconds > 0) {
        setCountdownSeconds(Math.min(data.expiresInSeconds, QR_EXPIRE_SECONDS));
      }
    } catch {
      setQrError("Không thể tạo mã QR BKPay. Vui lòng thử lại.");
    } finally {
      setIsCreatingQr(false);
    }
  };

  return (
    <div className="p-6">
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900 mb-2">
          Thanh toán (Hàng tháng)
        </h1>
        <p className="text-gray-600">
          Đăng ký và thanh toán phí gửi xe hàng tháng.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

        {/* ================= STUDENT ================= */}
        {/* ================= ADMIN / EMPLOYEE ================= */}
        {(isAdmin || isEmployee) && (
          <div className="lg:col-span-2 bg-blue-50 border-2 border-blue-200 rounded-xl p-8 text-center">
            <div className="flex justify-center mb-4">
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center">
                <CheckCircle className="w-8 h-8 text-blue-600" />
              </div>
            </div>
            <h2 className="text-xl font-bold text-gray-900 mb-2">
              {isAdmin ? 'Quản trị viên không cần thanh toán' : 'Nhân viên không cần thanh toán'}
            </h2>
            <p className="text-gray-600 max-w-md mx-auto">
              {isAdmin
                ? 'Tài khoản quản trị viên có quyền truy cập đầy đủ vào hệ thống mà không cần thanh toán phí bãi đậu xe hàng tháng.'
                : 'Tài khoản nhân viên dùng cho vận hành hệ thống nên không cần thanh toán phí bãi đậu xe.'}
            </p>
          </div>
        )}

        {/* ================= STUDENT ================= */}
        {isStudent && (
          <>
            <div className="space-y-6">
              <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-200">
                <h2 className="text-lg font-semibold mb-4">Gói của bạn</h2>

                <div className="bg-blue-50 border-2 border-blue-200 rounded-xl p-6 mb-4">
                  <div className="flex justify-between mb-4">
                    <h3 className="text-xl font-bold">Gói sinh viên tháng</h3>
                    <span className="px-3 py-1 bg-green-500 text-white text-xs rounded-full">
                      Đang hoạt động
                    </span>
                  </div>

                  <div className="space-y-2">
                    <div className="flex gap-2">
                      <CheckCircle className="text-green-600 w-5 h-5" />
                      Không giới hạn thời gian gửi xe
                    </div>
                    <div className="flex gap-2">
                      <CheckCircle className="text-green-600 w-5 h-5" />
                      Có hiệu lực 1 tháng
                    </div>
                    <div className="flex gap-2">
                      <CheckCircle className="text-green-600 w-5 h-5" />
                      Tất cả khu vực
                    </div>
                  </div>
                </div>

                <div className="mb-6">
                  <h3 className="text-sm font-semibold mb-2">Thời gian</h3>
                  <div className="flex gap-3 bg-gray-50 p-4 rounded">
                    <Calendar className="text-blue-600" />
                    <div>
                      01/04/2024 - 30/04/2024
                      <div className="text-sm text-gray-500">
                        Tự động gia hạn
                      </div>
                    </div>
                  </div>
                </div>

                <div className="border-t pt-4">
                  <div className="flex justify-between">
                    <span>Phí</span>
                    <span>50,000 VND</span>
                  </div>
                  <div className="flex justify-between text-green-600">
                    <span>Giảm giá</span>
                    <span>-10,000 VND</span>
                  </div>
                  <div className="flex justify-between font-bold text-lg">
                    <span>Tổng</span>
                    <span className="text-blue-600">50,000 VND</span>
                  </div>
                </div>
              </div>
            </div>

            {/* student payment */}
            <div className="bg-white p-6 rounded-xl border">
              <h2 className="font-semibold mb-4">Thanh toán</h2>

              <button
                onClick={() => void openBkPayQr(50000, "student")}
                className="w-full bg-blue-600 text-white p-3 rounded mb-4 flex justify-center gap-2"
              >
                <Smartphone /> BKPay
              </button>

              <div className="bg-gray-50 p-6 rounded text-center text-sm text-gray-600">
                Nhấn BKPay để mở popup quét QR. Mã sẽ tự hết hạn sau 5 phút.
              </div>
            </div>
          </>
        )}

        {/* ================= LECTURER ================= */}
        {isLecturer && (
          <>
            {/* LEFT */}
            <div className="bg-white p-6 rounded-xl border">
              <h2 className="font-semibold mb-4">Gói giảng viên</h2>

              <p className="mb-2">Đã dùng: 15 / 50</p>
              <div className="bg-gray-200 h-2 rounded mb-2">
                <div className="bg-purple-600 h-2 w-[30%]" />
              </div>

              <p className="text-sm text-gray-500">Còn 35 lượt</p>
            </div>

            {/* RIGHT */}
            <div className="bg-white p-6 rounded-xl border">
              <h2 className="font-semibold mb-4">Mua thêm lượt</h2>

              {/* đã mua */}
              <p className="mb-2">
                Đã mua:{" "}
                <span className="text-purple-600 font-semibold">
                  {purchased}
                </span>{" "}
                lượt
              </p>

              <p className="text-sm text-gray-600 mb-2">
                5,000 VND / lượt
              </p>

              {/* input */}
              <input
                type="number"
                min="1"
                value={quantity}
                onChange={(e) => setQuantity(Number(e.target.value))}
                className="border p-2 rounded w-full mb-3"
              />

              {/* total */}
              <p className="mb-3">
                Tổng:{" "}
                <span className="text-purple-600 font-semibold">
                  {total.toLocaleString()} VND
                </span>
              </p>

              <button
                onClick={() => void openBkPayQr(total, "lecturer")}
                className="w-full bg-purple-600 text-white p-3 rounded mb-4 flex items-center justify-center gap-2"
              >
                <Smartphone /> BKPay
              </button>

              <div className="bg-gray-50 p-6 rounded text-center text-sm text-gray-600">
                Nhấn BKPay để mở popup quét QR. Backend sẽ trả mã thanh toán riêng cho từng lượt.
              </div>
            </div>
          </>
        )}
      </div>

      {isQrModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/45 flex items-center justify-center p-4" onClick={closeQrModal}>
          <div
            className="w-full max-w-md max-h-[90vh] overflow-y-auto bg-white rounded-2xl shadow-xl border border-gray-200 overflow-hidden"
            onClick={(event) => event.stopPropagation()}
            role="dialog"
            aria-modal="true"
            aria-labelledby="bkpay-qr-title"
          >
            <div className="flex items-center justify-between px-5 py-4 border-b border-gray-200">
              <div>
                <h3 id="bkpay-qr-title" className="text-lg font-semibold text-gray-900">Quét QR BKPay</h3>
                <p className="text-sm text-gray-500">Mã QR tự động tắt sau {formatCountdown(countdownSeconds)}</p>
              </div>
              <button
                onClick={closeQrModal}
                className="p-2 rounded-lg hover:bg-gray-100 transition-colors"
                aria-label="Đóng popup QR"
              >
                <X className="w-5 h-5 text-gray-600" />
              </button>
            </div>

            <div className="p-5">
              <div className="mb-4 text-sm text-gray-700">
                Số tiền: <span className="font-semibold text-gray-900">{activeAmount.toLocaleString()} VND</span>
              </div>

              {isCreatingQr && (
                <div className="py-10 flex flex-col items-center gap-3 text-gray-600">
                  <LoaderCircle className="w-8 h-8 animate-spin" />
                  <p>Đang tạo mã QR...</p>
                </div>
              )}

              {!isCreatingQr && qrError && (
                <div className="p-4 rounded-lg bg-red-50 border border-red-200 text-red-700 text-sm">
                  {qrError}
                </div>
              )}

              {!isCreatingQr && qrImageUrl && (
                <div className="flex flex-col items-center gap-4">
                  <div className="p-3 bg-gray-50 border border-gray-200 rounded-xl">
                    <img src={qrImageUrl} alt="BKPay QR" className="w-48 h-48 sm:w-56 sm:h-56 object-contain" />
                  </div>
                  {qrToken && (
                    <p className="text-xs text-gray-500 break-all text-center">Phien giao dich: {qrToken}</p>
                  )}
                  {qrToken && (
                    <button
                      onClick={() => void confirmBkPayPayment(qrToken)}
                      disabled={isConfirmingPayment}
                      className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-60"
                    >
                      {isConfirmingPayment ? "Äang xĂ¡c nháº­n..." : "TĂ´i Ä‘Ă£ thanh toĂ¡n"}
                    </button>
                  )}
                  {paymentConfirmMessage && (
                    <p className="text-center text-sm text-gray-600">{paymentConfirmMessage}</p>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}


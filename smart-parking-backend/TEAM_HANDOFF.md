# Smart Parking Backend - Team Handoff

## 1. Overview

The Express backend lives in `smart-parking-backend`.

It does not use a database. Data is hardcoded and stored in in-memory arrays for the MVP. The backend follows the existing architecture:

`Route -> Controller -> Service -> Repository -> data`

Swagger is the API contract and is available through the running backend. External systems such as `HCMUT_SSO`, `HCMUT_DATACORE`, BKPay, and the IoT Gateway are mocked in this MVP.

## 2. How to run

Backend:

```bash
cd smart-parking-backend
npm install
npm run dev
```

Frontend:

```bash
cd SMART_PARKING_252-merged
npm install
npm run dev
```

Backend URL:

```txt
http://localhost:3000
```

Frontend URL:

```txt
http://localhost:5173
```

Swagger:

```txt
http://localhost:3000/api-docs
```

## 3. Environment

Backend `.env.example`:

```env
PORT=3000
NODE_ENV=development
CORS_ORIGIN=http://localhost:5173,http://127.0.0.1:5173
```

Frontend `.env`:

```env
VITE_API_BASE_URL=http://localhost:3000
```

## 4. Demo accounts

| Role | Email | Password |
| --- | --- | --- |
| Student | student@hcmut.edu.vn | student123 |
| Lecturer | lecturer@hcmut.edu.vn | lecturer123 |
| Admin | admin@hcmut.edu.vn | admin123 |
| Employee | employee@hcmut.edu.vn | employee123 |

## 5. Implemented shared APIs

- `GET /api/health`
- `GET /api/debug/state`
- `POST /api/debug/reset`
- `POST /api/auth/login`
- `GET /api/users/me`
- `GET /api/parking/map`
- `GET /api/parking/zones/status`
- `POST /api/parking/check-in`
- `POST /api/parking/check-out`
- `POST /api/payments/bkpay/qr`
- `GET /api/payments/:qrToken/status`
- `POST /api/payments/:qrToken/confirm`

## 6. Implemented Student APIs

- `GET /api/student/profile`
- `POST /api/student/topup`
- `POST /api/student/subscribe`
- `GET /api/student/parking-history`

Student subscription can be activated by a completed payment or by wallet balance. Parking history is filtered by `userId` and supports pagination. Check-in and check-out use the shared Parking API.

## 7. Implemented Lecturer APIs

- `GET /api/lecturer/profile`
- `GET /api/lecturer/quota`
- `GET /api/lecturer/entry-history`
- `GET /api/lecturer/frequency`
- `POST /api/lecturer/quota/purchase`

Lecturer quota is auto-created for the current month if no quota exists. Check-in increases `currentUsage`. Quota purchase increases `monthlyLimit`. Frequency is calculated from parking sessions.

## 8. Shared modules teammate should reuse

- `ParkingService`: shared check-in/check-out, active session validation, spot assignment, and spot release.
- `PaymentService`: BKPay QR intent, payment status, payment confirmation, and subscription/quota effects.
- `AuditService`: centralized action logging for login, payment, parking, and student/lecturer actions.
- `ZoneService`: zone-level parking status aggregation.
- `parkingSessions.data.js`: shared in-memory session store.
- `parkingSpots.data.js`: shared in-memory spot/status store.
- `payments.data.js`: shared in-memory payment intent store.
- `auditLogs.data.js`: shared in-memory audit log store.

Do not create duplicate parking session or payment flows. Admin, Employee, and Visitor work should reuse the shared services and data modules.

## 9. Recommended responsibility split

| Area | Owner |
| --- | --- |
| Student | Huy |
| Lecturer | Huy |
| Shared Auth/Parking/Payment core | Huy, shared for reuse |
| Admin | Teammate |
| Employee | Teammate |
| Visitor ticket/session | Teammate or shared ParkingService extension |
| Maintenance issues | Teammate |
| Reports/statistics | Teammate |
| Pricing policy config | Teammate |

## 10. Debug and reset

Use `GET /api/debug/state` to inspect counts for users, spots, active sessions, payments, audit logs, and the latest audit logs.

Use `POST /api/debug/reset` to reset all in-memory data back to the initial seed. Reset before every demo so the flow starts from a known state.

## 11. Known limitations

- No real database.
- Token is a mock token: `mock-token:<userId>`.
- SSO, DataCore, BKPay, and IoT Gateway are mocked.
- Admin, Employee, Maintenance, and Visitor flows are shallow or reserved for teammate extension.
- In-memory data is lost when the server restarts.

## 12. Git notes

Branch integration hiện tại: `FE-+-BE`.

Do not push `.env`, `node_modules`, `dist`, or generated local artifacts.

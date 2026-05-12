# Smart Parking Demo Script

## 1. Preparation

Checkout branch:

```bash
git checkout FE-+-BE
```

Start backend:

```bash
cd smart-parking-backend
npm install
npm run dev
```

Start frontend:

```bash
cd SMART_PARKING_252-merged
npm install
npm run dev
```

Open:

- Frontend: `http://localhost:5173`
- Swagger: `http://localhost:3000/api-docs`

Reset state before demo:

```bash
curl -X POST http://localhost:3000/api/debug/reset
```

## 2. Student flow

1. Login with `student@hcmut.edu.vn` / `student123`.
2. Open Dashboard.

Expected:

- Student info appears.
- Parking summary loads from backend.

3. Open Profile.

Expected:

- Profile data loads from `GET /api/users/me` or student profile.

4. Open History.

Expected:

- Student parking history loads from backend.

5. Open Payment.
6. Create BKPay QR for subscription.
7. Confirm by clicking `Tôi đã thanh toán`.

Expected:

- Payment status becomes completed.
- Subscription is active.

8. Open Parking.
9. Perform check-in.

Expected:

- A spot becomes occupied.
- Session becomes active.
- Audit log is created.

10. Perform check-out.

Expected:

- Session becomes completed.
- Spot becomes available again.
- Audit log is created.

## 3. Lecturer flow

1. Logout or clear session if needed.
2. Login with `lecturer@hcmut.edu.vn` / `lecturer123`.
3. Open Dashboard.

Expected:

- Lecturer quota loads from backend.

4. Open Frequency.

Expected:

- Frequency and entry history load from backend.

5. Open Payment.
6. Create BKPay QR for quota purchase.
7. Confirm by clicking `Tôi đã thanh toán`.

Expected:

- Quota `monthlyLimit` increases.

8. Open Parking.
9. Perform check-in.

Expected:

- `currentUsage` increases.
- Remaining quota decreases.

10. Perform check-out.

Expected:

- Session completed.
- Spot released.

## 4. Swagger/debug proof

Open Swagger:

```txt
http://localhost:3000/api-docs
```

Open debug state:

```bash
curl http://localhost:3000/api/debug/state
```

Expected:

- `payments` count increases after QR creation.
- `auditLogs` count increases after login/payment/check-in/check-out.
- `activeSessions` changes after check-in/check-out.

## 5. Troubleshooting

- CORS error if FE opened with wrong host: use `http://localhost:5173` or ensure CORS allows `http://127.0.0.1:5173`.
- Backend not running: start backend with `npm run dev`.
- FE still using mock: check `.env` has `VITE_API_BASE_URL=http://localhost:3000`, then check the Network tab.
- Port 3000 busy: change `PORT` in backend `.env`.
- Demo state messy: run `POST /api/debug/reset`.
- Token issue: clear `localStorage` and login again.

## 6. Mapping to design/use cases

| Use case | Demo implementation |
| --- | --- |
| UC001 Login via SSO | `POST /api/auth/login`, mock SSO |
| UC002 Internal card scan | `POST /api/parking/check-in`, `POST /api/parking/check-out` |
| UC005 Prepaid payment | BKPay QR + confirm payment |
| UC006 Parking status guidance | `GET /api/parking/map`, `GET /api/parking/zones/status` |

For MVP, external systems are mocked but the flow follows the submitted sequence and activity diagrams.

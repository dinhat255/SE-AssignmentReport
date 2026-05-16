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
## 4. Admin flow
1. Logout or clear session if needed.
2. Login with HCMUT_SSO(lecture/student/employee).
3. Open Dashboard.
4. Open Pariking(tình trạng) .
5. Check in/out
6. /api/admin/audit-logs
7.  History load from backend
8. /api/admin/users
9. Display all users in system
## 5. Employee flow
1. Login:
 - Access the system with the employee account: 
     employee@hcmut.edu.vn / employee123.
2. Initial Data Verification:
- Navigate to the Maintenance page.
- Execute the GET /api/employee/incidents endpoint.

Expected: 
- The incident list on the UI matches the Swagger response exactly (e.g., displaying existing records like M001, M002,...).

3. Report a New Incident:
- Action: 
    Click the "Report New Incident" button on the UI. Fill in the required details (Spot ID, Incident Type, Description) and click "Submit".
- Expected on UI:
     A success notification appears, and the new incident (e.g., M006) is immediately added to the table.

4. Verify New Incident :
- Action: 
    Return to execute the GET /api/employee/incidents endpoint again.
- Expected: 
    The newly created incident (M006) now appears in the Backend JSON response, proving the UI successfully sent the data.

5. Resolve an Incident & Update Status:

- Action:  
    On the UI,  click the "Xử lý/Hoàn tất" button.
- Expected : 
    The incident status changes to "Đã xử lý" (or In-progress).

6. Final Synchronization Check:
- Action: 
    Execute the GET /api/employee/incidents endpoint on Swagger one last time.
- Expected:
    The status field for that specific incident has been updated to "Đã xử lý" in the database.
## 6. Visitor flow
1. A visitor vehicle arrives at the parking entrance.
2. Perform POST /api/visitor/check-in via Swagger or the entrance kiosk.
Expected:
- The system records the entry of the vehicle.
- A new visitorTicket is created with an ACTIVE status.
3. The vehicle moves to and occupies an available parking spot (e.g., A05).
Expected:
- The sensor SENSOR-A05 updates the spot status to OCCUPIED on the Dashboard.
4. When the visitor is ready to leave, perform POST /api/visitor/check-out.
Expected:
- The system calculates the parking fee based on the actual duration and the pricing policy.
- The total amount due is displayed for the user.
5. Perform POST /api/visitor/payment to settle the parking fee.
Expected:
- The ticket status changes to COMPLETED upon successful payment.
- The parking spot A05 is released and returns to AVAILABLE status.
## 6. Swagger/debug proof

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

## 7. Troubleshooting

- CORS error if FE opened with wrong host: use `http://localhost:5173` or ensure CORS allows `http://127.0.0.1:5173`.
- Backend not running: start backend with `npm run dev`.
- FE still using mock: check `.env` has `VITE_API_BASE_URL=http://localhost:3000`, then check the Network tab.
- Port 3000 busy: change `PORT` in backend `.env`.
- Demo state messy: run `POST /api/debug/reset`.
- Token issue: clear `localStorage` and login again.

## 7. Mapping to design/use cases

| Use case | Demo implementation |
| --- | --- |
| UC001 Login via SSO | `POST /api/auth/login`, mock SSO |
| UC002 Internal card scan | `POST /api/parking/check-in`, `POST /api/parking/check-out` |
| UC005 Prepaid payment | BKPay QR + confirm payment |
| UC006 Parking status guidance | `GET /api/parking/map`, `GET /api/parking/zones/status` |
| UC008 statistical & Export report file |  `GET /api/reports/{type}/export `|
| UC 003 Guest card scan | `POST /api/visitor/check-in` , `POST /api/visitor/check-in` |
| UC 004 On-site payment  | `POST /api/visitor/payment` |
| UC 009 Monitoring and data synchronization |   `GET /api/admin/users` + `GET /api/admin/audit-logs` |
| UC 010 Fixed on-site treatment |  `GET /api/employee/incidents`| 
| UC 007 Pricing policy | `POST /api/admin/policy/pricing` , `GET /api/admin/policy/pricing` |
For MVP, external systems are mocked but the flow follows the submitted sequence and activity diagrams.

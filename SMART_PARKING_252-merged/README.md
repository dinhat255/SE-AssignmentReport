 # Smart Parking 252

Frontend for the Smart Parking system built with Vite, React, TypeScript, Tailwind CSS, and `react-router`.

## Setup

```bash
npm install
npm run dev
```

## Scripts

- `npm run dev` starts the local Vite server.
- `npm run build` creates a production build.

## Main Screens

- Public home and login pages.
- Dashboard shell with role-aware navigation and header.
- Parking map, parking history, monthly payment, login frequency, profile, and maintenance pages.

## Roles

The app currently supports four role values stored in local storage and used by the UI:

- `student`
- `lecturer`
- `admin`
- `employee`

## Mock Data and Handoff

Some pages still use the local mock layer in `src/mocks/mockData.ts` so the frontend can run without a backend. The current frontend/backend contract is documented in:

- [guidelines/FRONTEND_BACKEND_MOCKDATA_CONTRACT.md](guidelines/FRONTEND_BACKEND_MOCKDATA_CONTRACT.md)
- [guidelines/BACKEND_API_SUMMARY.md](guidelines/BACKEND_API_SUMMARY.md)

## Notes

- BKPay payment uses `POST /api/payments/bkpay/qr` and expects either `qrImageUrl` or `qrCodeBase64` in the response.
- The dashboard and protected pages render role-specific UI and hide unsupported actions for the current role.
  

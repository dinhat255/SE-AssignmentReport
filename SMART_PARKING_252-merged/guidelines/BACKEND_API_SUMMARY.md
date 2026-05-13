# Backend API Summary

This document summarizes the current frontend expectations so the backend can replace mock data with real APIs.

## Authentication and Role Context

Frontend files:
- `src/app/pages/Login.tsx`
- `src/app/components/DashboardHeader.tsx`
- `src/app/components/Sidebar.tsx`
- `src/app/pages/dashboard/Profile.tsx`

Expected login outcome:
- `userType`
- `accountRole`
- `userName`
- `userId`
- `email`
- `department`

Supported roles:
- `student`
- `lecturer`
- `admin`
- `employee`

## Dashboard Summary

Frontend file:
- `src/app/pages/dashboard/Dashboard.tsx`

Current data needs:
- wallet balance
- parking availability summary
- parking map grid
- monthly login frequency
- recent activity feed

Suggested endpoints:
- `GET /api/dashboard/summary`
- `GET /api/dashboard/parking-map`
- `GET /api/dashboard/activity`

## Monthly Payment and BKPay QR

Frontend file:
- `src/app/pages/dashboard/Payment.tsx`

Current contract:
- `POST /api/payments/bkpay/qr`

Request body:
- `amount`
- `role`
- `context` (`student` or `lecturer`)
- `expiresInSeconds`

Expected response:
- `qrImageUrl` or `qrCodeBase64`
- `qrToken`
- `expiresInSeconds`

## Login Frequency and Lecturer Usage

Frontend file:
- `src/app/pages/dashboard/LoginFrequency.tsx`

Backend should provide:
- monthly login frequency data
- remaining access quota for lecturer users
- entry/exit history

Suggested endpoints:
- `GET /api/login-frequency?period=monthly&role=lecturer`
- `GET /api/entry-history?role=lecturer`

## Maintenance

Frontend file:
- `src/app/pages/dashboard/Maintenance.tsx`

Backend should support:
- list issues
- create new report
- upload attachments
- update issue status

Suggested endpoints:
- `GET /api/maintenance/issues`
- `POST /api/maintenance/report`
- `PATCH /api/maintenance/issues/:id`

## Parking History

Frontend file:
- `src/app/pages/dashboard/MyHistory.tsx`

Backend should return:
- paginated history list
- total count
- ticket type and fee metadata

Suggested endpoint:
- `GET /api/history?page=1&limit=5`

## Notes for Implementation

- Keep role values consistent across auth, profile, sidebar, and dashboard responses.
- Preserve the existing field names where possible so the frontend can swap from mocks to real responses with minimal changes.
- If a response can be empty or delayed, return a normal success payload with an empty `data` array rather than a hard error when possible.

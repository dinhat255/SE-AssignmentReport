import { createBrowserRouter } from 'react-router';
import { Home } from './pages/Home';
import { Login } from './pages/Login';
import { DashboardLayout } from './layouts/DashboardLayout';
import { Dashboard } from './pages/dashboard/Dashboard';
import { Parking } from './pages/dashboard/Parking';
import { MyHistory } from './pages/dashboard/MyHistory';
import { Payment } from './pages/dashboard/Payment';
import { Profile } from './pages/dashboard/Profile';
import { LoginFrequency } from './pages/dashboard/LoginFrequency';
import { Maintenance } from './pages/dashboard/Maintenance';


export const router = createBrowserRouter([
  {
    path: '/',
    Component: Home,
  },
  {
    path: '/login',
    Component: Login,
  },
  {
    path: '/dashboard',
    Component: DashboardLayout,
    children: [
      {
        index: true,
        Component: Dashboard,
      },
      {
        path: 'parking',
        Component: Parking,
      },
      {
        path: 'history',
        Component: MyHistory,
      },
      {
        path: 'payment',
        Component: Payment,
      },
      {
        path: 'frequency',
        Component: LoginFrequency,
      },
      {
        path: 'maintenance',
        Component: Maintenance,
      },
      {
        path: 'profile',
        Component: Profile,
      },
    ],
  },
]);
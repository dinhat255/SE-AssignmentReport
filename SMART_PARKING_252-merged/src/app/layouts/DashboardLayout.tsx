import { Outlet } from 'react-router';
import { Sidebar } from '../components/Sidebar';
import { DashboardHeader } from '../components/DashboardHeader';

export function DashboardLayout() {
  return (
    <div className="flex min-h-screen flex-col lg:flex-row bg-gray-50">
      <Sidebar />
      <div className="flex-1 flex flex-col">
        <DashboardHeader />
        <main className="flex-1 overflow-auto">
          <Outlet />
        </main>
      </div>
    </div>
  );
}

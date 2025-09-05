import React from 'react';
import AdminSidebar from './AdminSidebar';
import AdminHeader from './AdminHeader';

const AdminLayout = ({ children }) => (
  <div className="min-h-screen flex bg-dark-950">
    <AdminSidebar />
    <div className="flex-1 flex flex-col">
      <AdminHeader />
      <main className="flex-1 p-6 overflow-auto">{children}</main>
    </div>
  </div>
);

export default AdminLayout; 
import React from 'react';

const AdminHeader = () => (
  <header className="bg-dark-900 border-b border-dark-800 p-4 flex items-center justify-between">
    <h2 className="text-lg font-bold text-white">Admin Dashboard</h2>
    <div>{/* Admin actions (notifications, profile, etc.) */}</div>
  </header>
);

export default AdminHeader; 
import React from 'react';

const AdminDashboard = () => (
  <div>
    <h1 className="text-2xl font-bold text-white mb-6">Welcome, Admin!</h1>
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      <div className="bg-dark-800 rounded-xl p-6">
        <div className="text-dark-400 text-sm mb-2">Total Users</div>
        <div className="text-3xl font-bold text-white">1,234</div>
      </div>
      <div className="bg-dark-800 rounded-xl p-6">
        <div className="text-dark-400 text-sm mb-2">Active Streams</div>
        <div className="text-3xl font-bold text-white">56</div>
      </div>
      <div className="bg-dark-800 rounded-xl p-6">
        <div className="text-dark-400 text-sm mb-2">Reports</div>
        <div className="text-3xl font-bold text-white">7</div>
      </div>
    </div>
  </div>
);

export default AdminDashboard; 
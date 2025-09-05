import React, { useEffect, useState } from 'react';
import { fetchAnalyticsSummary } from '../../utils/api/admin';
import { Users, Video, Flag, BarChart2 } from 'lucide-react';

const mock = {
  users: 1200,
  streams: 340,
  reports: 27,
  active: 89,
};

const AdminAnalytics = () => {
  const [summary, setSummary] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchAnalyticsSummary()
      .then(res => setSummary(res.data))
      .catch(() => setSummary(mock))
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <div className="flex items-center gap-2 text-white"><BarChart2 className="animate-pulse" /> Loading analytics...</div>;
  if (error) return <div className="text-red-400">{error}</div>;

  return (
    <div>
      <h1 className="text-2xl font-bold text-white mb-6">Platform Analytics</h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6 mb-8">
        <div className="bg-dark-800 rounded-xl p-6 flex flex-col items-center shadow-lg">
          <Users size={32} className="text-primary-400 mb-2" />
          <div className="text-2xl font-bold text-white">{summary?.users ?? mock.users}</div>
          <div className="text-dark-300">Total Users</div>
        </div>
        <div className="bg-dark-800 rounded-xl p-6 flex flex-col items-center shadow-lg">
          <Video size={32} className="text-blue-400 mb-2" />
          <div className="text-2xl font-bold text-white">{summary?.streams ?? mock.streams}</div>
          <div className="text-dark-300">Total Streams</div>
        </div>
        <div className="bg-dark-800 rounded-xl p-6 flex flex-col items-center shadow-lg">
          <Flag size={32} className="text-red-400 mb-2" />
          <div className="text-2xl font-bold text-white">{summary?.reports ?? mock.reports}</div>
          <div className="text-dark-300">Reports</div>
        </div>
        <div className="bg-dark-800 rounded-xl p-6 flex flex-col items-center shadow-lg">
          <BarChart2 size={32} className="text-green-400 mb-2" />
          <div className="text-2xl font-bold text-white">{summary?.active ?? mock.active}</div>
          <div className="text-dark-300">Active Streams</div>
        </div>
      </div>
      <div className="bg-dark-900 rounded-xl p-8 shadow-lg border border-dark-700">
        <h2 className="text-xl font-bold text-white mb-4">Trends & Charts</h2>
        <div className="text-dark-400">(Charts and analytics visualizations will go here.)</div>
      </div>
    </div>
  );
};

export default AdminAnalytics; 
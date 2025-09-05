import React, { useEffect, useState } from 'react';
import { fetchAllReports, resolveReport } from '../../utils/api/admin';
import { User as UserIcon, Loader2, Search, CheckCircle } from 'lucide-react';

const AdminReports = () => {
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [search, setSearch] = useState('');
  const [confirm, setConfirm] = useState(null); // reportId
  const [actionLoading, setActionLoading] = useState('');

  const loadReports = async () => {
    setLoading(true);
    setError('');
    try {
      const res = await fetchAllReports();
      setReports(res.data || []);
    } catch (err) {
      setError('Failed to load reports');
    }
    setLoading(false);
  };

  useEffect(() => {
    loadReports();
  }, []);

  const handleResolve = async (reportId) => {
    setActionLoading(reportId);
    await resolveReport(reportId);
    await loadReports();
    setActionLoading('');
    setConfirm(null);
  };

  const filtered = reports.filter(r =>
    r.reason?.toLowerCase().includes(search.toLowerCase()) ||
    r.reporter?.username?.toLowerCase().includes(search.toLowerCase())
  );

  if (loading) return <div className="flex items-center gap-2 text-white"><Loader2 className="animate-spin" /> Loading...</div>;
  if (error) return <div className="text-red-400">{error}</div>;

  return (
    <div>
      <h1 className="text-2xl font-bold text-white mb-6">Reports</h1>
      <div className="flex items-center mb-4 gap-2">
        <div className="relative w-full max-w-xs">
          <input
            className="w-full bg-dark-800 border border-dark-700 rounded-lg px-10 py-2 text-white placeholder-dark-400 focus:outline-none focus:ring-2 focus:ring-primary-500"
            placeholder="Search by reason or reporter..."
            value={search}
            onChange={e => setSearch(e.target.value)}
          />
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-dark-400" size={18} />
        </div>
      </div>
      <div className="overflow-x-auto rounded-lg shadow-lg">
        <table className="min-w-full bg-dark-900">
          <thead>
            <tr className="bg-dark-800 text-white">
              <th className="px-4 py-3 text-left font-semibold">Reporter</th>
              <th className="px-4 py-3 text-left font-semibold">Reason</th>
              <th className="px-4 py-3 text-left font-semibold">Status</th>
              <th className="px-4 py-3 text-left font-semibold">Actions</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map(report => (
              <tr key={report._id} className="border-b border-dark-800 hover:bg-dark-800/60 transition-colors">
                <td className="px-4 py-3 flex items-center gap-2">
                  {report.reporter?.avatar
                    ? <img src={report.reporter.avatar} alt={report.reporter.username} className="w-7 h-7 rounded-full" />
                    : <UserIcon size={18} className="text-dark-400" />}
                  <span>{report.reporter?.username}</span>
                </td>
                <td className="px-4 py-3">{report.reason}</td>
                <td className="px-4 py-3">
                  <span className={`inline-block px-3 py-1 rounded-full text-xs font-semibold ${report.status === 'resolved' ? 'bg-green-700 text-green-100' : 'bg-yellow-700 text-yellow-100'}`}>
                    {report.status}
                  </span>
                </td>
                <td className="px-4 py-3">
                  {report.status !== 'resolved' && (
                    <button
                      className="bg-green-600 hover:bg-green-700 text-white px-3 py-1 rounded flex items-center gap-1 transition-all focus:ring-2 focus:ring-green-500"
                      title="Resolve Report"
                      onClick={() => setConfirm(report._id)}
                      disabled={actionLoading === report._id}
                    >
                      <CheckCircle size={16} />
                      {actionLoading === report._id ? 'Resolving...' : 'Resolve'}
                    </button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {/* Confirmation Modal */}
      {confirm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70">
          <div className="bg-dark-900 rounded-xl p-8 shadow-lg w-full max-w-sm border border-dark-700 relative">
            <h2 className="text-xl font-bold text-white mb-4">Confirm Resolve</h2>
            <p className="text-dark-300 mb-6">
              Are you sure you want to mark this report as <span className="font-semibold text-green-400">resolved</span>?
            </p>
            <div className="flex gap-4 justify-end">
              <button
                className="px-4 py-2 rounded-lg bg-dark-700 text-white hover:bg-dark-600 transition-all"
                onClick={() => setConfirm(null)}
                disabled={actionLoading}
              >
                Cancel
              </button>
              <button
                className="px-4 py-2 rounded-lg bg-green-600 text-white hover:bg-green-700 font-semibold transition-all disabled:opacity-60"
                onClick={() => handleResolve(confirm)}
                disabled={actionLoading}
              >
                {actionLoading ? 'Processing...' : 'Yes, Resolve'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminReports; 
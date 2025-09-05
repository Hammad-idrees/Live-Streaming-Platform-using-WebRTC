import React, { useEffect, useState } from 'react';
import { fetchAllStreams } from '../../utils/api/admin';
import { Video, User as UserIcon, Loader2, Search } from 'lucide-react';

const AdminStreams = () => {
  const [streams, setStreams] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [search, setSearch] = useState('');

  useEffect(() => {
    fetchAllStreams()
      .then(res => setStreams(res.data || []))
      .catch(() => setError('Failed to load streams'))
      .finally(() => setLoading(false));
  }, []);

  const filtered = streams.filter(s =>
    s.title?.toLowerCase().includes(search.toLowerCase()) ||
    s.user?.username?.toLowerCase().includes(search.toLowerCase())
  );

  if (loading) return <div className="flex items-center gap-2 text-white"><Loader2 className="animate-spin" /> Loading...</div>;
  if (error) return <div className="text-red-400">{error}</div>;

  return (
    <div>
      <h1 className="text-2xl font-bold text-white mb-6">Streams</h1>
      <div className="flex items-center mb-4 gap-2">
        <div className="relative w-full max-w-xs">
          <input
            className="w-full bg-dark-800 border border-dark-700 rounded-lg px-10 py-2 text-white placeholder-dark-400 focus:outline-none focus:ring-2 focus:ring-primary-500"
            placeholder="Search by title or user..."
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
              <th className="px-4 py-3 text-left font-semibold">Title</th>
              <th className="px-4 py-3 text-left font-semibold">User</th>
              <th className="px-4 py-3 text-left font-semibold">Status</th>
              <th className="px-4 py-3 text-left font-semibold">Actions</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map(stream => (
              <tr key={stream._id} className="border-b border-dark-800 hover:bg-dark-800/60 transition-colors">
                <td className="px-4 py-3">{stream.title}</td>
                <td className="px-4 py-3 flex items-center gap-2">
                  {stream.user?.avatar
                    ? <img src={stream.user.avatar} alt={stream.user.username} className="w-7 h-7 rounded-full" />
                    : <UserIcon size={18} className="text-dark-400" />}
                  <span>{stream.user?.username}</span>
                </td>
                <td className="px-4 py-3">
                  <span className="inline-block px-3 py-1 rounded-full text-xs font-semibold bg-blue-700 text-blue-100">
                    {stream.status || 'Active'}
                  </span>
                </td>
                <td className="px-4 py-3">
                  {/* Add actions here if needed */}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default AdminStreams; 
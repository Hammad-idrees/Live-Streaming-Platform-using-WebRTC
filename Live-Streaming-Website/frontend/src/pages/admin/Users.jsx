import React, { useEffect, useState } from 'react';
import { fetchAllUsers, promoteToStreamer, demoteToUser, promoteToAdmin } from '../../utils/api/admin';
import { Shield, ArrowUp, ArrowDown, User as UserIcon, Loader2, Search } from 'lucide-react';

const roleColors = {
  admin: 'bg-yellow-600 text-yellow-100',
  streamer: 'bg-blue-600 text-blue-100',
  user: 'bg-dark-700 text-dark-200',
};

const AdminUsers = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [actionLoading, setActionLoading] = useState('');
  const [confirm, setConfirm] = useState(null); // { user, action }
  const [search, setSearch] = useState('');

  const loadUsers = async () => {
    setLoading(true);
    setError('');
    try {
      const res = await fetchAllUsers();
      setUsers(res.data || []);
    } catch (err) {
      setError('Failed to load users');
    }
    setLoading(false);
  };

  useEffect(() => {
    loadUsers();
  }, []);

  const handleAction = async (user, action) => {
    setActionLoading(user._id + '-' + action);
    if (action === 'promote') await promoteToStreamer(user._id);
    if (action === 'demote') await demoteToUser(user._id);
    if (action === 'admin') await promoteToAdmin(user._id);
    await loadUsers();
    setActionLoading('');
    setConfirm(null);
  };

  const filteredUsers = users.filter(u =>
    u.username.toLowerCase().includes(search.toLowerCase()) ||
    u.email?.toLowerCase().includes(search.toLowerCase())
  );

  if (loading) return <div className="flex items-center gap-2 text-white"><Loader2 className="animate-spin" /> Loading...</div>;
  if (error) return <div className="text-red-400">{error}</div>;

  return (
    <div>
      <h1 className="text-2xl font-bold text-white mb-6">User Management</h1>
      <div className="flex items-center mb-4 gap-2">
        <div className="relative w-full max-w-xs">
          <input
            className="w-full bg-dark-800 border border-dark-700 rounded-lg px-10 py-2 text-white placeholder-dark-400 focus:outline-none focus:ring-2 focus:ring-primary-500"
            placeholder="Search by username or email..."
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
              <th className="px-4 py-3 text-left font-semibold">User</th>
              <th className="px-4 py-3 text-left font-semibold">Email</th>
              <th className="px-4 py-3 text-left font-semibold">Role</th>
              <th className="px-4 py-3 text-left font-semibold">Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredUsers.map(u => (
              <tr key={u._id} className="border-b border-dark-800 hover:bg-dark-800/60 transition-colors group">
                <td className="px-4 py-3 flex items-center gap-3 min-w-[200px]">
                  {u.avatar ? (
                    <img src={u.avatar} alt={u.username} className="w-9 h-9 rounded-full object-cover border-2 border-dark-700" />
                  ) : (
                    <div className="w-9 h-9 rounded-full bg-dark-700 flex items-center justify-center text-dark-300">
                      <UserIcon size={20} />
                    </div>
                  )}
                  <span className="font-medium text-white">{u.username}</span>
                </td>
                <td className="px-4 py-3 text-dark-200">{u.email || <span className="italic text-dark-500">N/A</span>}</td>
                <td className="px-4 py-3">
                  <span className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-semibold uppercase ${roleColors[u.role] || 'bg-dark-700 text-dark-200'}`}>
                    {u.role === 'admin' && <Shield size={14} className="mr-1" />}
                    {u.role}
                  </span>
                </td>
                <td className="px-4 py-3 space-x-2 flex items-center">
                  {u.role !== 'streamer' && u.role !== 'admin' && (
                    <button
                      className="bg-primary-600 hover:bg-primary-700 text-white px-3 py-1 rounded flex items-center gap-1 transition-all focus:ring-2 focus:ring-primary-500"
                      title="Promote to Streamer"
                      onClick={() => setConfirm({ user: u, action: 'promote' })}
                      disabled={actionLoading === u._id + '-promote'}
                    >
                      <ArrowUp size={16} />
                      {actionLoading === u._id + '-promote' ? 'Promoting...' : 'Promote'}
                    </button>
                  )}
                  {u.role === 'streamer' && (
                    <button
                      className="bg-dark-700 hover:bg-dark-600 text-white px-3 py-1 rounded flex items-center gap-1 transition-all focus:ring-2 focus:ring-blue-500"
                      title="Demote to User"
                      onClick={() => setConfirm({ user: u, action: 'demote' })}
                      disabled={actionLoading === u._id + '-demote'}
                    >
                      <ArrowDown size={16} />
                      {actionLoading === u._id + '-demote' ? 'Demoting...' : 'Demote'}
                    </button>
                  )}
                  {u.role !== 'admin' && (
                    <button
                      className="bg-yellow-600 hover:bg-yellow-700 text-white px-3 py-1 rounded flex items-center gap-1 transition-all focus:ring-2 focus:ring-yellow-500"
                      title="Promote to Admin"
                      onClick={() => setConfirm({ user: u, action: 'admin' })}
                      disabled={actionLoading === u._id + '-admin'}
                    >
                      <Shield size={16} />
                      {actionLoading === u._id + '-admin' ? 'Promoting...' : 'Admin'}
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
            <h2 className="text-xl font-bold text-white mb-4">Confirm Action</h2>
            <p className="text-dark-300 mb-6">
              Are you sure you want to <span className="font-semibold text-primary-400">{confirm.action === 'promote' ? 'promote this user to streamer' : confirm.action === 'demote' ? 'demote this streamer to user' : 'promote this user to admin'}</span>?
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
                className={`px-4 py-2 rounded-lg font-semibold transition-all disabled:opacity-60 ${confirm.action === 'admin' ? 'bg-yellow-600 hover:bg-yellow-700 text-white' : confirm.action === 'demote' ? 'bg-dark-700 hover:bg-dark-600 text-white' : 'bg-primary-600 hover:bg-primary-700 text-white'}`}
                onClick={() => handleAction(confirm.user, confirm.action)}
                disabled={actionLoading}
              >
                {actionLoading ? 'Processing...' : 'Yes, Confirm'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminUsers; 
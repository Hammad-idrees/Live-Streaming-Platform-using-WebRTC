import React from 'react';
import { NavLink } from 'react-router-dom';
import { LayoutDashboard, Users, Video, Flag, List, BarChart3, Settings } from 'lucide-react';

const links = [
  { to: '/admin', label: 'Dashboard', icon: LayoutDashboard },
  { to: '/admin/users', label: 'Users', icon: Users },
  { to: '/admin/streams', label: 'Streams', icon: Video },
  { to: '/admin/reports', label: 'Reports', icon: Flag },
  { to: '/admin/categories', label: 'Categories', icon: List },
  { to: '/admin/analytics', label: 'Analytics', icon: BarChart3 },
  { to: '/admin/settings', label: 'Settings', icon: Settings },
];

const AdminSidebar = () => (
  <aside className="w-64 bg-dark-900 border-r border-dark-800 h-screen flex flex-col">
    <div className="p-6 border-b border-dark-800">
      <h1 className="text-xl font-bold text-white">Admin Panel</h1>
    </div>
    <nav className="flex-1 p-4 space-y-2">
      {links.map(link => (
        <NavLink
          key={link.to}
          to={link.to}
          className={({ isActive }) =>
            `flex items-center gap-3 px-3 py-2 rounded-lg transition-all font-medium ${
              isActive ? 'bg-primary-600/20 text-primary-300' : 'text-dark-300 hover:text-white hover:bg-dark-800'
            }`
          }
          end={link.to === '/admin'}
        >
          <link.icon size={20} />
          {link.label}
        </NavLink>
      ))}
    </nav>
  </aside>
);

export default AdminSidebar; 
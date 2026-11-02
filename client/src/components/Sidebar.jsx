import { NavLink } from 'react-router-dom';
import { LayoutDashboard, ShieldAlert, LogOut, Code2, Eye } from 'lucide-react';
import { useAuth } from '../hooks/useAuth';

const Sidebar = ({ isOpen, onClose }) => {
  const { logout, isAdmin } = useAuth();

  const menuItems = [
    {
      name: 'Candidate Portal',
      path: '/dashboard',
      icon: <LayoutDashboard size={18} />,
    },
  ];

  if (isAdmin) {
    menuItems.push({
      name: 'Admin Proctor View',
      path: '/admin',
      icon: <ShieldAlert size={18} />,
    });
  }

  return (
    <>
      {/* Mobile Drawer Overlay Backdrop */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-30 lg:hidden"
          onClick={onClose}
        />
      )}

      {/* Sidebar Container */}
      <aside
        className={`fixed top-0 bottom-0 left-0 z-40 w-64 bg-white dark:bg-slate-900 border-r border-slate-200 dark:border-slate-800 transition-transform duration-300 transform lg:translate-x-0 ${
          isOpen ? 'translate-x-0' : '-translate-x-full'
        } lg:static lg:h-[calc(100vh-73px)] lg:flex lg:flex-col lg:justify-between p-4`}
      >
        <div className="space-y-6 pt-16 lg:pt-0">
          <p className="px-3 text-xs font-semibold text-slate-400 uppercase tracking-wider">
            Navigation
          </p>

          <nav className="space-y-1.5">
            {menuItems.map((item) => (
              <NavLink
                key={item.name}
                to={item.path}
                onClick={onClose}
                className={({ isActive }) =>
                  `flex items-center gap-3 px-4 py-2.5 rounded-xl text-xs font-bold transition-all duration-200 ${
                    isActive
                      ? 'bg-indigo-600 text-white shadow-md shadow-indigo-500/20'
                      : 'text-slate-600 dark:text-slate-400 hover:text-indigo-600 dark:hover:text-indigo-400 hover:bg-slate-100 dark:hover:bg-slate-800'
                  }`
                }
              >
                {item.icon}
                {item.name}
              </NavLink>
            ))}
          </nav>
        </div>

        <div className="pt-6 border-t border-slate-100 dark:border-slate-800 lg:mb-2">
          <button
            onClick={() => {
              onClose();
              logout();
            }}
            className="w-full flex items-center gap-3 px-4 py-2.5 rounded-xl text-xs font-bold text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-950/20 transition-all text-left"
          >
            <LogOut size={18} />
            Sign Out
          </button>
        </div>
      </aside>
    </>
  );
};

export default Sidebar;

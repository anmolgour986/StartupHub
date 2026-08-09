import { useState } from 'react';
import { Outlet, NavLink, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  LayoutDashboard,
  Compass,
  Rocket,
  ClipboardList,
  CheckSquare,
  MessageSquare,
  User,
  Shield,
  Menu,
  X,
  LogOut,
  Sun,
  Moon,
  Search,
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import Avatar from '../components/ui/Avatar';
import NotificationBell from '../components/dashboard/NotificationBell';

const navItems = [
  { to: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { to: '/discover', label: 'Discover', icon: Compass },
  { to: '/my-startups', label: 'My Startups', icon: Rocket },
  { to: '/my-applications', label: 'Applications', icon: ClipboardList },
  { to: '/my-tasks', label: 'My Tasks', icon: CheckSquare },
  { to: '/messages', label: 'Messages', icon: MessageSquare },
  { to: '/profile', label: 'Profile', icon: User },
];

const SidebarContent = ({ onNavigate }) => {
  const { user } = useAuth();
  return (
    <div className="flex flex-col h-full">
      <div className="px-5 py-5 flex items-center gap-2">
        <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-brand-500 to-brand-700 flex items-center justify-center">
          <Rocket size={16} className="text-white" />
        </div>
        <span className="font-bold text-lg tracking-tight">StartupHub</span>
      </div>

      <nav className="flex-1 px-3 space-y-1 overflow-y-auto">
        {navItems.map(({ to, label, icon: Icon }) => (
          <NavLink
            key={to}
            to={to}
            onClick={onNavigate}
            className={({ isActive }) =>
              `flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-colors ${
                isActive
                  ? 'bg-brand-50 text-brand-700 dark:bg-brand-500/10 dark:text-brand-400'
                  : 'text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800'
              }`
            }
          >
            <Icon size={18} />
            {label}
          </NavLink>
        ))}
        {user?.role === 'admin' && (
          <NavLink
            to="/admin"
            onClick={onNavigate}
            className={({ isActive }) =>
              `flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-colors ${
                isActive
                  ? 'bg-brand-50 text-brand-700 dark:bg-brand-500/10 dark:text-brand-400'
                  : 'text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800'
              }`
            }
          >
            <Shield size={18} />
            Admin Panel
          </NavLink>
        )}
      </nav>

      {user?.role === 'founder' && (
        <div className="px-3 pb-3">
          <NavLink to="/startups/new" onClick={onNavigate} className="btn-primary w-full">
            + New Startup
          </NavLink>
        </div>
      )}
    </div>
  );
};

const DashboardLayout = () => {
  const [mobileOpen, setMobileOpen] = useState(false);
  const { user, logout } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <div className="min-h-screen flex bg-gray-50 dark:bg-gray-950">
      {/* Desktop sidebar */}
      <aside className="hidden lg:flex lg:flex-col w-64 border-r border-gray-100 dark:border-gray-900 bg-white dark:bg-gray-950 sticky top-0 h-screen">
        <SidebarContent />
      </aside>

      {/* Mobile drawer */}
      <AnimatePresence>
        {mobileOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-gray-900/50 z-40 lg:hidden"
              onClick={() => setMobileOpen(false)}
            />
            <motion.aside
              initial={{ x: -280 }}
              animate={{ x: 0 }}
              exit={{ x: -280 }}
              transition={{ type: 'tween', duration: 0.2 }}
              className="fixed inset-y-0 left-0 w-72 bg-white dark:bg-gray-950 z-50 lg:hidden"
            >
              <div className="flex justify-end p-3">
                <button onClick={() => setMobileOpen(false)} className="btn-ghost !p-2 rounded-lg">
                  <X size={20} />
                </button>
              </div>
              <SidebarContent onNavigate={() => setMobileOpen(false)} />
            </motion.aside>
          </>
        )}
      </AnimatePresence>

      <div className="flex-1 min-w-0 flex flex-col">
        {/* Topbar */}
        <header className="sticky top-0 z-30 bg-white/80 dark:bg-gray-950/80 backdrop-blur border-b border-gray-100 dark:border-gray-900">
          <div className="flex items-center justify-between px-4 lg:px-6 h-16 gap-4">
            <div className="flex items-center gap-3 flex-1">
              <button onClick={() => setMobileOpen(true)} className="btn-ghost !p-2 rounded-lg lg:hidden">
                <Menu size={20} />
              </button>
              <div className="relative hidden sm:block max-w-xs w-full">
                <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                <input
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' && e.target.value.trim()) {
                      navigate(`/discover?search=${encodeURIComponent(e.target.value.trim())}`);
                    }
                  }}
                  placeholder="Search startups..."
                  className="input !pl-9 !py-2 text-sm"
                />
              </div>
            </div>

            <div className="flex items-center gap-2">
              <button onClick={toggleTheme} className="btn-ghost !p-2 rounded-lg" aria-label="Toggle theme">
                {theme === 'dark' ? <Sun size={18} /> : <Moon size={18} />}
              </button>

              <NotificationBell />

              <div className="w-px h-6 bg-gray-200 dark:bg-gray-800 mx-1 hidden sm:block" />

              <NavLink to="/profile" className="flex items-center gap-2 pl-1">
                <Avatar user={user} size="sm" />
                <span className="text-sm font-medium hidden sm:block">{user?.name?.split(' ')[0]}</span>
              </NavLink>

              <button onClick={handleLogout} className="btn-ghost !p-2 rounded-lg" title="Log out">
                <LogOut size={18} />
              </button>
            </div>
          </div>
        </header>

        <main className="flex-1 p-4 lg:p-6">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default DashboardLayout;

import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Rocket, Menu, X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '../../context/AuthContext';

const links = [
  { href: '#features', label: 'Features' },
  { href: '#how-it-works', label: 'How it works' },
  { href: '#startups', label: 'Startups' },
];

const Navbar = () => {
  const [open, setOpen] = useState(false);
  const { isAuthenticated } = useAuth();

  return (
    <header className="sticky top-0 z-40 bg-white/70 dark:bg-gray-950/70 backdrop-blur-lg border-b border-gray-100/80 dark:border-gray-900">
      <nav className="max-w-7xl mx-auto px-5 lg:px-8 h-16 flex items-center justify-between">
        <Link to="/" className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-brand-500 to-brand-700 flex items-center justify-center">
            <Rocket size={16} className="text-white" />
          </div>
          <span className="font-bold text-lg tracking-tight">StartupHub</span>
        </Link>

        <div className="hidden md:flex items-center gap-8">
          {links.map((l) => (
            <a key={l.href} href={l.href} className="text-sm font-medium text-gray-600 dark:text-gray-300 hover:text-brand-600 transition-colors">
              {l.label}
            </a>
          ))}
        </div>

        <div className="hidden md:flex items-center gap-3">
          {isAuthenticated ? (
            <Link to="/dashboard" className="btn-primary">Go to Dashboard</Link>
          ) : (
            <>
              <Link to="/login" className="btn-ghost">Log in</Link>
              <Link to="/register" className="btn-primary">Get Started</Link>
            </>
          )}
        </div>

        <button onClick={() => setOpen(true)} className="md:hidden btn-ghost !p-2 rounded-lg">
          <Menu size={22} />
        </button>
      </nav>

      <AnimatePresence>
        {open && (
          <>
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 bg-gray-900/50 z-50 md:hidden" onClick={() => setOpen(false)} />
            <motion.div
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'tween', duration: 0.2 }}
              className="fixed inset-y-0 right-0 w-72 bg-white dark:bg-gray-950 z-50 p-5 md:hidden"
            >
              <div className="flex justify-end mb-6">
                <button onClick={() => setOpen(false)} className="btn-ghost !p-2 rounded-lg">
                  <X size={20} />
                </button>
              </div>
              <div className="flex flex-col gap-1">
                {links.map((l) => (
                  <a key={l.href} href={l.href} onClick={() => setOpen(false)} className="px-3 py-3 rounded-xl text-sm font-medium hover:bg-gray-100 dark:hover:bg-gray-900">
                    {l.label}
                  </a>
                ))}
              </div>
              <div className="flex flex-col gap-2 mt-6">
                {isAuthenticated ? (
                  <Link to="/dashboard" className="btn-primary w-full">Go to Dashboard</Link>
                ) : (
                  <>
                    <Link to="/login" className="btn-secondary w-full">Log in</Link>
                    <Link to="/register" className="btn-primary w-full">Get Started</Link>
                  </>
                )}
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </header>
  );
};

export default Navbar;

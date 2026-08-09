import { useEffect, useRef, useState } from 'react';
import { Bell, CheckCheck } from 'lucide-react';
import { AnimatePresence, motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { notificationAPI } from '../../services/api';
import { useSocket } from '../../context/SocketContext';
import { formatRelativeTime } from '../../utils/helpers';
import Avatar from '../ui/Avatar';
import EmptyState from '../ui/EmptyState';

const NotificationBell = () => {
  const [open, setOpen] = useState(false);
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [loading, setLoading] = useState(true);
  const ref = useRef(null);
  const { notifications: liveNotifications } = useSocket();

  const load = async () => {
    try {
      const { data } = await notificationAPI.list();
      setNotifications(data.notifications);
      setUnreadCount(data.unreadCount);
    } catch {
      /* ignore */
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, []);

  useEffect(() => {
    if (liveNotifications.length) {
      setNotifications((prev) => [liveNotifications[0], ...prev]);
      setUnreadCount((c) => c + 1);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [liveNotifications]);

  useEffect(() => {
    const onClick = (e) => {
      if (ref.current && !ref.current.contains(e.target)) setOpen(false);
    };
    document.addEventListener('mousedown', onClick);
    return () => document.removeEventListener('mousedown', onClick);
  }, []);

  const markAllRead = async () => {
    await notificationAPI.markAllRead();
    setNotifications((prev) => prev.map((n) => ({ ...n, isRead: true })));
    setUnreadCount(0);
  };

  const markOneRead = async (id) => {
    await notificationAPI.markRead(id);
    setNotifications((prev) => prev.map((n) => (n._id === id ? { ...n, isRead: true } : n)));
    setUnreadCount((c) => Math.max(0, c - 1));
  };

  return (
    <div className="relative" ref={ref}>
      <button onClick={() => setOpen((o) => !o)} className="btn-ghost !p-2 rounded-lg relative" aria-label="Notifications">
        <Bell size={18} />
        {unreadCount > 0 && (
          <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full ring-2 ring-white dark:ring-gray-950" />
        )}
      </button>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: -8, scale: 0.97 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -8, scale: 0.97 }}
            transition={{ duration: 0.15 }}
            className="absolute right-0 mt-2 w-80 max-h-96 overflow-y-auto card p-2 z-50"
          >
            <div className="flex items-center justify-between px-2 py-2">
              <span className="font-semibold text-sm">Notifications</span>
              {unreadCount > 0 && (
                <button onClick={markAllRead} className="text-xs text-brand-600 hover:underline flex items-center gap-1">
                  <CheckCheck size={13} /> Mark all read
                </button>
              )}
            </div>

            {loading ? (
              <div className="p-4 text-sm text-gray-400 text-center">Loading...</div>
            ) : notifications.length === 0 ? (
              <EmptyState icon={Bell} title="No notifications yet" description="We'll let you know when something happens." />
            ) : (
              <div className="space-y-1">
                {notifications.map((n) => (
                  <Link
                    key={n._id}
                    to={n.link || '#'}
                    onClick={() => {
                      if (!n.isRead) markOneRead(n._id);
                      setOpen(false);
                    }}
                    className={`flex gap-2.5 p-2.5 rounded-xl transition-colors ${
                      n.isRead ? 'hover:bg-gray-50 dark:hover:bg-gray-800' : 'bg-brand-50/60 dark:bg-brand-500/5 hover:bg-brand-50 dark:hover:bg-brand-500/10'
                    }`}
                  >
                    <Avatar user={n.sender} size="sm" />
                    <div className="min-w-0">
                      <p className="text-sm text-gray-700 dark:text-gray-300 leading-snug">{n.message}</p>
                      <p className="text-xs text-gray-400 mt-0.5">{formatRelativeTime(n.createdAt)}</p>
                    </div>
                    {!n.isRead && <span className="w-2 h-2 rounded-full bg-brand-500 shrink-0 mt-1.5" />}
                  </Link>
                ))}
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default NotificationBell;

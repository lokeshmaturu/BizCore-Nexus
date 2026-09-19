import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Bell,
  X,
  CheckCheck,
  AlertTriangle,
  Info,
  CheckCircle2,
  AlertCircle,
  ExternalLink,
} from 'lucide-react';
import { Link } from 'react-router-dom';
import {
  fetchNotifications,
  markNotificationRead,
  markAllNotificationsRead,
  setNotificationDrawerOpen,
} from '../../store/notificationSlice';
import { formatDate } from '../../utils/formatters';

export const NotificationDrawer = () => {
  const dispatch = useDispatch();
  const { notifications, unreadCount, isOpen } = useSelector((state) => state.notifications);

  useEffect(() => {
    dispatch(fetchNotifications());
  }, [dispatch]);

  const getIcon = (type) => {
    switch (type) {
      case 'WARNING':
        return <AlertTriangle className="w-4 h-4 text-amber-400" />;
      case 'CRITICAL':
        return <AlertCircle className="w-4 h-4 text-rose-400" />;
      case 'SUCCESS':
        return <CheckCircle2 className="w-4 h-4 text-emerald-400" />;
      default:
        return <Info className="w-4 h-4 text-blue-400" />;
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => dispatch(setNotificationDrawerOpen(false))}
            className="fixed inset-0 bg-slate-950/60 backdrop-blur-sm z-50"
          />

          {/* Drawer */}
          <motion.aside
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
            className="fixed top-0 right-0 bottom-0 w-full max-w-md bg-slate-900/95 border-l border-slate-800 backdrop-blur-2xl z-50 flex flex-col shadow-2xl"
          >
            {/* Header */}
            <div className="p-4 sm:p-5 border-b border-slate-800 flex items-center justify-between bg-slate-950/60">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-xl bg-slate-800 flex items-center justify-center text-brand-400">
                  <Bell className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-white flex items-center gap-2">
                    Enterprise Notifications
                    {unreadCount > 0 && (
                      <span className="text-[10px] px-2 py-0.5 rounded-full bg-brand-500/20 text-brand-300 border border-brand-500/30">
                        {unreadCount} Unread
                      </span>
                    )}
                  </h3>
                  <p className="text-xs text-slate-400">Live operational telemetry feed</p>
                </div>
              </div>

              <div className="flex items-center gap-1">
                {unreadCount > 0 && (
                  <button
                    onClick={() => dispatch(markAllNotificationsRead())}
                    title="Mark all as read"
                    className="p-2 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition-colors"
                  >
                    <CheckCheck className="w-4 h-4" />
                  </button>
                )}
                <button
                  onClick={() => dispatch(setNotificationDrawerOpen(false))}
                  className="p-2 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* List */}
            <div className="flex-1 overflow-y-auto p-4 space-y-2.5">
              {notifications.length === 0 ? (
                <div className="text-center py-12 text-slate-500 text-xs">
                  No notifications recorded.
                </div>
              ) : (
                notifications.map((n) => (
                  <div
                    key={n._id}
                    onClick={() => !n.isRead && dispatch(markNotificationRead(n._id))}
                    className={`p-3.5 rounded-xl border transition-all cursor-pointer ${
                      n.isRead
                        ? 'bg-slate-900/40 border-slate-800 text-slate-400'
                        : 'bg-slate-800/80 border-slate-700/80 text-slate-200 shadow-md'
                    }`}
                  >
                    <div className="flex items-start gap-3">
                      <div className="mt-0.5 shrink-0">{getIcon(n.type)}</div>
                      <div className="flex-1 space-y-1">
                        <div className="flex items-center justify-between gap-2">
                          <h4 className="text-xs font-bold text-white truncate">{n.title}</h4>
                          <span className="text-[10px] text-slate-500 shrink-0">
                            {formatDate(n.createdAt)}
                          </span>
                        </div>
                        <p className="text-xs text-slate-300 leading-relaxed">{n.message}</p>
                        {n.link && (
                          <Link
                            to={n.link}
                            onClick={() => dispatch(setNotificationDrawerOpen(false))}
                            className="inline-flex items-center gap-1 text-[11px] font-semibold text-brand-400 hover:text-brand-300 pt-1"
                          >
                            <span>Open Module</span>
                            <ExternalLink className="w-3 h-3" />
                          </Link>
                        )}
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          </motion.aside>
        </>
      )}
    </AnimatePresence>
  );
};

export default NotificationDrawer;

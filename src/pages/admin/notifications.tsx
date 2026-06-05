import React, { useState, useEffect } from 'react';
import Head from 'next/head';
import DashboardLayout from '@/layouts/DashboardLayout';
import { motion } from 'framer-motion';
import { Bell, Check, Trash2, Clock, AlertTriangle, AlertCircle, Info, CheckCircle2, RefreshCw, MessageSquare, ShieldAlert, Search, MoreVertical } from 'lucide-react';
import { api } from '@/utils/api';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';

const iconMap: Record<string, React.ElementType> = {
  MessageSquare: MessageSquare,
  ShieldAlert: ShieldAlert,
  Clock: Clock,
  CheckCircle2: CheckCircle2,
  Bell: Bell
};

const formatTimeAgo = (dateStr: string) => {
  const date = new Date(dateStr);
  const now = new Date();
  const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);

  if (diffInSeconds < 60) return `${diffInSeconds} seconds ago`;
  if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)} minutes ago`;
  if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)} hours ago`;
  return `${Math.floor(diffInSeconds / 86400)} days ago`;
};

export default function NotificationCenterPage() {
  const [notifications, setNotifications] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchNotifications = async () => {
    try {
      const data = await api.getNotifications();
      setNotifications(data);
    } catch (error) {
      console.error('Failed to fetch notifications:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchNotifications();

    const handleUpdate = () => {
      fetchNotifications();
    };
    window.addEventListener('notificationsUpdated', handleUpdate);

    return () => {
      window.removeEventListener('notificationsUpdated', handleUpdate);
    };
  }, []);

  const markAsRead = async (id: string) => {
    try {
      await api.markAsRead(id);
      setNotifications(notifications.map(n => n._id === id ? { ...n, isRead: true } : n));
      window.dispatchEvent(new Event('notificationsUpdated'));
    } catch (error) {
      console.error('Failed to mark as read', error);
    }
  };

  const markAllRead = async () => {
    try {
      await api.markAllNotificationsRead();
      setNotifications(notifications.map(n => ({ ...n, isRead: true })));
      window.dispatchEvent(new Event('notificationsUpdated'));
    } catch (error) {
      console.error('Failed to mark all as read', error);
    }
  };

  const deleteNotification = async (id: string) => {
    try {
      await api.deleteNotification(id);
      setNotifications(notifications.filter(n => n._id !== id));
      window.dispatchEvent(new Event('notificationsUpdated'));
    } catch (error) {
      console.error('Failed to delete notification', error);
    }
  };

  return (
    <DashboardLayout>
      <Head>
        <title>Notifications | Admin Panel</title>
      </Head>

      <div className="max-w-4xl mx-auto space-y-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-white mb-1">Notifications</h1>
            <p className="text-text-muted text-sm">Stay updated with operational alerts and system activity.</p>
          </div>
          <div className="flex items-center space-x-2">
            <Button className="space-x-2 h-9 text-xs" onClick={markAllRead}>
              <Check className="w-3.5 h-3.5" />
              <span>Mark All Read</span>
            </Button>
          </div>
        </div>

        <Card className="p-3">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-text-muted" />
            <input
              type="text"
              placeholder="Search notifications..."
              className="w-full bg-bg-dark border border-border-subtle rounded-lg py-2.5 pl-10 pr-4 text-sm text-white focus:outline-none focus:border-brand-primary/50"
            />
          </div>
        </Card>

        <div className="space-y-3">
          {loading ? (
            <p className="text-text-muted text-center py-8">Loading notifications...</p>
          ) : notifications.length === 0 ? (
            <p className="text-text-muted text-center py-8">No notifications found.</p>
          ) : (
            notifications.map((notif, i) => {
              const Icon = iconMap[notif.icon] || Bell;
              return (
                <motion.div
                  key={notif._id}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.05 }}
                >
                  <Card className={`p-5 hover:bg-white/5 transition-all cursor-pointer group border-l-4 ${!notif.isRead
                    ? 'border-l-brand-primary bg-brand-primary/5'
                    : 'border-l-transparent'
                    }`}>
                    <div className="flex items-start space-x-4">
                      <div className={`p-2.5 rounded-xl bg-bg-dark border border-border-subtle group-hover:border-brand-primary/30 transition-all`}>
                        <Icon className={`w-5 h-5 ${notif.color === 'brand' ? 'text-brand-primary' :
                          notif.color === 'warning' ? 'text-warning' :
                            notif.color === 'danger' ? 'text-danger' : 'text-success'
                          }`} />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between mb-1">
                          <h3 className={`text-sm font-bold ${notif.isRead ? 'text-white' : 'text-brand-primary'}`}>
                            {notif.title}
                            {!notif.isRead && <span className="ml-2 w-1.5 h-1.5 rounded-full bg-brand-primary inline-block" />}
                          </h3>
                          <span className="text-[10px] text-text-muted font-bold uppercase tracking-wider">
                            {formatTimeAgo(notif.createdAt)}
                          </span>
                        </div>
                        <p className="text-xs text-text-muted leading-relaxed mb-4">{notif.desc}</p>
                        <div className="flex items-center justify-between">
                          <div className="flex items-center space-x-4">
                            {notif.link && (
                              <button
                                onClick={() => {
                                  const fixedLink = notif.link.replace('/admin/tickets/', '/admin/queries/');
                                  window.location.href = fixedLink;
                                }}
                                className="text-[10px] font-bold text-brand-primary uppercase tracking-widest transition-colors"
                              >
                                View Details
                              </button>
                            )}
                            {!notif.isRead && (
                              <button
                                onClick={() => markAsRead(notif._id)}
                                className="text-[10px] font-bold text-text-muted uppercase tracking-widest transition-colors "
                              >
                                Mark as read
                              </button>
                            )}
                          </div>
                          <div className="flex items-center space-x-2 opacity-0 group-hover:opacity-100 transition-opacity">
                            <button className="p-1.5 text-text-muted transition-colors ">
                              <MoreVertical className="w-4 h-4" />
                            </button>
                            <button
                              onClick={() => deleteNotification(notif._id)}
                              className="p-1.5 text-text-muted hover:text-danger transition-colors"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  </Card>
                </motion.div>
              );
            })
          )}
        </div>

        {!loading && notifications.length > 0 && (
          <div className="text-center pt-6">
            <Button className="text-[10px] font-bold uppercase tracking-widest text-text-muted ">
              Load Older Notifications
            </Button>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}

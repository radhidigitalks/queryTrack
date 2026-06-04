import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { 
  LayoutDashboard, 
  MessageSquare, 
  Users, 
  Shield, 
  Clock, 
  AlertTriangle, 
  Bell, 
  BarChart3, 
  Settings, 
  LogOut,
  Search,
  Menu,
  X,
  Building2,
  CheckCircle2
} from 'lucide-react';
import { io } from 'socket.io-client';
import { API_URL, BASE_URL } from '../utils/api';
import { toast } from 'react-hot-toast';
import { motion, AnimatePresence } from 'framer-motion';

const sidebarItems = [
  { icon: LayoutDashboard, label: 'Dashboard', href: '/admin/dashboard', mod: 'dashboard' },
  { icon: MessageSquare, label: 'Queries', href: '/admin/queries', mod: 'query' },
  { icon: Building2, label: 'Departments', href: '/admin/departments', mod: 'departments' },
  { icon: Users, label: 'Users', href: '/admin/users', mod: 'users' },
  { icon: Shield, label: 'Roles & Permissions', href: '/admin/roles', mod: 'settings' },
  { icon: Bell, label: 'Notifications', href: '/admin/notifications', mod: 'dashboard' },
  { icon: BarChart3, label: 'Reports', href: '/admin/reports', mod: 'reports' },
  { icon: Settings, label: 'Settings', href: '/admin/settings', mod: 'settings' },
];

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [user, setUser] = useState<any>(null);
  const [notifications, setNotifications] = useState<any[]>([]);
  const [showDropdown, setShowDropdown] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const router = useRouter();

  const fetchNotifications = async () => {
    try {
      const res = await fetch(`${API_URL}/notifications`);
      if (res.ok) {
        const data = await res.json();
        setNotifications(data);
      }
    } catch (error) {
      console.error('Failed to fetch notifications:', error);
    }
  };

  const markAsRead = async (id: string, link?: string) => {
    try {
      await fetch(`${API_URL}/notifications/${id}/read`, { method: 'PATCH' });
      setNotifications(notifications.map(n => n._id === id ? { ...n, isRead: true } : n));
      
      // Dispatch a custom event to notify other components (like the notifications page)
      window.dispatchEvent(new Event('notificationsUpdated'));
    } catch (error) {
      console.error('Failed to mark as read', error);
    }

    setShowDropdown(false);
    if (link) {
      const fixedLink = link.replace('/admin/tickets/', '/admin/queries/');
      router.push(fixedLink);
    }
  };

  useEffect(() => {
    const u = localStorage.getItem('user');
    if (u) {
      setUser(JSON.parse(u));
    } else {
      router.push('/login');
    }

    fetchNotifications();

    // Setup Socket.IO connection
    const socket = io(BASE_URL);

    socket.on('new_ticket', (ticket) => {
      fetchNotifications(); // Refresh notifications when a new one arrives
      toast.success(
        <div>
          <strong>New Query Received!</strong>
          <br />
          <span className="text-xs font-mono">{ticket.id}</span>
          <br />
          <span className="text-[10px] text-text-muted">{ticket.subject}</span>
        </div>,
        { duration: 8000 }
      );
    });

    socket.on('ticket_expired', (ticket) => {
      fetchNotifications(); // Refresh notifications for SLA warning
      toast.error(
        <div>
          <strong>SLA Timeout Escalation!</strong>
          <br />
          <span className="text-xs font-mono">{ticket.id}</span>
          <br />
          <span className="text-[10px] text-text-muted">Ticket expired and requires admin attention.</span>
        </div>,
        { duration: 10000, icon: '⚠️' }
      );
    });

    const handleResize = () => {
      if (window.innerWidth >= 1024) {
        setIsSidebarOpen(true);
      } else {
        setIsSidebarOpen(false);
      }
    };
    handleResize();
    window.addEventListener('resize', handleResize);
    
    // Close dropdown on outside click
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setShowDropdown(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    
    const handleNotificationsUpdate = () => {
      fetchNotifications();
    };
    window.addEventListener('notificationsUpdated', handleNotificationsUpdate);
    
    return () => {
      window.removeEventListener('resize', handleResize);
      document.removeEventListener('mousedown', handleClickOutside);
      window.removeEventListener('notificationsUpdated', handleNotificationsUpdate);
      socket.disconnect();
    };
  }, []);

  const handleNavClick = () => {
    if (window.innerWidth < 1024) {
      setIsSidebarOpen(false);
    }
  };

  const unreadCount = notifications.filter(n => !n.isRead).length;

  return (
    <div className="min-h-screen bg-bg-dark text-text-main flex relative font-sans">
      {/* Sidebar Overlay on Mobile */}
      {isSidebarOpen && (
        <div 
          className="fixed inset-0 bg-black/10 backdrop-blur-sm z-40 lg:hidden transition-opacity duration-300"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside 
        className={`fixed lg:static inset-y-0 left-0 z-50 w-72 bg-bg-card border-r border-border-subtle transition-all duration-300 ease-in-out ${
          isSidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0 lg:w-20'
        }`}
      >
        <div className="h-full flex flex-col">
          {/* Logo Section */}
          <div className="p-6 mb-2 flex items-center justify-between border-b border-border-subtle/50">
            <div className={`flex items-center space-x-3 ${!isSidebarOpen && 'lg:hidden'}`}>
              <div className="w-10 h-10 rounded-xl flex items-center justify-center overflow-hidden bg-white shadow-md p-1 border border-border-subtle">
                <img src="/logo.webp" alt="Logo" className="w-full h-full object-contain" />
              </div>
              <span className="font-bold text-base text-text-main tracking-widest uppercase royal-font">ADMIN PANEL</span>
            </div>
            <button 
              onClick={() => setIsSidebarOpen(!isSidebarOpen)}
              className="lg:hidden text-text-muted hover:text-text-main p-1.5 rounded-lg border border-border-subtle hover:bg-brand-primary/5 transition-all"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Nav Items */}
          <nav className="flex-1 px-4 space-y-1.5 overflow-y-auto py-4">
            {sidebarItems.map((item) => {
              // Check permissions
              if (user && user.role && user.role.permissions && item.mod) {
                const perms = user.role.permissions[item.mod];
                if (perms && !perms.view && user.role.name !== 'Admin') {
                  return null; // Hide if no view permission
                }
              }

              const isActive = router.pathname.startsWith(item.href);
              return (
                <Link 
                  key={item.href} 
                  href={item.href}
                  onClick={handleNavClick}
                  className={`flex items-center space-x-3 px-4 py-3 rounded-xl transition-all duration-300 group ${
                    isActive 
                      ? 'bg-brand-primary/10 text-brand-primary border border-brand-primary/20 shadow-sm' 
                      : 'text-text-muted hover:bg-brand-primary/10 hover:text-brand-primary'
                  }`}
                  title={!isSidebarOpen ? item.label : undefined}
                >
                  <item.icon className={`w-5 h-5 flex-shrink-0 transition-transform duration-200 ${isActive ? 'text-brand-primary scale-110' : 'group-hover:text-brand-primary group-hover:scale-110'}`} />
                  <span className={`font-semibold text-sm transition-all duration-300 whitespace-nowrap ${
                    isSidebarOpen ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-4 lg:hidden'
                  }`}>
                    {item.label}
                  </span>
                  {isActive && isSidebarOpen && (
                    <div className="ml-auto w-1.5 h-1.5 rounded-full bg-brand-primary shadow-[0_0_8px_#C8A45D]" />
                  )}
                  {item.label === 'Notifications' && isSidebarOpen && unreadCount > 0 && (
                    <span className="ml-auto bg-danger text-white text-[10px] px-2 py-0.5 rounded-full">
                      {unreadCount}
                    </span>
                  )}
                </Link>
              );
            })}
          </nav>

          <div className="p-4 border-t border-border-subtle">
            <button 
              onClick={() => {
                localStorage.removeItem('token');
                localStorage.removeItem('user');
                router.push('/login');
              }}
              className={`w-full flex items-center space-x-3 px-4 py-3 rounded-xl text-danger hover:bg-danger/10 transition-all duration-300 ${!isSidebarOpen && 'lg:justify-center'}`}
            >
              <LogOut className="w-5 h-5" />
              <span className={`font-medium text-sm ${!isSidebarOpen && 'lg:hidden'}`}>Logout</span>
            </button>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col min-w-0">
        {/* Top Header */}
        <header className="h-20 border-b border-border-subtle bg-white/80 backdrop-blur-md flex items-center justify-between px-4 sm:px-8 sticky top-0 z-40">
          <div className="flex items-center space-x-4 flex-1">
            <button 
              onClick={() => setIsSidebarOpen(!isSidebarOpen)}
              className="p-2 text-text-muted hover:text-text-main lg:hidden border border-border-subtle rounded-xl bg-bg-dark hover:bg-brand-primary/5 transition-all"
            >
              <Menu className="w-5 h-5" />
            </button>
            
            <div className="relative max-w-md w-full hidden md:block">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-text-muted" />
              <input 
                type="text" 
                placeholder="Search queries, customers..." 
                className="w-full bg-bg-dark border border-border-subtle rounded-xl py-2.5 pl-11 pr-4 text-sm text-text-main focus:outline-none focus:border-brand-primary/50 focus:ring-1 focus:ring-brand-primary/50 transition-all"
              />
            </div>
          </div>

          <div className="flex items-center space-x-4 sm:space-x-6">
            <div className="relative" ref={dropdownRef}>
              <button 
                onClick={() => setShowDropdown(!showDropdown)}
                className="relative p-2 text-text-muted hover:text-text-main border border-border-subtle rounded-xl bg-bg-dark hover:bg-brand-primary/5 transition-colors"
              >
                <Bell className="w-5 h-5" />
                {unreadCount > 0 && (
                  <span className="absolute top-1 right-1 w-2.5 h-2.5 bg-danger rounded-full border-2 border-white" />
                )}
              </button>

              <AnimatePresence>
                {showDropdown && (
                  <motion.div
                    initial={{ opacity: 0, y: 10, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: 10, scale: 0.95 }}
                    transition={{ duration: 0.2 }}
                    className="absolute right-0 mt-3 w-80 bg-white border border-border-subtle rounded-2xl shadow-xl z-50 overflow-hidden"
                  >
                    <div className="p-4 border-b border-border-subtle flex items-center justify-between bg-bg-dark">
                      <h3 className="font-bold text-sm text-text-main">Notifications</h3>
                      {unreadCount > 0 && (
                        <span className="text-[10px] bg-brand-primary/10 text-brand-primary px-2 py-1 rounded-full font-bold">
                          {unreadCount} New
                        </span>
                      )}
                    </div>
                    
                    <div className="max-h-[300px] overflow-y-auto">
                      {notifications.length === 0 ? (
                        <div className="p-6 text-center text-text-muted text-sm">
                          No notifications
                        </div>
                      ) : (
                        notifications.slice(0, 5).map((notif) => (
                          <div 
                            key={notif._id} 
                            onClick={() => markAsRead(notif._id, notif.link)}
                            className={`p-4 border-b border-border-subtle/50 cursor-pointer transition-colors hover:bg-brand-primary/5 ${!notif.isRead ? 'bg-brand-primary/5 border-l-2 border-l-brand-primary' : ''}`}
                          >
                            <p className={`text-sm mb-1 ${!notif.isRead ? 'font-bold text-text-main' : 'text-text-muted'}`}>
                              {notif.title}
                            </p>
                            <p className="text-xs text-text-muted line-clamp-2">
                              {notif.desc}
                            </p>
                          </div>
                        ))
                      )}
                    </div>
                    
                    <div className="p-3 border-t border-border-subtle bg-bg-dark text-center">
                      <Link 
                        href="/admin/notifications" 
                        onClick={() => setShowDropdown(false)}
                        className="text-xs font-bold text-brand-primary hover:text-brand-light uppercase tracking-wider"
                      >
                        View All Notifications
                      </Link>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
            
            <div className="h-8 w-px bg-border-subtle" />
            
            <div className="flex items-center space-x-3 sm:space-x-4">
              <div className="text-right hidden sm:block">
                <p className="text-sm font-bold text-text-main leading-none royal-font">{user?.name || 'Loading...'}</p>
                <p className="text-[10px] text-text-muted font-semibold uppercase tracking-wider mt-1">{user?.role?.name || user?.role || 'Admin'}</p>
              </div>
              <div className="w-10 h-10 rounded-full border-2 border-brand-primary/30 p-0.5 shadow-sm">
                <img 
                  src="https://api.dicebear.com/7.x/avataaars/svg?seed=James" 
                  alt="Avatar" 
                  className="w-full h-full rounded-full bg-bg-dark object-cover"
                />
              </div>
            </div>
          </div>
        </header>

        {/* Page Content */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-8">
          {children}
        </div>
      </main>
    </div>
  );
}

import React, { useState, useEffect } from 'react';
import Head from 'next/head';
import DashboardLayout from '@/layouts/DashboardLayout';
import { motion } from 'framer-motion';
import { 
  MessageSquare, 
  Clock, 
  CheckCircle2, 
  Activity,
  AlertTriangle,
  Timer,
  User,
  Tags,
  QrCode
} from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { api } from '@/utils/api';
import Link from 'next/link';

export default function StaffDashboardPage() {
  const [stats, setStats] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
  }, []);

  useEffect(() => {
    const fetchData = async () => {
      if (!user?.id) return;
      
      try {
        const staffStats = await api.getStaffDashboardStats(user.id);
        setStats(staffStats);
      } catch (err) {
        console.error('Error fetching staff data', err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [user]);

  if (loading || !stats) {
    return (
      <DashboardLayout>
        <div className="flex items-center justify-center min-h-screen">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-brand-primary" />
        </div>
      </DashboardLayout>
    );
  }

  const kpis = [
    { label: 'My Open', value: stats.myOpen.toString(), icon: Activity, color: 'info' },
    { label: 'My In Progress', value: stats.myInProgress.toString(), icon: Timer, color: 'warning' },
    { label: 'My Resolved', value: stats.myResolved.toString(), icon: CheckCircle2, color: 'success' },
    { label: 'My Expired', value: stats.myExpired.toString(), icon: AlertTriangle, color: 'danger' },
  ];

  return (
    <DashboardLayout>
      <Head>
        <title>Staff Dashboard | {user?.name || 'Staff'}</title>
      </Head>

      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold text-text-main mb-1">Staff Dashboard</h1>
          <p className="text-text-muted text-sm">Welcome back, {user?.name || 'Staff'}.</p>
        </div>

        {/* KPI Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {kpis.map((kpi, i) => (
            <motion.div
              key={kpi.label}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.05 }}
            >
              <Card className="p-4 hover:border-brand-primary/30 transition-all cursor-pointer group hover:bg-brand-primary/[0.02]">
                <div className="flex items-center justify-between mb-3">
                  <div className={`p-2 rounded-lg bg-bg-dark border border-border-subtle group-hover:bg-brand-primary/10 transition-colors`}>
                    <kpi.icon className={`w-4 h-4 ${kpi.color === 'danger' ? 'text-danger' : kpi.color === 'success' ? 'text-success' : kpi.color === 'info' ? 'text-info' : 'text-warning'}`} />
                  </div>
                </div>
                <div>
                  <p className="text-text-muted text-[10px] uppercase font-bold tracking-wider mb-1">{kpi.label}</p>
                  <h3 className="text-xl font-bold text-text-main">{kpi.value}</h3>
                </div>
              </Card>
            </motion.div>
          ))}
        </div>

        <div className="grid grid-cols-1 gap-6">
          <Card className="p-0 overflow-hidden">
            <div className="p-4 border-b border-border-subtle flex items-center justify-between">
              <h3 className="text-sm font-bold text-text-main uppercase tracking-wider">My Tickets</h3>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm">
                <thead>
                  <tr className="bg-bg-dark text-text-muted uppercase tracking-widest border-b border-border-subtle">
                    <th className="px-4 py-3 font-bold">ID</th>
                    <th className="px-4 py-3 font-bold">Customer</th>
                    <th className="px-4 py-3 font-bold">Category</th>
                    <th className="px-4 py-3 font-bold">Status</th>
                    <th className="px-4 py-3 font-bold text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border-subtle">
                  {stats.myTickets?.map((ticket: any) => (
                    <tr key={ticket.id} className={`transition-colors group ${ticket.status === 'Time Expired' || ticket.status === 'Escalated' ? 'bg-danger/5 hover:bg-danger/10' : 'hover:bg-brand-primary/5'}`}>
                      <td className="px-4 py-3 font-bold text-brand-primary">{ticket.id}</td>
                      <td className="px-4 py-3 text-text-main">{ticket.customerName}</td>
                      <td className="px-4 py-3 text-text-main">
                        <div className="flex items-center">
                          <Tags className="w-3.5 h-3.5 text-text-muted mr-2" />
                          {ticket.categoryId?.name || 'N/A'}
                        </div>
                      </td>
                      <td className="px-4 py-3">
                        <Badge variant={ticket.status === 'Resolved' ? 'success' : ticket.status === 'Escalated' || ticket.status === 'Time Expired' ? 'danger' : ticket.status === 'In Progress' ? 'warning' : 'info'}>
                          {ticket.status}
                        </Badge>
                      </td>
                      <td className="px-4 py-3 text-right">
                        <Link href={`/admin/queries/${ticket.id}`}>
                          <Button variant="ghost" size="sm">View</Button>
                        </Link>
                      </td>
                    </tr>
                  ))}
                  {(!stats.myTickets || stats.myTickets.length === 0) && (
                    <tr>
                      <td colSpan={5} className="px-4 py-6 text-center text-text-muted">No tickets assigned to you</td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </Card>
        </div>
      </div>
    </DashboardLayout>
  );
}

import React, { useState, useEffect } from 'react';
import Head from 'next/head';
import DashboardLayout from '@/layouts/DashboardLayout';
import { motion } from 'framer-motion';
import {
  MessageSquare,
  Clock,
  CheckCircle2,
  ArrowUpRight,
  ArrowDownRight,
  Filter,
  Download,
  Activity,
  AlertTriangle,
  History,
  Timer,
  TrendingUp,
  Building2,
  Tags
} from 'lucide-react';
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer
} from 'recharts';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { api } from '@/utils/api';
import Link from 'next/link';

const data = [
  { name: 'Mon', queries: 45, resolved: 38 },
  { name: 'Tue', queries: 52, resolved: 42 },
  { name: 'Wed', queries: 48, resolved: 45 },
  { name: 'Thu', queries: 70, resolved: 55 },
  { name: 'Fri', queries: 65, resolved: 60 },
  { name: 'Sat', queries: 85, resolved: 72 },
  { name: 'Sun', queries: 75, resolved: 68 },
];

export default function DashboardPage() {
  const [stats, setStats] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const statsData = await api.getDashboardStats();
        setStats(statsData);
      } catch (err) {
        console.error('Error fetching dashboard data', err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

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
    { label: 'Total Tickets', value: stats.total.toString(), trend: '', isUp: true, icon: MessageSquare, color: 'gold' },
    { label: 'Open', value: stats.open.toString(), trend: '', isUp: false, icon: Activity, color: 'info' },
    { label: 'In Progress', value: stats.inProgress.toString(), trend: '', isUp: true, icon: Timer, color: 'warning' },
    { label: 'Resolved', value: stats.resolved.toString(), trend: '', isUp: true, icon: CheckCircle2, color: 'success' },
    { label: 'Time Expired', value: stats.timeExpired.toString(), trend: '', isUp: true, icon: Clock, color: 'danger' },
    { label: 'Escalated', value: stats.escalated.toString(), trend: '', isUp: true, icon: AlertTriangle, color: 'danger' },
  ];

  return (
    <DashboardLayout>
      <Head>
        <title>Admin Dashboard | Query Management System</title>
      </Head>

      <div className="space-y-6">
        {/* Header Section */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-text-main mb-1">Operational Overview</h1>
            <p className="text-text-muted text-sm">System status and query performance for today.</p>
          </div>
          <div className="flex items-center space-x-3">
            <Button className="space-x-2">
              <Filter className="w-4 h-4" />
              <span>Filter Data</span>
            </Button>
            <Button className="space-x-2">
              <Download className="w-4 h-4" />
              <span>Export Reports</span>
            </Button>
          </div>
        </div>

        {/* KPI Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-6 gap-4">
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
                    <kpi.icon className={`w-4 h-4 ${kpi.color === 'danger' ? 'text-danger' : kpi.color === 'success' ? 'text-success' : 'text-brand-primary'}`} />
                  </div>
                  <div className={`flex items-center text-[10px] font-bold ${kpi.isUp ? (kpi.color === 'danger' ? 'text-danger' : 'text-success') : 'text-text-muted'}`}>
                    {kpi.trend}
                    {kpi.isUp ? <ArrowUpRight className="w-3 h-3 ml-0.5" /> : <ArrowDownRight className="w-3 h-3 ml-0.5" />}
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

        {/* Charts Row */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <Card className="lg:col-span-2 p-6">
            <div className="flex items-center justify-between mb-8">
              <h3 className="text-lg font-bold text-text-main flex items-center">
                <Activity className="w-4 h-4 mr-2 text-brand-primary" />
                Query Trends
              </h3>
              <div className="flex items-center space-x-4">
                <div className="flex items-center space-x-2">
                  <div className="w-2 h-2 rounded-full bg-brand-primary" />
                  <span className="text-[10px] text-text-muted uppercase font-bold">New</span>
                </div>
                <div className="flex items-center space-x-2">
                  <div className="w-2 h-2 rounded-full bg-brand-light" />
                  <span className="text-[10px] text-text-muted uppercase font-bold">Resolved</span>
                </div>
              </div>
            </div>

            <div className="h-[300px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={data}>
                  <defs>
                    <linearGradient id="colorQueries" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#C8A45D" stopOpacity={0.2} />
                      <stop offset="95%" stopColor="#C8A45D" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="#E8DCC2" vertical={false} />
                  <XAxis dataKey="name" stroke="#6B7280" fontSize={10} tickLine={false} axisLine={false} />
                  <YAxis stroke="#6B7280" fontSize={10} tickLine={false} axisLine={false} />
                  <Tooltip
                    contentStyle={{ backgroundColor: '#FFFFFF', border: '1px solid #E8DCC2', borderRadius: '12px', boxShadow: '0 10px 30px -10px rgba(200, 164, 93, 0.15)' }}
                    itemStyle={{ fontSize: '12px', color: '#1F2937' }}
                    labelStyle={{ color: '#6B7280', fontWeight: 'bold' }}
                  />
                  <Area type="monotone" dataKey="queries" stroke="#C8A45D" strokeWidth={2} fillOpacity={1} fill="url(#colorQueries)" />
                  <Area type="monotone" dataKey="resolved" stroke="#D6B97A" strokeWidth={2} fill="transparent" />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </Card>

          <Card className="p-6">
            <h3 className="text-lg font-bold text-text-main mb-8 flex items-center">
              <History className="w-4 h-4 mr-2 text-brand-primary" />
              Recent Activity
            </h3>
            <div className="space-y-6">
              {[
                { type: 'resolved', msg: 'Ticket TKT-2025-001 resolved by John', time: '2m ago' },
                { type: 'escalated', msg: 'Ticket TKT-2025-002 escalated to Supervisor', time: '12m ago' },
                { type: 'assigned', msg: 'New ticket assigned to Sarah', time: '25m ago' },
              ].map((item, i) => (
                <div key={i} className="flex items-start space-x-3">
                  <div className={`w-1.5 h-1.5 rounded-full mt-1.5 ${item.type === 'resolved' ? 'bg-success' : item.type === 'escalated' ? 'bg-danger' : 'bg-brand-primary'}`} />
                  <div className="flex-1">
                    <p className="text-xs text-text-main leading-tight mb-1">{item.msg}</p>
                    <p className="text-[10px] text-text-muted uppercase font-bold">{item.time}</p>
                  </div>
                </div>
              ))}
            </div>
          </Card>
        </div>

        {/* Bottom Row: Tables */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card className="p-0 overflow-hidden">
            <div className="p-4 border-b border-border-subtle flex items-center justify-between">
              <h3 className="text-sm font-bold text-text-main uppercase tracking-wider">Recent Tickets</h3>
              <Link href="/admin/queries">
                <Button variant="ghost" size="sm">View All</Button>
              </Link>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm">
                <thead>
                  <tr className="bg-bg-dark text-text-muted uppercase tracking-widest border-b border-border-subtle">
                    <th className="px-4 py-3 font-bold">ID</th>
                    <th className="px-4 py-3 font-bold">Customer</th>
                    <th className="px-4 py-3 font-bold">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border-subtle">
                  {stats.recentTickets?.slice(0, 5).map((ticket: any) => (
                    <tr key={ticket.id} className={`transition-colors group hover:bg-brand-primary/5`}>
                      <td className="px-4 py-3 font-bold text-brand-primary">{ticket.id}</td>
                      <td className="px-4 py-3 text-text-main">{ticket.customerName}</td>
                      <td className="px-4 py-3">
                        <Badge variant={ticket.status === 'Resolved' ? 'success' : ticket.status === 'Escalated' || ticket.status === 'Time Expired' ? 'danger' : ticket.status === 'In Progress' ? 'warning' : 'info'}>
                          {ticket.status}
                        </Badge>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </Card>

          <Card className="p-0 overflow-hidden">
            <div className="p-4 border-b border-border-subtle flex items-center justify-between">
              <h3 className="text-sm font-bold text-text-main uppercase tracking-wider">Quick Links</h3>
            </div>
            <div className="p-4 space-y-3">
              <Link href="/admin/categories" className="flex items-center p-3 rounded-lg hover:bg-brand-primary/5 transition-colors">
                <Tags className="w-5 h-5 text-brand-primary mr-3" />
                <div>
                  <p className="font-medium text-text-main">Categories</p>
                  <p className="text-xs text-text-muted">Manage categories per department</p>
                </div>
              </Link>
              <Link href="/admin/assignments" className="flex items-center p-3 rounded-lg hover:bg-brand-primary/5 transition-colors">
                <Activity className="w-5 h-5 text-brand-primary mr-3" />
                <div>
                  <p className="font-medium text-text-main">Assignments</p>
                  <p className="text-xs text-text-muted">Assign staff and supervisors</p>
                </div>
              </Link>
              <Link href="/admin/sla" className="flex items-center p-3 rounded-lg hover:bg-brand-primary/5 transition-colors">
                <Timer className="w-5 h-5 text-brand-primary mr-3" />
                <div>
                  <p className="font-medium text-text-main">SLA Management</p>
                  <p className="text-xs text-text-muted">Configure resolution time SLAs</p>
                </div>
              </Link>
            </div>
          </Card>
        </div>
      </div>
    </DashboardLayout>
  );
}

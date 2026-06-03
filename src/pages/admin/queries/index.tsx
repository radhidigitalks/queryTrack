import React, { useState } from 'react';
import Head from 'next/head';
import DashboardLayout from '@/layouts/DashboardLayout';
import { motion } from 'framer-motion';
import { 
  Search, 
  Filter, 
  Download, 
  Plus, 
  Eye, 
  Edit, 
  Trash2,
  ArrowUpDown,
  ChevronLeft,
  ChevronRight,
  Clock,
  Tag
} from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import Link from 'next/link';

const queries = [
  { 
    id: 'QRY-2026-001', 
    customer: 'Alexander Wright', 
    category: 'Technical', 
    priority: 'Critical', 
    assigned: 'David Chen', 
    dept: 'IT Support', 
    sla: '0h 45m', 
    status: 'In Progress', 
    date: '2026-06-03 10:30' 
  },
  { 
    id: 'QRY-2026-002', 
    customer: 'Sophia Loren', 
    category: 'Housekeeping', 
    priority: 'Medium', 
    assigned: 'Maria Garcia', 
    dept: 'Housekeeping', 
    sla: '3h 12m', 
    status: 'Open', 
    date: '2026-06-03 09:15' 
  },
  { 
    id: 'QRY-2026-003', 
    customer: 'Marcus Aurelius', 
    category: 'F&B', 
    priority: 'High', 
    assigned: 'James Wilson', 
    dept: 'Dining', 
    sla: '1h 05m', 
    status: 'Escalated', 
    date: '2026-06-03 08:45' 
  },
  { 
    id: 'QRY-2026-004', 
    customer: 'Elena Gilbert', 
    category: 'Maintenance', 
    priority: 'Low', 
    assigned: 'Robert Fox', 
    dept: 'Facilities', 
    sla: '12h 00m', 
    status: 'Resolved', 
    date: '2026-06-02 16:20' 
  },
  { 
    id: 'QRY-2026-005', 
    customer: 'Victor Hugo', 
    category: 'Concierge', 
    priority: 'High', 
    assigned: 'Sarah J.', 
    dept: 'Guest Services', 
    sla: '0h 15m', 
    status: 'Overdue', 
    date: '2026-06-02 14:10' 
  },
];

export default function QueriesPage() {
  const [searchTerm, setSearchTerm] = useState('');

  return (
    <DashboardLayout>
      <Head>
        <title>Query Management | Admin Panel</title>
      </Head>

      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-text-main mb-1">Query Management</h1>
            <p className="text-text-muted text-sm">Monitor and resolve operational customer inquiries.</p>
          </div>
          <div className="flex items-center space-x-3">
            <Button variant="secondary" className="space-x-2">
              <Download className="w-4 h-4" />
              <span>Export CSV</span>
            </Button>
            <Button className="space-x-2">
              <Plus className="w-4 h-4" />
              <span>Manual Entry</span>
            </Button>
          </div>
        </div>

        {/* Filters Bar */}
        <Card className="p-4">
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-text-muted" />
              <input 
                type="text" 
                placeholder="Search by ID, Customer Name, or Agent..." 
                className="w-full bg-bg-dark border border-border-subtle rounded-lg py-2.5 pl-10 pr-4 text-sm text-text-main focus:outline-none focus:border-brand-primary/50"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            
            <div className="flex items-center space-x-3 overflow-x-auto pb-2 lg:pb-0">
              <select className="bg-bg-dark border border-border-subtle rounded-lg px-3 py-2 text-xs text-text-main focus:outline-none focus:border-brand-primary/50">
                <option>All Statuses</option>
                <option>Open</option>
                <option>In Progress</option>
                <option>Resolved</option>
                <option>Escalated</option>
              </select>
              <select className="bg-bg-dark border border-border-subtle rounded-lg px-3 py-2 text-xs text-text-main focus:outline-none focus:border-brand-primary/50">
                <option>All Priorities</option>
                <option>Critical</option>
                <option>High</option>
                <option>Medium</option>
                <option>Low</option>
              </select>
              <select className="bg-bg-dark border border-border-subtle rounded-lg px-3 py-2 text-xs text-text-main focus:outline-none focus:border-brand-primary/50">
                <option>All Departments</option>
                <option>IT Support</option>
                <option>Housekeeping</option>
                <option>Dining</option>
              </select>
              <Button variant="secondary" size="sm" className="h-[34px]">
                <Filter className="w-3.5 h-3.5" />
              </Button>
            </div>
          </div>
        </Card>

        {/* Table Content */}
        <Card className="p-0 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="bg-bg-dark text-text-muted text-[10px] uppercase tracking-widest font-bold border-b border-border-subtle">
                  <th className="px-6 py-4">
                    <div className="flex items-center space-x-2 cursor-pointer hover:text-brand-primary transition-colors">
                      <span>Query ID</span>
                      <ArrowUpDown className="w-3 h-3" />
                    </div>
                  </th>
                  <th className="px-6 py-4">Customer</th>
                  <th className="px-6 py-4">Category</th>
                  <th className="px-6 py-4">Priority</th>
                  <th className="px-6 py-4">Assigned To</th>
                  <th className="px-6 py-4">SLA Time</th>
                  <th className="px-6 py-4">Status</th>
                  <th className="px-6 py-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border-subtle">
                {queries.map((query) => (
                  <tr key={query.id} className="hover:bg-brand-primary/5 transition-all group text-sm">
                    <td className="px-6 py-4">
                      <Link href={`/admin/queries/${query.id}`} className="font-bold text-brand-primary hover:underline">
                        {query.id}
                      </Link>
                      <p className="text-[10px] text-text-muted mt-0.5">{query.date}</p>
                    </td>
                    <td className="px-6 py-4 text-text-main font-medium">{query.customer}</td>
                    <td className="px-6 py-4">
                      <div className="flex items-center space-x-2 text-text-muted">
                        <Tag className="w-3 h-3" />
                        <span>{query.category}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <Badge variant={
                        query.priority === 'Critical' ? 'danger' :
                        query.priority === 'High' ? 'warning' : 'info'
                      }>
                        {query.priority}
                      </Badge>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center space-x-2">
                        <div className="w-6 h-6 rounded-full bg-bg-dark border border-border-subtle flex items-center justify-center text-[10px] font-bold text-brand-primary">
                          {query.assigned.split(' ').map(n => n[0]).join('')}
                        </div>
                        <div>
                          <p className="text-text-main text-xs font-bold">{query.assigned}</p>
                          <p className="text-[10px] text-text-muted">{query.dept}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center space-x-2">
                        <Clock className={`w-3 h-3 ${query.status === 'Overdue' ? 'text-danger' : 'text-text-muted'}`} />
                        <span className={`font-mono text-xs ${query.status === 'Overdue' ? 'text-danger font-bold' : 'text-text-main'}`}>
                          {query.sla}
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center space-x-2">
                        <div className={`w-1.5 h-1.5 rounded-full ${
                          query.status === 'Resolved' ? 'bg-success' :
                          query.status === 'Escalated' ? 'bg-danger' :
                          query.status === 'In Progress' ? 'bg-info' : 'bg-warning'
                        }`} />
                        <span className="text-xs font-bold text-text-main uppercase">{query.status}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex items-center justify-end space-x-1 opacity-0 group-hover:opacity-100 transition-opacity">
                        <Link href={`/admin/queries/${query.id}`}>
                          <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                            <Eye className="w-4 h-4" />
                          </Button>
                        </Link>
                        <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                          <Edit className="w-4 h-4" />
                        </Button>
                        <Button variant="ghost" size="sm" className="h-8 w-8 p-0 text-danger hover:bg-danger/10">
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          <div className="p-4 border-t border-border-subtle flex items-center justify-between bg-bg-dark/30">
            <p className="text-[10px] text-text-muted uppercase font-bold tracking-widest">
              Showing <span className="text-text-main">1-5</span> of <span className="text-text-main">124</span> Entries
            </p>
            <div className="flex items-center space-x-2">
              <Button variant="secondary" size="sm" className="h-8" disabled>
                <ChevronLeft className="w-4 h-4" />
              </Button>
              <div className="flex items-center px-2 space-x-1">
                {[1, 2, 3].map((n) => (
                  <button 
                    key={n}
                    className={`w-8 h-8 rounded-lg text-xs font-bold transition-colors ${
                      n === 1 ? 'bg-brand-primary text-white shadow-sm' : 'text-text-muted hover:text-brand-primary hover:bg-brand-primary/5'
                    }`}
                  >
                    {n}
                  </button>
                ))}
              </div>
              <Button variant="secondary" size="sm" className="h-8">
                <ChevronRight className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </Card>
      </div>
    </DashboardLayout>
  );
}

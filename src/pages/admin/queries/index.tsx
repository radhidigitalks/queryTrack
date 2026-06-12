import React, { useEffect, useRef, useState } from 'react';
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
  Clock
} from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import Link from 'next/link';
import { api } from '@/utils/api';
import { Ticket, Department } from '@/utils/storage';
import toast from 'react-hot-toast';

export default function TicketsPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [tickets, setTickets] = useState<Ticket[]>([]);
  const [departments, setDepartments] = useState<Department[]>([]);
  const [statusFilter, setStatusFilter] = useState('All');
  const [deptFilter, setDeptFilter] = useState('All');
  const [showFilterPopup, setShowFilterPopup] = useState(false);
  const filterPopupRef = useRef<HTMLDivElement>(null);

  const [page, setPage] = useState(1);
  const [limit] = useState(10);
  const [totalPages, setTotalPages] = useState(1);
  const [totalRecords, setTotalRecords] = useState(0);
  const [isExporting, setIsExporting] = useState(false);

  const fetchData = async () => {
    try {
      const deptsData = await api.getDepartments();
      setDepartments(deptsData);
      
      const res = await api.getTickets(page, limit, searchTerm, statusFilter, deptFilter);
      setTickets(res.data || res); // Handle backward compatibility
      if (res.pagination) {
        setTotalPages(res.pagination.totalPages);
        setTotalRecords(res.pagination.total);
      }
    } catch (err) {
      console.error(err);
    }
  };

  React.useEffect(() => {
    // Debounce the search input
    const timeout = setTimeout(() => {
      fetchData();
    }, 300);
    return () => clearTimeout(timeout);
  }, [page, searchTerm, statusFilter, deptFilter]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (filterPopupRef.current && !filterPopupRef.current.contains(event.target as Node)) {
        setShowFilterPopup(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleExportCSV = async () => {
    try {
      setIsExporting(true);
      const blob = await api.exportTicketsCSV(searchTerm, statusFilter, deptFilter);
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `tickets-export-${new Date().toISOString().split('T')[0]}.csv`;
      document.body.appendChild(a);
      a.click();
      a.remove();
      window.URL.revokeObjectURL(url);
      toast.success('Export downloaded!');
    } catch (err) {
      toast.error('Failed to export tickets');
    } finally {
      setIsExporting(false);
    }
  };



  const handleDelete = async (id: string) => {
    if (confirm("Are you sure you want to delete this ticket?")) {
      try {
        await api.deleteTicket(id);
        toast.success('Ticket deleted!');
        fetchData();
      } catch (err) {
        console.error(err);
        toast.error('Error deleting ticket');
      }
    }
  };

  const filteredTickets = tickets; // Filtering is now handled by the backend

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
            <Button className="space-x-2" onClick={handleExportCSV} disabled={isExporting}>
              <Download className="w-4 h-4" />
              <span>{isExporting ? 'Exporting...' : 'Export CSV'}</span>
            </Button>
            {/* <Button className="space-x-2">
              <Plus className="w-4 h-4" />
              <span>Manual Entry</span>
            </Button> */}
          </div>
        </div>

        {/* Filters Bar */}
        <Card className="p-4 overflow-visible">
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

            <div className="relative flex items-center pb-2 lg:pb-0" ref={filterPopupRef}>
              <Button
                size="sm"
                className="h-8.5"
                onClick={() => setShowFilterPopup((value) => !value)}
                title="Open filters"
              >
                <Filter className="w-3.5 h-3.5" />
              </Button>

              {showFilterPopup && (
                <div className="absolute right-0 top-full mt-2 w-72 rounded-2xl border border-border-subtle bg-bg-card p-4 shadow-2xl z-30">
                  <div className="mb-3 flex items-center justify-between">
                    <div>
                      <p className="text-sm font-bold text-text-main">Filters</p>
                    </div>
                    <button
                      type="button"
                      onClick={() => setShowFilterPopup(false)}
                      className="text-xs font-bold uppercase tracking-wider text-text-muted hover:text-text-main"
                    >
                      Close
                    </button>
                  </div>

                  <div className="space-y-3">
                    <div>
                      <label className="mb-1 block text-[10px] font-bold uppercase tracking-widest text-text-muted">
                        Status
                      </label>
                      <select
                        className="w-full bg-bg-dark border border-border-subtle rounded-lg px-3 py-2 text-xs text-text-main focus:outline-none focus:border-brand-primary/50"
                        value={statusFilter}
                        onChange={(e) => setStatusFilter(e.target.value)}
                      >
                        <option value="All">All Statuses</option>
                        <option value="Open">Open</option>
                        <option value="In Progress">In Progress</option>
                        <option value="Resolved">Resolved</option>
                        <option value="Time Expired">Time Expired</option>
                        <option value="Escalated">Escalated</option>
                      </select>
                    </div>

                    <div>
                      <label className="mb-1 block text-[10px] font-bold uppercase tracking-widest text-text-muted">
                        Department
                      </label>
                      <select
                        className="w-full bg-bg-dark border border-border-subtle rounded-lg px-3 py-2 text-xs text-text-main focus:outline-none focus:border-brand-primary/50"
                        value={deptFilter}
                        onChange={(e) => setDeptFilter(e.target.value)}
                      >
                        <option value="All">All Departments</option>
                        {departments.map(d => <option key={d.id} value={d.id}>{d.name}</option>)}
                      </select>
                    </div>
                  </div>
                </div>
              )}
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
                  <th className="px-6 py-4">Department</th>
                  <th className="px-6 py-4">Category</th>
                  <th className="px-6 py-4">Assigned To</th>
                  <th className="px-6 py-4">Created</th>
                  <th className="px-6 py-4">Status</th>
                  <th className="px-6 py-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border-subtle">
                {filteredTickets.map((ticket) => {
                  const departmentName =
                    (ticket as any)?.departmentId?.name ||
                    departments.find(d => String(d.id) === String((ticket as any)?.departmentId))?.name ||
                    'Unknown';
                  const categoryName = (ticket as any)?.categoryId?.name || 'Unknown';
                  const assignedToName = (ticket as any)?.assignedStaffId?.name || 'Unassigned';
                  return (
                    <tr
                      key={ticket.id}
                      className={`transition-all group text-sm ${
                        ticket.status === 'Time Expired' || ticket.status === 'Escalated'
                          ? 'bg-danger/5 hover:bg-danger/10'
                          : 'hover:bg-brand-primary/5'
                      }`}
                    >
                      <td className="px-6 py-4">
                        <Link href={`/admin/queries/${ticket.id}`} className="font-bold text-brand-primary hover:underline">
                          {ticket.id}
                        </Link>
                      </td>
                      <td className="px-6 py-4 text-text-main font-medium">{ticket.customerName}</td>
                    
                      <td className="px-6 py-4">
                        <span className="text-xs text-text-main">{departmentName}</span>
                      </td>
                      <td className="px-6 py-4">
                        <span className="text-xs text-text-main">{categoryName}</span>
                      </td>
                      <td className="px-6 py-4">
                        <span className="text-xs text-text-main">{assignedToName}</span>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center space-x-2">
                          <Clock className="w-3 h-3 text-text-muted" />
                          <span className="font-mono text-xs text-text-main">
                            {new Date(ticket.createdAt).toLocaleString()}
                          </span>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center space-x-2">
                          <div className={`w-1.5 h-1.5 rounded-full ${ticket.status === 'Resolved' ? 'bg-success' :
                            ticket.status === 'Escalated' || ticket.status === 'Time Expired' ? 'bg-danger' :
                              ticket.status === 'In Progress' ? 'bg-info' : 'bg-warning'
                            }`} />
                          <span className="text-xs font-bold text-text-main uppercase">{ticket.status}</span>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-right">
                        <div className="flex items-center justify-end space-x-1">
                          <Link href={`/admin/queries/${ticket.id}`}>
                            <Button size="sm" className="h-8 w-8 p-0" title="View Details">
                              <Eye className="w-4 h-4" />
                            </Button>
                          </Link>
                          <Link href={`/admin/queries/${ticket.id}`}>
                            <Button size="sm" className="h-8 w-8 p-0" title="Edit Ticket">
                              <Edit className="w-4 h-4" />
                            </Button>
                          </Link>
                          <Button

                            size="sm"
                            className="h-8 w-8 p-0"
                            onClick={() => handleDelete(ticket.id)}
                            title="Delete Ticket"
                          >
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </div>
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-4 border-t border-border-subtle bg-bg-dark/30">
            <p className="text-xs font-bold text-text-muted uppercase tracking-wider">
              Showing <span className="text-text-main">{(page - 1) * limit + 1}-{Math.min(page * limit, totalRecords)}</span> of <span className="text-text-main">{totalRecords}</span> Entries
            </p>
            <div className="flex items-center space-x-2">
              <Button size="sm" className="h-8" disabled={page === 1} onClick={() => setPage(p => p - 1)}>
                <ChevronLeft className="w-4 h-4" />
              </Button>
              <div className="flex items-center px-2 space-x-1">
                {Array.from({ length: totalPages }).map((_, i) => {
                  const n = i + 1;
                  return (
                  <button
                    key={n}
                    onClick={() => setPage(n)}
                    className={`w-8 h-8 rounded-lg text-xs font-bold transition-colors ${n === page ? 'bg-brand-primary text-white shadow-sm' : 'text-text-muted hover:text-brand-primary hover:bg-brand-primary/5'
                      }`}
                  >
                    {n}
                  </button>
                )})}
              </div>
              <Button size="sm" className="h-8" disabled={page === totalPages || totalPages === 0} onClick={() => setPage(p => p + 1)}>
                <ChevronRight className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </Card>
      </div>
    </DashboardLayout>
  );
}

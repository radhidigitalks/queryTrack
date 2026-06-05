import React, { useState, useEffect } from 'react';
import Head from 'next/head';
import DashboardLayout from '@/layouts/DashboardLayout';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { Plus, Edit2, Trash2, Tags, User, Shield } from 'lucide-react';
import { api } from '@/utils/api';
import toast from 'react-hot-toast';

export default function AssignmentsPage() {
  const [categories, setCategories] = useState<any[]>([]);
  const [users, setUsers] = useState<any[]>([]);
  const [assignments, setAssignments] = useState<any[]>([]);
  const [supervisors, setSupervisors] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [isAssignmentModalOpen, setIsAssignmentModalOpen] = useState(false);
  const [isSupervisorModalOpen, setIsSupervisorModalOpen] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<any>(null);
  const [formData, setFormData] = useState({
    categoryId: '',
    staffId: ''
  });
  const [supervisorFormData, setSupervisorFormData] = useState({
    categoryId: '',
    supervisorId: ''
  });

  const fetchData = async () => {
    try {
      const [catRes, userRes, assignRes, supervisorRes] = await Promise.all([
        api.getCategories(),
        api.getUsers(),
        api.getCategoryAssignments(),
        api.getCategorySupervisors()
      ]);
      setCategories(catRes);
      setUsers(userRes);
      setAssignments(assignRes);
      setSupervisors(supervisorRes);
    } catch (err) {
      console.error(err);
      toast.error('Failed to load data');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const getAssignmentForCategory = (categoryId: string) => {
    return assignments.find((a) => {
      const assignmentCategoryId = a?.categoryId?._id || a?.categoryId?.id || a?.categoryId;
      return String(assignmentCategoryId) === String(categoryId);
    });
  };

  const getSupervisorForCategory = (categoryId: string) => {
    return supervisors.find((s) => {
      const supervisorCategoryId = s?.categoryId?._id || s?.categoryId?.id || s?.categoryId;
      return String(supervisorCategoryId) === String(categoryId);
    });
  };

  const handleAssignmentSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await api.createCategoryAssignment(formData);
      toast.success('Staff assigned successfully');
      setIsAssignmentModalOpen(false);
      resetAssignmentForm();
      fetchData();
    } catch (err) {
      console.error(err);
      toast.error('Failed to assign staff');
    }
  };

  const handleSupervisorSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await api.createCategorySupervisor(supervisorFormData);
      toast.success('Supervisor assigned successfully');
      setIsSupervisorModalOpen(false);
      resetSupervisorForm();
      fetchData();
    } catch (err) {
      console.error(err);
      toast.error('Failed to assign supervisor');
    }
  };

  const handleDeleteAssignment = async (categoryId: string) => {
    if (!confirm('Are you sure you want to remove this assignment?')) return;
    try {
      await api.deleteCategoryAssignment(categoryId);
      toast.success('Assignment removed');
      fetchData();
    } catch (err) {
      console.error(err);
      toast.error('Failed to remove assignment');
    }
  };

  const handleDeleteSupervisor = async (categoryId: string) => {
    if (!confirm('Are you sure you want to remove this supervisor?')) return;
    try {
      await api.deleteCategorySupervisor(categoryId);
      toast.success('Supervisor removed');
      fetchData();
    } catch (err) {
      console.error(err);
      toast.error('Failed to remove supervisor');
    }
  };

  const resetAssignmentForm = () => {
    setFormData({ categoryId: '', staffId: '' });
    setSelectedCategory(null);
  };

  const resetSupervisorForm = () => {
    setSupervisorFormData({ categoryId: '', supervisorId: '' });
    setSelectedCategory(null);
  };

  return (
    <DashboardLayout>
      <Head>
        <title>Category Assignments | Admin</title>
      </Head>

      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold text-text-main mb-1">Category Assignments</h1>
          <p className="text-text-muted text-sm">Assign staff members and supervisors to categories.</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Staff Assignments */}
          <Card className="p-0 overflow-hidden">
            <div className="p-4 border-b border-border-subtle flex items-center justify-between">
              <h3 className="text-sm font-bold text-text-main uppercase tracking-wider flex items-center">
                <User className="w-4 h-4 mr-2" />
                Staff Assignments
              </h3>
              <Button onClick={() => { resetAssignmentForm(); setIsAssignmentModalOpen(true); }} size="sm" className="space-x-2">
                <Plus className="w-3 h-3" />
                <span>Assign</span>
              </Button>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm">
                <thead>
                  <tr className="bg-bg-dark text-text-muted uppercase tracking-widest border-b border-border-subtle">
                    <th className="px-4 py-3 font-bold">Category</th>
                    <th className="px-4 py-3 font-bold">Assigned To</th>
                    <th className="px-4 py-3 font-bold text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border-subtle">
                  {categories.map((cat) => {
                    const assignment = getAssignmentForCategory(cat.id);
                    return (
                      <tr key={cat.id} className="hover:bg-brand-primary/5 transition-colors">
                        <td className="px-4 py-3">
                          <div className="flex items-center space-x-2">
                            <Tags className="w-4 h-4 text-brand-primary" />
                            <span className="font-medium">{cat.name}</span>
                          </div>
                        </td>
                        <td className="px-4 py-3">
                          {assignment?.staffId?.name ? (
                            <span className="text-text-main">{assignment.staffId.name}</span>
                          ) : (
                            <span className="text-text-muted italic">Not assigned</span>
                          )}
                        </td>
                        <td className="px-4 py-3 text-right">
                          <div className="flex items-center justify-end space-x-2">
                            <Button 
                              variant="ghost" 
                              size="sm" 
                              className="p-1.5"
                              onClick={() => {
                                setFormData({ 
                                  categoryId: cat.id, 
                                  staffId: assignment?.staffId?._id || assignment?.staffId?.id || ''
                                });
                                setSelectedCategory(cat);
                                setIsAssignmentModalOpen(true);
                              }}
                            >
                              <Edit2 className="w-3.5 h-3.5" />
                            </Button>
                            {assignment && (
                              <Button 
                                variant="ghost" 
                                size="sm" 
                                className="p-1.5 text-danger"
                                onClick={() => handleDeleteAssignment(cat.id)}
                              >
                                <Trash2 className="w-3.5 h-3.5" />
                              </Button>
                            )}
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </Card>

          {/* Supervisor Assignments */}
          <Card className="p-0 overflow-hidden">
            <div className="p-4 border-b border-border-subtle flex items-center justify-between">
              <h3 className="text-sm font-bold text-text-main uppercase tracking-wider flex items-center">
                <Shield className="w-4 h-4 mr-2" />
                Supervisor Assignments
              </h3>
              <Button onClick={() => { resetSupervisorForm(); setIsSupervisorModalOpen(true); }} size="sm" className="space-x-2">
                <Plus className="w-3 h-3" />
                <span>Assign</span>
              </Button>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm">
                <thead>
                  <tr className="bg-bg-dark text-text-muted uppercase tracking-widest border-b border-border-subtle">
                    <th className="px-4 py-3 font-bold">Category</th>
                    <th className="px-4 py-3 font-bold">Supervisor</th>
                    <th className="px-4 py-3 font-bold text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border-subtle">
                  {categories.map((cat) => {
                    const supervisor = getSupervisorForCategory(cat.id);
                    return (
                      <tr key={cat.id} className="hover:bg-brand-primary/5 transition-colors">
                        <td className="px-4 py-3">
                          <div className="flex items-center space-x-2">
                            <Tags className="w-4 h-4 text-brand-primary" />
                            <span className="font-medium">{cat.name}</span>
                          </div>
                        </td>
                        <td className="px-4 py-3">
                          {supervisor?.supervisorId?.name ? (
                            <span className="text-text-main">{supervisor.supervisorId.name}</span>
                          ) : (
                            <span className="text-text-muted italic">Not assigned</span>
                          )}
                        </td>
                        <td className="px-4 py-3 text-right">
                          <div className="flex items-center justify-end space-x-2">
                            <Button 
                              variant="ghost" 
                              size="sm" 
                              className="p-1.5"
                              onClick={() => {
                                setSupervisorFormData({ 
                                  categoryId: cat.id, 
                                  supervisorId: supervisor?.supervisorId?._id || supervisor?.supervisorId?.id || ''
                                });
                                setSelectedCategory(cat);
                                setIsSupervisorModalOpen(true);
                              }}
                            >
                              <Edit2 className="w-3.5 h-3.5" />
                            </Button>
                            {supervisor && (
                              <Button 
                                variant="ghost" 
                                size="sm" 
                                className="p-1.5 text-danger"
                                onClick={() => handleDeleteSupervisor(cat.id)}
                              >
                                <Trash2 className="w-3.5 h-3.5" />
                              </Button>
                            )}
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </Card>
        </div>
      </div>

      {/* Assignment Modal */}
      {isAssignmentModalOpen && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <Card className="w-full max-w-md p-6">
            <h2 className="text-xl font-bold text-text-main mb-6">Assign Staff</h2>
            <form onSubmit={handleAssignmentSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-text-main mb-1">Category</label>
                <select
                  value={formData.categoryId}
                  onChange={(e) => setFormData({ ...formData, categoryId: e.target.value })}
                  className="w-full bg-bg-dark border border-border-subtle rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:border-brand-primary/50 transition-all"
                  required
                >
                  <option value="">Select Category</option>
                  {categories.map((cat) => (
                    <option key={cat.id} value={cat.id}>{cat.name}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-text-main mb-1">Staff Member</label>
                <select
                  value={formData.staffId}
                  onChange={(e) => setFormData({ ...formData, staffId: e.target.value })}
                  className="w-full bg-bg-dark border border-border-subtle rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:border-brand-primary/50 transition-all"
                  required
                >
                  <option value="">Select Staff</option>
                  {users.map((user) => (
                    <option key={user.id} value={user.id}>{user.name}</option>
                  ))}
                </select>
              </div>
              <div className="flex items-center justify-end space-x-3 pt-4">
                <Button 
                  type="button" 
                  variant="outline" 
                  onClick={() => setIsAssignmentModalOpen(false)}
                >
                  Cancel
                </Button>
                <Button type="submit">Save</Button>
              </div>
            </form>
          </Card>
        </div>
      )}

      {/* Supervisor Modal */}
      {isSupervisorModalOpen && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <Card className="w-full max-w-md p-6">
            <h2 className="text-xl font-bold text-text-main mb-6">Assign Supervisor</h2>
            <form onSubmit={handleSupervisorSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-text-main mb-1">Category</label>
                <select
                  value={supervisorFormData.categoryId}
                  onChange={(e) => setSupervisorFormData({ ...supervisorFormData, categoryId: e.target.value })}
                  className="w-full bg-bg-dark border border-border-subtle rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:border-brand-primary/50 transition-all"
                  required
                >
                  <option value="">Select Category</option>
                  {categories.map((cat) => (
                    <option key={cat.id} value={cat.id}>{cat.name}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-text-main mb-1">Supervisor</label>
                <select
                  value={supervisorFormData.supervisorId}
                  onChange={(e) => setSupervisorFormData({ ...supervisorFormData, supervisorId: e.target.value })}
                  className="w-full bg-bg-dark border border-border-subtle rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:border-brand-primary/50 transition-all"
                  required
                >
                  <option value="">Select Supervisor</option>
                  {users.map((user) => (
                    <option key={user.id} value={user.id}>{user.name}</option>
                  ))}
                </select>
              </div>
              <div className="flex items-center justify-end space-x-3 pt-4">
                <Button 
                  type="button" 
                  variant="outline" 
                  onClick={() => setIsSupervisorModalOpen(false)}
                >
                  Cancel
                </Button>
                <Button type="submit">Save</Button>
              </div>
            </form>
          </Card>
        </div>
      )}
    </DashboardLayout>
  );
}

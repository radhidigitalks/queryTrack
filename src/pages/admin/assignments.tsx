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
  const [departments, setDepartments] = useState<any[]>([]);
  const [users, setUsers] = useState<any[]>([]);
  const [assignments, setAssignments] = useState<any[]>([]);
  const [supervisors, setSupervisors] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedDepartment, setSelectedDepartment] = useState<string>('all');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<any>(null);
  const [formData, setFormData] = useState({
    categoryId: '',
    staffId: '',
    supervisorId: ''
  });

  const fetchData = async () => {
    try {
      const [catRes, deptRes, userRes, assignRes, supervisorRes] = await Promise.all([
        api.getCategories(),
        api.getDepartments(),
        api.getUsers(),
        api.getCategoryAssignments(),
        api.getCategorySupervisors()
      ]);
      setCategories(catRes);
      setDepartments(deptRes);
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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (formData.staffId) {
        await api.createCategoryAssignment({ categoryId: formData.categoryId, staffId: formData.staffId });
      } else {
        const existingStaff = getAssignmentForCategory(formData.categoryId);
        if (existingStaff) await api.deleteCategoryAssignment(formData.categoryId);
      }

      if (formData.supervisorId) {
        await api.createCategorySupervisor({ categoryId: formData.categoryId, supervisorId: formData.supervisorId });
      } else {
        const existingSupervisor = getSupervisorForCategory(formData.categoryId);
        if (existingSupervisor) await api.deleteCategorySupervisor(formData.categoryId);
      }

      toast.success('Assignments updated successfully');
      setIsModalOpen(false);
      resetForm();
      fetchData();
    } catch (err) {
      console.error(err);
      toast.error('Failed to update assignments');
    }
  };

  const handleDeleteAll = async (categoryId: string) => {
    if (!confirm('Are you sure you want to remove both staff and supervisor assignments?')) return;
    try {
      const existingStaff = getAssignmentForCategory(categoryId);
      if (existingStaff) await api.deleteCategoryAssignment(categoryId);
      const existingSupervisor = getSupervisorForCategory(categoryId);
      if (existingSupervisor) await api.deleteCategorySupervisor(categoryId);
      toast.success('Assignments removed');
      fetchData();
    } catch (err) {
      console.error(err);
      toast.error('Failed to remove assignments');
    }
  };

  const resetForm = () => {
    setFormData({ categoryId: '', staffId: '', supervisorId: '' });
    setSelectedCategory(null);
  };

  return (
    <DashboardLayout>
      <Head>
        <title>Category Assignments | Admin</title>
      </Head>

      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-text-main mb-1">Category Assignments</h1>
            <p className="text-text-muted text-sm">Assign staff members and supervisors to categories.</p>
          </div>
        </div>

        <div className="space-y-12 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-4">
          {departments.map(dept => {
            const deptCategories = categories.filter(c => (c.departmentId?._id || c.departmentId?.id || c.departmentId) === dept.id);
            if (deptCategories.length === 0) return null;

            return (
              <div key={dept.id} className="space-y-4">
                <h2 className="text-xl font-bold text-brand-primary flex items-center">
                  <span className="w-2 h-6 bg-brand-primary rounded mr-3"></span>
                  {dept.name} Department
                </h2>
                
                <Card className="p-0 overflow-hidden flex flex-col h-[400px]">
                  <div className="p-4 border-b border-border-subtle flex items-center justify-between shrink-0">
                    <h3 className="text-sm font-bold text-text-main uppercase tracking-wider flex items-center">
                      <Shield className="w-4 h-4 mr-2" />
                      Assignments
                    </h3>
                    <Button onClick={() => { resetForm(); setIsModalOpen(true); }} size="sm" className="space-x-2">
                      <Plus className="w-3 h-3" />
                      <span>Assign</span>
                    </Button>
                  </div>
                  <div className="overflow-auto flex-1">
                    <table className="w-full text-left text-sm">
                      <thead>
                        <tr className="bg-bg-dark text-text-muted uppercase tracking-widest border-b border-border-subtle sticky top-0 z-10">
                          <th className="px-4 py-3 font-bold">Category</th>
                          <th className="px-4 py-3 font-bold">Assigned Staff</th>
                          <th className="px-4 py-3 font-bold">Assigned Supervisor</th>
                          <th className="px-4 py-3 font-bold text-right">Actions</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-border-subtle">
                        {deptCategories.map((cat) => {
                          const assignment = getAssignmentForCategory(cat.id);
                          const supervisor = getSupervisorForCategory(cat.id);
                          return (
                            <tr key={cat.id} className="hover:bg-brand-primary/5 transition-colors">
                              <td className="px-4 py-3">
                                <div className="flex items-center space-x-2">
                                  <span className="font-medium">{cat.name}</span>
                                </div>
                              </td>
                              <td className="px-4 py-3">
                                {assignment?.staffId?.name ? (
                                  <span className="text-text-main flex items-center">{assignment.staffId.name}</span>
                                ) : (
                                  <span className="text-text-muted italic">Not assigned</span>
                                )}
                              </td>
                              <td className="px-4 py-3">
                                {supervisor?.supervisorId?.name ? (
                                  <span className="text-text-main flex items-center">{supervisor.supervisorId.name}</span>
                                ) : (
                                  <span className="text-text-muted italic">Not assigned</span>
                                )}
                              </td>
                              <td className="px-4 py-3 text-right">
                                <div className="flex items-center justify-end space-x-2">
                                  <Button 
                                    size="sm" 
                                    className="p-1.5"
                                    onClick={() => {
                                      setFormData({ 
                                        categoryId: cat.id, 
                                        staffId: assignment?.staffId?._id || assignment?.staffId?.id || '',
                                        supervisorId: supervisor?.supervisorId?._id || supervisor?.supervisorId?.id || ''
                                      });
                                      setSelectedCategory(cat);
                                      setIsModalOpen(true);
                                    }}
                                  >
                                    <Edit2 className="w-3.5 h-3.5" />
                                  </Button>
                                  {(assignment || supervisor) && (
                                    <Button 
                                      size="sm" 
                                      className="p-1.5"
                                      onClick={() => handleDeleteAll(cat.id)}
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
            );
          })}
        </div>
      </div>

      {/* Unified Assignment Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <Card className="w-full max-w-md p-6">
            <h2 className="text-xl font-bold text-text-main mb-6">Assign Staff & Supervisor</h2>
            <form onSubmit={handleSubmit} className="space-y-4">
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
                >
                  <option value="">Not Assigned (Delete)</option>
                  {users.map((user) => (
                    <option key={user.id} value={user.id}>{user.name}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-text-main mb-1">Supervisor</label>
                <select
                  value={formData.supervisorId}
                  onChange={(e) => setFormData({ ...formData, supervisorId: e.target.value })}
                  className="w-full bg-bg-dark border border-border-subtle rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:border-brand-primary/50 transition-all"
                >
                  <option value="">Not Assigned (Delete)</option>
                  {users.map((user) => (
                    <option key={user.id} value={user.id}>{user.name}</option>
                  ))}
                </select>
              </div>
              <div className="flex items-center justify-end space-x-3 pt-4">
                <Button 
                  type="button" 
                  variant="outline" 
                  onClick={() => setIsModalOpen(false)}
                >
                  Cancel
                </Button>
                <Button type="submit">Save Assignments</Button>
              </div>
            </form>
          </Card>
        </div>
      )}
    </DashboardLayout>
  );
}

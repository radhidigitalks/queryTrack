import React, { useState, useEffect } from 'react';
import Head from 'next/head';
import DashboardLayout from '@/layouts/DashboardLayout';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { Plus, Edit2, Trash2, Tags, Building2 } from 'lucide-react';
import { api } from '@/utils/api';
import toast from 'react-hot-toast';

export default function CategoriesPage() {
  const [categories, setCategories] = useState<any[]>([]);
  const [departments, setDepartments] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    departmentId: ''
  });
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreviewUrl, setImagePreviewUrl] = useState<string>('');

  const fetchData = async () => {
    try {
      const [catRes, deptRes] = await Promise.all([
        api.getCategories(),
        api.getDepartments()
      ]);
      setCategories(catRes);
      setDepartments(deptRes);
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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const payload = new FormData();
      payload.append('name', formData.name);
      payload.append('departmentId', formData.departmentId);
      if (imageFile) payload.append('image', imageFile);

      if (editingId) {
        await api.updateCategory(editingId, payload);
        toast.success('Category updated successfully');
      } else {
        await api.createCategory(payload);
        toast.success('Category created successfully');
      }
      setIsModalOpen(false);
      resetForm();
      fetchData();
    } catch (err) {
      console.error(err);
      toast.error('Failed to save category');
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this category?')) return;
    try {
      await api.deleteCategory(id);
      toast.success('Category deleted successfully');
      fetchData();
    } catch (err) {
      console.error(err);
      toast.error('Failed to delete category');
    }
  };

  const resetForm = () => {
    setFormData({
      name: '',
      departmentId: ''
    });
    setEditingId(null);
    setImageFile(null);
    setImagePreviewUrl('');
  };

  return (
    <DashboardLayout>
      <Head>
        <title>Categories | Admin</title>
      </Head>

      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-text-main mb-1">Categories</h1>
            <p className="text-text-muted text-sm">Manage categories for each department.</p>
          </div>
          <Button onClick={() => { resetForm(); setIsModalOpen(true); }} className="space-x-2">
            <Plus className="w-4 h-4" />
            <span>Add Category</span>
          </Button>
        </div>

        {departments.length === 0 && categories.length === 0 && (
          <Card className="p-12 text-center text-text-muted">
            No departments or categories found.
          </Card>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-start">
          {departments.map((dept) => {
            const deptCategories = categories.filter(c => {
              const cDeptId = c.departmentId?._id || c.departmentId?.id || c.departmentId;
              return String(cDeptId) === String(dept.id);
            });

            return (
              <div key={dept.id} className="space-y-3">
                <div className="flex items-center space-x-2 px-1">
                  <Building2 className="w-5 h-5 text-brand-primary" />
                  <h2 className="text-lg font-bold text-text-main">{dept.name}</h2>
                  <span className="text-xs font-bold px-2 py-0.5 rounded-full bg-brand-primary/10 text-brand-primary">
                    {deptCategories.length}
                  </span>
                </div>
                <Card className="p-0 overflow-hidden">
                  <div className="overflow-auto max-h-[350px]">
                    <table className="w-full text-left text-sm relative">
                      <thead className="sticky top-0 z-10">
                        <tr className="bg-bg-dark text-text-muted uppercase tracking-widest border-b border-border-subtle">
                          <th className="px-6 py-4 font-bold w-24">Image</th>
                          <th className="px-6 py-4 font-bold">Category Name</th>
                          <th className="px-6 py-4 font-bold text-right">Actions</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-border-subtle">
                        {deptCategories.map((cat) => (
                          <tr key={cat.id} className="hover:bg-brand-primary/5 transition-colors">
                            <td className="px-6 py-4">
                              <div className="w-10 h-10 rounded-lg overflow-hidden bg-white shadow-sm p-1 border border-border-subtle">
                                <img src={cat.imageUrl || '/logo.webp'} alt="" className="w-full h-full object-contain" />
                              </div>
                            </td>
                            <td className="px-6 py-4 w-full">
                              <div className="flex items-center space-x-3">
                                <Tags className="w-5 h-5 text-brand-primary" />
                                <span className="font-medium text-text-main">{cat.name}</span>
                              </div>
                            </td>
                            <td className="px-6 py-4 text-right">
                              <div className="flex items-center justify-end space-x-2">
                                <Button 
                                  variant="ghost" 
                                  className="p-2"
                                  onClick={() => {
                                    setEditingId(cat.id);
                                    const deptId =
                                      cat.departmentId?._id ||
                                      cat.departmentId?.id ||
                                      cat.departmentId;
                                    setFormData({
                                      name: cat.name,
                                      departmentId: deptId ? String(deptId) : ''
                                    });
                                    setImageFile(null);
                                    setImagePreviewUrl(cat.imageUrl || '');
                                    setIsModalOpen(true);
                                  }}
                                >
                                  <Edit2 className="w-4 h-4" />
                                </Button>
                                <Button 
                                  variant="ghost" 
                                  className="p-2 text-danger"
                                  onClick={() => handleDelete(cat.id)}
                                >
                                  <Trash2 className="w-4 h-4" />
                                </Button>
                              </div>
                            </td>
                          </tr>
                        ))}
                        {deptCategories.length === 0 && (
                          <tr>
                            <td colSpan={3} className="px-6 py-8 text-center text-text-muted text-xs">
                              No categories in this department
                            </td>
                          </tr>
                        )}
                      </tbody>
                    </table>
                  </div>
                </Card>
              </div>
            );
          })}

          {(() => {
            const unassignedCategories = categories.filter(c => {
              const cDeptId = c.departmentId?._id || c.departmentId?.id || c.departmentId;
              return !departments.some(d => String(d.id) === String(cDeptId));
            });

            if (unassignedCategories.length === 0) return null;

            return (
              <div className="space-y-3">
                <div className="flex items-center space-x-2 px-1">
                  <Building2 className="w-5 h-5 text-text-muted" />
                  <h2 className="text-lg font-bold text-text-main">Unassigned</h2>
                  <span className="text-xs font-bold px-2 py-0.5 rounded-full bg-border-subtle text-text-muted">
                    {unassignedCategories.length}
                  </span>
                </div>
                <Card className="p-0 overflow-hidden">
                  <div className="overflow-auto max-h-[350px]">
                    <table className="w-full text-left text-sm relative">
                      <thead className="sticky top-0 z-10">
                        <tr className="bg-bg-dark text-text-muted uppercase tracking-widest border-b border-border-subtle">
                          <th className="px-6 py-4 font-bold w-24">Image</th>
                          <th className="px-6 py-4 font-bold">Category Name</th>
                          <th className="px-6 py-4 font-bold text-right">Actions</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-border-subtle">
                        {unassignedCategories.map((cat) => (
                          <tr key={cat.id} className="hover:bg-brand-primary/5 transition-colors">
                            <td className="px-6 py-4">
                              <div className="w-10 h-10 rounded-lg overflow-hidden bg-white shadow-sm p-1 border border-border-subtle">
                                <img src={cat.imageUrl || '/logo.webp'} alt="" className="w-full h-full object-contain" />
                              </div>
                            </td>
                            <td className="px-6 py-4 w-full">
                              <div className="flex items-center space-x-3">
                                <Tags className="w-5 h-5 text-brand-primary" />
                                <span className="font-medium text-text-main">{cat.name}</span>
                              </div>
                            </td>
                            <td className="px-6 py-4 text-right">
                              <div className="flex items-center justify-end space-x-2">
                                <Button 
                                  variant="ghost" 
                                  className="p-2"
                                  onClick={() => {
                                    setEditingId(cat.id);
                                    const deptId =
                                      cat.departmentId?._id ||
                                      cat.departmentId?.id ||
                                      cat.departmentId;
                                    setFormData({
                                      name: cat.name,
                                      departmentId: deptId ? String(deptId) : ''
                                    });
                                    setImageFile(null);
                                    setImagePreviewUrl(cat.imageUrl || '');
                                    setIsModalOpen(true);
                                  }}
                                >
                                  <Edit2 className="w-4 h-4" />
                                </Button>
                                <Button 
                                  variant="ghost" 
                                  className="p-2 text-danger"
                                  onClick={() => handleDelete(cat.id)}
                                >
                                  <Trash2 className="w-4 h-4" />
                                </Button>
                              </div>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </Card>
              </div>
            );
          })()}
        </div>
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <Card className="w-full max-w-md p-6">
            <h2 className="text-xl font-bold text-text-main mb-6">
              {editingId ? 'Edit Category' : 'Add Category'}
            </h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-text-main mb-1">Image</label>
                <div className="flex items-center space-x-3">
                  <div className="w-14 h-14 rounded-lg overflow-hidden bg-white shadow-sm p-1 border border-border-subtle flex items-center justify-center">
                    <img src={imagePreviewUrl || '/logo.webp'} alt="" className="w-full h-full object-contain" />
                  </div>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={(e) => {
                      const f = e.target.files?.[0] || null;
                      setImageFile(f);
                      setImagePreviewUrl(f ? URL.createObjectURL(f) : imagePreviewUrl);
                    }}
                    className="text-sm text-text-muted"
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-text-main mb-1">Name</label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full bg-bg-dark border border-border-subtle rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:border-brand-primary/50 transition-all"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-text-main mb-1">Department</label>
                <select
                  value={formData.departmentId}
                  onChange={(e) => setFormData({ ...formData, departmentId: e.target.value })}
                  className="w-full bg-bg-dark border border-border-subtle rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:border-brand-primary/50 transition-all"
                  required
                >
                  <option value="">Select Department</option>
                  {departments.map((dept) => (
                    <option key={dept.id} value={dept.id}>{dept.name}</option>
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
                <Button type="submit">
                  {editingId ? 'Update' : 'Create'}
                </Button>
              </div>
            </form>
          </Card>
        </div>
      )}
    </DashboardLayout>
  );
}

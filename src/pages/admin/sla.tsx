import React, { useState, useEffect } from 'react';
import Head from 'next/head';
import DashboardLayout from '@/layouts/DashboardLayout';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { Plus, Edit2, Trash2, Tags, Timer } from 'lucide-react';
import { api } from '@/utils/api';
import toast from 'react-hot-toast';

export default function SLAPage() {
  const [categories, setCategories] = useState<any[]>([]);
  const [slas, setSLAs] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<any>(null);
  const [formData, setFormData] = useState({
    categoryId: '',
    resolutionTime: '',
    timeUnit: 'Minutes' as 'Minutes' | 'Hours'
  });

  const fetchData = async () => {
    try {
      const [catRes, slaRes] = await Promise.all([
        api.getCategories(),
        api.getCategorySLAs()
      ]);
      setCategories(catRes);
      setSLAs(slaRes);
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

  const getSLAForCategory = (categoryId: string) => {
    return slas.find((s) => {
      const slaCategoryId = s?.categoryId?._id || s?.categoryId?.id || s?.categoryId;
      return String(slaCategoryId) === String(categoryId);
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await api.createCategorySLA({
        ...formData,
        resolutionTime: Number(formData.resolutionTime)
      });
      toast.success('SLA configured successfully');
      setIsModalOpen(false);
      resetForm();
      fetchData();
    } catch (err) {
      console.error(err);
      toast.error('Failed to configure SLA');
    }
  };

  const handleDelete = async (categoryId: string) => {
    if (!confirm('Are you sure you want to remove this SLA?')) return;
    try {
      await api.deleteCategorySLA(categoryId);
      toast.success('SLA removed');
      fetchData();
    } catch (err) {
      console.error(err);
      toast.error('Failed to remove SLA');
    }
  };

  const resetForm = () => {
    setFormData({
      categoryId: '',
      resolutionTime: '',
      timeUnit: 'Minutes'
    });
    setSelectedCategory(null);
  };

  return (
    <DashboardLayout>
      <Head>
        <title>SLA Management | Admin</title>
      </Head>

      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-text-main mb-1">SLA Management</h1>
            <p className="text-text-muted text-sm">Configure resolution time SLAs per category.</p>
          </div>
          <Button onClick={() => { resetForm(); setIsModalOpen(true); }} className="space-x-2">
            <Plus className="w-4 h-4" />
            <span>Configure SLA</span>
          </Button>
        </div>

        <Card className="p-0 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead>
                <tr className="bg-bg-dark text-text-muted uppercase tracking-widest border-b border-border-subtle">
                  <th className="px-6 py-4 font-bold">Category</th>
                  <th className="px-6 py-4 font-bold">Resolution Time</th>
                  <th className="px-6 py-4 font-bold text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border-subtle">
                {categories.map((cat) => {
                  const sla = getSLAForCategory(cat.id);
                  return (
                    <tr key={cat.id} className="hover:bg-brand-primary/5 transition-colors">
                      <td className="px-6 py-4">
                        <div className="flex items-center space-x-3">
                          <Tags className="w-5 h-5 text-brand-primary" />
                          <span className="font-medium text-text-main">{cat.name}</span>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        {sla ? (
                          <div className="flex items-center space-x-2">
                            <Timer className="w-4 h-4 text-brand-primary" />
                            <span className="font-medium">{sla.resolutionTime ?? sla.resolutionHours ?? sla.hours} {sla.timeUnit ?? sla.unit}</span>
                          </div>
                        ) : (
                          <span className="text-text-muted italic">Not configured</span>
                        )}
                      </td>
                      <td className="px-6 py-4 text-right">
                        <div className="flex items-center justify-end space-x-2">
                          <Button 
                            variant="ghost" 
                            className="p-2"
                            onClick={() => {
                              setFormData({
                                categoryId: cat.id,
                                resolutionTime: sla?.resolutionTime?.toString() || '',
                                timeUnit: sla?.timeUnit || 'Minutes'
                              });
                              setSelectedCategory(cat);
                              setIsModalOpen(true);
                            }}
                          >
                            <Edit2 className="w-4 h-4" />
                          </Button>
                          {sla && (
                            <Button 
                              variant="ghost" 
                              className="p-2 text-danger"
                              onClick={() => handleDelete(cat.id)}
                            >
                              <Trash2 className="w-4 h-4" />
                            </Button>
                          )}
                        </div>
                      </td>
                    </tr>
                  );
                })}
                {categories.length === 0 && (
                  <tr>
                    <td colSpan={3} className="px-6 py-12 text-center text-text-muted">
                      No categories found
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </Card>
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <Card className="w-full max-w-md p-6">
            <h2 className="text-xl font-bold text-text-main mb-6">
              Configure SLA
            </h2>
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
                <label className="block text-sm font-medium text-text-main mb-1">Resolution Time</label>
                <div className="flex gap-3">
                  <input
                    type="number"
                    value={formData.resolutionTime}
                    onChange={(e) => setFormData({ ...formData, resolutionTime: e.target.value })}
                    className="flex-1 bg-bg-dark border border-border-subtle rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:border-brand-primary/50 transition-all"
                    placeholder="30"
                    min="1"
                    required
                  />
                  <select
                    value={formData.timeUnit}
                    onChange={(e) => setFormData({ ...formData, timeUnit: e.target.value as 'Minutes' | 'Hours' })}
                    className="bg-bg-dark border border-border-subtle rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:border-brand-primary/50 transition-all"
                  >
                    <option value="Minutes">Minutes</option>
                    <option value="Hours">Hours</option>
                  </select>
                </div>
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
                  Save
                </Button>
              </div>
            </form>
          </Card>
        </div>
      )}
    </DashboardLayout>
  );
}

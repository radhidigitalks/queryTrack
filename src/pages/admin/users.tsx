import React from 'react';
import Head from 'next/head';
import DashboardLayout from '@/layouts/DashboardLayout';
import {
  UserPlus,
  Building2,
  Edit,
  Trash2,
  Lock,
  Unlock,
  Search,
  Filter,
  CheckCircle2,
  XCircle
} from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { Input } from '@/components/ui/Input';
import { Modal } from '@/components/ui/Modal';
import { storage, User, Department } from '@/utils/storage';
import { api } from '@/utils/api';
import toast from 'react-hot-toast';

export default function UserManagementPage() {
  const [users, setUsers] = React.useState<any[]>([]);
  const [departments, setDepartments] = React.useState<Department[]>([]);
  const [roles, setRoles] = React.useState<any[]>([]);
  const [currentUser, setCurrentUser] = React.useState<any>(null);

  // Filters
  const [search, setSearch] = React.useState('');
  const [deptFilter, setDeptFilter] = React.useState('All Departments');
  const [roleFilter, setRoleFilter] = React.useState('All Roles');
  const [showFilterPopup, setShowFilterPopup] = React.useState(false);
  const filterPopupRef = React.useRef<HTMLDivElement>(null);

  // Modal State
  const [isModalOpen, setIsModalOpen] = React.useState(false);
  const [modalMode, setModalMode] = React.useState<'create' | 'edit'>('create');
  const [editingUserId, setEditingUserId] = React.useState('');

  // Form State
  const [formName, setFormName] = React.useState('');
  const [formEmail, setFormEmail] = React.useState('');
  const [formPassword, setFormPassword] = React.useState('');
  const [formRole, setFormRole] = React.useState('');
  const [formDeptId, setFormDeptId] = React.useState('');

  const fetchData = async () => {
    try {
      const usersData = await api.getUsers();
      const deptsData = await api.getDepartments();
      const rolesData = await api.getRoles();
      setUsers(usersData);
      setDepartments(deptsData);
      setRoles(rolesData);
    } catch (err) {
      console.error(err);
    }
  };

  React.useEffect(() => {
    fetchData();
    const u = localStorage.getItem('user');
    if (u) {
      setCurrentUser(JSON.parse(u));
    }
  }, []);

  React.useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (filterPopupRef.current && !filterPopupRef.current.contains(event.target as Node)) {
        setShowFilterPopup(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const openCreateModal = () => {
    setModalMode('create');
    setFormName('');
    setFormEmail('');
    setFormPassword('');
    setFormRole(roles.length > 0 ? roles[0].id : '');
    setFormDeptId(departments.length > 0 ? departments[0].id : '');
    setIsModalOpen(true);
  };

  const openEditModal = async (user: any) => {
    try {
      const liveUser = await api.getUserById(user.id);
      setModalMode('edit');
      setEditingUserId(liveUser.id);
      setFormName(liveUser.name);
      setFormEmail(liveUser.email);
      setFormPassword(liveUser.password || ''); // Show the decrypted password!
      let roleId = liveUser.role?._id || liveUser.role?.id;
      if (!roleId && typeof liveUser.role === 'string') {
        const match = roles.find(r => r.name === liveUser.role);
        if (match) roleId = match.id;
      }
      setFormRole(roleId || (roles.length > 0 ? roles[0].id : ''));
      setFormDeptId(liveUser.departmentId || '');
      setIsModalOpen(true);
    } catch (err) {
      toast.error('Failed to load user details');
    }
  };

  const handleSave = async () => {
    if (!formName.trim() || !formEmail.trim()) return;

    try {
      // Find selected role to check if we should assign department
      const selectedRoleObj = roles.find(r => r.id === formRole);
      // We'll keep department if they have viewTickets but maybe not manageRoles
      const needsDept = true; // Let's just always save department if selected for now

      if (modalMode === 'create') {
        if (!formPassword.trim()) return toast.error('Password is required for new users');
        await api.createUser({
          name: formName,
          email: formEmail,
          password: formPassword,
          role: formRole,
          departmentId: formDeptId || undefined,
          isActive: true
        });
        toast.success('User created successfully!');
      } else {
        const payload: any = {
          name: formName,
          email: formEmail,
          role: formRole,
          departmentId: formDeptId || undefined
        };
        if (formPassword.trim()) payload.password = formPassword;

        await api.updateUser(editingUserId, payload);
        toast.success('User updated successfully!');
      }
      fetchData();
      setIsModalOpen(false);
    } catch (err) {
      console.error(err);
      toast.error('Error saving user');
    }
  };

  const handleDelete = async (id: string) => {
    if (confirm("Are you sure you want to delete this user?")) {
      try {
        await api.deleteUser(id);
        toast.success('User deleted!');
        fetchData();
      } catch (err) {
        console.error(err);
        toast.error('Error deleting user');
      }
    }
  };

  const toggleStatus = async (user: User) => {
    try {
      await api.updateUser(user.id, { isActive: !user.isActive });
      toast.success(`User ${user.isActive ? 'deactivated' : 'activated'}`);
      fetchData();
    } catch (err) {
      console.error(err);
      toast.error('Error toggling status');
    }
  };

  const filteredUsers = users.filter(u => {
    if (deptFilter !== 'All Departments' && u.departmentId !== deptFilter) return false;
    if (roleFilter !== 'All Roles' && u.role?._id !== roleFilter && u.role?.id !== roleFilter) return false;
    if (search) {
      const s = search.toLowerCase();
      return u.name.toLowerCase().includes(s) || u.email.toLowerCase().includes(s);
    }
    return true;
  });

  return (
    <DashboardLayout>
      <Head>
        <title>User Management | Admin Panel</title>
      </Head>

      <div className="space-y-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-white mb-1">User Management</h1>
            <p className="text-text-muted text-sm">Manage administrative access and team assignments.</p>
          </div>
          {(!currentUser || currentUser.role?.name === 'Admin' || currentUser.role?.permissions?.users?.create) && (
            <Button className="space-x-2" onClick={openCreateModal}>
              <UserPlus className="w-4 h-4" />
              <span>Add New User</span>
            </Button>
          )}
        </div>

        <Card className="p-4 overflow-visible">
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-text-muted" />
              <input
                type="text"
                placeholder="Search by name or email..."
                className="w-full bg-bg-dark border border-border-subtle rounded-lg py-2.5 pl-10 pr-4 text-sm text-white focus:outline-none focus:border-brand-primary/50"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
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
                        Department
                      </label>
                      <select
                        className="w-full bg-bg-dark border border-border-subtle rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-brand-primary/50"
                        value={deptFilter}
                        onChange={(e) => setDeptFilter(e.target.value)}
                      >
                        <option value="All Departments">All Departments</option>
                        {departments.map(d => <option key={d.id} value={d.id}>{d.name}</option>)}
                      </select>
                    </div>

                    <div>
                      <label className="mb-1 block text-[10px] font-bold uppercase tracking-widest text-text-muted">
                        Role
                      </label>
                      <select
                        className="w-full bg-bg-dark border border-border-subtle rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-brand-primary/50"
                        value={roleFilter}
                        onChange={(e) => setRoleFilter(e.target.value)}
                      >
                        <option value="All Roles">All Roles</option>
                        {roles.map(r => <option key={r.id} value={r.id}>{r.name}</option>)}
                      </select>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </Card>

        <Card className="p-0 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="bg-bg-dark text-text-muted text-[10px] uppercase tracking-widest font-bold border-b border-border-subtle">
                  <th className="px-6 py-4">User</th>
                  <th className="px-6 py-4">Department</th>
                  <th className="px-6 py-4">Role</th>
                  <th className="px-6 py-4">Status</th>
                  <th className="px-6 py-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border-subtle">
                {filteredUsers.map((mappedUser) => {
                  const dept = departments.find(d => d.id === mappedUser.departmentId);
                  return (
                    <tr key={mappedUser.id} className={`hover:bg-white/5 transition-colors group text-sm ${!mappedUser.isActive ? 'opacity-50' : ''}`}>
                      <td className="px-6 py-4">
                        <div className="flex items-center space-x-3">
                          <div className="w-10 h-10 rounded-lg bg-bg-dark border border-border-subtle flex items-center justify-center font-bold text-brand-primary">
                            {mappedUser.name.split(' ').map((n: string) => n[0]).join('')}
                          </div>
                          <div>
                            <p className="text-white font-bold">{mappedUser.name}</p>
                            <p className="text-[11px] text-text-muted">{mappedUser.email}</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center space-x-2 text-text-muted">
                          <Building2 className="w-3.5 h-3.5" />
                          <span>{dept?.name || 'None'}</span>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <Badge variant={mappedUser.role?.name === 'Admin' ? 'gold' : 'info'}>
                          {mappedUser.role?.name || 'Unknown'}
                        </Badge>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center space-x-2">
                          {mappedUser.isActive ? (
                            <CheckCircle2 className="w-3.5 h-3.5 text-success" />
                          ) : (
                            <XCircle className="w-3.5 h-3.5 text-text-muted" />
                          )}
                          <span className={`text-xs font-bold uppercase ${mappedUser.isActive ? 'text-success' : 'text-text-muted'}`}>
                            {mappedUser.isActive ? 'Active' : 'Inactive'}
                          </span>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-right">
                        <div className="flex items-center justify-end space-x-1">
                          {(!currentUser || currentUser.role?.name === 'Admin' || currentUser.role?.permissions?.users?.edit) && (
                            <>
                              <Button onClick={() => openEditModal(mappedUser)} size="sm" className="h-8 w-8 p-0" title="Edit">
                                <Edit className="w-4 h-4" />
                              </Button>
                              <Button size="sm" className="h-8 w-8 p-0" onClick={() => toggleStatus(mappedUser)} title={mappedUser.isActive ? 'Lock Account' : 'Unlock Account'}>
                                {mappedUser.isActive ? <Lock className="w-4 h-4" /> : <Unlock className="w-4 h-4" />}
                              </Button>
                            </>
                          )}
                          {(!currentUser || currentUser.role?.name === 'Admin' || currentUser.role?.permissions?.users?.delete) && (
                            <Button size="sm" className="h-8 w-8 p-0 text-danger hover:text-danger hover:bg-danger/10" onClick={() => handleDelete(mappedUser.id)} title="Delete">
                              <Trash2 className="w-4 h-4" />
                            </Button>
                          )}
                        </div>
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
            {filteredUsers.length === 0 && (
              <div className="p-8 text-center text-text-muted">
                No users found.
              </div>
            )}
          </div>
        </Card>
      </div>

      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={modalMode === 'create' ? 'Add New User' : 'Edit User'}
      >
        <div className="space-y-4">
          <Input
            label="Full Name"
            placeholder="John Doe"
            value={formName}
            onChange={(e) => setFormName(e.target.value)}
          />
          <Input
            label="Email Address"
            type="email"
            placeholder="john@example.com"
            value={formEmail}
            onChange={(e) => setFormEmail(e.target.value)}
          />
          <Input
            label="Password"
            type="password"
            placeholder="••••••••"
            value={formPassword}
            onChange={(e) => setFormPassword(e.target.value)}
          />

          <div className="space-y-2">
            <label className="block text-sm font-medium text-text-muted">Role</label>
            <select
              className="w-full bg-bg-dark border border-border-subtle rounded-lg px-4 py-2.5 text-white appearance-none focus:outline-none focus:border-brand-primary/50 transition-all text-sm"
              value={formRole}
              onChange={(e) => setFormRole(e.target.value)}
            >
              {roles.map(r => <option key={r.id} value={r.id}>{r.name}</option>)}
            </select>
          </div>

          <div className="space-y-2">
            <label className="block text-sm font-medium text-text-muted">Department</label>
            <select
              className="w-full bg-bg-dark border border-border-subtle rounded-lg px-4 py-2.5 text-white appearance-none focus:outline-none focus:border-brand-primary/50 transition-all text-sm"
              value={formDeptId}
              onChange={(e) => setFormDeptId(e.target.value)}
            >
              <option value="">No Department</option>
              {departments.map(d => <option key={d.id} value={d.id}>{d.name}</option>)}
            </select>
          </div>

          <div className="flex justify-end space-x-3 pt-4 border-t border-border-subtle">
            <Button onClick={() => setIsModalOpen(false)}>Cancel</Button>
            <Button onClick={handleSave}>
              {modalMode === 'create' ? 'Create User' : 'Save Changes'}
            </Button>
          </div>
        </div>
      </Modal>

    </DashboardLayout>
  );
}

export const BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3655';
export const API_URL = BASE_URL.endsWith('/api') ? BASE_URL : `${BASE_URL}/api`;

const getAuthHeaders = () => {
  const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null;
  return {
    'Content-Type': 'application/json',
    ...(token ? { Authorization: `Bearer ${token}` } : {})
  };
};

const getAuthHeadersForFormData = () => {
  const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null;
  return {
    ...(token ? { Authorization: `Bearer ${token}` } : {})
  };
};

export const api = {
  // --- Roles ---
  getRoles: async () => {
    const res = await fetch(`${API_URL}/roles`, { headers: getAuthHeaders() });
    if (!res.ok) throw new Error('Failed to fetch roles');
    return res.json();
  },
  getRoleById: async (id: string) => {
    const res = await fetch(`${API_URL}/roles/${id}`, { headers: getAuthHeaders() });
    if (!res.ok) throw new Error('Failed to fetch role');
    return res.json();
  },
  createRole: async (data: any) => {
    const res = await fetch(`${API_URL}/roles`, {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify(data),
    });
    if (!res.ok) throw new Error('Failed to create role');
    return res.json();
  },
  updateRole: async (id: string, data: any) => {
    const res = await fetch(`${API_URL}/roles/${id}`, {
      method: 'PUT',
      headers: getAuthHeaders(),
      body: JSON.stringify(data),
    });
    if (!res.ok) throw new Error('Failed to update role');
    return res.json();
  },
  deleteRole: async (id: string) => {
    const res = await fetch(`${API_URL}/roles/${id}`, {
      method: 'DELETE',
      headers: getAuthHeaders()
    });
    if (!res.ok) throw new Error('Failed to delete role');
    return res.json();
  },

  // --- Departments ---
  getDepartments: async () => {
    const res = await fetch(`${API_URL}/departments`, { headers: getAuthHeaders() });
    if (!res.ok) throw new Error('Failed to fetch departments');
    return res.json();
  },
  getDepartmentById: async (id: string) => {
    const res = await fetch(`${API_URL}/departments/${id}`, { headers: getAuthHeaders() });
    if (!res.ok) throw new Error('Failed to fetch department');
    return res.json();
  },
  getDepartmentBySlug: async (slug: string) => {
    const res = await fetch(`${API_URL}/departments/slug/${slug}`);
    if (!res.ok) throw new Error('Failed to fetch department');
    return res.json();
  },
  createDepartment: async (data: { name: string, description?: string, isActive: boolean }) => {
    const res = await fetch(`${API_URL}/departments`, {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify(data),
    });
    if (!res.ok) throw new Error('Failed to create department');
    return res.json();
  },
  updateDepartment: async (id: string, data: { name?: string, description?: string, isActive?: boolean }) => {
    const res = await fetch(`${API_URL}/departments/${id}`, {
      method: 'PUT',
      headers: getAuthHeaders(),
      body: JSON.stringify(data),
    });
    if (!res.ok) throw new Error('Failed to update department');
    return res.json();
  },
  deleteDepartment: async (id: string) => {
    const res = await fetch(`${API_URL}/departments/${id}`, { 
      method: 'DELETE',
      headers: getAuthHeaders()
    });
    if (!res.ok) throw new Error('Failed to delete department');
    return res.json();
  },

  // --- QR Codes ---
  getQRCodes: async () => {
    const res = await fetch(`${API_URL}/qrcodes`, { headers: getAuthHeaders() });
    if (!res.ok) throw new Error('Failed to fetch QR codes');
    return res.json();
  },
  getQRCodeById: async (id: string) => {
    const res = await fetch(`${API_URL}/qrcodes/${id}`, { headers: getAuthHeaders() });
    if (!res.ok) throw new Error('Failed to fetch QR code');
    return res.json();
  },
  getQRCodeByPath: async (path: string) => {
    const res = await fetch(`${API_URL}/qrcodes/path/${path}`);
    if (!res.ok) throw new Error('Failed to fetch QR code');
    return res.json();
  },
  createQRCode: async (data: any) => {
    const res = await fetch(`${API_URL}/qrcodes`, {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify(data),
    });
    if (!res.ok) throw new Error('Failed to create QR code');
    return res.json();
  },
  updateQRCode: async (id: string, data: any) => {
    const res = await fetch(`${API_URL}/qrcodes/${id}`, {
      method: 'PUT',
      headers: getAuthHeaders(),
      body: JSON.stringify(data),
    });
    if (!res.ok) throw new Error('Failed to update QR code');
    return res.json();
  },
  deleteQRCode: async (id: string) => {
    const res = await fetch(`${API_URL}/qrcodes/${id}`, { 
      method: 'DELETE',
      headers: getAuthHeaders()
    });
    if (!res.ok) throw new Error('Failed to delete QR code');
    return res.json();
  },

  // --- Categories ---
  getCategories: async (departmentId?: string) => {
    const query = departmentId ? new URLSearchParams({ departmentId }).toString() : '';
    const res = await fetch(`${API_URL}/categories${query ? '?' + query : ''}`, { headers: getAuthHeaders() });
    if (!res.ok) throw new Error('Failed to fetch categories');
    return res.json();
  },
  getCategoryById: async (id: string) => {
    const res = await fetch(`${API_URL}/categories/${id}`, { headers: getAuthHeaders() });
    if (!res.ok) throw new Error('Failed to fetch category');
    return res.json();
  },
  createCategory: async (data: any) => {
    const res = await fetch(`${API_URL}/categories`, {
      method: 'POST',
      headers: data instanceof FormData ? getAuthHeadersForFormData() : getAuthHeaders(),
      body: data instanceof FormData ? data : JSON.stringify(data),
    });
    if (!res.ok) throw new Error('Failed to create category');
    return res.json();
  },
  updateCategory: async (id: string, data: any) => {
    const res = await fetch(`${API_URL}/categories/${id}`, {
      method: 'PUT',
      headers: data instanceof FormData ? getAuthHeadersForFormData() : getAuthHeaders(),
      body: data instanceof FormData ? data : JSON.stringify(data),
    });
    if (!res.ok) throw new Error('Failed to update category');
    return res.json();
  },
  deleteCategory: async (id: string) => {
    const res = await fetch(`${API_URL}/categories/${id}`, { 
      method: 'DELETE',
      headers: getAuthHeaders()
    });
    if (!res.ok) throw new Error('Failed to delete category');
    return res.json();
  },

  // --- Category Assignments ---
  getCategoryAssignments: async () => {
    const res = await fetch(`${API_URL}/categoryassignments`, { headers: getAuthHeaders() });
    if (!res.ok) throw new Error('Failed to fetch category assignments');
    return res.json();
  },
  getCategoryAssignmentByCategoryId: async (categoryId: string) => {
    const res = await fetch(`${API_URL}/categoryassignments/category/${categoryId}`, { headers: getAuthHeaders() });
    if (!res.ok) throw new Error('Failed to fetch category assignment');
    return res.json();
  },
  createCategoryAssignment: async (data: any) => {
    const res = await fetch(`${API_URL}/categoryassignments`, {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify(data),
    });
    if (!res.ok) throw new Error('Failed to create category assignment');
    return res.json();
  },
  deleteCategoryAssignment: async (categoryId: string) => {
    const res = await fetch(`${API_URL}/categoryassignments/category/${categoryId}`, { 
      method: 'DELETE',
      headers: getAuthHeaders()
    });
    if (!res.ok) throw new Error('Failed to delete category assignment');
    return res.json();
  },

  // --- Category Supervisors ---
  getCategorySupervisors: async () => {
    const res = await fetch(`${API_URL}/categorysupervisors`, { headers: getAuthHeaders() });
    if (!res.ok) throw new Error('Failed to fetch category supervisors');
    return res.json();
  },
  getCategorySupervisorByCategoryId: async (categoryId: string) => {
    const res = await fetch(`${API_URL}/categorysupervisors/category/${categoryId}`, { headers: getAuthHeaders() });
    if (!res.ok) throw new Error('Failed to fetch category supervisor');
    return res.json();
  },
  createCategorySupervisor: async (data: any) => {
    const res = await fetch(`${API_URL}/categorysupervisors`, {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify(data),
    });
    if (!res.ok) throw new Error('Failed to create category supervisor');
    return res.json();
  },
  deleteCategorySupervisor: async (categoryId: string) => {
    const res = await fetch(`${API_URL}/categorysupervisors/category/${categoryId}`, { 
      method: 'DELETE',
      headers: getAuthHeaders()
    });
    if (!res.ok) throw new Error('Failed to delete category supervisor');
    return res.json();
  },

  // --- Category SLAs ---
  getCategorySLAs: async () => {
    const res = await fetch(`${API_URL}/categoryslas`, { headers: getAuthHeaders() });
    if (!res.ok) throw new Error('Failed to fetch category SLAs');
    return res.json();
  },
  getCategorySLAByCategoryId: async (categoryId: string) => {
    const res = await fetch(`${API_URL}/categoryslas/category/${categoryId}`, { headers: getAuthHeaders() });
    if (!res.ok) throw new Error('Failed to fetch category SLA');
    return res.json();
  },
  createCategorySLA: async (data: any) => {
    const res = await fetch(`${API_URL}/categoryslas`, {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify(data),
    });
    if (!res.ok) throw new Error('Failed to create category SLA');
    return res.json();
  },
  deleteCategorySLA: async (categoryId: string) => {
    const res = await fetch(`${API_URL}/categoryslas/category/${categoryId}`, { 
      method: 'DELETE',
      headers: getAuthHeaders()
    });
    if (!res.ok) throw new Error('Failed to delete category SLA');
    return res.json();
  },

  // --- Users ---
  getUsers: async () => {
    const res = await fetch(`${API_URL}/users`, { headers: getAuthHeaders() });
    if (!res.ok) throw new Error('Failed to fetch users');
    return res.json();
  },
  getUserById: async (id: string) => {
    const res = await fetch(`${API_URL}/users/${id}`, { headers: getAuthHeaders() });
    if (!res.ok) throw new Error('Failed to fetch user');
    return res.json();
  },
  createUser: async (data: any) => {
    const res = await fetch(`${API_URL}/users`, {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify(data),
    });
    if (!res.ok) {
      const err = await res.json();
      throw new Error(err.message || 'Failed to create user');
    }
    return res.json();
  },
  updateUser: async (id: string, data: any) => {
    const res = await fetch(`${API_URL}/users/${id}`, {
      method: 'PUT',
      headers: getAuthHeaders(),
      body: JSON.stringify(data),
    });
    if (!res.ok) throw new Error('Failed to update user');
    return res.json();
  },
  deleteUser: async (id: string) => {
    const res = await fetch(`${API_URL}/users/${id}`, { 
      method: 'DELETE',
      headers: getAuthHeaders() 
    });
    if (!res.ok) throw new Error('Failed to delete user');
    return res.json();
  },

  // --- Tickets ---
  getTickets: async (page = 1, limit = 10, search = '', status = 'All', departmentId = 'All', categoryId = 'All') => {
    const query = new URLSearchParams({
      page: page.toString(),
      limit: limit.toString(),
      search,
      status,
      departmentId,
      categoryId
    }).toString();
    const res = await fetch(`${API_URL}/tickets?${query}`, { headers: getAuthHeaders() });
    if (!res.ok) throw new Error('Failed to fetch tickets');
    return res.json();
  },
  getDashboardStats: async () => {
    const res = await fetch(`${API_URL}/tickets/dashboard/stats`, { headers: getAuthHeaders() });
    if (!res.ok) throw new Error('Failed to fetch dashboard stats');
    return res.json();
  },
  getStaffDashboardStats: async (staffId: string) => {
    const query = new URLSearchParams({ staffId }).toString();
    const res = await fetch(`${API_URL}/tickets/staff/stats?${query}`, { headers: getAuthHeaders() });
    if (!res.ok) throw new Error('Failed to fetch staff stats');
    return res.json();
  },
  exportTicketsCSV: async (search = '', status = 'All', departmentId = 'All', categoryId = 'All') => {
    const query = new URLSearchParams({ search, status, departmentId, categoryId }).toString();
    const res = await fetch(`${API_URL}/tickets/export?${query}`, { headers: getAuthHeaders() });
    if (!res.ok) throw new Error('Failed to export tickets');
    return res.blob();
  },
  getTicketById: async (id: string) => {
    const res = await fetch(`${API_URL}/tickets/${id}`, { headers: getAuthHeaders() });
    if (!res.ok) throw new Error('Failed to fetch ticket');
    return res.json();
  },
  createTicket: async (data: any) => {
    const res = await fetch(`${API_URL}/tickets`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    if (!res.ok) throw new Error('Failed to create ticket');
    return res.json();
  },
  updateTicket: async (id: string, data: any) => {
    const res = await fetch(`${API_URL}/tickets/${id}`, {
      method: 'PUT',
      headers: getAuthHeaders(),
      body: JSON.stringify(data),
    });
    if (!res.ok) throw new Error('Failed to update ticket');
    return res.json();
  },
  addNoteToTicket: async (id: string, data: any) => {
    const res = await fetch(`${API_URL}/tickets/${id}/notes`, {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify(data),
    });
    if (!res.ok) throw new Error('Failed to add note');
    return res.json();
  },
  deleteTicket: async (id: string) => {
    const res = await fetch(`${API_URL}/tickets/${id}`, { 
      method: 'DELETE',
      headers: getAuthHeaders() 
    });
    if (!res.ok) throw new Error('Failed to delete ticket');
    return res.json();
  },
  login: async (credentials: any) => {
    const res = await fetch(`${API_URL}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(credentials)
    });
    if (!res.ok) {
      const err = await res.json();
      throw new Error(err.message || 'Login failed');
    }
    return res.json();
  },

  // --- Notifications ---
  getNotifications: async () => {
    const res = await fetch(`${API_URL}/notifications`, { headers: getAuthHeaders() });
    if (!res.ok) throw new Error('Failed to fetch notifications');
    return res.json();
  },
  markAllNotificationsRead: async () => {
    const res = await fetch(`${API_URL}/notifications/mark-all-read`, {
      method: 'POST',
      headers: getAuthHeaders()
    });
    if (!res.ok) throw new Error('Failed to mark all as read');
    return res.json();
  },
  markAsRead: async (id: string) => {
    const res = await fetch(`${API_URL}/notifications/${id}/read`, {
      method: 'PATCH',
      headers: getAuthHeaders()
    });
    if (!res.ok) throw new Error('Failed to mark as read');
    return res.json();
  },
  deleteNotification: async (id: string) => {
    const res = await fetch(`${API_URL}/notifications/${id}`, {
      method: 'DELETE',
      headers: getAuthHeaders()
    });
    if (!res.ok) throw new Error('Failed to delete notification');
    return res.json();
  }
};

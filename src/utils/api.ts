export const BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3655';
export const API_URL = BASE_URL.endsWith('/api') ? BASE_URL : `${BASE_URL}/api`;

const getAuthHeaders = () => {
  const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null;
  return {
    'Content-Type': 'application/json',
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
  createDepartment: async (data: { name: string, isActive: boolean }) => {
    const res = await fetch(`${API_URL}/departments`, {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify(data),
    });
    if (!res.ok) throw new Error('Failed to create department');
    return res.json();
  },
  updateDepartment: async (id: string, data: { name?: string, isActive?: boolean }) => {
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

  // --- Resolution Times ---
  getResolutionTimes: async () => {
    const res = await fetch(`${API_URL}/settings/resolution-times`, { headers: getAuthHeaders() });
    if (!res.ok) throw new Error('Failed to fetch resolution times');
    return res.json();
  },
  createResolutionTime: async (data: any) => {
    const res = await fetch(`${API_URL}/settings/resolution-times`, {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify(data),
    });
    if (!res.ok) throw new Error('Failed to create resolution time');
    return res.json();
  },
  updateResolutionTime: async (id: string, data: any) => {
    const res = await fetch(`${API_URL}/settings/resolution-times/${id}`, {
      method: 'PUT',
      headers: getAuthHeaders(),
      body: JSON.stringify(data),
    });
    if (!res.ok) throw new Error('Failed to update resolution time');
    return res.json();
  },
  deleteResolutionTime: async (id: string) => {
    const res = await fetch(`${API_URL}/settings/resolution-times/${id}`, { 
      method: 'DELETE',
      headers: getAuthHeaders()
    });
    if (!res.ok) throw new Error('Failed to delete resolution time');
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
  getTickets: async (page = 1, limit = 10, search = '', status = 'All', departmentId = 'All') => {
    const query = new URLSearchParams({
      page: page.toString(),
      limit: limit.toString(),
      search,
      status,
      departmentId
    }).toString();
    const res = await fetch(`${API_URL}/tickets?${query}`, { headers: getAuthHeaders() });
    if (!res.ok) throw new Error('Failed to fetch tickets');
    return res.json();
  },
  exportTicketsCSV: async (search = '', status = 'All', departmentId = 'All') => {
    const query = new URLSearchParams({ search, status, departmentId }).toString();
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
      headers: getAuthHeaders(),
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
  }
};

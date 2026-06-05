export type TicketStatus = 'Open' | 'In Progress' | 'Resolved' | 'Expired' | 'Time Expired' | 'Escalated';

export interface Ticket {
  id: string;
  customerName: string;
  mobileNumber: string;
  email?: string;
  departmentId: string;
  subject: string;
  description: string;
  attachmentUrl?: string;
  assignedStaffId?: string;
  status: TicketStatus;
  createdAt: string; // ISO string
  expiryAt: string; // ISO string
  timeline: { title: string; time: string; desc: string; status: 'completed' | 'active' | 'pending' }[];
  internalNotes: { text: string; addedBy: string; addedAt: string }[];
}

export interface Department {
  id: string;
  name: string;
  description?: string;
  isActive: boolean;
}

export interface User {
  id: string;
  name: string;
  email: string;
  role: 'Admin' | 'Staff';
  departmentId?: string; // For staff
  isActive: boolean;
}

export interface Settings {
  globalResolutionHours: number;
}

// Default Data
const DEFAULT_SETTINGS: Settings = {
  globalResolutionHours: 24
};

const DEFAULT_DEPARTMENTS: Department[] = [
  { id: 'dept-1', name: 'IT Support', isActive: true },
  { id: 'dept-2', name: 'HR', isActive: true },
  { id: 'dept-3', name: 'Accounts', isActive: true },
  { id: 'dept-4', name: 'Sales', isActive: true },
  { id: 'dept-5', name: 'Operations', isActive: true },
  { id: 'dept-6', name: 'Admin', isActive: true },
];

const DEFAULT_USERS: User[] = [
  { id: 'admin-1', name: 'Super Admin', email: 'admin@system.com', role: 'Admin', isActive: true },
  { id: 'staff-1', name: 'IT Staff', email: 'it@system.com', role: 'Staff', departmentId: 'dept-1', isActive: true },
];

// Helper to check and mark expired tickets
const checkAndExpireTickets = (tickets: Ticket[]): Ticket[] => {
  const now = new Date();
  let changed = false;
  
  const updated = tickets.map(ticket => {
    if (ticket.status !== 'Resolved' && ticket.status !== 'Expired') {
      const expiryTime = new Date(ticket.expiryAt);
      if (now > expiryTime) {
        changed = true;
        return { ...ticket, status: 'Expired' as TicketStatus };
      }
    }
    return ticket;
  });

  if (changed && typeof window !== 'undefined') {
    localStorage.setItem('sys_tickets', JSON.stringify(updated));
  }
  
  return updated;
};

// Storage utility
export const storage = {
  getSettings: (): Settings => {
    if (typeof window === 'undefined') return DEFAULT_SETTINGS;
    const data = localStorage.getItem('sys_settings');
    return data ? JSON.parse(data) : DEFAULT_SETTINGS;
  },
  
  saveSettings: (settings: Settings) => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('sys_settings', JSON.stringify(settings));
    }
  },

  getDepartments: (): Department[] => {
    if (typeof window === 'undefined') return DEFAULT_DEPARTMENTS;
    const data = localStorage.getItem('sys_departments');
    if (!data) {
      localStorage.setItem('sys_departments', JSON.stringify(DEFAULT_DEPARTMENTS));
      return DEFAULT_DEPARTMENTS;
    }
    return JSON.parse(data);
  },

  saveDepartments: (depts: Department[]) => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('sys_departments', JSON.stringify(depts));
    }
  },

  getUsers: (): User[] => {
    if (typeof window === 'undefined') return DEFAULT_USERS;
    const data = localStorage.getItem('sys_users');
    if (!data) {
      localStorage.setItem('sys_users', JSON.stringify(DEFAULT_USERS));
      return DEFAULT_USERS;
    }
    return JSON.parse(data);
  },

  saveUsers: (users: User[]) => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('sys_users', JSON.stringify(users));
    }
  },

  getTickets: (): Ticket[] => {
    if (typeof window === 'undefined') return [];
    // Also merge legacy submitted_queries for backward compatibility with initial form submissions if any
    const legacyData = localStorage.getItem('submitted_queries');
    const legacyTickets = legacyData ? JSON.parse(legacyData) : [];
    
    let sysTickets: Ticket[] = [];
    const data = localStorage.getItem('sys_tickets');
    if (data) {
      sysTickets = JSON.parse(data);
    }
    
    // Auto expiry check
    return checkAndExpireTickets(sysTickets);
  },

  saveTickets: (tickets: Ticket[]) => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('sys_tickets', JSON.stringify(tickets));
    }
  },
  
  saveTicket: (ticket: Ticket) => {
    const tickets = storage.getTickets();
    const existingIndex = tickets.findIndex(t => t.id === ticket.id);
    if (existingIndex >= 0) {
      tickets[existingIndex] = ticket;
    } else {
      tickets.push(ticket);
    }
    storage.saveTickets(tickets);
  }
};

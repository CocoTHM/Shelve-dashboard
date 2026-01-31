import axios from 'axios';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001/api';

export const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Intercepteur pour ajouter le token JWT
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Intercepteur pour gérer les erreurs
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Token invalide ou expiré
      localStorage.removeItem('token');
      window.location.href = '/auth/login';
    }
    return Promise.reject(error);
  }
);

// API functions
export const authApi = {
  getDiscordAuthUrl: (serverId?: string) =>
    api.get('/auth/discord', { params: { serverId } }),
  
  callback: (code: string, state?: string) =>
    api.post('/auth/discord/callback', { code, state }),
  
  refreshToken: () =>
    api.post('/auth/refresh'),
  
  getCurrentUser: () =>
    api.get('/auth/me'),
  
  logout: () =>
    api.post('/auth/logout'),
};

export const statsApi = {
  getDashboardStats: (serverId: string) =>
    api.get('/stats/dashboard', { params: { serverId } }),
  
  getActivityGraph: (serverId: string, days?: number) =>
    api.get('/stats/activity', { params: { serverId, days } }),
  
  getPresenceStats: (serverId: string) =>
    api.get('/stats/presence', { params: { serverId } }),
  
  getServiceStats: (serverId: string) =>
    api.get('/stats/services', { params: { serverId } }),
};

export const voiceApi = {
  getHistory: (userId: string, serverId: string, page?: number) =>
    api.get('/voice/history', { params: { userId, serverId, page } }),
  
  getStats: (userId: string, serverId: string, days?: number) =>
    api.get('/voice/stats', { params: { userId, serverId, days } }),
  
  getActiveSessions: (serverId: string) =>
    api.get('/voice/active', { params: { serverId } }),
  
  exportData: (serverId: string, startDate: string, endDate: string) =>
    api.get('/voice/export', { params: { serverId, startDate, endDate } }),
};

export const servicesApi = {
  getActive: (serverId: string) =>
    api.get('/services/active', { params: { serverId } }),
  
  getUserHistory: (userId: string, serverId: string, page?: number) =>
    api.get('/services/history', { params: { userId, serverId, page } }),
  
  getUserStats: (userId: string, serverId: string, days?: number) =>
    api.get('/services/stats', { params: { userId, serverId, days } }),
  
  getServerHistory: (serverId: string, page?: number) =>
    api.get('/services/server-history', { params: { serverId, page } }),
  
  endService: (serviceId: string, notes?: string) =>
    api.patch(`/services/${serviceId}/end`, { notes }),
};

export const logsApi = {
  getLogs: (serverId: string, filters?: any, page?: number) =>
    api.get('/logs', { params: { serverId, ...filters, page } }),
  
  getLogById: (logId: string) =>
    api.get(`/logs/${logId}`),
  
  getUserRecentLogs: (userId: string, serverId: string, limit?: number) =>
    api.get(`/logs/user/${userId}`, { params: { serverId, limit } }),
};

export const rolesApi = {
  getServerRoles: (serverId: string) =>
    api.get('/roles', { params: { serverId } }),
  
  getRoleById: (roleId: string) =>
    api.get(`/roles/${roleId}`),
  
  assignRole: (serverId: string, userId: string, roleId: string) =>
    api.post('/roles/assign', { serverId, userId, roleId }),
  
  removeRole: (serverId: string, userId: string, roleId: string) =>
    api.delete('/roles/remove', { data: { serverId, userId, roleId } }),
};

export const eventsApi = {
  getServerEvents: (serverId: string, filters?: any) =>
    api.get('/events', { params: { serverId, ...filters } }),
  
  getEventById: (eventId: string) =>
    api.get(`/events/${eventId}`),
  
  createEvent: (data: any) =>
    api.post('/events', data),
  
  updateEvent: (eventId: string, data: any) =>
    api.put(`/events/${eventId}`, data),
  
  deleteEvent: (eventId: string) =>
    api.delete(`/events/${eventId}`),
  
  updateAttendeeResponse: (eventId: string, userId: string, response: string) =>
    api.put(`/events/${eventId}/attendees/${userId}/response`, { response }),
};

export const ticketsApi = {
  getServerTickets: (serverId: string, filters?: any) =>
    api.get('/tickets', { params: { serverId, ...filters } }),
  
  getTicketById: (ticketId: string) =>
    api.get(`/tickets/${ticketId}`),
  
  createTicket: (data: any) =>
    api.post('/tickets', data),
  
  assignTicket: (ticketId: string, assignedToId: string) =>
    api.put(`/tickets/${ticketId}/assign`, { assignedToId }),
  
  updateTicketStatus: (ticketId: string, status: string) =>
    api.put(`/tickets/${ticketId}/status`, { status }),
  
  addMessage: (ticketId: string, content: string) =>
    api.post(`/tickets/${ticketId}/messages`, { content }),
  
  getTicketMessages: (ticketId: string) =>
    api.get(`/tickets/${ticketId}/messages`),
};

export const serversApi = {
  getUserServers: () =>
    api.get('/servers'),
  
  getServerById: (serverId: string) =>
    api.get(`/servers/${serverId}`),
  
  getServerConfig: (serverId: string) =>
    api.get(`/servers/${serverId}/config`),
  
  updateServerConfig: (serverId: string, config: any) =>
    api.put(`/servers/${serverId}/config`, config),
};

export const usersApi = {
  getCurrentUser: () =>
    api.get('/users/me'),
  
  getUserById: (userId: string) =>
    api.get(`/users/${userId}`),
  
  getUserStats: (userId: string, serverId: string) =>
    api.get(`/users/${userId}/stats`, { params: { serverId } }),
};

export interface User {
  id: string;
  discordId: string;
  username: string;
  discriminator: string;
  avatar: string;
  email?: string;
  createdAt: string;
  updatedAt: string;
  lastLoginAt?: string;
}

export interface Server {
  id: string;
  discordId: string;
  name: string;
  icon: string;
  ownerId: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface Role {
  id: string;
  serverId: string;
  discordId: string;
  name: string;
  color: string | null;
  position: number;
  permissions: string;
  dashboardPermissions: string[];
}

export interface VoiceLog {
  id: string;
  userId: string;
  serverId: string;
  channelId: string;
  channelName: string;
  joinedAt: string;
  leftAt?: string;
  duration?: number;
  isDeafened: boolean;
  isMuted: boolean;
  isSelfDeaf: boolean;
  isSelfMute: boolean;
  afkDuration: number;
  activeDuration: number;
  user?: User;
}

export interface ServiceLog {
  id: string;
  userId: string;
  serverId: string;
  channelId: string;
  channelName: string;
  startedAt: string;
  endedAt?: string;
  duration?: number;
  status: 'IN_PROGRESS' | 'COMPLETED' | 'CANCELLED';
  notes?: string;
  user?: User;
}

export interface AuditLog {
  id: string;
  userId: string;
  serverId: string;
  action: string;
  entity: string;
  entityId: string;
  description: string;
  metadata?: any;
  ipAddress?: string;
  userAgent?: string;
  createdAt: string;
  user?: User;
}

export interface Event {
  id: string;
  serverId: string;
  title: string;
  description?: string;
  startAt: string;
  endAt?: string;
  type: 'MEETING' | 'SERVICE' | 'TRAINING' | 'COMMUNITY' | 'OTHER';
  channelId?: string;
  channelName?: string;
  notifyBefore?: number;
  notified: boolean;
  status: 'SCHEDULED' | 'IN_PROGRESS' | 'COMPLETED' | 'CANCELLED';
  attendees?: EventAttendee[];
  createdAt: string;
  updatedAt: string;
}

export interface EventAttendee {
  id: string;
  eventId: string;
  userId: string;
  response: 'PENDING' | 'ACCEPTED' | 'DECLINED' | 'MAYBE';
  notes?: string;
  user?: User;
}

export interface Ticket {
  id: string;
  serverId: string;
  title: string;
  description: string;
  category: 'SUPPORT' | 'BUG' | 'FEATURE_REQUEST' | 'QUESTION' | 'OTHER';
  priority: 'LOW' | 'MEDIUM' | 'HIGH' | 'URGENT';
  createdById: string;
  assignedToId?: string;
  status: 'OPEN' | 'ASSIGNED' | 'IN_PROGRESS' | 'WAITING' | 'CLOSED';
  tags: string[];
  createdBy?: User;
  assignedTo?: User;
  createdAt: string;
  updatedAt: string;
  closedAt?: string;
}

export interface DashboardStats {
  totalMembers: number;
  activeServices: number;
  todayConnections: number;
  activeSessions: number;
  topMembers: Array<{
    id: string;
    username: string;
    avatar: string;
    total_time: number;
  }>;
}

export interface ActivityGraphData {
  date: string;
  connections: number;
  uniqueUsers: number;
}

export interface ServiceStats {
  todayServices: number;
  weekServices: number;
  weekServiceTime: number;
  topStaff: Array<{
    id: string;
    username: string;
    avatar: string;
    service_count: number;
    total_time: number;
  }>;
}

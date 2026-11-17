/**
 * Questo Enterprise 2.0 — Shared Type Definitions
 */

export type UserRole = 'CEO' | 'CTO' | 'TEAM_LEAD' | 'ENGINEER' | 'INTERN';

export interface User {
  id: string;
  email: string;
  name: string;
  role: UserRole;
  companyId: string;
  companyName: string;
  avatarColor: string;
  initials: string;
}

export interface NavItem {
  label: string;
  path: string;
  icon: string; // lucide icon name
  badge?: number;
  section: 'overview' | 'work' | 'people' | 'operations';
}

export interface TaskItem {
  taskId: string;
  title: string;
  description: string;
  assignee: string;
  assigneeEmail: string;
  priority: 'P0 - Blocker' | 'P1 - High' | 'P2 - Medium' | 'P3 - Low';
  status: 'Open' | 'In Progress' | 'Blocked' | 'In Review' | 'Done';
  xpBounty: number;
  createdAt: string;
  deadline: string;
  completedAt?: string;
  blockerDetails?: string;
  tags: string[];
}

export interface StandupItem {
  updateId: string;
  timestamp: string;
  internEmail: string;
  internName: string;
  doneYesterday: string;
  plannedToday: string;
  blockers: string;
  hasBlocker: boolean;
  sentimentHealth: string;
  extractedRisks: string;
  xpAwarded: number | string;
  reviewStatus: string;
  ctoFeedback: string;
}

export interface TeamMember {
  email: string;
  name: string;
  role: UserRole;
  title: string;
  department: string;
  reportsTo: string;
  totalXp: number;
  level: number;
  streakDays: number;
  tasksCompleted: number;
  deliveryReliability: number;
  avatarColor: string;
  initials: string;
  joinedAt: string;
  status: 'Active' | 'On Leave' | 'Offline';
}

export interface ApplicantItem {
  appId: string;
  name: string;
  email: string;
  role: string;
  skills: string;
  resumeUrl: string;
  decision: 'Pending' | 'Selected' | 'Rejected';
  feedback?: string;
  timestamp: string;
}

export interface LeaveRequest {
  leaveId: string;
  employeeEmail: string;
  employeeName: string;
  leaveType: 'Vacation' | 'Sick' | 'Exam / Study' | 'Personal' | 'Conference';
  startDate: string;
  endDate: string;
  daysCount: number;
  reason: string;
  status: 'Pending' | 'Approved' | 'Rejected';
  approverEmail?: string;
  streakProtected: boolean;
  tasksRescheduled: number;
  submittedAt: string;
}

export interface MeetingItem {
  meetingId: string;
  title: string;
  attendees: string[];
  meetLink: string;
  scheduledAt: string;
  duration: number;
  type: 'Standup' | 'Sprint Planning' | 'Incident Triage' | '1-on-1 Mentorship' | 'Demo / Review';
  agenda: string[];
  createdBy: string;
  status: 'Scheduled' | 'In Progress' | 'Completed' | 'Cancelled';
}

export interface AnalyticsCard {
  employeeName: string;
  employeeEmail: string;
  reliabilityScore: number;
  blockerResolutionTime: string;
  standupConsistency: number;
  currentLevel: string;
  xpTotal: number;
  streakDays: number;
  burnoutRisk: 'Low' | 'Medium' | 'High';
  aiFeedback: string[];
}

export interface RoadmapMilestone {
  week: number;
  title: string;
  deliverables: string[];
  xpBounty: number;
  tasks: Array<{
    id: string;
    title: string;
    description: string;
    xp: number;
  }>;
}


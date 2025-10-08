/**
 * TypeScript type definitions for Clockify API v1
 * Based on https://docs.developer.clockify.me/
 */

// ============================================================================
// Common Types
// ============================================================================

export interface TimeInterval {
  start: string; // ISO 8601
  end: string | null; // ISO 8601, null if timer is running
  duration?: string; // ISO 8601 duration format
}

export interface HourlyRate {
  amount: number;
  currency: string;
}

export interface Membership {
  userId: string;
  hourlyRate: HourlyRate | null;
  costRate: HourlyRate | null;
  targetId: string;
  membershipType: string;
  membershipStatus: string;
}

// ============================================================================
// Workspace
// ============================================================================

export interface Workspace {
  id: string;
  name: string;
  hourlyRate: HourlyRate;
  memberships: Membership[];
  workspaceSettings: WorkspaceSettings;
  imageUrl: string;
  featureSubscriptionType: string | null;
}

export interface WorkspaceSettings {
  timeRoundingInReports: boolean;
  onlyAdminsSeeBillableRates: boolean;
  onlyAdminsCreateProject: boolean;
  onlyAdminsSeeDashboard: boolean;
  defaultBillableProjects: boolean;
  lockTimeEntries: string | null;
  round: {
    round: string;
    minutes: string;
  };
  projectFavorites: boolean;
  canSeeTimeSheet: boolean;
  canSeeTracker: boolean;
  projectPickerSpecialFilter: boolean;
  forceProjects: boolean;
  forceTasks: boolean;
  forceTags: boolean;
  forceDescription: boolean;
  onlyAdminsSeeAllTimeEntries: boolean;
  onlyAdminsSeePublicProjectsEntries: boolean;
  trackTimeDownToSecond: boolean;
  projectGroupingLabel: string;
  adminOnlyPages: string[];
  automaticLock: any | null;
  onlyAdminsCreateTag: boolean;
  onlyAdminsCreateTask: boolean;
  timeTrackingMode: string;
  isProjectPublicByDefault: boolean;
}

// ============================================================================
// Client
// ============================================================================

export interface Client {
  id: string;
  name: string;
  workspaceId: string;
  archived: boolean;
  address?: string;
  note?: string;
}

export interface CreateClientRequest {
  name: string;
  address?: string;
  note?: string;
}

export interface UpdateClientRequest {
  name?: string;
  address?: string;
  note?: string;
  archived?: boolean;
}

// ============================================================================
// Project
// ============================================================================

export interface Project {
  id: string;
  name: string;
  clientId: string | null;
  clientName?: string;
  workspaceId: string;
  billable: boolean;
  memberships: Membership[];
  color: string;
  estimate: ProjectEstimate | null;
  archived: boolean;
  duration: string | null;
  costRate: HourlyRate | null;
  hourlyRate: HourlyRate | null;
  timeEstimate: ProjectTimeEstimate | null;
  budgetEstimate: ProjectBudgetEstimate | null;
  public: boolean;
  template: boolean;
  note: string;
}

export interface ProjectEstimate {
  estimate: string;
  type: "AUTO" | "MANUAL";
}

export interface ProjectTimeEstimate {
  estimate: number;
  type: "AUTO" | "MANUAL";
  resetOption: string | null;
  active: boolean;
}

export interface ProjectBudgetEstimate {
  estimate: number;
  type: "AUTO" | "MANUAL";
  resetOption: string | null;
  active: boolean;
}

export interface CreateProjectRequest {
  name: string;
  clientId?: string;
  isPublic?: boolean;
  estimate?: {
    estimate: string;
    type: "AUTO" | "MANUAL";
  };
  color?: string;
  billable?: boolean;
  note?: string;
}

export interface UpdateProjectRequest {
  name?: string;
  clientId?: string;
  isPublic?: boolean;
  estimate?: {
    estimate: string;
    type: "AUTO" | "MANUAL";
  };
  color?: string;
  billable?: boolean;
  archived?: boolean;
  note?: string;
}

// ============================================================================
// Task
// ============================================================================

export interface Task {
  id: string;
  name: string;
  projectId: string;
  assigneeIds: string[];
  assigneeId: string | null;
  userGroupIds: string[];
  estimate: string | null;
  status: "ACTIVE" | "DONE";
  duration: string | null;
  billable: boolean;
  hourlyRate: HourlyRate | null;
  costRate: HourlyRate | null;
}

export interface CreateTaskRequest {
  name: string;
  projectId: string;
  assigneeIds?: string[];
  estimate?: string;
  status?: "ACTIVE" | "DONE";
  billable?: boolean;
}

export interface UpdateTaskRequest {
  name?: string;
  assigneeIds?: string[];
  estimate?: string;
  status?: "ACTIVE" | "DONE";
  billable?: boolean;
}

// ============================================================================
// Tag
// ============================================================================

export interface Tag {
  id: string;
  name: string;
  workspaceId: string;
  archived: boolean;
}

export interface CreateTagRequest {
  name: string;
}

export interface UpdateTagRequest {
  name?: string;
  archived?: boolean;
}

// ============================================================================
// Time Entry
// ============================================================================

export interface TimeEntry {
  id: string;
  description: string;
  tagIds: string[];
  userId: string;
  billable: boolean;
  taskId: string | null;
  projectId: string | null;
  timeInterval: TimeInterval;
  workspaceId: string;
  hourlyRate: HourlyRate | null;
  costRate: HourlyRate | null;
  isLocked: boolean;
  customFieldValues: CustomFieldValue[];
  type: string;
  kioskId: string | null;
}

export interface CustomFieldValue {
  customFieldId: string;
  timeEntryId: string;
  value: string;
  name: string;
  type: string;
  status: string;
}

export interface CreateTimeEntryRequest {
  start: string; // ISO 8601
  end?: string; // ISO 8601, omit for running timer
  billable?: boolean;
  description?: string;
  projectId?: string;
  taskId?: string;
  tagIds?: string[];
}

export interface UpdateTimeEntryRequest {
  start?: string;
  end?: string;
  billable?: boolean;
  description?: string;
  projectId?: string;
  taskId?: string;
  tagIds?: string[];
}

// ============================================================================
// User
// ============================================================================

export interface User {
  id: string;
  email: string;
  name: string;
  memberships: Membership[];
  profilePicture: string;
  activeWorkspace: string;
  defaultWorkspace: string;
  settings: UserSettings;
  status: string;
}

export interface UserSettings {
  weekStart: string;
  timeZone: string;
  timeFormat: string;
  dateFormat: string;
  sendNewsletter: boolean;
  weeklyUpdates: boolean;
  longRunning: boolean;
  scheduledReports: boolean;
  approval: boolean;
  pto: boolean;
  alerts: boolean;
  reminders: boolean;
  timeTrackingManual: boolean;
  summaryReportSettings: any;
  isCompactViewOn: boolean;
  dashboardSelection: string;
  dashboardViewType: string;
  dashboardPinToTop: boolean;
  projectListCollapse: number;
  collapseAllProjectLists: boolean;
  groupSimilarEntriesDisabled: boolean;
  myStartOfDay: string;
  projectPickerTaskFilter: boolean;
  lang: string;
  multiFactorEnabled: boolean;
  theme: string;
}

// ============================================================================
// Summary Report
// ============================================================================

export interface SummaryReportRequest {
  dateRangeStart: string; // ISO 8601
  dateRangeEnd: string; // ISO 8601
  summaryFilter?: {
    groups?: string[];
  };
  users?: {
    ids: string[];
    contains: "CONTAINS" | "DOES_NOT_CONTAIN";
  };
  projects?: {
    ids: string[];
    contains: "CONTAINS" | "DOES_NOT_CONTAIN";
  };
}

export interface SummaryReportResponse {
  groupOne: ReportGroup[];
  totals: ReportTotals[];
}

export interface ReportGroup {
  duration: number;
  name: string;
  children?: ReportGroup[];
  _id?: string;
}

export interface ReportTotals {
  totalTime: number;
  totalBillableTime: number;
  entriesCount: number;
}

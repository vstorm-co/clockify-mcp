/**
 * Time Entry API operations
 */

import { clockifyFetch } from "./client.js";
import type {
  TimeEntry,
  CreateTimeEntryRequest,
  UpdateTimeEntryRequest,
} from "../types/clockify.js";

/**
 * List time entries for a user with optional filtering
 */
export async function listTimeEntries(
  workspaceId: string,
  userId: string,
  options?: {
    start?: string; // ISO 8601 date
    end?: string; // ISO 8601 date
    description?: string;
    projectId?: string;
    taskId?: string;
    tagIds?: string[];
    page?: number;
    pageSize?: number;
  }
): Promise<TimeEntry[]> {
  const params = new URLSearchParams();
  if (options?.start) params.append("start", options.start);
  if (options?.end) params.append("end", options.end);
  if (options?.description) params.append("description", options.description);
  if (options?.projectId) params.append("project", options.projectId);
  if (options?.taskId) params.append("task", options.taskId);
  if (options?.tagIds) {
    options.tagIds.forEach((tagId) => params.append("tags", tagId));
  }
  if (options?.page) params.append("page", options.page.toString());
  if (options?.pageSize) params.append("page-size", options.pageSize.toString());

  const url = `/workspaces/${workspaceId}/user/${userId}/time-entries?${params.toString()}`;
  return clockifyFetch<TimeEntry[]>(url);
}

/**
 * Get a specific time entry
 */
export async function getTimeEntry(
  workspaceId: string,
  timeEntryId: string
): Promise<TimeEntry> {
  return clockifyFetch<TimeEntry>(
    `/workspaces/${workspaceId}/time-entries/${timeEntryId}`
  );
}

/**
 * Create a new time entry
 */
export async function createTimeEntry(
  workspaceId: string,
  data: CreateTimeEntryRequest
): Promise<TimeEntry> {
  return clockifyFetch<TimeEntry>(`/workspaces/${workspaceId}/time-entries`, {
    method: "POST",
    body: JSON.stringify(data),
  });
}

/**
 * Update an existing time entry
 */
export async function updateTimeEntry(
  workspaceId: string,
  timeEntryId: string,
  updates: UpdateTimeEntryRequest
): Promise<TimeEntry> {
  return clockifyFetch<TimeEntry>(
    `/workspaces/${workspaceId}/time-entries/${timeEntryId}`,
    {
      method: "PUT",
      body: JSON.stringify(updates),
    }
  );
}

/**
 * Delete a time entry
 */
export async function deleteTimeEntry(
  workspaceId: string,
  timeEntryId: string
): Promise<void> {
  await clockifyFetch<void>(
    `/workspaces/${workspaceId}/time-entries/${timeEntryId}`,
    {
      method: "DELETE",
    }
  );
}

/**
 * Bulk update time entries
 */
export async function bulkUpdateTimeEntries(
  workspaceId: string,
  timeEntryIds: string[],
  updates: Partial<UpdateTimeEntryRequest>
): Promise<TimeEntry[]> {
  return clockifyFetch<TimeEntry[]>(
    `/workspaces/${workspaceId}/time-entries/bulk`,
    {
      method: "PATCH",
      body: JSON.stringify({
        timeEntryIds,
        ...updates,
      }),
    }
  );
}

/**
 * Bulk delete time entries
 */
export async function bulkDeleteTimeEntries(
  workspaceId: string,
  timeEntryIds: string[]
): Promise<void> {
  await clockifyFetch<void>(
    `/workspaces/${workspaceId}/time-entries/bulk`,
    {
      method: "DELETE",
      body: JSON.stringify({ timeEntryIds }),
    }
  );
}

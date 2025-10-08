/**
 * Timer API operations
 */

import { clockifyFetch } from "./client.js";
import type { TimeEntry } from "../types/clockify.js";

/**
 * Start a new timer (running time entry)
 */
export async function startTimer(
  workspaceId: string,
  data: {
    description?: string;
    projectId?: string;
    taskId?: string;
    tagIds?: string[];
    billable?: boolean;
  }
): Promise<TimeEntry> {
  const startTime = new Date().toISOString();

  return clockifyFetch<TimeEntry>(
    `/workspaces/${workspaceId}/time-entries`,
    {
      method: "POST",
      body: JSON.stringify({
        start: startTime,
        description: data.description || "",
        projectId: data.projectId,
        taskId: data.taskId,
        tagIds: data.tagIds || [],
        billable: data.billable,
      }),
    }
  );
}

/**
 * Stop the currently running timer
 */
export async function stopTimer(
  workspaceId: string,
  userId: string
): Promise<TimeEntry> {
  const endTime = new Date().toISOString();

  return clockifyFetch<TimeEntry>(
    `/workspaces/${workspaceId}/user/${userId}/time-entries`,
    {
      method: "PATCH",
      body: JSON.stringify({
        end: endTime,
      }),
    }
  );
}

/**
 * Get the currently running timer (if any)
 */
export async function getActiveTimer(
  workspaceId: string,
  userId: string
): Promise<TimeEntry | null> {
  try {
    // The in-progress parameter returns only the running timer
    const result = await clockifyFetch<TimeEntry[]>(
      `/workspaces/${workspaceId}/user/${userId}/time-entries?in-progress=true`
    );

    // Return the first running timer or null if none
    return result && result.length > 0 ? result[0] : null;
  } catch (error) {
    // If no timer is running, API might return error - return null
    return null;
  }
}

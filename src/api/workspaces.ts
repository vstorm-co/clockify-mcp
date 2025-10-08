/**
 * Workspace API Operations
 */

import { clockifyFetch } from "./client.js";
import type { Workspace } from "../types/clockify.js";

/**
 * List all workspaces the user has access to
 */
export async function listWorkspaces(): Promise<Workspace[]> {
  return clockifyFetch<Workspace[]>("/workspaces");
}

/**
 * Get details for a specific workspace
 */
export async function getWorkspace(workspaceId: string): Promise<Workspace> {
  return clockifyFetch<Workspace>(`/workspaces/${workspaceId}`);
}

/**
 * Update workspace settings
 */
export async function updateWorkspace(
  workspaceId: string,
  updates: {
    name?: string;
    settings?: {
      timeRoundingInReports?: boolean;
      onlyAdminsSeeBillableRates?: boolean;
      onlyAdminsCreateProject?: boolean;
      onlyAdminsSeePublicProjectsEntries?: boolean;
      trackTimeDownToSecond?: boolean;
      isProjectPublicByDefault?: boolean;
    };
  }
): Promise<Workspace> {
  return clockifyFetch<Workspace>(`/workspaces/${workspaceId}`, {
    method: "PUT",
    body: JSON.stringify(updates),
  });
}

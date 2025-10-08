/**
 * Project API Operations
 */

import { clockifyFetch } from "./client.js";
import type { Project, CreateProjectRequest, UpdateProjectRequest } from "../types/clockify.js";

/**
 * List all projects in a workspace
 */
export async function listProjects(
  workspaceId: string,
  options?: {
    archived?: boolean;
    name?: string;
    clientId?: string;
    page?: number;
    pageSize?: number;
  }
): Promise<Project[]> {
  const params = new URLSearchParams();
  if (options?.archived !== undefined) params.append("archived", String(options.archived));
  if (options?.name) params.append("name", options.name);
  if (options?.clientId) params.append("clients", options.clientId);
  if (options?.page) params.append("page", String(options.page));
  if (options?.pageSize) params.append("page-size", String(options.pageSize));

  const query = params.toString();
  const endpoint = `/workspaces/${workspaceId}/projects${query ? `?${query}` : ""}`;

  return clockifyFetch<Project[]>(endpoint);
}

/**
 * Get a specific project
 */
export async function getProject(workspaceId: string, projectId: string): Promise<Project> {
  return clockifyFetch<Project>(`/workspaces/${workspaceId}/projects/${projectId}`);
}

/**
 * Create a new project
 */
export async function createProject(
  workspaceId: string,
  project: CreateProjectRequest
): Promise<Project> {
  return clockifyFetch<Project>(`/workspaces/${workspaceId}/projects`, {
    method: "POST",
    body: JSON.stringify(project),
  });
}

/**
 * Update an existing project
 */
export async function updateProject(
  workspaceId: string,
  projectId: string,
  updates: UpdateProjectRequest
): Promise<Project> {
  return clockifyFetch<Project>(`/workspaces/${workspaceId}/projects/${projectId}`, {
    method: "PUT",
    body: JSON.stringify(updates),
  });
}

/**
 * Delete a project
 */
export async function deleteProject(
  workspaceId: string,
  projectId: string
): Promise<void> {
  return clockifyFetch<void>(`/workspaces/${workspaceId}/projects/${projectId}`, {
    method: "DELETE",
  });
}

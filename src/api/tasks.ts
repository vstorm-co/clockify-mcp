/**
 * Task API Operations
 */

import { clockifyFetch } from "./client.js";
import type { Task, CreateTaskRequest, UpdateTaskRequest } from "../types/clockify.js";

/**
 * List all tasks for a project
 */
export async function listTasks(
  workspaceId: string,
  projectId: string,
  options?: {
    isActive?: boolean;
    name?: string;
    page?: number;
    pageSize?: number;
  }
): Promise<Task[]> {
  const params = new URLSearchParams();
  if (options?.isActive !== undefined) params.append("is-active", String(options.isActive));
  if (options?.name) params.append("name", options.name);
  if (options?.page) params.append("page", String(options.page));
  if (options?.pageSize) params.append("page-size", String(options.pageSize));

  const query = params.toString();
  const endpoint = `/workspaces/${workspaceId}/projects/${projectId}/tasks${query ? `?${query}` : ""}`;

  return clockifyFetch<Task[]>(endpoint);
}

/**
 * Create a new task
 */
export async function createTask(
  workspaceId: string,
  projectId: string,
  task: CreateTaskRequest
): Promise<Task> {
  return clockifyFetch<Task>(`/workspaces/${workspaceId}/projects/${projectId}/tasks`, {
    method: "POST",
    body: JSON.stringify(task),
  });
}

/**
 * Update an existing task
 */
export async function updateTask(
  workspaceId: string,
  projectId: string,
  taskId: string,
  updates: UpdateTaskRequest
): Promise<Task> {
  return clockifyFetch<Task>(`/workspaces/${workspaceId}/projects/${projectId}/tasks/${taskId}`, {
    method: "PUT",
    body: JSON.stringify(updates),
  });
}

/**
 * Delete a task
 */
export async function deleteTask(
  workspaceId: string,
  projectId: string,
  taskId: string
): Promise<void> {
  return clockifyFetch<void>(`/workspaces/${workspaceId}/projects/${projectId}/tasks/${taskId}`, {
    method: "DELETE",
  });
}

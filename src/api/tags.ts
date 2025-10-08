/**
 * Tag API Operations
 */

import { clockifyFetch } from "./client.js";
import type { Tag, CreateTagRequest, UpdateTagRequest } from "../types/clockify.js";

/**
 * List all tags in a workspace
 */
export async function listTags(
  workspaceId: string,
  options?: {
    archived?: boolean;
    name?: string;
    page?: number;
    pageSize?: number;
  }
): Promise<Tag[]> {
  const params = new URLSearchParams();
  if (options?.archived !== undefined) params.append("archived", String(options.archived));
  if (options?.name) params.append("name", options.name);
  if (options?.page) params.append("page", String(options.page));
  if (options?.pageSize) params.append("page-size", String(options.pageSize));

  const query = params.toString();
  const endpoint = `/workspaces/${workspaceId}/tags${query ? `?${query}` : ""}`;

  return clockifyFetch<Tag[]>(endpoint);
}

/**
 * Create a new tag
 */
export async function createTag(
  workspaceId: string,
  tag: CreateTagRequest
): Promise<Tag> {
  return clockifyFetch<Tag>(`/workspaces/${workspaceId}/tags`, {
    method: "POST",
    body: JSON.stringify(tag),
  });
}

/**
 * Update an existing tag
 */
export async function updateTag(
  workspaceId: string,
  tagId: string,
  updates: UpdateTagRequest
): Promise<Tag> {
  return clockifyFetch<Tag>(`/workspaces/${workspaceId}/tags/${tagId}`, {
    method: "PUT",
    body: JSON.stringify(updates),
  });
}

/**
 * Delete a tag
 */
export async function deleteTag(
  workspaceId: string,
  tagId: string
): Promise<void> {
  return clockifyFetch<void>(`/workspaces/${workspaceId}/tags/${tagId}`, {
    method: "DELETE",
  });
}

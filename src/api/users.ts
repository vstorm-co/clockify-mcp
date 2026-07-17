/**
 * User API Operations
 */

import { clockifyFetch } from "./client.js";
import type { User } from "../types/clockify.js";

/**
 * List users in a workspace ("Find all users on workspace").
 *
 * The `name` filter is applied server-side by Clockify (substring match,
 * case-insensitive), so we can search for "Sikorski" without downloading
 * the whole workspace.
 *
 * Note: listing every user usually requires an ADMIN or OWNER API key.
 * A plain USER key may only be able to see itself.
 */
export async function listUsers(
  workspaceId: string,
  options?: {
    name?: string;
    email?: string;
    status?: "ACTIVE" | "INACTIVE" | "PENDING" | "ALL";
    page?: number;
    pageSize?: number;
  }
): Promise<User[]> {
  const params = new URLSearchParams();
  if (options?.name) params.append("name", options.name);
  if (options?.email) params.append("email", options.email);
  if (options?.status) params.append("status", options.status);
  if (options?.page) params.append("page", String(options.page));
  if (options?.pageSize) params.append("page-size", String(options.pageSize));

  const query = params.toString();
  const endpoint = `/workspaces/${workspaceId}/users${query ? `?${query}` : ""}`;

  return clockifyFetch<User[]>(endpoint);
}
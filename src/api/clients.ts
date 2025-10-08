/**
 * Client API Operations
 */

import { clockifyFetch } from "./client.js";
import type { Client, CreateClientRequest, UpdateClientRequest } from "../types/clockify.js";

/**
 * List all clients in a workspace
 */
export async function listClients(
  workspaceId: string,
  options?: {
    archived?: boolean;
    name?: string;
    page?: number;
    pageSize?: number;
  }
): Promise<Client[]> {
  const params = new URLSearchParams();
  if (options?.archived !== undefined) params.append("archived", String(options.archived));
  if (options?.name) params.append("name", options.name);
  if (options?.page) params.append("page", String(options.page));
  if (options?.pageSize) params.append("page-size", String(options.pageSize));

  const query = params.toString();
  const endpoint = `/workspaces/${workspaceId}/clients${query ? `?${query}` : ""}`;

  return clockifyFetch<Client[]>(endpoint);
}

/**
 * Create a new client
 */
export async function createClient(
  workspaceId: string,
  client: CreateClientRequest
): Promise<Client> {
  return clockifyFetch<Client>(`/workspaces/${workspaceId}/clients`, {
    method: "POST",
    body: JSON.stringify(client),
  });
}

/**
 * Update an existing client
 */
export async function updateClient(
  workspaceId: string,
  clientId: string,
  updates: UpdateClientRequest
): Promise<Client> {
  return clockifyFetch<Client>(`/workspaces/${workspaceId}/clients/${clientId}`, {
    method: "PUT",
    body: JSON.stringify(updates),
  });
}

/**
 * Delete a client
 */
export async function deleteClient(
  workspaceId: string,
  clientId: string
): Promise<void> {
  return clockifyFetch<void>(`/workspaces/${workspaceId}/clients/${clientId}`, {
    method: "DELETE",
  });
}

/**
 * MCP Tool Handlers
 * Routes tool requests to appropriate API implementations
 */

import type {
  ListToolsRequest,
  CallToolRequest,
} from "@modelcontextprotocol/sdk/types.js";
import * as workspaces from "./api/workspaces.js";
import * as users from "./api/users.js";
import * as clients from "./api/clients.js";
import * as projects from "./api/projects.js";
import * as tasks from "./api/tasks.js";
import * as tags from "./api/tags.js";
import * as timeEntries from "./api/timeEntries.js";
import * as timer from "./api/timer.js";

/**
 * Lists all available Clockify tools
 */
export async function listToolsHandler(_request: ListToolsRequest) {
  return {
    tools: [
      // Workspace Management
      {
        name: "listWorkspaces",
        description: "List all workspaces the user has access to",
        inputSchema: {
          type: "object",
          properties: {},
          required: [],
        },
      },
      {
        name: "getWorkspace",
        description: "Get details for a specific workspace",
        inputSchema: {
          type: "object",
          properties: {
            workspaceId: {
              type: "string",
              description: "The workspace ID",
            },
          },
          required: ["workspaceId"],
        },
      },
      {
        name: "updateWorkspace",
        description: "Update workspace settings (name, time tracking preferences)",
        inputSchema: {
          type: "object",
          properties: {
            workspaceId: {
              type: "string",
              description: "The workspace ID",
            },
            name: {
              type: "string",
              description: "New workspace name (optional)",
            },
            settings: {
              type: "object",
              description: "Workspace settings to update (optional)",
              properties: {
                timeRoundingInReports: { type: "boolean" },
                onlyAdminsSeeBillableRates: { type: "boolean" },
                onlyAdminsCreateProject: { type: "boolean" },
                trackTimeDownToSecond: { type: "boolean" },
                isProjectPublicByDefault: { type: "boolean" },
              },
            },
          },
          required: ["workspaceId"],
        },
      },
      // User Management
      {
        name: "listUsers",
        description:
          "Find users in a workspace. Use the 'name' filter to look up a person's userId by their full name (case-insensitive substring match). Call this to resolve a person's name to a userId before using tools that require userId, such as listTimeEntries or getActiveTimer.",
        inputSchema: {
          type: "object",
          properties: {
            workspaceId: {
              type: "string",
              description: "The workspace ID",
            },
            name: {
              type: "string",
              description: "Filter by full name or part of it (optional)",
            },
            email: {
              type: "string",
              description: "Filter by email or part of it (optional)",
            },
            status: {
              type: "string",
              description:
                "Filter by status: ACTIVE, INACTIVE, PENDING, or ALL (optional)",
            },
            page: {
              type: "number",
              description: "Page number (optional)",
            },
            pageSize: {
              type: "number",
              description: "Results per page, max 5000 (optional)",
            },
          },
          required: ["workspaceId"],
        },
      },
      // Client Management
      {
        name: "listClients",
        description: "List all clients in a workspace with optional filtering",
        inputSchema: {
          type: "object",
          properties: {
            workspaceId: {
              type: "string",
              description: "The workspace ID",
            },
            archived: {
              type: "boolean",
              description: "Filter by archived status (optional)",
            },
            name: {
              type: "string",
              description: "Filter by client name (optional)",
            },
            page: {
              type: "number",
              description: "Page number for pagination (optional)",
            },
            pageSize: {
              type: "number",
              description: "Number of results per page (optional)",
            },
          },
          required: ["workspaceId"],
        },
      },
      {
        name: "createClient",
        description: "Create a new client in a workspace",
        inputSchema: {
          type: "object",
          properties: {
            workspaceId: {
              type: "string",
              description: "The workspace ID",
            },
            name: {
              type: "string",
              description: "Client name",
            },
            address: {
              type: "string",
              description: "Client address (optional)",
            },
            note: {
              type: "string",
              description: "Client note (optional)",
            },
          },
          required: ["workspaceId", "name"],
        },
      },
      {
        name: "updateClient",
        description: "Update an existing client",
        inputSchema: {
          type: "object",
          properties: {
            workspaceId: {
              type: "string",
              description: "The workspace ID",
            },
            clientId: {
              type: "string",
              description: "The client ID",
            },
            name: {
              type: "string",
              description: "New client name (optional)",
            },
            address: {
              type: "string",
              description: "New client address (optional)",
            },
            note: {
              type: "string",
              description: "New client note (optional)",
            },
            archived: {
              type: "boolean",
              description: "Archive/unarchive the client (optional)",
            },
          },
          required: ["workspaceId", "clientId"],
        },
      },
      {
        name: "deleteClient",
        description: "Delete a client from a workspace",
        inputSchema: {
          type: "object",
          properties: {
            workspaceId: {
              type: "string",
              description: "The workspace ID",
            },
            clientId: {
              type: "string",
              description: "The client ID",
            },
          },
          required: ["workspaceId", "clientId"],
        },
      },
      // Project Management
      {
        name: "listProjects",
        description: "List all projects in a workspace with optional filtering",
        inputSchema: {
          type: "object",
          properties: {
            workspaceId: {
              type: "string",
              description: "The workspace ID",
            },
            archived: {
              type: "boolean",
              description: "Filter by archived status (optional)",
            },
            name: {
              type: "string",
              description: "Filter by project name (optional)",
            },
            clientId: {
              type: "string",
              description: "Filter by client ID (optional)",
            },
            page: {
              type: "number",
              description: "Page number for pagination (optional)",
            },
            pageSize: {
              type: "number",
              description: "Number of results per page (optional)",
            },
          },
          required: ["workspaceId"],
        },
      },
      {
        name: "getProject",
        description: "Get details for a specific project",
        inputSchema: {
          type: "object",
          properties: {
            workspaceId: {
              type: "string",
              description: "The workspace ID",
            },
            projectId: {
              type: "string",
              description: "The project ID",
            },
          },
          required: ["workspaceId", "projectId"],
        },
      },
      {
        name: "createProject",
        description: "Create a new project in a workspace",
        inputSchema: {
          type: "object",
          properties: {
            workspaceId: {
              type: "string",
              description: "The workspace ID",
            },
            name: {
              type: "string",
              description: "Project name",
            },
            clientId: {
              type: "string",
              description: "Client ID (optional)",
            },
            isPublic: {
              type: "boolean",
              description: "Is project public (optional)",
            },
            color: {
              type: "string",
              description: "Project color hex code (optional)",
            },
            billable: {
              type: "boolean",
              description: "Is project billable (optional)",
            },
            note: {
              type: "string",
              description: "Project note (optional)",
            },
          },
          required: ["workspaceId", "name"],
        },
      },
      {
        name: "updateProject",
        description: "Update an existing project",
        inputSchema: {
          type: "object",
          properties: {
            workspaceId: {
              type: "string",
              description: "The workspace ID",
            },
            projectId: {
              type: "string",
              description: "The project ID",
            },
            name: {
              type: "string",
              description: "New project name (optional)",
            },
            clientId: {
              type: "string",
              description: "New client ID (optional)",
            },
            isPublic: {
              type: "boolean",
              description: "Is project public (optional)",
            },
            color: {
              type: "string",
              description: "New project color hex code (optional)",
            },
            billable: {
              type: "boolean",
              description: "Is project billable (optional)",
            },
            archived: {
              type: "boolean",
              description: "Archive/unarchive the project (optional)",
            },
            note: {
              type: "string",
              description: "New project note (optional)",
            },
          },
          required: ["workspaceId", "projectId"],
        },
      },
      {
        name: "deleteProject",
        description: "Delete a project from a workspace",
        inputSchema: {
          type: "object",
          properties: {
            workspaceId: {
              type: "string",
              description: "The workspace ID",
            },
            projectId: {
              type: "string",
              description: "The project ID",
            },
          },
          required: ["workspaceId", "projectId"],
        },
      },
      // Task Management
      {
        name: "listTasks",
        description: "List all tasks for a project with optional filtering",
        inputSchema: {
          type: "object",
          properties: {
            workspaceId: {
              type: "string",
              description: "The workspace ID",
            },
            projectId: {
              type: "string",
              description: "The project ID",
            },
            isActive: {
              type: "boolean",
              description: "Filter by active status (optional)",
            },
            name: {
              type: "string",
              description: "Filter by task name (optional)",
            },
            page: {
              type: "number",
              description: "Page number for pagination (optional)",
            },
            pageSize: {
              type: "number",
              description: "Number of results per page (optional)",
            },
          },
          required: ["workspaceId", "projectId"],
        },
      },
      {
        name: "createTask",
        description: "Create a new task in a project",
        inputSchema: {
          type: "object",
          properties: {
            workspaceId: {
              type: "string",
              description: "The workspace ID",
            },
            projectId: {
              type: "string",
              description: "The project ID",
            },
            name: {
              type: "string",
              description: "Task name",
            },
            assigneeIds: {
              type: "array",
              items: { type: "string" },
              description: "Array of user IDs to assign (optional)",
            },
            estimate: {
              type: "string",
              description: "Time estimate in ISO 8601 duration format (optional)",
            },
            status: {
              type: "string",
              enum: ["ACTIVE", "DONE"],
              description: "Task status (optional, default: ACTIVE)",
            },
            billable: {
              type: "boolean",
              description: "Is task billable (optional)",
            },
          },
          required: ["workspaceId", "projectId", "name"],
        },
      },
      {
        name: "updateTask",
        description: "Update an existing task",
        inputSchema: {
          type: "object",
          properties: {
            workspaceId: {
              type: "string",
              description: "The workspace ID",
            },
            projectId: {
              type: "string",
              description: "The project ID",
            },
            taskId: {
              type: "string",
              description: "The task ID",
            },
            name: {
              type: "string",
              description: "New task name (optional)",
            },
            assigneeIds: {
              type: "array",
              items: { type: "string" },
              description: "New array of user IDs to assign (optional)",
            },
            estimate: {
              type: "string",
              description: "New time estimate in ISO 8601 duration format (optional)",
            },
            status: {
              type: "string",
              enum: ["ACTIVE", "DONE"],
              description: "New task status (optional)",
            },
            billable: {
              type: "boolean",
              description: "Is task billable (optional)",
            },
          },
          required: ["workspaceId", "projectId", "taskId"],
        },
      },
      {
        name: "deleteTask",
        description: "Delete a task from a project",
        inputSchema: {
          type: "object",
          properties: {
            workspaceId: {
              type: "string",
              description: "The workspace ID",
            },
            projectId: {
              type: "string",
              description: "The project ID",
            },
            taskId: {
              type: "string",
              description: "The task ID",
            },
          },
          required: ["workspaceId", "projectId", "taskId"],
        },
      },
      // Tag Management
      {
        name: "listTags",
        description: "List all tags in a workspace with optional filtering",
        inputSchema: {
          type: "object",
          properties: {
            workspaceId: {
              type: "string",
              description: "The workspace ID",
            },
            archived: {
              type: "boolean",
              description: "Filter by archived status (optional)",
            },
            name: {
              type: "string",
              description: "Filter by tag name (optional)",
            },
            page: {
              type: "number",
              description: "Page number for pagination (optional)",
            },
            pageSize: {
              type: "number",
              description: "Number of results per page (optional)",
            },
          },
          required: ["workspaceId"],
        },
      },
      {
        name: "createTag",
        description: "Create a new tag in a workspace",
        inputSchema: {
          type: "object",
          properties: {
            workspaceId: {
              type: "string",
              description: "The workspace ID",
            },
            name: {
              type: "string",
              description: "Tag name",
            },
          },
          required: ["workspaceId", "name"],
        },
      },
      {
        name: "updateTag",
        description: "Update an existing tag",
        inputSchema: {
          type: "object",
          properties: {
            workspaceId: {
              type: "string",
              description: "The workspace ID",
            },
            tagId: {
              type: "string",
              description: "The tag ID",
            },
            name: {
              type: "string",
              description: "New tag name (optional)",
            },
            archived: {
              type: "boolean",
              description: "Archive/unarchive the tag (optional)",
            },
          },
          required: ["workspaceId", "tagId"],
        },
      },
      {
        name: "deleteTag",
        description: "Delete a tag from a workspace",
        inputSchema: {
          type: "object",
          properties: {
            workspaceId: {
              type: "string",
              description: "The workspace ID",
            },
            tagId: {
              type: "string",
              description: "The tag ID",
            },
          },
          required: ["workspaceId", "tagId"],
        },
      },
      // Time Entry Management
      {
        name: "listTimeEntries",
        description: "List time entries for a user with optional filtering by date range, project, task, tags",
        inputSchema: {
          type: "object",
          properties: {
            workspaceId: {
              type: "string",
              description: "The workspace ID",
            },
            userId: {
              type: "string",
              description: "The user ID",
            },
            start: {
              type: "string",
              description: "Start date in ISO 8601 format (optional)",
            },
            end: {
              type: "string",
              description: "End date in ISO 8601 format (optional)",
            },
            description: {
              type: "string",
              description: "Filter by description (optional)",
            },
            projectId: {
              type: "string",
              description: "Filter by project ID (optional)",
            },
            taskId: {
              type: "string",
              description: "Filter by task ID (optional)",
            },
            tagIds: {
              type: "array",
              items: { type: "string" },
              description: "Filter by tag IDs (optional)",
            },
            page: {
              type: "number",
              description: "Page number for pagination (optional)",
            },
            pageSize: {
              type: "number",
              description: "Number of results per page (optional)",
            },
          },
          required: ["workspaceId", "userId"],
        },
      },
      {
        name: "getTimeEntry",
        description: "Get details for a specific time entry",
        inputSchema: {
          type: "object",
          properties: {
            workspaceId: {
              type: "string",
              description: "The workspace ID",
            },
            timeEntryId: {
              type: "string",
              description: "The time entry ID",
            },
          },
          required: ["workspaceId", "timeEntryId"],
        },
      },
      {
        name: "createTimeEntry",
        description: "Create a new time entry (finished time entry, not a timer)",
        inputSchema: {
          type: "object",
          properties: {
            workspaceId: {
              type: "string",
              description: "The workspace ID",
            },
            start: {
              type: "string",
              description: "Start time in ISO 8601 format",
            },
            end: {
              type: "string",
              description: "End time in ISO 8601 format (optional, omit for running timer)",
            },
            description: {
              type: "string",
              description: "Time entry description (optional)",
            },
            projectId: {
              type: "string",
              description: "Project ID (optional)",
            },
            taskId: {
              type: "string",
              description: "Task ID (optional)",
            },
            tagIds: {
              type: "array",
              items: { type: "string" },
              description: "Tag IDs (optional)",
            },
            billable: {
              type: "boolean",
              description: "Is billable (optional)",
            },
          },
          required: ["workspaceId", "start"],
        },
      },
      {
        name: "updateTimeEntry",
        description: "Update an existing time entry",
        inputSchema: {
          type: "object",
          properties: {
            workspaceId: {
              type: "string",
              description: "The workspace ID",
            },
            timeEntryId: {
              type: "string",
              description: "The time entry ID",
            },
            start: {
              type: "string",
              description: "New start time in ISO 8601 format (optional)",
            },
            end: {
              type: "string",
              description: "New end time in ISO 8601 format (optional)",
            },
            description: {
              type: "string",
              description: "New description (optional)",
            },
            projectId: {
              type: "string",
              description: "New project ID (optional)",
            },
            taskId: {
              type: "string",
              description: "New task ID (optional)",
            },
            tagIds: {
              type: "array",
              items: { type: "string" },
              description: "New tag IDs (optional)",
            },
            billable: {
              type: "boolean",
              description: "Is billable (optional)",
            },
          },
          required: ["workspaceId", "timeEntryId"],
        },
      },
      {
        name: "deleteTimeEntry",
        description: "Delete a time entry",
        inputSchema: {
          type: "object",
          properties: {
            workspaceId: {
              type: "string",
              description: "The workspace ID",
            },
            timeEntryId: {
              type: "string",
              description: "The time entry ID",
            },
          },
          required: ["workspaceId", "timeEntryId"],
        },
      },
      {
        name: "bulkUpdateTimeEntries",
        description: "Update multiple time entries at once",
        inputSchema: {
          type: "object",
          properties: {
            workspaceId: {
              type: "string",
              description: "The workspace ID",
            },
            timeEntryIds: {
              type: "array",
              items: { type: "string" },
              description: "Array of time entry IDs to update",
            },
            start: {
              type: "string",
              description: "New start time in ISO 8601 format (optional)",
            },
            end: {
              type: "string",
              description: "New end time in ISO 8601 format (optional)",
            },
            description: {
              type: "string",
              description: "New description (optional)",
            },
            projectId: {
              type: "string",
              description: "New project ID (optional)",
            },
            taskId: {
              type: "string",
              description: "New task ID (optional)",
            },
            tagIds: {
              type: "array",
              items: { type: "string" },
              description: "New tag IDs (optional)",
            },
            billable: {
              type: "boolean",
              description: "Is billable (optional)",
            },
          },
          required: ["workspaceId", "timeEntryIds"],
        },
      },
      {
        name: "bulkDeleteTimeEntries",
        description: "Delete multiple time entries at once",
        inputSchema: {
          type: "object",
          properties: {
            workspaceId: {
              type: "string",
              description: "The workspace ID",
            },
            timeEntryIds: {
              type: "array",
              items: { type: "string" },
              description: "Array of time entry IDs to delete",
            },
          },
          required: ["workspaceId", "timeEntryIds"],
        },
      },
      // Timer Operations
      {
        name: "startTimer",
        description: "Start a new timer (running time entry)",
        inputSchema: {
          type: "object",
          properties: {
            workspaceId: {
              type: "string",
              description: "The workspace ID",
            },
            description: {
              type: "string",
              description: "Timer description (optional)",
            },
            projectId: {
              type: "string",
              description: "Project ID (optional)",
            },
            taskId: {
              type: "string",
              description: "Task ID (optional)",
            },
            tagIds: {
              type: "array",
              items: { type: "string" },
              description: "Tag IDs (optional)",
            },
            billable: {
              type: "boolean",
              description: "Is billable (optional)",
            },
          },
          required: ["workspaceId"],
        },
      },
      {
        name: "stopTimer",
        description: "Stop the currently running timer",
        inputSchema: {
          type: "object",
          properties: {
            workspaceId: {
              type: "string",
              description: "The workspace ID",
            },
            userId: {
              type: "string",
              description: "The user ID",
            },
          },
          required: ["workspaceId", "userId"],
        },
      },
      {
        name: "getActiveTimer",
        description: "Get the currently running timer (if any)",
        inputSchema: {
          type: "object",
          properties: {
            workspaceId: {
              type: "string",
              description: "The workspace ID",
            },
            userId: {
              type: "string",
              description: "The user ID",
            },
          },
          required: ["workspaceId", "userId"],
        },
      },
    ],
  };
}

/**
 * Routes tool calls to the appropriate handler
 */
export async function callToolHandler(request: CallToolRequest) {
  const { name, arguments: args } = request.params;

  try {
    switch (name) {
      // Workspace tools
      case "listWorkspaces": {
        const result = await workspaces.listWorkspaces();
        return {
          content: [
            {
              type: "text",
              text: JSON.stringify(result, null, 2),
            },
          ],
        };
      }

      case "getWorkspace": {
        const { workspaceId } = args as { workspaceId: string };
        if (!workspaceId) {
          throw new Error("workspaceId is required");
        }
        const result = await workspaces.getWorkspace(workspaceId);
        return {
          content: [
            {
              type: "text",
              text: JSON.stringify(result, null, 2),
            },
          ],
        };
      }

      case "updateWorkspace": {
        const { workspaceId, name, settings } = args as {
          workspaceId: string;
          name?: string;
          settings?: Record<string, boolean>;
        };
        if (!workspaceId) {
          throw new Error("workspaceId is required");
        }
        const updates: { name?: string; settings?: Record<string, boolean> } = {};
        if (name) updates.name = name;
        if (settings) updates.settings = settings;

        const result = await workspaces.updateWorkspace(workspaceId, updates);
        return {
          content: [
            {
              type: "text",
              text: JSON.stringify(result, null, 2),
            },
          ],
        };
      }

      // User tools
      case "listUsers": {
        const { workspaceId, name, email, status, page, pageSize } = args as {
          workspaceId: string;
          name?: string;
          email?: string;
          status?: "ACTIVE" | "INACTIVE" | "PENDING" | "ALL";
          page?: number;
          pageSize?: number;
        };
        if (!workspaceId) {
          throw new Error("workspaceId is required");
        }
        const result = await users.listUsers(workspaceId, {
          name,
          email,
          status,
          page,
          pageSize,
        });
        return {
          content: [
            {
              type: "text",
              text: JSON.stringify(result, null, 2),
            },
          ],
        };
      }
      // Client tools
      case "listClients": {
        const { workspaceId, archived, name, page, pageSize } = args as {
          workspaceId: string;
          archived?: boolean;
          name?: string;
          page?: number;
          pageSize?: number;
        };
        if (!workspaceId) {
          throw new Error("workspaceId is required");
        }
        const result = await clients.listClients(workspaceId, { archived, name, page, pageSize });
        return {
          content: [
            {
              type: "text",
              text: JSON.stringify(result, null, 2),
            },
          ],
        };
      }

      case "createClient": {
        const { workspaceId, name, address, note } = args as {
          workspaceId: string;
          name: string;
          address?: string;
          note?: string;
        };
        if (!workspaceId || !name) {
          throw new Error("workspaceId and name are required");
        }
        const result = await clients.createClient(workspaceId, { name, address, note });
        return {
          content: [
            {
              type: "text",
              text: JSON.stringify(result, null, 2),
            },
          ],
        };
      }

      case "updateClient": {
        const { workspaceId, clientId, name, address, note, archived } = args as {
          workspaceId: string;
          clientId: string;
          name?: string;
          address?: string;
          note?: string;
          archived?: boolean;
        };
        if (!workspaceId || !clientId) {
          throw new Error("workspaceId and clientId are required");
        }
        const updates: { name?: string; address?: string; note?: string; archived?: boolean } = {};
        if (name) updates.name = name;
        if (address !== undefined) updates.address = address;
        if (note !== undefined) updates.note = note;
        if (archived !== undefined) updates.archived = archived;

        const result = await clients.updateClient(workspaceId, clientId, updates);
        return {
          content: [
            {
              type: "text",
              text: JSON.stringify(result, null, 2),
            },
          ],
        };
      }

      case "deleteClient": {
        const { workspaceId, clientId } = args as {
          workspaceId: string;
          clientId: string;
        };
        if (!workspaceId || !clientId) {
          throw new Error("workspaceId and clientId are required");
        }
        await clients.deleteClient(workspaceId, clientId);
        return {
          content: [
            {
              type: "text",
              text: JSON.stringify({ success: true, message: "Client deleted" }, null, 2),
            },
          ],
        };
      }

      // Project tools
      case "listProjects": {
        const { workspaceId, archived, name, clientId, page, pageSize } = args as {
          workspaceId: string;
          archived?: boolean;
          name?: string;
          clientId?: string;
          page?: number;
          pageSize?: number;
        };
        if (!workspaceId) {
          throw new Error("workspaceId is required");
        }
        const result = await projects.listProjects(workspaceId, { archived, name, clientId, page, pageSize });
        return {
          content: [
            {
              type: "text",
              text: JSON.stringify(result, null, 2),
            },
          ],
        };
      }

      case "getProject": {
        const { workspaceId, projectId } = args as {
          workspaceId: string;
          projectId: string;
        };
        if (!workspaceId || !projectId) {
          throw new Error("workspaceId and projectId are required");
        }
        const result = await projects.getProject(workspaceId, projectId);
        return {
          content: [
            {
              type: "text",
              text: JSON.stringify(result, null, 2),
            },
          ],
        };
      }

      case "createProject": {
        const { workspaceId, name, clientId, isPublic, color, billable, note } = args as {
          workspaceId: string;
          name: string;
          clientId?: string;
          isPublic?: boolean;
          color?: string;
          billable?: boolean;
          note?: string;
        };
        if (!workspaceId || !name) {
          throw new Error("workspaceId and name are required");
        }
        const projectData: {
          name: string;
          clientId?: string;
          isPublic?: boolean;
          color?: string;
          billable?: boolean;
          note?: string;
        } = { name };
        if (clientId) projectData.clientId = clientId;
        if (isPublic !== undefined) projectData.isPublic = isPublic;
        if (color) projectData.color = color;
        if (billable !== undefined) projectData.billable = billable;
        if (note) projectData.note = note;

        const result = await projects.createProject(workspaceId, projectData);
        return {
          content: [
            {
              type: "text",
              text: JSON.stringify(result, null, 2),
            },
          ],
        };
      }

      case "updateProject": {
        const { workspaceId, projectId, name, clientId, isPublic, color, billable, archived, note } = args as {
          workspaceId: string;
          projectId: string;
          name?: string;
          clientId?: string;
          isPublic?: boolean;
          color?: string;
          billable?: boolean;
          archived?: boolean;
          note?: string;
        };
        if (!workspaceId || !projectId) {
          throw new Error("workspaceId and projectId are required");
        }
        const updates: {
          name?: string;
          clientId?: string;
          isPublic?: boolean;
          color?: string;
          billable?: boolean;
          archived?: boolean;
          note?: string;
        } = {};
        if (name) updates.name = name;
        if (clientId !== undefined) updates.clientId = clientId;
        if (isPublic !== undefined) updates.isPublic = isPublic;
        if (color) updates.color = color;
        if (billable !== undefined) updates.billable = billable;
        if (archived !== undefined) updates.archived = archived;
        if (note !== undefined) updates.note = note;

        const result = await projects.updateProject(workspaceId, projectId, updates);
        return {
          content: [
            {
              type: "text",
              text: JSON.stringify(result, null, 2),
            },
          ],
        };
      }

      case "deleteProject": {
        const { workspaceId, projectId } = args as {
          workspaceId: string;
          projectId: string;
        };
        if (!workspaceId || !projectId) {
          throw new Error("workspaceId and projectId are required");
        }
        await projects.deleteProject(workspaceId, projectId);
        return {
          content: [
            {
              type: "text",
              text: JSON.stringify({ success: true, message: "Project deleted" }, null, 2),
            },
          ],
        };
      }

      // Task tools
      case "listTasks": {
        const { workspaceId, projectId, isActive, name, page, pageSize } = args as {
          workspaceId: string;
          projectId: string;
          isActive?: boolean;
          name?: string;
          page?: number;
          pageSize?: number;
        };
        if (!workspaceId || !projectId) {
          throw new Error("workspaceId and projectId are required");
        }
        const result = await tasks.listTasks(workspaceId, projectId, { isActive, name, page, pageSize });
        return {
          content: [
            {
              type: "text",
              text: JSON.stringify(result, null, 2),
            },
          ],
        };
      }

      case "createTask": {
        const { workspaceId, projectId, name, assigneeIds, estimate, status, billable } = args as {
          workspaceId: string;
          projectId: string;
          name: string;
          assigneeIds?: string[];
          estimate?: string;
          status?: "ACTIVE" | "DONE";
          billable?: boolean;
        };
        if (!workspaceId || !projectId || !name) {
          throw new Error("workspaceId, projectId, and name are required");
        }
        const taskData: {
          name: string;
          projectId: string;
          assigneeIds?: string[];
          estimate?: string;
          status?: "ACTIVE" | "DONE";
          billable?: boolean;
        } = { name, projectId };
        if (assigneeIds) taskData.assigneeIds = assigneeIds;
        if (estimate) taskData.estimate = estimate;
        if (status) taskData.status = status;
        if (billable !== undefined) taskData.billable = billable;

        const result = await tasks.createTask(workspaceId, projectId, taskData);
        return {
          content: [
            {
              type: "text",
              text: JSON.stringify(result, null, 2),
            },
          ],
        };
      }

      case "updateTask": {
        const { workspaceId, projectId, taskId, name, assigneeIds, estimate, status, billable } = args as {
          workspaceId: string;
          projectId: string;
          taskId: string;
          name?: string;
          assigneeIds?: string[];
          estimate?: string;
          status?: "ACTIVE" | "DONE";
          billable?: boolean;
        };
        if (!workspaceId || !projectId || !taskId) {
          throw new Error("workspaceId, projectId, and taskId are required");
        }
        const updates: {
          name?: string;
          assigneeIds?: string[];
          estimate?: string;
          status?: "ACTIVE" | "DONE";
          billable?: boolean;
        } = {};
        if (name) updates.name = name;
        if (assigneeIds) updates.assigneeIds = assigneeIds;
        if (estimate !== undefined) updates.estimate = estimate;
        if (status) updates.status = status;
        if (billable !== undefined) updates.billable = billable;

        const result = await tasks.updateTask(workspaceId, projectId, taskId, updates);
        return {
          content: [
            {
              type: "text",
              text: JSON.stringify(result, null, 2),
            },
          ],
        };
      }

      case "deleteTask": {
        const { workspaceId, projectId, taskId } = args as {
          workspaceId: string;
          projectId: string;
          taskId: string;
        };
        if (!workspaceId || !projectId || !taskId) {
          throw new Error("workspaceId, projectId, and taskId are required");
        }
        await tasks.deleteTask(workspaceId, projectId, taskId);
        return {
          content: [
            {
              type: "text",
              text: JSON.stringify({ success: true, message: "Task deleted" }, null, 2),
            },
          ],
        };
      }

      // Tag tools
      case "listTags": {
        const { workspaceId, archived, name, page, pageSize } = args as {
          workspaceId: string;
          archived?: boolean;
          name?: string;
          page?: number;
          pageSize?: number;
        };
        if (!workspaceId) {
          throw new Error("workspaceId is required");
        }
        const result = await tags.listTags(workspaceId, { archived, name, page, pageSize });
        return {
          content: [
            {
              type: "text",
              text: JSON.stringify(result, null, 2),
            },
          ],
        };
      }

      case "createTag": {
        const { workspaceId, name } = args as {
          workspaceId: string;
          name: string;
        };
        if (!workspaceId || !name) {
          throw new Error("workspaceId and name are required");
        }
        const result = await tags.createTag(workspaceId, { name });
        return {
          content: [
            {
              type: "text",
              text: JSON.stringify(result, null, 2),
            },
          ],
        };
      }

      case "updateTag": {
        const { workspaceId, tagId, name, archived } = args as {
          workspaceId: string;
          tagId: string;
          name?: string;
          archived?: boolean;
        };
        if (!workspaceId || !tagId) {
          throw new Error("workspaceId and tagId are required");
        }
        const updates: { name?: string; archived?: boolean } = {};
        if (name) updates.name = name;
        if (archived !== undefined) updates.archived = archived;

        const result = await tags.updateTag(workspaceId, tagId, updates);
        return {
          content: [
            {
              type: "text",
              text: JSON.stringify(result, null, 2),
            },
          ],
        };
      }

      case "deleteTag": {
        const { workspaceId, tagId } = args as {
          workspaceId: string;
          tagId: string;
        };
        if (!workspaceId || !tagId) {
          throw new Error("workspaceId and tagId are required");
        }
        await tags.deleteTag(workspaceId, tagId);
        return {
          content: [
            {
              type: "text",
              text: JSON.stringify({ success: true, message: "Tag deleted" }, null, 2),
            },
          ],
        };
      }

      // Time Entry tools
      case "listTimeEntries": {
        const { workspaceId, userId, start, end, description, projectId, taskId, tagIds, page, pageSize } = args as {
          workspaceId: string;
          userId: string;
          start?: string;
          end?: string;
          description?: string;
          projectId?: string;
          taskId?: string;
          tagIds?: string[];
          page?: number;
          pageSize?: number;
        };
        if (!workspaceId || !userId) {
          throw new Error("workspaceId and userId are required");
        }
        const result = await timeEntries.listTimeEntries(workspaceId, userId, {
          start,
          end,
          description,
          projectId,
          taskId,
          tagIds,
          page,
          pageSize,
        });
        return {
          content: [
            {
              type: "text",
              text: JSON.stringify(result, null, 2),
            },
          ],
        };
      }

      case "getTimeEntry": {
        const { workspaceId, timeEntryId } = args as {
          workspaceId: string;
          timeEntryId: string;
        };
        if (!workspaceId || !timeEntryId) {
          throw new Error("workspaceId and timeEntryId are required");
        }
        const result = await timeEntries.getTimeEntry(workspaceId, timeEntryId);
        return {
          content: [
            {
              type: "text",
              text: JSON.stringify(result, null, 2),
            },
          ],
        };
      }

      case "createTimeEntry": {
        const { workspaceId, start, end, description, projectId, taskId, tagIds, billable } = args as {
          workspaceId: string;
          start: string;
          end?: string;
          description?: string;
          projectId?: string;
          taskId?: string;
          tagIds?: string[];
          billable?: boolean;
        };
        if (!workspaceId || !start) {
          throw new Error("workspaceId and start are required");
        }
        const entryData: {
          start: string;
          end?: string;
          description?: string;
          projectId?: string;
          taskId?: string;
          tagIds?: string[];
          billable?: boolean;
        } = { start };
        if (end) entryData.end = end;
        if (description) entryData.description = description;
        if (projectId) entryData.projectId = projectId;
        if (taskId) entryData.taskId = taskId;
        if (tagIds) entryData.tagIds = tagIds;
        if (billable !== undefined) entryData.billable = billable;

        const result = await timeEntries.createTimeEntry(workspaceId, entryData);
        return {
          content: [
            {
              type: "text",
              text: JSON.stringify(result, null, 2),
            },
          ],
        };
      }

      case "updateTimeEntry": {
        const { workspaceId, timeEntryId, start, end, description, projectId, taskId, tagIds, billable } = args as {
          workspaceId: string;
          timeEntryId: string;
          start?: string;
          end?: string;
          description?: string;
          projectId?: string;
          taskId?: string;
          tagIds?: string[];
          billable?: boolean;
        };
        if (!workspaceId || !timeEntryId) {
          throw new Error("workspaceId and timeEntryId are required");
        }
        const updates: {
          start?: string;
          end?: string;
          description?: string;
          projectId?: string;
          taskId?: string;
          tagIds?: string[];
          billable?: boolean;
        } = {};
        if (start) updates.start = start;
        if (end !== undefined) updates.end = end;
        if (description !== undefined) updates.description = description;
        if (projectId !== undefined) updates.projectId = projectId;
        if (taskId !== undefined) updates.taskId = taskId;
        if (tagIds) updates.tagIds = tagIds;
        if (billable !== undefined) updates.billable = billable;

        const result = await timeEntries.updateTimeEntry(workspaceId, timeEntryId, updates);
        return {
          content: [
            {
              type: "text",
              text: JSON.stringify(result, null, 2),
            },
          ],
        };
      }

      case "deleteTimeEntry": {
        const { workspaceId, timeEntryId } = args as {
          workspaceId: string;
          timeEntryId: string;
        };
        if (!workspaceId || !timeEntryId) {
          throw new Error("workspaceId and timeEntryId are required");
        }
        await timeEntries.deleteTimeEntry(workspaceId, timeEntryId);
        return {
          content: [
            {
              type: "text",
              text: JSON.stringify({ success: true, message: "Time entry deleted" }, null, 2),
            },
          ],
        };
      }

      case "bulkUpdateTimeEntries": {
        const { workspaceId, timeEntryIds, start, end, description, projectId, taskId, tagIds, billable } = args as {
          workspaceId: string;
          timeEntryIds: string[];
          start?: string;
          end?: string;
          description?: string;
          projectId?: string;
          taskId?: string;
          tagIds?: string[];
          billable?: boolean;
        };
        if (!workspaceId || !timeEntryIds || timeEntryIds.length === 0) {
          throw new Error("workspaceId and timeEntryIds are required");
        }
        const updates: {
          start?: string;
          end?: string;
          description?: string;
          projectId?: string;
          taskId?: string;
          tagIds?: string[];
          billable?: boolean;
        } = {};
        if (start) updates.start = start;
        if (end !== undefined) updates.end = end;
        if (description !== undefined) updates.description = description;
        if (projectId !== undefined) updates.projectId = projectId;
        if (taskId !== undefined) updates.taskId = taskId;
        if (tagIds) updates.tagIds = tagIds;
        if (billable !== undefined) updates.billable = billable;

        const result = await timeEntries.bulkUpdateTimeEntries(workspaceId, timeEntryIds, updates);
        return {
          content: [
            {
              type: "text",
              text: JSON.stringify(result, null, 2),
            },
          ],
        };
      }

      case "bulkDeleteTimeEntries": {
        const { workspaceId, timeEntryIds } = args as {
          workspaceId: string;
          timeEntryIds: string[];
        };
        if (!workspaceId || !timeEntryIds || timeEntryIds.length === 0) {
          throw new Error("workspaceId and timeEntryIds are required");
        }
        await timeEntries.bulkDeleteTimeEntries(workspaceId, timeEntryIds);
        return {
          content: [
            {
              type: "text",
              text: JSON.stringify({ success: true, message: `${timeEntryIds.length} time entries deleted` }, null, 2),
            },
          ],
        };
      }

      // Timer tools
      case "startTimer": {
        const { workspaceId, description, projectId, taskId, tagIds, billable } = args as {
          workspaceId: string;
          description?: string;
          projectId?: string;
          taskId?: string;
          tagIds?: string[];
          billable?: boolean;
        };
        if (!workspaceId) {
          throw new Error("workspaceId is required");
        }
        const timerData: {
          description?: string;
          projectId?: string;
          taskId?: string;
          tagIds?: string[];
          billable?: boolean;
        } = {};
        if (description) timerData.description = description;
        if (projectId) timerData.projectId = projectId;
        if (taskId) timerData.taskId = taskId;
        if (tagIds) timerData.tagIds = tagIds;
        if (billable !== undefined) timerData.billable = billable;

        const result = await timer.startTimer(workspaceId, timerData);
        return {
          content: [
            {
              type: "text",
              text: JSON.stringify(result, null, 2),
            },
          ],
        };
      }

      case "stopTimer": {
        const { workspaceId, userId } = args as {
          workspaceId: string;
          userId: string;
        };
        if (!workspaceId || !userId) {
          throw new Error("workspaceId and userId are required");
        }
        const result = await timer.stopTimer(workspaceId, userId);
        return {
          content: [
            {
              type: "text",
              text: JSON.stringify(result, null, 2),
            },
          ],
        };
      }

      case "getActiveTimer": {
        const { workspaceId, userId } = args as {
          workspaceId: string;
          userId: string;
        };
        if (!workspaceId || !userId) {
          throw new Error("workspaceId and userId are required");
        }
        const result = await timer.getActiveTimer(workspaceId, userId);
        return {
          content: [
            {
              type: "text",
              text: JSON.stringify(result || { message: "No active timer" }, null, 2),
            },
          ],
        };
      }

      default:
        throw new Error(`Unknown tool: ${name}`);
    }
  } catch (error) {
    const errorMessage =
      error instanceof Error ? error.message : "Unknown error occurred";
    return {
      content: [
        {
          type: "text",
          text: JSON.stringify({ error: errorMessage }, null, 2),
        },
      ],
      isError: true,
    };
  }
}

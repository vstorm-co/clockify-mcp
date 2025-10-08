# AGENTS.md - AI Agent Development Context

This document provides context for AI agents (like Claude Code, Cursor, or other LLM-powered development tools) working on the Clockify MCP Server codebase.

## Project Overview

**Project Name:** Clockify MCP Server - Feature-Rich Edition
**Purpose:** Comprehensive Model Context Protocol (MCP) server providing full CRUD operations for Clockify API
**Language:** TypeScript
**Runtime:** Node.js 20+
**Architecture:** STDIO-based MCP server using `@modelcontextprotocol/sdk`

## Key Design Decisions

### 1. Architecture Pattern
- **Modular API Layer:** Each Clockify resource has its own API module (`src/api/*.ts`)
- **Centralized Routing:** Tool registration and routing happens in `handlers.ts`
- **Type Safety:** Full TypeScript interfaces for all Clockify API models in `types/clockify.ts`
- **Single Client:** Shared `clockifyFetch()` wrapper in `api/client.ts` handles authentication and base URL

### 2. Tool Naming Convention
Follow these patterns for consistency:
- `list*` - Get multiple items (e.g., `listProjects`, `listClients`)
- `get*` - Get single item details (e.g., `getProject`, `getWorkspace`)
- `create*` - Create new resource (e.g., `createClient`, `createTask`)
- `update*` - Modify existing resource (e.g., `updateProject`, `updateTag`)
- `delete*` - Remove resource (e.g., `deleteClient`, `deleteTask`)
- `start*` / `stop*` - Timer operations (e.g., `startTimer`, `stopTimer`)
- `bulk*` - Batch operations (e.g., `bulkUpdateTimeEntries`)

### 3. Response Format
All MCP tool responses follow this pattern:
```typescript
{
  content: [
    {
      type: "text",
      text: JSON.stringify(result, null, 2)
    }
  ]
}
```

For errors:
```typescript
{
  content: [
    {
      type: "text",
      text: JSON.stringify({ error: errorMessage }, null, 2)
    }
  ],
  isError: true
}
```

### 4. API Client Pattern
The `clockifyFetch()` helper:
- Automatically adds `X-Api-Key` header from environment variable
- Prefixes all paths with base URL (`https://api.clockify.me/api/v1`)
- Handles JSON parsing and error responses
- Returns typed responses via generics

## File Organization

```
src/
├── index.ts              # MCP server initialization (STDIO transport)
├── handlers.ts           # Tool registration & routing (listToolsHandler, callToolHandler)
├── api/                  # Clockify API operations
│   ├── client.ts         # Shared API client with clockifyFetch()
│   ├── workspaces.ts     # Workspace CRUD
│   ├── clients.ts        # Client CRUD
│   ├── projects.ts       # Project CRUD
│   ├── tasks.ts          # Task CRUD
│   ├── tags.ts           # Tag CRUD
│   ├── timeEntries.ts    # Time entry CRUD + bulk operations
│   └── timer.ts          # Timer start/stop/get active
└── types/
    └── clockify.ts       # TypeScript interfaces for all Clockify models
```

## Adding New Tools

To add a new MCP tool:

1. **Add API function** in appropriate `src/api/*.ts` file:
   ```typescript
   export async function operationName(
     workspaceId: string,
     data: DataType
   ): Promise<ResultType> {
     return clockifyFetch<ResultType>('/endpoint', {
       method: 'POST',
       body: JSON.stringify(data)
     });
   }
   ```

2. **Register tool schema** in `handlers.ts` → `listToolsHandler()`:
   ```typescript
   {
     name: "toolName",
     description: "What this tool does",
     inputSchema: {
       type: "object",
       properties: {
         workspaceId: { type: "string", description: "..." },
         // ... other parameters
       },
       required: ["workspaceId"]
     }
   }
   ```

3. **Add route handler** in `handlers.ts` → `callToolHandler()`:
   ```typescript
   case "toolName": {
     const { workspaceId, param } = args as {
       workspaceId: string;
       param: string;
     };
     if (!workspaceId) {
       throw new Error("workspaceId is required");
     }
     const result = await module.operationName(workspaceId, param);
     return {
       content: [{ type: "text", text: JSON.stringify(result, null, 2) }]
     };
   }
   ```

4. **Add types** in `types/clockify.ts` if needed

## Common Patterns

### Optional Parameters Pattern
```typescript
// In API function signature
options?: {
  archived?: boolean;
  name?: string;
  page?: number;
  pageSize?: number;
}

// Building query params
const params = new URLSearchParams();
if (options?.archived !== undefined) {
  params.append("archived", options.archived.toString());
}
```

### Update Operations Pattern
```typescript
// Allow partial updates via optional properties
export async function updateResource(
  workspaceId: string,
  resourceId: string,
  updates: {
    name?: string;
    archived?: boolean;
    // ... other optional fields
  }
): Promise<Resource> {
  return clockifyFetch<Resource>(`/endpoint/${resourceId}`, {
    method: 'PUT',
    body: JSON.stringify(updates)
  });
}
```

### Delete Operations Pattern
```typescript
// Return void, handler wraps in success message
export async function deleteResource(
  workspaceId: string,
  resourceId: string
): Promise<void> {
  await clockifyFetch<void>(`/endpoint/${resourceId}`, {
    method: 'DELETE'
  });
}

// In handler:
await module.deleteResource(workspaceId, resourceId);
return {
  content: [{
    type: "text",
    text: JSON.stringify({ success: true, message: "Resource deleted" }, null, 2)
  }]
};
```

## Testing

### MCP Inspector
Run `npm run inspector` to test tools interactively before deploying to Claude Desktop.

### Manual Testing Scripts
- `src/test-create.ts` - Create test resources (client, project, task, tag)
- `src/test-cleanup.ts` - Clean up test resources

Run with: `npm run test:create` or `npm run test:cleanup`

## Environment Variables

- `CLOCKIFY_API_KEY` - **Required.** Clockify API key for authentication
  - Obtain from: Clockify → Profile → API section
  - Set in MCP client config (Claude Desktop, VSCode, etc.)

## API Rate Limits

Clockify enforces **50 requests/second**. Consider this when:
- Implementing bulk operations (prefer single bulk endpoint over loops)
- Listing large datasets (use pagination parameters)
- Performing mass updates (use `bulkUpdateTimeEntries` instead of individual updates)

## Development Workflow

1. **Make changes** in TypeScript source files
2. **Build:** `npm run build`
3. **Test:** `npm run inspector` or direct Claude Desktop testing
4. **Lint:** `npm run lint:fix` before committing

### Watch Mode for Active Development
```bash
npm run watch  # Auto-rebuild on file changes
```

## TypeScript Configuration

- **Target:** ES2020
- **Module:** ESNext with `.js` extensions in imports (required for Node.js ESM)
- **Strict mode:** Enabled for type safety
- **Output:** `build/` directory

## Common Gotchas

1. **Import Extensions:** Always use `.js` in imports (even for `.ts` files):
   ```typescript
   import { clockifyFetch } from "./client.js";  // ✅ Correct
   import { clockifyFetch } from "./client";     // ❌ Wrong
   ```

2. **Type Names:** Use Clockify's type naming from `types/clockify.ts`:
   - `CreateTimeEntryRequest` not `TimeEntryCreateRequest`
   - `UpdateClientRequest` not `ClientUpdateRequest`

3. **Workspace ID Required:** Almost all operations require `workspaceId` as first parameter

4. **ISO 8601 Dates:** Clockify expects ISO 8601 format:
   ```typescript
   new Date().toISOString()  // "2025-01-08T10:30:00.000Z"
   ```

5. **Timer vs Time Entry:**
   - Running timer = time entry without end date
   - Completed time entry = has both start and end dates

## Reference Implementation

Original MCP implementation: https://github.com/inakianduaga/clockify-mcp

Key differences in this edition:
- ✅ Full CRUD operations (original was mostly read-only)
- ✅ Modular architecture (original had everything in handlers.ts)
- ✅ Comprehensive type safety (original had minimal types)
- ✅ Timer operations (start/stop/get active)
- ✅ Bulk operations for time entries
- ✅ Client, Task, and Tag management (not in original)

## Future Enhancement Ideas

Marked as "On Request Only" in [Plan.md](Plan.md):
- User & Team Management (user settings, user groups)
- Summary Reports (from reference implementation)
- User listing (from reference implementation)
- Custom fields management
- Webhooks integration
- Schedules and time-off
- Advanced reporting features

## Helpful Resources

- **Clockify API Docs:** https://docs.developer.clockify.me/
- **MCP Specification:** https://modelcontextprotocol.io/
- **MCP SDK:** https://github.com/modelcontextprotocol/typescript-sdk
- **TypeScript Handbook:** https://www.typescriptlang.org/docs/

## Agent Best Practices

When working on this codebase:
1. ✅ Always maintain type safety - add types to `types/clockify.ts`
2. ✅ Follow existing naming conventions for tools and functions
3. ✅ Test with MCP Inspector before deploying
4. ✅ Keep API modules focused (one resource per file)
5. ✅ Document complex operations with JSDoc comments
6. ✅ Handle errors gracefully with clear messages
7. ✅ Use optional parameters for flexibility
8. ✅ Build after changes (`npm run build`)
9. ✅ Lint before committing (`npm run lint:fix`)

## Questions or Issues?

When encountering issues:
1. Check [Plan.md](Plan.md) for original design decisions
2. Review [README.md](README.md) for setup and usage
3. Test with `npm run inspector` to isolate MCP vs API issues
4. Verify Clockify API behavior at https://docs.developer.clockify.me/

# GitHub Copilot Instructions for Clockify MCP Server

This file provides context and guidelines for GitHub Copilot (and other AI coding assistants) when working on this codebase.

## Project Context

You are working on **Clockify MCP Server - Feature-Rich Edition**, a comprehensive Model Context Protocol (MCP) server that provides full CRUD operations for the Clockify API. This server enables LLMs like Claude to manage Clockify workspaces, clients, projects, tasks, tags, and time tracking.

**Key Technologies:**
- TypeScript (ES2020, ESNext modules)
- Node.js 20+
- MCP SDK v0.6.0 (`@modelcontextprotocol/sdk`)
- STDIO transport for Claude Desktop/VSCode integration

## Architecture Overview

### File Organization
```
src/
├── index.ts              # MCP server initialization
├── handlers.ts           # Tool registration & routing
├── api/                  # Clockify API operations (one file per resource)
│   ├── client.ts         # Shared clockifyFetch() wrapper
│   ├── workspaces.ts
│   ├── clients.ts
│   ├── projects.ts
│   ├── tasks.ts
│   ├── tags.ts
│   ├── timeEntries.ts
│   └── timer.ts
└── types/
    └── clockify.ts       # All TypeScript interfaces
```

### Key Patterns

1. **API Client Pattern:**
   - All API calls go through `clockifyFetch()` in `api/client.ts`
   - Automatically adds authentication headers
   - Returns typed responses via generics

2. **Tool Naming Convention:**
   - `list*` - Get multiple items
   - `get*` - Get single item
   - `create*` - Create resource
   - `update*` - Modify resource
   - `delete*` - Remove resource
   - `start*/stop*` - Timer operations
   - `bulk*` - Batch operations

3. **Response Format:**
   ```typescript
   return {
     content: [{ type: "text", text: JSON.stringify(result, null, 2) }]
   };
   ```

## Coding Guidelines

### DO:
✅ Use TypeScript strict mode - all functions must be typed
✅ Import with `.js` extensions (ESM requirement): `from "./client.js"`
✅ Add types to `types/clockify.ts` for new Clockify API models
✅ Follow existing naming conventions for tools and functions
✅ Use optional parameters for flexibility
✅ Document complex operations with JSDoc
✅ Handle errors gracefully with clear messages
✅ Test with `npm run inspector` before committing
✅ Run `npm run lint:fix` before committing

### DON'T:
❌ Import without `.js` extensions
❌ Add logic to `index.ts` (keep it as MCP server setup only)
❌ Put API operations in `handlers.ts` (use `api/*.ts` modules)
❌ Use `any` type (prefer `unknown` or specific types)
❌ Add required parameters to existing tools (breaking change)
❌ Forget to build after changes (`npm run build`)
❌ Skip validation of required parameters in handlers

## Adding New MCP Tools

Follow these steps when adding a new tool:

### 1. Create API Function (in appropriate `api/*.ts` file)
```typescript
/**
 * Brief description of what this does
 */
export async function operationName(
  workspaceId: string,
  data: RequestType
): Promise<ResponseType> {
  return clockifyFetch<ResponseType>('/api/endpoint', {
    method: 'POST',
    body: JSON.stringify(data),
  });
}
```

### 2. Register Tool Schema (in `handlers.ts` → `listToolsHandler()`)
```typescript
{
  name: "toolName",
  description: "Clear description of what this tool does",
  inputSchema: {
    type: "object",
    properties: {
      workspaceId: {
        type: "string",
        description: "The workspace ID",
      },
      // ... other parameters with descriptions
    },
    required: ["workspaceId"],
  },
}
```

### 3. Add Route Handler (in `handlers.ts` → `callToolHandler()`)
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
    content: [
      {
        type: "text",
        text: JSON.stringify(result, null, 2),
      },
    ],
  };
}
```

### 4. Add TypeScript Types (if needed)
Add to `types/clockify.ts`:
```typescript
export interface ResourceName {
  id: string;
  name: string;
  // ... other fields
}

export interface CreateResourceRequest {
  name: string;
  // ... other fields
}
```

## Common Patterns to Follow

### Optional Parameters Pattern
```typescript
options?: {
  archived?: boolean;
  name?: string;
  page?: number;
}

// In implementation:
const params = new URLSearchParams();
if (options?.archived !== undefined) {
  params.append("archived", options.archived.toString());
}
```

### Update Operations Pattern
```typescript
// Use partial updates with optional properties
updates: {
  name?: string;
  archived?: boolean;
}
```

### Delete Operations Pattern
```typescript
// API function returns void
export async function deleteResource(...): Promise<void> {
  await clockifyFetch<void>('/endpoint', { method: 'DELETE' });
}

// Handler wraps in success message
return {
  content: [{
    type: "text",
    text: JSON.stringify({ success: true, message: "Resource deleted" }, null, 2)
  }]
};
```

## Important Gotchas

1. **Import Extensions:** Always use `.js` in imports even for `.ts` files
2. **Type Names:** Match Clockify types exactly (e.g., `CreateTimeEntryRequest` not `TimeEntryCreateRequest`)
3. **Workspace ID:** Almost all operations require `workspaceId`
4. **ISO 8601 Dates:** Use `new Date().toISOString()`
5. **Rate Limits:** Clockify enforces 50 requests/second

## Testing Workflow

1. Make changes to TypeScript files
2. Build: `npm run build`
3. Test: `npm run inspector` (MCP Inspector UI)
4. Or test directly in Claude Desktop (restart required)
5. Lint: `npm run lint:fix`

## Documentation Requirements

When adding features, update:
- [ ] JSDoc comments for new functions
- [ ] `README.md` if adding user-facing tools
- [ ] `AGENTS.md` if changing architecture patterns
- [ ] This file if introducing new patterns

## Clockify API Reference

- **Base URL:** `https://api.clockify.me/api/v1`
- **Auth:** `X-Api-Key` header
- **Docs:** https://docs.developer.clockify.me/
- **Rate Limit:** 50 requests/second

## Quick Reference

### Most Common Tasks

**Add a new list operation:**
```typescript
// api/resource.ts
export async function listResources(workspaceId: string): Promise<Resource[]> {
  return clockifyFetch<Resource[]>(`/workspaces/${workspaceId}/resources`);
}
```

**Add optional filtering:**
```typescript
options?: {
  archived?: boolean;
  name?: string;
}

const params = new URLSearchParams();
if (options?.archived !== undefined) params.append("archived", String(options.archived));
if (options?.name) params.append("name", options.name);
```

**Add a create operation:**
```typescript
export async function createResource(
  workspaceId: string,
  data: CreateResourceRequest
): Promise<Resource> {
  return clockifyFetch<Resource>(`/workspaces/${workspaceId}/resources`, {
    method: "POST",
    body: JSON.stringify(data),
  });
}
```

## Questions?

- Review [AGENTS.md](../AGENTS.md) for detailed development context
- Check [Plan.md](../Plan.md) for original design decisions
- See [README.md](../README.md) for user-facing documentation
- Consult Clockify API docs: https://docs.developer.clockify.me/

## Current Scope

✅ **Implemented (33 tools):**
- Workspace, Client, Project, Task, Tag CRUD
- Time entry CRUD + bulk operations
- Timer operations (start/stop/get active)

📋 **Future Enhancements (on request):**
- User & team management
- Summary reports (from reference impl)
- Custom fields
- Webhooks
- Advanced reporting

---

**Remember:** This is a production MCP server used by real users. Maintain backward compatibility, test thoroughly, and prioritize clarity over cleverness.

# Clockify MCP Server - Feature-Rich Implementation Plan

## Overview
Build a comprehensive STDIO MCP server for Clockify API integration, expanding beyond the reference implementation's read-only + basic time entry capabilities to support full CRUD operations across all major Clockify features.

## Reference Implementation Analysis
**Location**: `C:\Work\community\ClockifyTools\ReferenceMCP`

**Current Capabilities**:
- Read-only: Projects, Users, Time Entries (by user/date)
- Write: Add time entries
- Reporting: Summary reports with user/project grouping
- Architecture: STDIO transport, TypeScript, MCP SDK 0.6.0

**Limitations**:
- No client management
- No task CRUD operations
- No tag management
- No workspace configuration
- No time entry updates/deletes
- No timer start/stop functionality
- No custom fields
- No webhooks
- No user group management

## API Documentation Source
https://docs.developer.clockify.me/

**Rate Limit**: 50 requests/second

## Technology Stack
- **Transport**: STDIO (for easy Claude Desktop & VSCode integration)
- **Runtime**: Node.js with TypeScript
- **MCP SDK**: `@modelcontextprotocol/sdk` (0.6.0+)
- **Authentication**: API key via environment variable (`CLOCKIFY_API_KEY`)
- **Base URL**: `https://api.clockify.me/api/v1`

## Feature Categories & Implementation Priority

### Phase 1: Core CRUD Operations (Foundational)
Expand beyond reference implementation with full create/update/delete capabilities.

#### 1.1 Workspace Management
- **List workspaces** (existing pattern from reference)
- **Get workspace details** (read-only)
- **Update workspace settings** (name, rounding, time tracking mode)
- Tools: `listWorkspaces`, `getWorkspace`, `updateWorkspace`

#### 1.2 Client Management (NEW)
- **List clients** with filtering (archived, name search)
- **Create client** (name, address, note)
- **Update client** (modify details, archive/unarchive)
- **Delete client**
- Tools: `listClients`, `createClient`, `updateClient`, `deleteClient`

#### 1.3 Project Management (ENHANCED)
Reference only has read-only `listProjects`. Add:
- **Get single project details**
- **Create project** (name, clientId, color, billable settings)
- **Update project** (details, budget, time estimate)
- **Delete/archive project**
- Tools: `getProject`, `createProject`, `updateProject`, `deleteProject`

#### 1.4 Task Management (NEW)
- **List tasks** for a project
- **Create task** (name, project, estimate)
- **Update task** (status, estimate, assignment)
- **Delete task**
- Tools: `listTasks`, `createTask`, `updateTask`, `deleteTask`

#### 1.5 Tag Management (NEW)
- **List tags** in workspace
- **Create tag** (name, color)
- **Update tag**
- **Delete tag**
- Tools: `listTags`, `createTag`, `updateTag`, `deleteTag`

### Phase 2: Enhanced Time Tracking
Build on reference's `addTimeEntry` with full lifecycle management.

#### 2.1 Time Entry CRUD (ENHANCED)
Reference has create + list. Add:
- **Update time entry** (change project, task, description, times)
- **Delete time entry**
- **Duplicate time entry**
- Tools: `updateTimeEntry`, `deleteTimeEntry`, `duplicateTimeEntry`

#### 2.2 Timer Operations (NEW)
- **Start timer** (running time entry)
- **Stop active timer**
- **Get currently running timer**
- Tools: `startTimer`, `stopTimer`, `getActiveTimer`

#### 2.3 Bulk Operations (NEW)
- **Bulk update** time entries (change project/task for multiple)
- **Bulk delete** time entries
- Tools: `bulkUpdateTimeEntries`, `bulkDeleteTimeEntries`

### Future Phases (Deferred - On Request Only)

#### User & Team Management
- User settings, user groups

#### Advanced Features
- Custom fields, webhooks, schedules, time off, advanced reporting

## Architecture Design

### Project Structure
```
clockify-mcp/
├── src/
│   ├── index.ts              # MCP server setup (STDIO transport)
│   ├── handlers.ts           # Tool handler routing
│   ├── api/
│   │   ├── client.ts         # Clockify API client wrapper
│   │   ├── workspaces.ts     # Workspace operations
│   │   ├── clients.ts        # Client CRUD
│   │   ├── projects.ts       # Project CRUD
│   │   ├── tasks.ts          # Task CRUD
│   │   ├── tags.ts           # Tag CRUD
│   │   ├── timeEntries.ts    # Time entry operations
│   │   ├── timer.ts          # Timer start/stop
│   │   ├── users.ts          # User operations (from reference)
│   │   └── reports.ts        # Reporting (from reference)
│   ├── types/
│   │   └── clockify.ts       # TypeScript interfaces for API
│   └── utils/
│       ├── validation.ts     # Input validation
│       └── errors.ts         # Error handling
├── test/
│   └── *.test.ts             # Vitest test suite
├── package.json
├── tsconfig.json
└── README.md
```

### Core Patterns (from Reference)
1. **API Client**: Centralized `clockifyFetch()` helper with auth headers
2. **Environment Config**: `CLOCKIFY_API_KEY` from MCP settings
3. **Tool Registration**: `listToolsHandler()` returns all available tools
4. **Tool Execution**: `callToolHandler()` routes by tool name
5. **Response Format**: `{ content: [{ type: "text", text: JSON.stringify(...) }] }`

### Enhancements Over Reference
1. **Modular API Layer**: Separate files per resource (not all in handlers.ts)
2. **Type Safety**: Full TypeScript interfaces for Clockify API models
3. **Error Handling**: Consistent error messages + validation
4. **Input Validation**: Schema-based validation before API calls
5. **Pagination Support**: Handle paginated endpoints (clients, projects, time entries)
6. **Caching Strategy**: Optional workspace/user info caching to reduce API calls

## Tool Naming Convention
Follow reference pattern of camelCase verbs:
- `list*` - Get multiple items (listProjects, listClients)
- `get*` - Get single item details (getProject, getWorkspace)
- `create*` - Create new resource (createClient, createTask)
- `update*` - Modify existing resource (updateProject, updateTag)
- `delete*` - Remove resource (deleteClient, deleteTask)
- `start*` / `stop*` - Timer operations (startTimer, stopTimer)
- `bulk*` - Batch operations (bulkUpdateTimeEntries)

## Implementation Scope

### Complete Implementation (Phase 1 + 2 from above)
**Goal**: Full CRUD operations for core Clockify resources + enhanced time tracking
**Tools**: ~25-30 tools
- Workspace, Client, Project, Task, Tag CRUD operations
- Time entry CRUD, timer operations, bulk operations
- Maintain existing tools from reference (listUsers, getSummaryReport, etc.)
**Deliverable**: Production-ready MCP server for day-to-day time tracking + setup management

### Future Enhancements (On Request)
- User/team management, custom fields, webhooks, schedules, advanced reporting

## Success Criteria
1. **STDIO Transport**: Works with Claude Desktop & VSCode MCP configs
2. **Comprehensive Coverage**: All major Clockify API categories implemented
3. **Type Safety**: Full TypeScript types for all API models
4. **Error Handling**: Clear error messages for API failures + validation
5. **Testing**: Vitest test coverage for all tools
6. **Documentation**: README with setup + tool usage examples
7. **Backward Compatible**: Maintains reference implementation's tool names where applicable

## Configuration Example (Claude Desktop)
```json
{
  "mcpServers": {
    "clockify": {
      "command": "node",
      "args": ["C:\\Work\\community\\ClockifyTools\\clockify-mcp\\build\\index.js"],
      "env": {
        "CLOCKIFY_API_KEY": "your-api-key-here"
      }
    }
  }
}
```

## Next Steps
1. Initialize project structure in `clockify-mcp/` folder
2. Set up package.json + tsconfig.json (mirroring reference)
3. Implement core CRUD + enhanced time tracking features
4. Test with MCP Inspector + Claude Desktop
5. Deploy for production use

## Notes
- Reference implementation has good patterns: reuse STDIO setup, tool schema format, API client approach
- Focus on write operations (reference is mostly read-only)
- Consider adding optional parameters for pagination (page size, page number)
- May need to handle API rate limits (50 req/sec) with queuing for bulk operations
- Clockify API uses ISO8601 dates - keep this consistent across all tools

# Clockify MCP Server - Feature-Rich Edition

[![Install with NPX - VS Code](https://img.shields.io/badge/Install%20with%20NPX-VS%20Code-0078d4?style=for-the-badge&logo=visual-studio-code)](https://vscode.dev/redirect/mcp/install?name=clockify-mcp&config={"type":"stdio","command":"npx","args":["@jeremyvyska/clockify-mcp"]})

A comprehensive MCP (Model Context Protocol) server for Clockify API integration, providing full CRUD operations across all major Clockify features. This server enables LLMs like Claude to manage your entire Clockify workspace - from workspaces and clients to projects, tasks, tags, and time tracking.

## Features

### Workspace Management
- **listWorkspaces** - List all accessible workspaces
- **getWorkspace** - Get workspace details
- **updateWorkspace** - Update workspace settings

### Client Management
- **listClients** - List clients with filtering (archived, name search)
- **createClient** - Create new client
- **updateClient** - Update client details, archive/unarchive
- **deleteClient** - Delete client

### Project Management
- **listProjects** - List projects with filtering (archived, name, client)
- **getProject** - Get single project details
- **createProject** - Create new project with client, color, billable settings
- **updateProject** - Update project details, budget, time estimate
- **deleteProject** - Delete/archive project

### Task Management
- **listTasks** - List tasks for a project
- **createTask** - Create task with name, estimate, assignments
- **updateTask** - Update task status, estimate, assignments
- **deleteTask** - Delete task

### Tag Management
- **listTags** - List tags in workspace
- **createTag** - Create new tag
- **updateTag** - Update tag name, archive/unarchive
- **deleteTag** - Delete tag

### Time Entry Management
- **listTimeEntries** - List time entries with filtering (date range, project, task, tags)
- **getTimeEntry** - Get specific time entry details
- **createTimeEntry** - Create completed time entry
- **updateTimeEntry** - Update existing time entry
- **deleteTimeEntry** - Delete time entry
- **bulkUpdateTimeEntries** - Update multiple time entries at once
- **bulkDeleteTimeEntries** - Delete multiple time entries at once

### Timer Operations
- **startTimer** - Start a new running timer
- **stopTimer** - Stop the currently running timer
- **getActiveTimer** - Get current running timer (if any)

**Total: 33 tools** covering all major Clockify operations

## Quick Start

### Prerequisites
- Node.js 20+ installed
- Clockify API key ([how to obtain](#how-to-obtain-a-clockify-api-key))

### Installation

1. Clone this repository:
```bash
git clone https://github.com/yourusername/clockify-mcp.git
cd clockify-mcp
```

2. Install dependencies:
```bash
npm install
```

3. Build the project:
```bash
npm run build
```

### Configuration

#### For Claude Desktop

Add to your Claude Desktop config file:

**macOS:** `~/Library/Application Support/Claude/claude_desktop_config.json`
**Windows:** `%APPDATA%\Claude\claude_desktop_config.json`

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

#### For VSCode with MCP Extension

Add to your VSCode MCP settings:

```json
{
  "mcpServers": {
    "clockify": {
      "command": "node",
      "args": ["/absolute/path/to/clockify-mcp/build/index.js"],
      "env": {
        "CLOCKIFY_API_KEY": "your-api-key-here"
      }
    }
  }
}
```

### Testing with MCP Inspector

Test the server before integrating with Claude:

```bash
npm run inspector
```

This launches the MCP Inspector UI where you can test all tools interactively.

## How to Obtain a Clockify API Key

1. Log in to your [Clockify account](https://clockify.me/login)
2. Click on your profile icon (top right) → **Profile settings**
3. Scroll to the **API** section
4. Click **Generate** to create a new API key, or copy your existing key

## Usage Examples

Once configured, you can ask Claude things like:

**Workspace Setup:**
- "List all my Clockify workspaces"
- "Create a new client called 'Acme Corp' with address '123 Main St'"
- "Create a project 'Website Redesign' for client Acme Corp"

**Task Management:**
- "Add a task 'Design homepage mockup' to the Website Redesign project"
- "List all active tasks for the Website Redesign project"
- "Mark the homepage mockup task as done"

**Time Tracking:**
- "Start a timer for the Website Redesign project"
- "What's my active timer?"
- "Stop my timer"
- "Show my time entries for today"
- "Create a 2-hour time entry for yesterday on the Website Redesign project"

**Bulk Operations:**
- "Change all my time entries from last week to the Website Redesign project"
- "Delete all my time entries from December 1st"

## Development

### Scripts

- `npm run build` - Compile TypeScript to JavaScript
- `npm run watch` - Watch mode for development
- `npm run inspector` - Test with MCP Inspector
- `npm run lint` - Lint the codebase
- `npm run lint:fix` - Auto-fix linting issues
- `npm test` - Run tests (when implemented)

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
│   │   └── timer.ts          # Timer start/stop
│   └── types/
│       └── clockify.ts       # TypeScript interfaces for API
├── build/                    # Compiled JavaScript (generated)
├── package.json
├── tsconfig.json
└── README.md
```

### Architecture

- **Transport:** STDIO (for Claude Desktop & VSCode integration)
- **Runtime:** Node.js with TypeScript
- **MCP SDK:** `@modelcontextprotocol/sdk` v0.6.0
- **Authentication:** API key via environment variable
- **API:** Clockify REST API v1 (`https://api.clockify.me/api/v1`)

## API Rate Limits

Clockify API has a rate limit of **50 requests per second**. The bulk operations in this server help you stay under this limit when performing mass updates.

## Troubleshooting

**Server not appearing in Claude Desktop:**
1. Check that the path in your config is absolute, not relative
2. Verify the `CLOCKIFY_API_KEY` environment variable is set
3. Restart Claude Desktop completely
4. Check Claude Desktop logs for errors

**"Unknown tool" errors:**
- Run `npm run build` to ensure latest code is compiled
- Verify you're using the correct workspace ID (use `listWorkspaces` first)

**Authentication errors:**
- Verify your API key is valid (test at https://api.clockify.me/api/v1/user with `X-Api-Key` header)
- Check that the API key has necessary permissions in your workspace

## Contributing

Contributions welcome! Please:
1. Fork the repository
2. Create a feature branch
3. Make your changes with tests
4. Submit a pull request

## License

MIT License - see [LICENSE](LICENSE) file for details

## Acknowledgments

**Thank you** to [@inakianduaga](https://github.com/inakianduaga) for the original [clockify-mcp](https://github.com/inakianduaga/clockify-mcp) implementation. This feature-rich edition builds upon that foundation, expanding from read-only + basic time entry capabilities to full CRUD operations across all major Clockify resources.

The original implementation provided:
- Excellent MCP architecture patterns
- Docker-based deployment
- Summary reporting functionality
- User management

This edition extends it with:
- Full CRUD for clients, projects, tasks, and tags
- Comprehensive time entry management
- Timer operations (start/stop/get active)
- Bulk operations for time entries
- Workspace configuration management
- Enhanced TypeScript type safety
- Modular API layer architecture

Check out the [original repository](https://github.com/inakianduaga/clockify-mcp) for Docker-based deployment and CI/CD examples.

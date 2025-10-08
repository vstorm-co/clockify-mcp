#!/usr/bin/env node

/**
 * Clockify MCP Server
 * Feature-rich MCP server for comprehensive Clockify API integration
 */

import { Server } from "@modelcontextprotocol/sdk/server/index.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import {
  CallToolRequestSchema,
  ListToolsRequestSchema,
} from "@modelcontextprotocol/sdk/types.js";
import process from "node:process";
import { initializeClient } from "./api/client.js";
import { listToolsHandler, callToolHandler } from "./handlers.js";

/**
 * Create an MCP server with capabilities for tools
 */
const server = new Server(
  {
    name: "clockify-mcp",
    version: "0.1.0",
  },
  {
    capabilities: {
      tools: {},
    },
  },
);

/**
 * Handler that lists available tools
 */
server.setRequestHandler(ListToolsRequestSchema, listToolsHandler);

/**
 * Handler for tool execution
 */
server.setRequestHandler(CallToolRequestSchema, callToolHandler);

/**
 * Start the server using stdio transport
 */
async function main() {
  const apiKey = process.env.CLOCKIFY_API_KEY;

  if (!apiKey) {
    throw new Error("CLOCKIFY_API_KEY environment variable is required");
  }

  initializeClient(apiKey);

  console.error("[Setup] Initializing Clockify MCP server...");
  const transport = new StdioServerTransport();
  await server.connect(transport);
  console.error("[Setup] Clockify MCP server running");
}

main().catch((err) => {
  console.error("[Error] MCP server failed to start:", err);
  process.exit(1);
});

export { server };

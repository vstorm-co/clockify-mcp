#!/usr/bin/env node

/**
 * Test script to create test data in Clockify
 * Creates: Client → Project → Task → Tag
 * Saves IDs to test-data.json for later cleanup
 */

import * as fs from "node:fs";
import * as path from "node:path";
import { initializeClient } from "./api/client.js";
import * as workspaces from "./api/workspaces.js";
import * as clients from "./api/clients.js";
import * as projects from "./api/projects.js";
import * as tasks from "./api/tasks.js";
import * as tags from "./api/tags.js";

interface TestData {
  workspaceId: string;
  clientId: string;
  projectId: string;
  taskId: string;
  tagId: string;
}

async function createTestData() {
  console.log("🚀 Starting Clockify MCP Test - CREATE\n");

  // Initialize API client
  const apiKey = process.env.CLOCKIFY_API_KEY;
  if (!apiKey) {
    throw new Error("CLOCKIFY_API_KEY environment variable is required");
  }
  initializeClient(apiKey);

  const testData: Partial<TestData> = {};

  try {
    // 1. Get workspace
    console.log("1️⃣  Fetching workspaces...");
    const workspaceList = await workspaces.listWorkspaces();
    if (workspaceList.length === 0) {
      throw new Error("No workspaces found");
    }
    testData.workspaceId = workspaceList[0].id;
    console.log(`   ✅ Using workspace: ${workspaceList[0].name} (${testData.workspaceId})\n`);

    // 2. Create client
    console.log("2️⃣  Creating test client...");
    const client = await clients.createClient(testData.workspaceId, {
      name: "MCP Test Client",
      address: "123 Test Street, Test City",
      note: "Created by MCP integration test - safe to delete",
    });
    testData.clientId = client.id;
    console.log(`   ✅ Client created: ${client.name} (${client.id})\n`);

    // 3. Create project
    console.log("3️⃣  Creating test project...");
    const project = await projects.createProject(testData.workspaceId, {
      name: "MCP Test Project",
      clientId: testData.clientId,
      isPublic: false,
      billable: true,
      color: "#FF5722",
      note: "Created by MCP integration test - safe to delete",
    });
    testData.projectId = project.id;
    console.log(`   ✅ Project created: ${project.name} (${project.id})\n`);

    // 4. Create task
    console.log("4️⃣  Creating test task...");
    const task = await tasks.createTask(testData.workspaceId, testData.projectId, {
      name: "MCP Test Task",
      projectId: testData.projectId,
      status: "ACTIVE",
      billable: true,
    });
    testData.taskId = task.id;
    console.log(`   ✅ Task created: ${task.name} (${task.id})\n`);

    // 5. Create tag
    console.log("5️⃣  Creating test tag...");
    const tag = await tags.createTag(testData.workspaceId, {
      name: "MCP-Test",
    });
    testData.tagId = tag.id;
    console.log(`   ✅ Tag created: ${tag.name} (${tag.id})\n`);

    // Save test data for cleanup
    const testDataPath = path.join(process.cwd(), "test-data.json");
    fs.writeFileSync(testDataPath, JSON.stringify(testData, null, 2));
    console.log(`💾 Test data saved to: ${testDataPath}\n`);

    console.log("✨ All test resources created successfully!");
    console.log("   → Go verify on Clockify's website");
    console.log("   → Run 'npm run test:cleanup' when ready to delete\n");

  } catch (error) {
    console.error("❌ Error creating test data:", error);

    // Save partial data if we got any IDs before failure
    if (Object.keys(testData).length > 0) {
      const testDataPath = path.join(process.cwd(), "test-data.json");
      fs.writeFileSync(testDataPath, JSON.stringify(testData, null, 2));
      console.log(`💾 Partial test data saved to: ${testDataPath}`);
      console.log("   You can still run cleanup to remove partial data\n");
    }

    process.exit(1);
  }
}

createTestData();

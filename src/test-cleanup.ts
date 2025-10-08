#!/usr/bin/env node

/**
 * Test cleanup script to delete test data from Clockify
 * Deletes in reverse order: Tag → Task → Project → Client
 * Reads IDs from test-data.json
 */

import * as fs from "node:fs";
import * as path from "node:path";
import { initializeClient } from "./api/client.js";
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

async function cleanupTestData() {
  console.log("🧹 Starting Clockify MCP Test - CLEANUP\n");

  // Initialize API client
  const apiKey = process.env.CLOCKIFY_API_KEY;
  if (!apiKey) {
    throw new Error("CLOCKIFY_API_KEY environment variable is required");
  }
  initializeClient(apiKey);

  // Load test data
  const testDataPath = path.join(process.cwd(), "test-data.json");
  if (!fs.existsSync(testDataPath)) {
    console.error("❌ No test-data.json found. Nothing to clean up.");
    console.log("   Run 'npm run test:create' first to create test data.\n");
    process.exit(1);
  }

  const testData: TestData = JSON.parse(fs.readFileSync(testDataPath, "utf-8"));
  console.log("📖 Loaded test data from test-data.json\n");

  let deletedCount = 0;

  try {
    // Delete in reverse order to maintain referential integrity

    // 5. Delete tag
    if (testData.tagId) {
      console.log("5️⃣  Deleting test tag...");
      try {
        await tags.deleteTag(testData.workspaceId, testData.tagId);
        console.log(`   ✅ Tag deleted (${testData.tagId})\n`);
        deletedCount++;
      } catch (error) {
        console.log(`   ⚠️  Tag already deleted or not found\n`);
      }
    }

    // 4. Delete task
    if (testData.taskId && testData.projectId) {
      console.log("4️⃣  Deleting test task...");
      try {
        await tasks.deleteTask(testData.workspaceId, testData.projectId, testData.taskId);
        console.log(`   ✅ Task deleted (${testData.taskId})\n`);
        deletedCount++;
      } catch (error) {
        console.log(`   ⚠️  Task already deleted or not found\n`);
      }
    }

    // 3. Delete project
    if (testData.projectId) {
      console.log("3️⃣  Deleting test project...");
      try {
        await projects.deleteProject(testData.workspaceId, testData.projectId);
        console.log(`   ✅ Project deleted (${testData.projectId})\n`);
        deletedCount++;
      } catch (error) {
        console.log(`   ⚠️  Project already deleted or not found\n`);
      }
    }

    // 2. Delete client
    if (testData.clientId) {
      console.log("2️⃣  Deleting test client...");
      try {
        await clients.deleteClient(testData.workspaceId, testData.clientId);
        console.log(`   ✅ Client deleted (${testData.clientId})\n`);
        deletedCount++;
      } catch (error) {
        console.log(`   ⚠️  Client already deleted or not found\n`);
      }
    }

    // Remove test data file
    fs.unlinkSync(testDataPath);
    console.log(`🗑️  Removed test-data.json\n`);

    console.log(`✨ Cleanup complete! Deleted ${deletedCount} resource(s).\n`);

  } catch (error) {
    console.error("❌ Error during cleanup:", error);
    console.log("\n💡 Tip: You may need to manually delete remaining resources from Clockify\n");
    process.exit(1);
  }
}

cleanupTestData();

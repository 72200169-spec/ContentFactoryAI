import { DatabaseService } from "./database/database.js";
import { logger } from "./services/logger.service.js";
import fs from "node:fs";

function testDatabase(): void {
  logger.info("Starting database smoke test...");

  const testDbPath = "data/test-smoke.db";
  const db = new DatabaseService(testDbPath);

  try {
    db.open();
    db.initialize();

    if (!db.isConnected()) {
      logger.error("Database connection failed");
      process.exit(1);
    }
    logger.info("1. SQLite opened correctly: PASS");

    const database = db.getDb();

    const insertProject = database.prepare(
      "INSERT INTO projects (name, genre, language, target_duration, status) VALUES (?, ?, ?, ?, ?)"
    );

    const result = insertProject.run(
      "Test Project",
      "educational",
      "es",
      60,
      "idea"
    );
    const projectId = result.lastInsertRowid;
    logger.info(`2. Insert project (ID: ${projectId}): PASS`);

    const project = database.prepare("SELECT * FROM projects WHERE id = ?").get(projectId) as Record<string, unknown>;
    if (!project || project["name"] !== "Test Project") {
      logger.error("Project read failed");
      process.exit(1);
    }
    logger.info("3. Read project: PASS");

    const insertStory = database.prepare(
      "INSERT INTO stories (project_id, title, story) VALUES (?, ?, ?)"
    );
    const storyResult = insertStory.run(projectId, "Test Story", "Once upon a time...");
    const storyId = storyResult.lastInsertRowid;
    logger.info(`4. Insert story (FK to project): PASS`);

    const insertScene = database.prepare(
      "INSERT INTO scenes (story_id, scene_order, narration) VALUES (?, ?, ?)"
    );
    const sceneResult = insertScene.run(storyId, 1, "Scene narration");
    const sceneId = sceneResult.lastInsertRowid;
    logger.info(`5. Insert scene (FK to story): PASS`);

    database.prepare("DELETE FROM projects WHERE id = ?").run(projectId);
    const deletedStory = database.prepare("SELECT * FROM stories WHERE id = ?").get(storyId);
    if (deletedStory) {
      logger.error("Foreign key cascade delete failed");
      process.exit(1);
    }
    logger.info("6. Foreign keys (CASCADE delete): PASS");

    logger.info("");
    logger.info("All database tests PASSED");

  } finally {
    db.close();
    if (fs.existsSync(testDbPath)) {
      fs.unlinkSync(testDbPath);
    }
  }
}

testDatabase();

import Database from "better-sqlite3";
import path from "node:path";
import fs from "node:fs";
import { SCHEMA_SQL } from "./schema.js";
import { logger } from "../services/logger.service.js";

const DEFAULT_DB_PATH = path.resolve("data", "content-factory.db");

export class DatabaseService {
  private db: Database.Database | null = null;
  private readonly dbPath: string;

  constructor(dbPath?: string) {
    this.dbPath = dbPath ?? DEFAULT_DB_PATH;
  }

  open(): void {
    const dir = path.dirname(this.dbPath);
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }

    this.db = new Database(this.dbPath);
    this.db.pragma("journal_mode = WAL");
    this.db.pragma("foreign_keys = ON");

    logger.info(`Database opened: ${this.dbPath}`);
  }

  initialize(): void {
    if (!this.db) {
      throw new Error("Database not opened. Call open() first.");
    }

    this.db.exec(SCHEMA_SQL);
    logger.info("Database schema initialized");
  }

  getDb(): Database.Database {
    if (!this.db) {
      throw new Error("Database not opened. Call open() first.");
    }
    return this.db;
  }

  close(): void {
    if (this.db) {
      this.db.close();
      this.db = null;
      logger.info("Database closed");
    }
  }

  isConnected(): boolean {
    if (!this.db) return false;
    try {
      this.db.prepare("SELECT 1").get();
      return true;
    } catch {
      return false;
    }
  }
}

export const database = new DatabaseService();

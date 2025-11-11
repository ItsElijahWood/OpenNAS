import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import { Database, open } from "sqlite";
import sqlite3 from "sqlite3";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export class NASDatabase {
  constructor() {
    this.dbPath = path.resolve(__dirname, "./db/OpenNAS.db");
    this.path = path.resolve(__dirname, "./db");
  }

  /**
   * Initialises the database.
   *
   * @returns {Database}
   */
  async init() {
    const dir = this.path;
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }

    this.conn = await open({
      filename: this.dbPath,
      driver: sqlite3.Database,
    });

    console.log("Database started.");

    return this.conn;
  }

  /**
   * Run a query on the database.
   *
   * @param {any} statement
   * @param {Array} params
   */
  async run(statement, params) {
    if (!this.conn) {
      throw new Error("Database connection not initialised.");
    }

    await this.conn.run(statement, params);
  }

  /**
   * Run a get query on the database.
   *
   * @param {any} statement
   * @param {Array} params
   */
  async get(statement, params) {
    if (!this.conn) {
      throw new Error("Database connection not initialised.");
    }

    return await this.conn.get(statement, params);
  }

  /**
   * Closes the database.
   */
  async close() {
    if (this.conn) {
      await this.conn.close();
    }
  }
}

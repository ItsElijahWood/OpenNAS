import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import { Database, open } from "sqlite";
import sqlite3 from "sqlite3";
import bcrypt from "bcrypt";

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

export async function database() {
  console.log("Database started.");

  const conn = new NASDatabase();
  await conn.init();

  conn.run(`CREATE TABLE IF NOT EXISTS 'users' (
    id INTEGER PRIMARY KEY NOT NULL,
    username VARCHAR NOT NULL,
    password VARCHAR NOT NULL,
    mnt_point VARCHAR NOT NULL,
    reason VARCHAR NOT NULL,
    access VARCHAR NOT NULL,
    drive VARCHAR NOT NULL,
    builtin VARCHAR NOT NULL,
    hidden_password VARCHAR NOT NULL
  )`);

  const ROOT_USERNAME = process.env.NAS_USERNAME;
  const ROOT_PASSWORD = process.env.NAS_PASSWORD;
  const ROOT_DRIVE = process.env.NAS_DRIVE;
  const ROOT_MNT_POINT = process.env.NAS_MNT_POINT;
  const ROOT_REASON = process.env.NAS_DESCRIPTION;
  const ROOT_ACCESS = process.env.ROOT_ACCESS;
  const ROOT_UID = process.env.ROOT_UID;

  const hidden_password = "*".repeat(ROOT_PASSWORD.length);

  if (!ROOT_USERNAME || !ROOT_PASSWORD || !ROOT_DRIVE || !ROOT_MNT_POINT || !ROOT_REASON || !ROOT_ACCESS || !ROOT_UID) {
    throw new Error("Some env is null when creating root account.");
  }

  const ROOT_PASSWORD_HASHED = await bcrypt.hash(ROOT_PASSWORD, 10);

  conn.run(`INSERT INTO users (id, username, password, mnt_point, reason, access, drive, builtin, hidden_password) 
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
    ON CONFLICT(id) DO UPDATE SET
      username = excluded.username,
      password = excluded.password,
      mnt_point = excluded.mnt_point,
      reason = excluded.reason,
      access = excluded.access,
      drive = excluded.drive,
      builtin = excluded.builtin,
      hidden_password = excluded.hidden_password
    `, [ROOT_UID, ROOT_USERNAME.toLowerCase(), ROOT_PASSWORD_HASHED, ROOT_MNT_POINT, ROOT_REASON, ROOT_ACCESS, ROOT_DRIVE, "Yes", hidden_password]);
}
